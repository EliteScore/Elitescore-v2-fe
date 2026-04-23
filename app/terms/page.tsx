import type { Metadata } from "next"
import Link from "next/link"
import { LegalPageLayout, LEGAL_LAST_UPDATED } from "@/components/legal-page-layout"
import { ELITESCORE_SUPPORT_EMAIL, ELITESCORE_SUPPORT_MAILTO } from "@/lib/supportContact"

export const metadata: Metadata = {
  title: "Terms of Service | EliteScore",
  description:
    "EliteScore Terms of Service (Beta). Rules for using the challenge and gamification platform in the EEA and the Netherlands.",
}

const BETA_VERSION = "Beta / Pre-registration"

export default function TermsOfServicePage() {
  return (
    <LegalPageLayout title="Terms of Service" lastUpdated={LEGAL_LAST_UPDATED} version={BETA_VERSION}>
      <blockquote className="rounded-r-xl border-l-4 border-slate-400 bg-white/90 py-3 pl-4 pr-3 text-slate-700 shadow-sm not-italic">
        <p className="text-sm font-semibold text-slate-900">Beta notice.</p>
        <p className="mt-1.5 text-sm leading-relaxed">
          EliteScore is currently in beta. Features may be incomplete, unavailable, or change without notice. By using
          the Service during this phase, you accept that it is provided on a best-efforts basis while the product is
          still being developed.
        </p>
      </blockquote>

      <section>
        <h2>1. Who we are</h2>
        <p>
          EliteScore (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is operated by an individual developer based in
          the Netherlands. The Service is currently unregistered and operates as a personal project in beta. We are in
          the process of establishing a legal entity; company registration details will be added to these Terms once
          registration is complete.
        </p>
        <p>
          For any questions, contact us at:{" "}
          <a href={ELITESCORE_SUPPORT_MAILTO}>
            <strong>{ELITESCORE_SUPPORT_EMAIL}</strong>
          </a>
        </p>
      </section>

      <section>
        <h2>2. Acceptance of these Terms</h2>
        <p>
          By creating an account or using the Service, you agree to these Terms and our{" "}
          <Link href="/privacy">Privacy Policy</Link>. If you do not agree, please do not use the Service.
        </p>
        <p>
          If you use the Service on behalf of an organisation, you confirm you are authorised to bind that organisation
          to these Terms.
        </p>
        <p>
          These Terms do not affect any mandatory rights you have under the law of your country of residence, including
          consumer protection rights in the EEA and the Netherlands (such as those under Boek 6 and 7 of the Dutch
          Civil Code).
        </p>
      </section>

      <section>
        <h2>3. Eligibility</h2>
        <p>
          The Service is not intended for anyone under the age of 16. If you are under 16, you must not create an
          account or use the Service without the consent of a parent or legal guardian, in accordance with Article 8
          GDPR and its implementation in Dutch law (UAVG).
        </p>
        <p>
          You must provide accurate information when registering and keep it up to date. You are responsible for keeping
          your login credentials secure. If you believe your account has been accessed without authorisation, notify us
          immediately at <a href={ELITESCORE_SUPPORT_MAILTO}>{ELITESCORE_SUPPORT_EMAIL}</a>.
        </p>
      </section>

      <section>
        <h2>4. What the Service offers</h2>
        <p>
          EliteScore allows you to participate in challenges, submit proof of completion, track streaks and scores,
          appear on leaderboards, and interact with a community. Because this is a beta, not all features are finished
          or stable.
        </p>
        <p>
          We may add, modify, suspend, or remove features at any time during the beta period. We will try to give
          reasonable notice where a change significantly affects your use of the Service, but this is not always possible
          during active development.
        </p>
      </section>

      <section>
        <h2>5. Your content</h2>
        <p>
          You keep all intellectual property rights in any content you upload or submit (such as proof of challenge
          completion, photos, or text).
        </p>
        <p>
          By submitting content, you grant us a non-exclusive, worldwide, royalty-free licence to store, display,
          process, and use that content for the sole purpose of operating and improving the Service, including
          displaying your progress and running leaderboards.
        </p>
        <p>
          You are responsible for making sure you have the rights to any content you submit. You must not upload
          content that is unlawful, hateful, violent, sexually exploitative, or that infringes the rights of others. We
          may remove content or restrict access to accounts where necessary to comply with law or to protect the safety
          of users.
        </p>
      </section>

      <section>
        <h2>6. Fees and paid features</h2>
        <p>
          The Service is currently free to use. If we introduce paid features in the future, we will clearly show
          pricing, billing terms, and applicable taxes before you are charged. Any payment processing will be handled
          by a third-party payment provider.
        </p>
      </section>

      <section>
        <h2>7. Limitation of liability</h2>
        <p>Nothing in these Terms limits or excludes liability for:</p>
        <ul>
          <li>death or personal injury caused by negligence;</li>
          <li>fraud or fraudulent misrepresentation; or</li>
          <li>
            any other liability that cannot be limited or excluded under mandatory applicable law, including Dutch and
            EU consumer protection law.
          </li>
        </ul>
        <p>
          The Service is provided on an &quot;as is&quot; and &quot;as available&quot; basis, particularly during the
          beta period. To the extent permitted by applicable law, we are not liable for indirect or consequential loss,
          loss of data, loss of profits, or loss of business.
        </p>
        <p>
          Where we are liable and where such a limit is permitted under applicable law, our total aggregate liability in
          any twelve-month period is limited to the greater of: (a) the fees you actually paid us in that period, or (b){" "}
          €150.
        </p>
        <p>
          If you are a consumer in the Netherlands or the EEA, mandatory local law may give you stronger rights than
          those described above, and nothing in these Terms is intended to reduce those rights.
        </p>
      </section>

      <section>
        <h2>8. Termination</h2>
        <p>
          You may stop using the Service at any time and request deletion of your account by contacting us at{" "}
          <a href={ELITESCORE_SUPPORT_MAILTO}>{ELITESCORE_SUPPORT_EMAIL}</a>.
        </p>
        <p>
          We may suspend or terminate your access if you materially breach these Terms, if we are required to do so by
          law, or if we decide to stop offering the Service. Sections that by their nature should survive termination
          (including liability, governing law, and dispute resolution) continue to apply.
        </p>
      </section>

      <section>
        <h2>9. Governing law and disputes</h2>
        <p>
          These Terms are governed by the laws of the Netherlands, without prejudice to any mandatory consumer
          protection laws of your country of habitual residence.
        </p>
        <p>
          <strong>Consumers in the EEA:</strong> You may bring proceedings before the courts of the EEA Member State
          where you are domiciled, in accordance with Article 18 of the Brussels I bis Regulation or equivalent
          applicable rules. The European Commission&apos;s Online Dispute Resolution platform is available at{" "}
          <a href="https://ec.europa.eu/odr" target="_blank" rel="noopener noreferrer">
            https://ec.europa.eu/odr
          </a>
          . We are not currently obliged to participate in an alternative dispute resolution procedure, but you may
          contact us directly to resolve any issue.
        </p>
        <p>
          <strong>Consumers in the Netherlands:</strong> Dutch mandatory law (including applicable provisions of Boek 6
          and 7 BW) applies in addition to EU rules. You may bring a complaint before the{" "}
          <a href="https://www.acm.nl" target="_blank" rel="noopener noreferrer">
            Autoriteit Consument &amp; Markt (ACM)
          </a>{" "}
          or seek recourse through the Dutch courts.
        </p>
      </section>

      <section>
        <h2>10. Changes to these Terms</h2>
        <p>
          We may update these Terms from time to time. We will post the updated version with a new &quot;Last
          updated&quot; date. If a change is material, we will notify you by email or through the Service before it
          takes effect. If you do not accept the updated Terms, please stop using the Service and request deletion of your
          account.
        </p>
      </section>

      <section>
        <h2>11. Contact</h2>
        <p>
          Questions about these Terms:{" "}
          <a href={ELITESCORE_SUPPORT_MAILTO}>
            <strong>{ELITESCORE_SUPPORT_EMAIL}</strong>
          </a>
        </p>
      </section>
    </LegalPageLayout>
  )
}
