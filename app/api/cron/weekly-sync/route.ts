import { NextRequest, NextResponse } from 'next/server';
import { processAllConnections } from '@/lib/sync-processor';

export const maxDuration = 300;
export const dynamic     = 'force-dynamic';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await processAllConnections();
    return NextResponse.json({
      ok:        true,
      processed: result.processed,
      failed:    result.failed,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Weekly sync cron error:', err);
    return NextResponse.json(
      { ok: false, error: (err as Error).message },
      { status: 500 }
    );
  }
}
