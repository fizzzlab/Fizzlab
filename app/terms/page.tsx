import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';

export const metadata = {
  title: 'Terms of Service | PulseTrack',
  description: 'Terms of Service for PulseTrack — the behavioural wearable consistency platform.',
};

const LAST_UPDATED = 'February 28, 2026';
const APP_URL      = 'https://trackingweb-liard.vercel.app';

export default function TermsPage() {
  return (
    <div className="page-bg min-h-screen">
      <Navbar />

      <main className="max-w-3xl mx-auto px-6 py-16">
        <div className="mb-10">
          <h1
            className="text-3xl font-bold text-slate-100 mb-3"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Terms of Service
          </h1>
          <p className="text-slate-500 text-sm">Last updated: {LAST_UPDATED}</p>
        </div>

        <div className="space-y-8 text-slate-400 leading-relaxed text-sm">

          <Section title="1. Acceptance of Terms">
            <p>
              By accessing or using PulseTrack (&ldquo;the Platform&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;)
              at <a href={APP_URL} className="text-[#C89664] hover:underline">{APP_URL}</a>, you agree to be bound
              by these Terms of Service. If you do not agree, you must not use the Platform.
            </p>
          </Section>

          <Section title="2. Description of Service">
            <p>
              PulseTrack is a browser-based behavioural consistency platform that connects to supported wearable
              devices via OAuth, retrieves strictly non-clinical behavioural data (steps, active minutes, active
              days, sleep duration, sleep consistency, activity session count and duration), and delivers automated
              weekly behavioural insights via email.
            </p>
            <p className="mt-3">
              The Platform does <strong className="text-slate-200">not</strong> collect, process, or store
              physiological or clinical health data including heart rate, HRV, SpO₂, blood pressure, ECG, stress
              scores, recovery metrics, VO₂ max, or medication information. PulseTrack is not a medical device
              and does not provide medical advice, diagnosis, or treatment.
            </p>
          </Section>

          <Section title="3. Eligibility">
            <p>
              You must be at least 18 years of age to use the Platform. By registering, you confirm that you meet
              this requirement and that the information you provide is accurate.
            </p>
          </Section>

          <Section title="4. Account Registration">
            <p>
              You must register using a valid email address. You are responsible for maintaining the
              confidentiality of your credentials and for all activity that occurs under your account. You must
              notify us immediately of any unauthorised use.
            </p>
          </Section>

          <Section title="5. Wearable Connections and OAuth">
            <p>
              PulseTrack integrates with third-party wearable platforms (currently Fitbit and Withings) via
              OAuth 2.0. By connecting a wearable account, you authorise PulseTrack to retrieve the behavioural
              data described in Section 2 on your behalf on a scheduled weekly basis.
            </p>
            <p className="mt-3">
              You may revoke this authorisation at any time via the Connected Devices page or directly through
              your wearable provider&rsquo;s account settings. Revocation will stop future data retrieval but
              does not delete data already collected.
            </p>
          </Section>

          <Section title="6. Data Use">
            <p>
              Data retrieved from wearable platforms is used solely to generate your weekly behavioural
              consistency report and to send automated service emails. Data is never sold, rented, or shared
              with third parties for commercial purposes. For full details, see our{' '}
              <Link href="/privacy" className="text-[#C89664] hover:underline">Privacy Policy</Link>.
            </p>
          </Section>

          <Section title="7. Automated Communications">
            <p>
              By registering, you consent to receive automated service emails including sync acknowledgements,
              behavioural encouragement messages, and re-authentication alerts. You may adjust email preferences
              at any time via your Account Settings page.
            </p>
          </Section>

          <Section title="8. Acceptable Use">
            <p>You agree not to:</p>
            <ul className="list-disc list-inside mt-2 space-y-1.5">
              <li>Use the Platform for any unlawful purpose</li>
              <li>Attempt to gain unauthorised access to any part of the Platform or its infrastructure</li>
              <li>Interfere with, disrupt, or degrade the performance of the Platform</li>
              <li>Reverse-engineer, decompile, or attempt to extract source code</li>
              <li>Submit false or misleading information during registration</li>
              <li>Impersonate any person or entity</li>
            </ul>
          </Section>

          <Section title="9. Intellectual Property">
            <p>
              All content, design, trademarks, and software comprising the Platform are the property of
              PulseTrack or its licensors. Nothing in these Terms grants you any right to use our intellectual
              property without prior written consent.
            </p>
          </Section>

          <Section title="10. Disclaimers">
            <p>
              The Platform is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without warranties of
              any kind, express or implied. We do not warrant that the Platform will be uninterrupted,
              error-free, or that wearable data retrieved will be complete or accurate — as data availability
              depends on third-party provider APIs outside our control.
            </p>
            <p className="mt-3">
              PulseTrack is not a medical service. Nothing on the Platform constitutes medical advice. Always
              consult a qualified healthcare professional for health decisions.
            </p>
          </Section>

          <Section title="11. Limitation of Liability">
            <p>
              To the fullest extent permitted by applicable law, PulseTrack shall not be liable for any
              indirect, incidental, special, consequential, or punitive damages arising from your use of or
              inability to use the Platform, even if we have been advised of the possibility of such damages.
              Our total liability shall not exceed the amount paid by you (if any) in the twelve months
              preceding the claim.
            </p>
          </Section>

          <Section title="12. Termination">
            <p>
              We reserve the right to suspend or terminate your account at any time for violation of these
              Terms or for any other reason at our discretion, with or without notice. You may delete your
              account at any time via Account Settings, which will trigger deletion of your personal data
              in accordance with our Privacy Policy.
            </p>
          </Section>

          <Section title="13. Changes to These Terms">
            <p>
              We may update these Terms at any time. Changes will be posted on this page with an updated
              &ldquo;Last updated&rdquo; date. Continued use of the Platform after changes constitutes
              acceptance of the revised Terms.
            </p>
          </Section>

          <Section title="14. Governing Law">
            <p>
              These Terms are governed by and construed in accordance with applicable law. Any disputes
              shall be subject to the exclusive jurisdiction of the relevant courts.
            </p>
          </Section>

          <Section title="15. Contact">
            <p>
              If you have questions about these Terms, please contact us through the Platform or via the
              email address associated with your account.
            </p>
          </Section>

        </div>

        <div className="mt-12 pt-8 border-t border-[rgba(35,62,92,0.4)] flex items-center justify-between">
          <Link href="/" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">
            Back to home
          </Link>
          <Link href="/privacy" className="text-sm text-[#C89664] hover:underline">
            Privacy Policy
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
