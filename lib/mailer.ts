import FormData from 'form-data';
import Mailgun from 'mailgun.js';
import { getRequiredAppUrl } from '@/lib/app-url';

const mailgun = new Mailgun(FormData);

function getMgClient() {
  return mailgun.client({
    username: 'api',
    key: process.env.MAILGUN_API_KEY!,
    url: 'https://api.mailgun.net',
  });
}

const FROM = `PulseTrack <noreply@${process.env.MAILGUN_DOMAIN}>`;
const APP_URL = getRequiredAppUrl();

function emailWrapper(content: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>PulseTrack</title></head>
<body style="margin:0;padding:0;background-color:#b8834a;font-family:Inter,Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#b8834a;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#021C3B,#010E22);border-radius:12px 12px 0 0;padding:24px 32px;">
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="background:#C89664;width:10px;height:10px;border-radius:3px;"></td>
                <td style="padding-left:10px;font-family:Inter,Helvetica,Arial,sans-serif;font-size:16px;font-weight:700;color:#C89664;letter-spacing:-0.3px;">PulseTrack</td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="background:#C89664;border-left:1px solid rgba(235,114,27,0.3);border-right:1px solid rgba(235,114,27,0.3);padding:32px;">
            ${content}
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:rgba(1,14,34,0.08);border:1px solid rgba(235,114,27,0.2);border-top:none;border-radius:0 0 12px 12px;padding:16px 32px;text-align:center;">
            <p style="margin:0;font-size:12px;color:rgba(1,14,34,0.45);font-family:Inter,Helvetica,Arial,sans-serif;">This is an automated message from PulseTrack. Do not reply.</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function sendAcknowledgementEmail(to: string, userName: string): Promise<void> {
  const mg = getMgClient();
  await mg.messages.create(process.env.MAILGUN_DOMAIN!, {
    from: FROM,
    to,
    subject: 'Your wearable data has been synced — PulseTrack',
    html: emailWrapper(`
      <div style="display:inline-block;background:rgba(1,14,34,0.08);border:1px solid rgba(235,114,27,0.3);border-radius:6px;padding:4px 12px;font-size:12px;font-weight:700;color:#021C3B;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:20px;">Sync Complete</div>
      <h2 style="margin:0 0 12px;font-size:22px;font-weight:700;color:#010E22;letter-spacing:-0.3px;">Data synced successfully</h2>
      <p style="margin:0 0 16px;font-size:15px;color:rgba(1,14,34,0.75);line-height:1.6;">Hi${userName ? ' ' + userName : ''},</p>
      <p style="margin:0 0 16px;font-size:15px;color:rgba(1,14,34,0.75);line-height:1.6;">Your wearable data has been successfully synced and processed for this week. Your behavioural consistency data is now up to date.</p>
      <table cellpadding="0" cellspacing="0" style="margin-top:24px;width:100%;background:rgba(1,14,34,0.06);border:1px solid rgba(1,14,34,0.1);border-left:3px solid #EB721B;border-radius:6px;">
        <tr><td style="padding:14px 16px;font-size:13px;color:rgba(1,14,34,0.65);line-height:1.5;">Weekly processing runs every <strong style="color:#010E22;">Monday at 6am UTC</strong>. Your next sync will be automatically scheduled.</td></tr>
      </table>
    `),
  });
}

export async function sendEncouragementEmail(
  to: string,
  userName: string,
  consistencyScore: number
): Promise<void> {
  const mg = getMgClient();
  await mg.messages.create(process.env.MAILGUN_DOMAIN!, {
    from: FROM,
    to,
    subject: 'You hit your consistency target this week — PulseTrack',
    html: emailWrapper(`
      <div style="display:inline-block;background:rgba(5,150,105,0.12);border:1px solid rgba(5,150,105,0.35);border-radius:6px;padding:4px 12px;font-size:12px;font-weight:700;color:#065f46;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:20px;">Target Met</div>
      <h2 style="margin:0 0 12px;font-size:22px;font-weight:700;color:#010E22;letter-spacing:-0.3px;">Consistency target achieved</h2>
      <p style="margin:0 0 16px;font-size:15px;color:rgba(1,14,34,0.75);line-height:1.6;">Hi${userName ? ' ' + userName : ''},</p>
      <p style="margin:0 0 16px;font-size:15px;color:rgba(1,14,34,0.75);line-height:1.6;">You achieved a behavioural consistency score of <strong style="color:#010E22;">${consistencyScore}%</strong> this week — above your target threshold.</p>
      <table cellpadding="0" cellspacing="0" style="margin:20px 0;width:100%;">
        <tr>
          <td align="center" style="background:linear-gradient(135deg,#021C3B,#010E22);border-radius:10px;padding:20px;">
            <div style="font-size:42px;font-weight:800;color:#C89664;letter-spacing:-1px;">${consistencyScore}%</div>
            <div style="font-size:12px;color:rgba(200,150,100,0.7);margin-top:4px;letter-spacing:0.05em;text-transform:uppercase;">Weekly Consistency Score</div>
          </td>
        </tr>
      </table>
      <p style="margin:0;font-size:15px;color:rgba(1,14,34,0.75);line-height:1.6;">Keep it up. Consistent behaviour over time drives lasting results.</p>
    `),
  });
}

export async function sendBadgeEarnedEmail(
  to: string,
  userName: string,
  badges: { name: string; emoji: string; goalName: string; description: string }[]
): Promise<void> {
  const mg = getMgClient();
  const badgeRows = badges.map(b =>
    `<tr><td style="padding:10px 14px;border-bottom:1px solid rgba(1,14,34,0.08);font-size:14px;color:#010E22;">
      <span style="font-size:20px;margin-right:8px;">${b.emoji}</span>
      <strong>${b.name}</strong>
      <div style="font-size:12px;color:rgba(1,14,34,0.55);margin-top:2px;">${b.goalName} — ${b.description}</div>
    </td></tr>`
  ).join('');

  await mg.messages.create(process.env.MAILGUN_DOMAIN!, {
    from: FROM,
    to,
    subject: `You earned ${badges.length === 1 ? 'a new badge' : `${badges.length} new badges`} — PulseTrack`,
    html: emailWrapper(`
      <div style="display:inline-block;background:rgba(235,114,27,0.12);border:1px solid rgba(235,114,27,0.35);border-radius:6px;padding:4px 12px;font-size:12px;font-weight:700;color:#EB721B;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:20px;">Badge Earned</div>
      <h2 style="margin:0 0 12px;font-size:22px;font-weight:700;color:#010E22;letter-spacing:-0.3px;">Congratulations${userName ? ', ' + userName : ''}!</h2>
      <p style="margin:0 0 20px;font-size:15px;color:rgba(1,14,34,0.75);line-height:1.6;">Your consistent behaviour has earned you ${badges.length === 1 ? 'a new badge' : 'new badges'}:</p>
      <table cellpadding="0" cellspacing="0" style="width:100%;background:rgba(1,14,34,0.04);border:1px solid rgba(1,14,34,0.1);border-radius:8px;overflow:hidden;">
        ${badgeRows}
      </table>
      <p style="margin:20px 0 0;font-size:14px;color:rgba(1,14,34,0.65);line-height:1.6;">Keep up the consistency — more badges unlock as your streaks grow.</p>
    `),
  });
}

export async function sendWeeklyCheckinEmail(
  to: string,
  userName: string,
  targetsMet: number,
  targetsTotal: number,
  metList: string[],
  missedList: string[]
): Promise<void> {
  const mg = getMgClient();
  const metItems = metList.map(m => `<li style="padding:3px 0;color:#065f46;font-size:13px;">✓ ${m}</li>`).join('');
  const missedItems = missedList.map(m => `<li style="padding:3px 0;color:#991b1b;font-size:13px;">✗ ${m}</li>`).join('');

  await mg.messages.create(process.env.MAILGUN_DOMAIN!, {
    from: FROM,
    to,
    subject: `Weekly check-in: ${targetsMet} of ${targetsTotal} targets hit — PulseTrack`,
    html: emailWrapper(`
      <div style="display:inline-block;background:rgba(37,107,151,0.12);border:1px solid rgba(37,107,151,0.35);border-radius:6px;padding:4px 12px;font-size:12px;font-weight:700;color:#256B97;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:20px;">Weekly Check-in</div>
      <h2 style="margin:0 0 12px;font-size:22px;font-weight:700;color:#010E22;letter-spacing:-0.3px;">Your weekly summary</h2>
      <p style="margin:0 0 16px;font-size:15px;color:rgba(1,14,34,0.75);line-height:1.6;">Hi${userName ? ' ' + userName : ''},</p>
      <table cellpadding="0" cellspacing="0" style="margin:16px 0;width:100%;">
        <tr>
          <td align="center" style="background:linear-gradient(135deg,#021C3B,#010E22);border-radius:10px;padding:20px;">
            <div style="font-size:42px;font-weight:800;color:#C89664;letter-spacing:-1px;">${targetsMet}/${targetsTotal}</div>
            <div style="font-size:12px;color:rgba(200,150,100,0.7);margin-top:4px;letter-spacing:0.05em;text-transform:uppercase;">Targets Hit This Week</div>
          </td>
        </tr>
      </table>
      ${metItems ? `<div style="margin:16px 0 8px;font-size:13px;font-weight:700;color:#010E22;">Targets Met</div><ul style="margin:0;padding-left:18px;">${metItems}</ul>` : ''}
      ${missedItems ? `<div style="margin:16px 0 8px;font-size:13px;font-weight:700;color:#010E22;">Targets Missed</div><ul style="margin:0;padding-left:18px;">${missedItems}</ul>` : ''}
      <p style="margin:20px 0 0;font-size:14px;color:rgba(1,14,34,0.65);line-height:1.6;">Consistency compounds. Every week you show up matters.</p>
    `),
  });
}

export async function sendNoDataEmail(to: string, userName: string, provider: string): Promise<void> {
  const mg = getMgClient();
  const connectUrl = `${APP_URL}/connect`;
  await mg.messages.create(process.env.MAILGUN_DOMAIN!, {
    from: FROM,
    to,
    subject: `No wearable data received for 7 days — PulseTrack`,
    html: emailWrapper(`
      <div style="display:inline-block;background:rgba(245,158,11,0.12);border:1px solid rgba(245,158,11,0.35);border-radius:6px;padding:4px 12px;font-size:12px;font-weight:700;color:#92400e;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:20px;">No Data</div>
      <h2 style="margin:0 0 12px;font-size:22px;font-weight:700;color:#010E22;letter-spacing:-0.3px;">We haven't received data recently</h2>
      <p style="margin:0 0 16px;font-size:15px;color:rgba(1,14,34,0.75);line-height:1.6;">Hi${userName ? ' ' + userName : ''},</p>
      <p style="margin:0 0 24px;font-size:15px;color:rgba(1,14,34,0.75);line-height:1.6;">Your <strong style="color:#010E22;">${provider}</strong> wearable hasn't sent any data in over 7 days. Reconnect to continue syncing and building your streaks.</p>
      <table cellpadding="0" cellspacing="0">
        <tr>
          <td style="background:linear-gradient(135deg,#021C3B,#010E22);border-radius:8px;padding:1px;">
            <a href="${connectUrl}" style="display:inline-block;padding:13px 28px;background:linear-gradient(135deg,#021C3B,#010E22);color:#C89664;border-radius:7px;text-decoration:none;font-weight:700;font-size:14px;letter-spacing:0.02em;">
              Reconnect ${provider} &rarr;
            </a>
          </td>
        </tr>
      </table>
      <table cellpadding="0" cellspacing="0" style="margin-top:24px;width:100%;background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.2);border-left:3px solid #f59e0b;border-radius:6px;">
        <tr><td style="padding:12px 16px;font-size:13px;color:rgba(1,14,34,0.65);line-height:1.5;">Without data, weekly processing and badge progress will be paused.</td></tr>
      </table>
    `),
  });
}

export async function sendReauthEmail(to: string, userName: string, provider: string): Promise<void> {
  const mg = getMgClient();
  const connectUrl = `${APP_URL}/connect`;
  await mg.messages.create(process.env.MAILGUN_DOMAIN!, {
    from: FROM,
    to,
    subject: `Action required: reconnect your ${provider} account — PulseTrack`,
    html: emailWrapper(`
      <div style="display:inline-block;background:rgba(185,28,28,0.1);border:1px solid rgba(185,28,28,0.35);border-radius:6px;padding:4px 12px;font-size:12px;font-weight:700;color:#991b1b;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:20px;">Action Required</div>
      <h2 style="margin:0 0 12px;font-size:22px;font-weight:700;color:#010E22;letter-spacing:-0.3px;">Reconnect your ${provider} account</h2>
      <p style="margin:0 0 16px;font-size:15px;color:rgba(1,14,34,0.75);line-height:1.6;">Hi${userName ? ' ' + userName : ''},</p>
      <p style="margin:0 0 24px;font-size:15px;color:rgba(1,14,34,0.75);line-height:1.6;">Your <strong style="color:#010E22;">${provider}</strong> connection has expired. To continue receiving weekly behavioural insights, please reconnect your account.</p>
      <table cellpadding="0" cellspacing="0">
        <tr>
          <td style="background:linear-gradient(135deg,#021C3B,#010E22);border-radius:8px;padding:1px;">
            <a href="${connectUrl}" style="display:inline-block;padding:13px 28px;background:linear-gradient(135deg,#021C3B,#010E22);color:#C89664;border-radius:7px;text-decoration:none;font-weight:700;font-size:14px;letter-spacing:0.02em;">
              Reconnect ${provider} &rarr;
            </a>
          </td>
        </tr>
      </table>
      <table cellpadding="0" cellspacing="0" style="margin-top:24px;width:100%;background:rgba(185,28,28,0.06);border:1px solid rgba(185,28,28,0.2);border-left:3px solid #dc2626;border-radius:6px;">
        <tr><td style="padding:12px 16px;font-size:13px;color:rgba(1,14,34,0.65);line-height:1.5;">Until reconnected, weekly sync and behavioural analysis will be paused for your account.</td></tr>
      </table>
    `),
  });
}
