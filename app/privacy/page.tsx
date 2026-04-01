import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';

export const metadata = {
  title: 'Privacy Policy | PulseTrack',
  description: 'Privacy Policy for PulseTrack — how we collect, use, and protect your data.',
};

const LAST_UPDATED = 'February 28, 2026';

export default function PrivacyPage() {
  return (
    <div className="page-bg min-h-screen">
      <Navbar />

      <main className="max-w-3xl mx-auto px-6 py-16">
        <div className="mb-10">
          <h1
            className="text-3xl font-bold text-slate-100 mb-3"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Privacy Policy
          </h1>
          <p className="text-slate-500 text-sm">Last updated: {LAST_UPDATED}</p>
        </div>

        <div className="space-y-8 text-slate-400 leading-relaxed text-sm">

          <Section title="1. Overview">
            <p>
              PulseTrack (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) is committed to protecting
              your privacy. This Privacy Policy explains what data we collect, how we use it, how we protect
              it, and your rights in relation to it.
            </p>
            <p className="mt-3">
              PulseTrack is not a medical service and does not process clinical or physiological health data.
              Our data scope is strictly limited to non-clinical behavioural metrics as described below.
            </p>
          </Section>

          <Section title="2. Data We Collect">
            <p className="mb-3">We collect only the following categories of data:</p>

            <SubHeading>2.1 Account Data</SubHeading>
            <ul className="list-disc list-inside space-y-1.5 mt-2">
              <li>Email address (used for authentication and service communications)</li>
              <li>Full name (optional, used for personalised emails)</li>
              <li>Password (stored as a secure hash — never stored in plain text)</li>
            </ul>

            <SubHeading>2.2 Wearable Behavioural Data</SubHeading>
            <p className="mt-2 mb-2">
              After you connect a wearable device, we retrieve the following data weekly from your wearable
              provider&rsquo;s cloud API:
            </p>
            <ul className="list-disc list-inside space-y-1.5">
              <li>Daily step count</li>
              <li>Active minutes per day</li>
              <li>Number of active days per week</li>
              <li>Sleep duration (hours)</li>
              <li>Sleep consistency score</li>
              <li>Activity session count</li>
              <li>Activity session duration</li>
            </ul>
            <p className="mt-3 text-slate-500">
              We explicitly do <strong className="text-slate-400">not</strong> collect heart rate, HRV,
              SpO₂, blood pressure, ECG, stress scores, recovery metrics, VO₂ max, medication data, or
              any other physiological or clinical data. Our OAuth scopes are configured to request only
              the minimum permissions required.
            </p>

            <SubHeading>2.3 OAuth Tokens</SubHeading>
            <p className="mt-2">
              To retrieve data on your behalf, we store OAuth access and refresh tokens issued by your
              wearable provider. These tokens are encrypted at rest using AES-256-GCM with managed
              encryption keys and are never logged or exposed in any interface.
            </p>

            <SubHeading>2.4 Sync and System Logs</SubHeading>
            <p className="mt-2">
              We maintain logs of sync operations (success, failure, timestamp) for system health
              monitoring and support purposes. Logs do not contain raw wearable data.
            </p>

            <SubHeading>2.5 Aggregate Analytics</SubHeading>
            <p className="mt-2">
              We generate pseudonymised aggregate analytics (e.g., platform-wide consistency rates,
              device distribution) for operational and research purposes. These analytics cannot be
              used to identify individual users.
            </p>
          </Section>

          <Section title="3. How We Use Your Data">
            <ul className="list-disc list-inside space-y-2">
              <li>To authenticate and manage your account</li>
              <li>To retrieve your weekly behavioural data from connected wearable providers</li>
              <li>To evaluate your weekly behavioural consistency against defined thresholds</li>
              <li>To send automated service emails (sync acknowledgement, encouragement, re-authentication alerts)</li>
              <li>To monitor platform health, diagnose issues, and improve reliability</li>
              <li>To generate pseudonymised aggregate analytics</li>
              <li>To comply with legal obligations</li>
            </ul>
            <p className="mt-3">
              We do not use your data for advertising, profiling for commercial purposes, or sell it to
              any third party.
            </p>
          </Section>

          <Section title="4. Legal Basis for Processing">
            <p>We process your data on the following legal bases:</p>
            <ul className="list-disc list-inside space-y-2 mt-3">
              <li><strong className="text-slate-300">Contract performance</strong> — processing necessary to provide the service you signed up for</li>
              <li><strong className="text-slate-300">Consent</strong> — for connecting wearable accounts and receiving service emails (withdrawable at any time)</li>
              <li><strong className="text-slate-300">Legitimate interests</strong> — system monitoring, security, and fraud prevention</li>
              <li><strong className="text-slate-300">Legal obligation</strong> — where required by applicable law</li>
            </ul>
          </Section>

          <Section title="5. Data Sharing">
            <p>We share data only in the following limited circumstances:</p>
            <ul className="list-disc list-inside space-y-2 mt-3">
              <li>
                <strong className="text-slate-300">Supabase</strong> — our database and authentication
                provider (PostgreSQL hosted infrastructure). Data is stored in encrypted form.
              </li>
              <li>
                <strong className="text-slate-300">Mailgun</strong> — our email delivery provider,
                used solely to send transactional service emails. Only your email address and email
                content is transmitted.
              </li>
              <li>
                <strong className="text-slate-300">Fitbit / Withings</strong> — we communicate with
                these APIs only to retrieve data you have authorised us to access.
              </li>
              <li>
                <strong className="text-slate-300">Legal requirements</strong> — we may disclose data
                if required by law, court order, or to protect the rights and safety of users.
              </li>
            </ul>
            <p className="mt-3">We never sell, rent, or trade your personal data.</p>
          </Section>

          <Section title="6. Data Retention">
            <p>
              We retain your account data and wearable behavioural data for as long as your account is
              active. Weekly sync data is retained for a rolling period sufficient to provide historical
              trend analysis.
            </p>
            <p className="mt-3">
              Upon account deletion, all personal data (account details, wearable tokens, individual
              sync records) is permanently deleted within 30 days. Pseudonymised aggregate analytics,
              which cannot identify you, may be retained indefinitely for research purposes.
            </p>
          </Section>

          <Section title="7. Data Security">
            <ul className="list-disc list-inside space-y-2">
              <li>OAuth tokens encrypted at rest using AES-256-GCM</li>
              <li>All data transmitted over HTTPS/TLS</li>
              <li>Passwords hashed using industry-standard algorithms (never stored in plain text)</li>
              <li>Tokens never logged or exposed in application interfaces</li>
              <li>Access to production data restricted to authorised personnel only</li>
              <li>Regular security reviews of infrastructure and dependencies</li>
            </ul>
          </Section>

          <Section title="8. Your Rights">
            <p>Under applicable data protection law, you have the right to:</p>
            <ul className="list-disc list-inside space-y-2 mt-3">
              <li><strong className="text-slate-300">Access</strong> — request a copy of the personal data we hold about you</li>
              <li><strong className="text-slate-300">Rectification</strong> — request correction of inaccurate data</li>
              <li><strong className="text-slate-300">Erasure</strong> — request deletion of your data (right to be forgotten). Available directly via Account Settings.</li>
              <li><strong className="text-slate-300">Restriction</strong> — request that we restrict processing of your data</li>
              <li><strong className="text-slate-300">Portability</strong> — request your data in a structured, machine-readable format</li>
              <li><strong className="text-slate-300">Objection</strong> — object to processing based on legitimate interests</li>
              <li><strong className="text-slate-300">Withdraw consent</strong> — revoke wearable connections or email preferences at any time via Account Settings</li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, use the Account Settings page or contact us directly.
              We will respond within 30 days.
            </p>
          </Section>

          <Section title="9. Cookies and Tracking">
            <p>
              PulseTrack uses only functional cookies necessary for authentication and session management
              (provided by Supabase). We do not use advertising cookies, third-party tracking scripts,
              or analytics cookies.
            </p>
          </Section>

          <Section title="10. Children's Privacy">
            <p>
              The Platform is not directed at children under the age of 18. We do not knowingly collect
              personal data from minors. If we become aware that we have done so, we will delete the
              data promptly.
            </p>
          </Section>

          <Section title="11. Third-Party Links">
            <p>
              The Platform may contain links to third-party sites (e.g., Fitbit, Withings). We are not
              responsible for the privacy practices of those sites and encourage you to review their
              respective privacy policies.
            </p>
          </Section>

          <Section title="12. Changes to This Policy">
            <p>
              We may update this Privacy Policy from time to time. Changes will be posted on this page
              with an updated &ldquo;Last updated&rdquo; date. Where changes are material, we will notify
              registered users by email. Continued use of the Platform constitutes acceptance of the
              updated policy.
            </p>
          </Section>

          <Section title="13. Contact">
            <p>
              For privacy-related questions, data requests, or to exercise your rights, please contact
              us via the email address associated with your account or through the Platform.
            </p>
          </Section>

        </div>

        <div className="mt-12 pt-8 border-t border-[rgba(35,62,92,0.4)] flex items-center justify-between">
          <Link href="/" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">
            Back to home
          </Link>
          <Link href="/terms" className="text-sm text-[#C89664] hover:underline">
            Terms of Service
          </Link>
        </div>
      </main>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2
        className="text-base font-semibold text-slate-200 mb-3"
        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
      >
        {title}
      </h2>
      <div className="text-slate-400">{children}</div>
    </div>
  );
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3
      className="text-sm font-semibold text-slate-300 mt-4 mb-1"
      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
    >
      {children}
    </h3>
  );
}
