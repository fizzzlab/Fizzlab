import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createHash } from 'crypto';

/**
 * Garmin Health API push webhook.
 *
 * Garmin pushes daily summaries, sleep data, and activity data to this endpoint
 * whenever a user syncs their device. We store each summary in the
 * garmin_push_data table for later aggregation during the weekly cron sync.
 *
 * Configure this URL in the Garmin Developer Portal as your push endpoint:
 *   https://your-domain.vercel.app/api/webhooks/garmin
 */

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// Map a Garmin userAccessToken to our user_id via the stored token hash
async function resolveUserId(
  supabase: ReturnType<typeof getServiceClient>,
  userAccessToken: string
): Promise<string | null> {
  const hash = createHash('sha256').update(userAccessToken).digest('hex');

  const { data } = await supabase
    .from('wearable_connections')
    .select('user_id')
    .eq('provider', 'garmin')
    .eq('provider_user_id', hash)
    .eq('status', 'connected')
    .single();

  return data?.user_id ?? null;
}

type GarminSummary = {
  userAccessToken?: string;
  summaryId?: string;
  calendarDate?: string;
  [key: string]: unknown;
};

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const supabase = getServiceClient();
  const results  = { stored: 0, skipped: 0 };

  // Garmin sends data grouped by type: { dailies: [...], sleeps: [...], activities: [...] }
  const dataTypes = ['dailies', 'sleeps', 'activities', 'epochs'] as const;

  for (const dataType of dataTypes) {
    const items = body[dataType] as GarminSummary[] | undefined;
    if (!Array.isArray(items)) continue;

    for (const item of items) {
      if (!item.userAccessToken) {
        results.skipped++;
        continue;
      }

      const userId = await resolveUserId(supabase, item.userAccessToken);
      if (!userId) {
        results.skipped++;
        continue;
      }

      const summaryDate = item.calendarDate ?? new Date().toISOString().split('T')[0];

      // Upsert to avoid duplicate pushes for the same summary
      const { error } = await supabase
        .from('garmin_push_data')
        .upsert(
          {
            user_id:      userId,
            data_type:    dataType === 'epochs' ? 'dailies' : dataType,
            summary_id:   item.summaryId ?? `${dataType}-${summaryDate}`,
            summary_date: summaryDate,
            payload:      item,
          },
          { onConflict: 'user_id,data_type,summary_date' }
        );

      if (error) {
        console.error(`Garmin webhook store error (${dataType}):`, error.message);
        results.skipped++;
      } else {
        results.stored++;
      }
    }
  }

  // Garmin expects a 200 response — anything else triggers retries
  return NextResponse.json({ ok: true, ...results });
}

// Garmin may also send a HEAD request to verify the endpoint
export async function HEAD() {
  return new NextResponse(null, { status: 200 });
}

// Garmin sends deregistration notifications via DELETE
export async function DELETE(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: true });
  }

  const supabase = getServiceClient();
  const deregistrations = body.deregistrations as GarminSummary[] | undefined;

  if (Array.isArray(deregistrations)) {
    for (const item of deregistrations) {
      if (!item.userAccessToken) continue;
      const userId = await resolveUserId(supabase, item.userAccessToken);
      if (userId) {
        await supabase
          .from('wearable_connections')
          .update({ status: 'disconnected' })
          .eq('user_id', userId)
          .eq('provider', 'garmin');
      }
    }
  }

  return NextResponse.json({ ok: true });
}
