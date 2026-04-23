import type { Metadata } from "next"
import { LegalPageLayout, LEGAL_LAST_UPDATED } from "@/components/legal-page-layout"
import { ELITESCORE_SUPPORT_EMAIL, ELITESCORE_SUPPORT_MAILTO } from "@/lib/supportContact"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Terms of Service | EliteScore",
  description:
    "EliteScore Terms of Service. Rules for using our challenge and gamification platform in the EEA, including the Netherlands.",
}

export default function TermsOfServicePage() {
  return (
    <LegalPageLayout title="Terms of Service" lastUpdated={LEGAL_LAST_UPDATED}>
      <p className="rounded-xl border border-amber-200/80 bg-amber-50/80 px-3 py-2.5 text-xs text-amber-950 md:text-sm">
        <strong>Important:</strong> These Terms are a legal agreement between you and the operator of EliteScore. They are
        designed to work alongside mandatory consumer and data protection laws in the EEA, including the Netherlands.{" "}
        <strong>They do not replace professional legal advice.</strong> You should have these Terms (and the Privacy
        Policy) reviewed by qualified counsel, especially if you trade as a business.
      </p>

      <section>
        <h2>1. Who we are and acceptance</h2>
        <p>
          <strong>EliteScore</strong> (“we”, “us”, “our”) operates the website, app, and related services (the{" "}
          <strong>“Service”</strong>) that let you take part in challenges, submit proof, use leaderboards, and connect
          with your community. The operator of the Service acts as a contracting party. For general questions, contact
          us at{" "}
          <a href={ELITESCORE_SUPPORT_MAILTO}>{ELITESCORE_SUPPORT_EMAIL}</a>. We may add or publish company and
          registration details (for example, trade name, legal form, and registered address) in the Service or in these
          Terms from time to time.
        </p>
        <p>
          By creating an account, accessing, or using the Service, you agree to these Terms and to our{" "}
          <Link href="/privacy">Privacy Policy</Link>. If you do not agree, do not use the Service. Where you are using
          the Service for an organisation, you confirm that you are authorised to bind that organisation to these
          Terms.
        </p>
      </section>

      <section>
        <h2>2. Eligibility and accounts</h2>
        <ul>
          <li>
            The Service is not intended for children under 16. If you are under 16, you must not create an account unless
            a parent or legal guardian has given the consent required in your country (including, where you live in the
            Netherlands, the rules that implement Article 8 GDPR in national law such as the UAVG for consent for
            information society services).
          </li>
          <li>You must provide accurate registration information and keep it up to date.</li>
          <li>
            You are responsible for your login credentials. Notify us immediately at{" "}
            <a href={ELITESCORE_SUPPORT_MAILTO}>{ELITESCORE_SUPPORT_EMAIL}</a> if you suspect unauthorised use.
          </li>
        </ul>
      </section>

      <section>
        <h2>3. The Service, challenges, and your content</h2>
        <p>
          The Service may include daily or timed tasks, upload or submission of proof, scoring (such as “EliteScore”),
          streaks, ranks, and communication features. We may add, change, or withdraw features, challenges, or
          integrations, provided we respect mandatory rights that apply to you.
        </p>
        <p>
          You retain your intellectual property in content you upload or submit. You grant us a non-exclusive, worldwide
          licence to host, process, store, display, and otherwise use that content for the purpose of providing and
          improving the Service, enforcing these Terms, and as described in the Privacy Policy, including to display
          your progress, handle submissions, and operate leaderboards. You are responsible for ensuring you have
          the rights to any materials you provide.
        </p>
        <p>
          You will not use the Service to break the law, infringe others’ rights, or submit malicious, unlawful, hateful,
          violent, or sexually exploitative content. We may remove content or restrict accounts where necessary to
          protect users or to comply with law, subject to your statutory rights and any complaint procedures below.
        </p>
      </section>

      <section>
        <h2>4. Subscriptions, fees, and third parties</h2>
        <p>
          If we offer paid features, prices, billing cycles, and taxes will be shown before you pay. You authorise
          us and our payment providers to charge your chosen payment method in line with the plan you select. We use
          third-party infrastructure (e.g. hosting, analytics) as described in the Privacy Policy.
        </p>
      </section>

      <section>
        <h2>5. Limitation of liability (without prejudice to mandatory law)</h2>
        <p>
          <strong>Nothing in these Terms limits or excludes our liability for death or personal injury caused by
          negligence, fraud or fraudulent misrepresentation, or any other liability that cannot be limited or excluded
          under applicable law (including consumer protection rules in the EEA and the Netherlands).</strong>
        </p>
        <p>
          The Service is provided on an “as is” and “as available” basis. To the fullest extent permitted by applicable
          law, we are not liable for indirect or consequential loss, loss of data, loss of business, or loss of
          profits, except where such exclusion is not allowed. Where we are liable, our total aggregate liability
          arising in connection with the Service in any twelve-month period may be limited to the greater of (a) the
          fees you actually paid to us in that period for the Service, or (b) one hundred and fifty euro (€150), except
          where a higher amount is required by mandatory law. Local mandatory consumer laws may give you stronger rights
          (for example in the Netherlands, rules on non-conformity and remedies under the Civil Code in consumer
          contracts).
        </p>
      </section>

      <section>
        <h2>6. Termination</h2>
        <p>
          You may stop using the Service and may request account deletion in line with the Privacy Policy. We may
          suspend or end access where you materially breach these Terms, where we must do so to comply with law, or
          where we lawfully stop offering the Service. Provisions that by nature should survive (including limitations,
          applicable law, and dispute resolution) will continue to apply.
        </p>
      </section>

      <section>
        <h2>7. Governing law, consumers in the EEA and the Netherlands, and disputes</h2>
        <p>
          <strong>Consumers in the EEA and the United Kingdom (where the UK’s retained EU consumer law applies to you):
          </strong> You benefit from all mandatory rights under the law of the country where you are habitually resident.
          Nothing in these Terms is intended to take those rights away.
        </p>
        <p>
          <strong>Consumers in the Netherlands:</strong> Dutch mandatory law (including Book 6 and 7 of the Dutch Civil
          Code, where applicable) may apply in addition to EU rules on digital content and services and consumer
          protection. The European Commission’s online dispute resolution platform (ODR) is available at{" "}
          <a href="https://ec.europa.eu/odr" target="_blank" rel="noopener noreferrer">
            https://ec.europa.eu/odr
          </a>
          . We are not obliged to use an alternative dispute resolution body; you may also bring proceedings before the
          courts of your place of residence where that is available to you under EU/EEA or Dutch procedural rules, or
          where mandatory law requires otherwise.
        </p>
        <p>
          <strong>Choice of law (contractual, subject to mandatory consumer law):</strong> Unless a mandatory law of your
          country (including the Netherlands) gives you a right to a different court, and except where the EU/EEA
          requires otherwise, these Terms and any dispute arising from them are otherwise governed by the laws of the
          Kingdom of the Netherlands, excluding only its conflict-of-law rules that would refer to another law, where
          such referral is not mandatory. Subject to the paragraph above, the courts of the Netherlands may have
          jurisdiction, without prejudice to the consumer’s right to sue in the courts of the Member State in which
          they are domiciled if such a right follows from Article 18 Brussels I bis or equivalent.
        </p>
      </section>

      <section>
        <h2>8. Changes to these Terms</h2>
        <p>
          We may update these Terms. We will post the new version with an updated “Last updated” date. If the change
          is material, we will take reasonable steps to inform you (for example by e-mail or in-app notice) where
          required by law. Your continued use after the effective date can constitute acceptance, except where
          applicable law requires a different process (e.g. explicit consent for specific changes to processing under
          privacy law). If you do not accept the new Terms, you should stop using the Service and can exercise your
          data rights as described in the Privacy Policy.
        </p>
      </section>

      <section>
        <h2>9. Contact</h2>
        <p>
          Questions about these Terms: <a href={ELITESCORE_SUPPORT_MAILTO}>{ELITESCORE_SUPPORT_EMAIL}</a>
        </p>
      </section>
    </LegalPageLayout>
  )
}
