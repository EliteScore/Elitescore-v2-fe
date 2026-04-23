import type { Metadata } from "next"
import Link from "next/link"
import { LegalPageLayout, LEGAL_LAST_UPDATED } from "@/components/legal-page-layout"
import { ELITESCORE_SUPPORT_EMAIL, ELITESCORE_SUPPORT_MAILTO } from "@/lib/supportContact"

export const metadata: Metadata = {
  title: "Privacy Policy | EliteScore",
  description:
    "How EliteScore processes personal data under the GDPR, EEA law, and Dutch (AVG/UAVG) rules. Your rights, retention, and contacts.",
}

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout title="Privacy Policy" lastUpdated={LEGAL_LAST_UPDATED}>
      <p className="rounded-xl border border-amber-200/80 bg-amber-50/80 px-3 py-2.5 text-xs text-amber-950 md:text-sm">
        <strong>Notice:</strong> This Privacy Policy explains how the operator of EliteScore (the <strong>“controller”
        </strong> in GDPR terms) processes personal data. It is not legal advice. You should have it reviewed and adapted
        for your final corporate structure, hosting stack, and data flows (e.g. by a lawyer qualified in the Netherlands
        and EU privacy law) before relying on it in court or in dealings with a supervisory authority.
      </p>

      <section>
        <h2>1. Scope and who this applies to</h2>
        <p>
          This Policy applies to personal data we process when you use the EliteScore website, application, and related
          services (the <strong>“Service”</strong>), and when you contact us. It is prepared with the{" "}
          <strong>General Data Protection Regulation (EU) 2016/679</strong> (&quot;GDPR&quot;) and, for users in the
          Netherlands, the <strong>Uitvoeringswet AVG (UAVG)</strong> and other Dutch rules that implement the GDPR and
          related laws. If you are in the UK, the UK GDPR and Data Protection Act 2018 may also apply; we will respect
          applicable UK and EU adequacy and transfer tools where relevant.
        </p>
        <p>
          Please read this Policy together with our <Link href="/terms">Terms of Service</Link>.
        </p>
      </section>

      <section>
        <h2>2. Data controller and contact</h2>
        <p>
          The <strong>controller</strong> responsible for the processing described here is the legal entity that operates
          EliteScore, reachable for privacy matters at:{" "}
          <a href={ELITESCORE_SUPPORT_MAILTO}>{ELITESCORE_SUPPORT_EMAIL}</a> (title your message
          <strong> “Data protection / GDPR”</strong>).
        </p>
        <p>
          We may list the legal name, registered address, and business identifiers (e.g. KvK, VAT) in the Service,
          in these documents, or in the footer. If you need them for a specific purpose (e.g. a data processing agreement
          for your organisation), ask us at the e-mail address above. We are not required to appoint a Data Protection
          Officer (DPO) in every case under EU law; if we appoint a DPO, we will publish their contact details here.
        </p>
      </section>

      <section>
        <h2>3. What personal data we process</h2>
        <p>Depending on how you use the Service, we may process:</p>
        <ul>
          <li>
            <strong>Account and identity data:</strong> e-mail address, name, username, password or authentication
            tokens, and similar credentials (passwords are stored using appropriate technical measures, not in plain
            text).
          </li>
          <li>
            <strong>Activity and service data:</strong> challenges joined, task completion, proof submissions, scores,
            streaks, ranks, and technical logs related to the Service.
          </li>
          <li>
            <strong>Communications:</strong> messages you send to us (e.g. support), and, where the Service allows, user
            communication metadata or content in line with the feature.
          </li>
          <li>
            <strong>Third-party and integration data:</strong> where you sign in with a provider, we receive the
            information that provider discloses. Where you add a spectator e-mail in line with a challenge, we process
            that e-mail for the operation of that feature (e.g. invites or accountability), as set out in the product and
            in the Terms.
          </li>
          <li>
            <strong>Technical and usage data:</strong> IP address, device type, browser, language, date/time, cookies or
            similar technologies (where used), and security-related events.
          </li>
        </ul>
        <p>
          We do not intend to process special categories of data (Article 9 GDPR) unless you choose to put such
          information in a free-text field, in a profile, or in a submission—please avoid that unless the feature
          requires it. If you do, you should consider whether you have a separate legal basis; we will treat such
          information with additional care and may delete it if it is not necessary.
        </p>
      </section>

      <section>
        <h2>4. Purposes and legal bases (Article 6 GDPR)</h2>
        <p>We process personal data for the following purposes and, where the GDPR requires it, on these bases:</p>
        <ul>
          <li>
            <strong>Providing the Service, account management, and contract performance</strong> (Art. 6(1)(b) GDPR) —
            running accounts, challenges, leaderboards, proof handling, and related features in line with the Terms.
          </li>
          <li>
            <strong>Legitimate interests</strong> (Art. 6(1)(f) GDPR) — security, abuse prevention, fraud detection,
            improving and analysing the Service, and internal reporting, where we balance our interests against your
            rights and you can object in line with your rights below.
          </li>
          <li>
            <strong>Legal obligations</strong> (Art. 6(1)(c) GDPR) — e.g. responding to lawful requests from authorities,
            tax, or accounting when applicable.
          </li>
          <li>
            <strong>Consent</strong> (Art. 6(1)(a) GDPR) — where we ask for it explicitly (e.g. certain marketing,
            non-essential cookies, or research). You can withdraw consent at any time; withdrawal does not affect
            processing before withdrawal when it was lawful.
          </li>
        </ul>
      </section>

      <section>
        <h2>5. Recipients, processors, and international transfers</h2>
        <p>
          We use trusted <strong>processors</strong> (e.g. hosting, e-mail, analytics) who process data on our
          instructions. We use agreements that include GDPR Art. 28 style clauses. Our Service may be hosted in the EEA
          or, where the provider is outside the EEA, we rely on an EU Commission adequacy decision, Standard Contractual
          Clauses (SCCs), the UK’s International Data Transfer Addendum, or other approved mechanisms, plus supplementary
          measures where required by case law (including Schrems II guidance).
        </p>
        <p>
          We do not <strong>sell</strong> your personal data in the sense of US “sale” models. We may have to share data
          with law enforcement or courts when we are legally required to, or to establish or defend legal claims where
          permitted.
        </p>
      </section>

      <section>
        <h2>6. Retention</h2>
        <p>
          We keep personal data only as long as needed for the purposes above, and as required by law. Examples: account
          data is kept for the life of the account; security logs for a limited period; proof or challenge data in line
          with game rules, dispute resolution, and storage costs. When retention ends, we delete or irreversibly
          anonymise data unless a longer period is required (e.g. legal hold).
        </p>
      </section>

      <section>
        <h2>7. Your rights (Articles 12–22 GDPR)</h2>
        <p>Depending on the situation, you have the right to:</p>
        <ul>
          <li>
            <strong>Access</strong> your data and receive a copy;
          </li>
          <li>
            <strong>Rectify</strong> inaccurate data; <strong>erasure</strong> (“right to be forgotten”) where
            conditions are met; <strong>restrict</strong> processing; <strong>data portability</strong> where
            processing is by automated means and based on contract or consent;
          </li>
          <li>
            <strong>Object</strong> to processing based on legitimate interests (including profiling) and to
            <strong> direct marketing</strong> at any time;
          </li>
          <li>
            <strong>Withdraw consent</strong> where we rely on it, without affecting prior lawful processing; and
          </li>
          <li>
            <strong>Not be subject to solely automated decisions with legal or similarly significant effects</strong>{" "}
            in the cases described in Art. 22, where we do not have an allowed exception; we will explain any such
            decision-making in the product if it applies and offer human review.
          </li>
        </ul>
        <p>
          You can contact us at <a href={ELITESCORE_SUPPORT_MAILTO}>{ELITESCORE_SUPPORT_EMAIL}</a> to exercise these
          rights. We will respond without undue delay and at the latest within <strong>one month</strong>, extendable
          in complex cases as allowed by the GDPR. We may need to verify your identity. You have the right to lodge a
          complaint with a supervisory authority—see the next section.
        </p>
      </section>

      <section>
        <h2>8. Supervisory authorities — Netherlands and the EEA</h2>
        <p>
          If you are in the <strong>Netherlands</strong>, the Dutch supervisory authority is the{" "}
          <strong>Autoriteit Persoonsgegevens (AP)</strong> (
          <a href="https://www.autoriteitpersoonsgegevens.nl" target="_blank" rel="noopener noreferrer">
            https://www.autoriteitpersoonsgegevens.nl
          </a>
          , Postbus 93374, 2509 AJ Den Haag, Netherlands). You can lodge a complaint with the AP, or, if you are in
          another EEA state, with your local data protection authority.
        </p>
        <p>
          Under Chapter VII GDPR, certain cross-border cases may be handled through cooperation between authorities
          (e.g. one-stop-shop) where our main or single establishment in the EEA is identified.
        </p>
      </section>

      <section>
        <h2>9. Cookies and similar technologies (ePrivacy)</h2>
        <p>
          We may use cookies, local storage, or similar tools for (a) strictly necessary operation of the Service, (b)
          analytics, or (c) personalisation, as permitted by the ePrivacy rules transposed in your country (e.g. in the
          Netherlands, the Telecommunicatiewet / relevant EU rules on consent) and the GDPR. Where we need consent for
          non-essential technologies, we will request it in a clear way (e.g. banner) before setting those tools. You can
          control many cookies through your browser; blocking strictly necessary cookies may break parts of the
          Service.
        </p>
      </section>

      <section>
        <h2>10. Security</h2>
        <p>
          We implement appropriate technical and organisational measures (TOMs) under Art. 32 GDPR, such as
          access controls, encryption in transit where appropriate, and vendor review. No system is 100% secure; please
          use a strong, unique password and keep your device safe.
        </p>
      </section>

      <section>
        <h2>11. Children</h2>
        <p>
          The Service is not directed at children under 16. We do not knowingly collect their personal data. If you
          believe a child has provided data, contact us and we will take steps to delete it, in line with national rules
          on consent for information society services (including implementation of Article 8 GDPR in the Netherlands
          under the AVG/UAVG).
        </p>
      </section>

      <section>
        <h2>12. Changes to this Policy</h2>
        <p>
          We may update this Policy. The “Last updated” date at the top will change. We will take additional steps (e.g.
          notice in-app or by e-mail) if required by law for material changes to processing. Continued use after the
          update may be subject to the updated Policy where the law allows; where your consent is required, we will ask
          for it.
        </p>
      </section>

      <section>
        <h2>13. Contact</h2>
        <p>
          Privacy and data protection questions:{" "}
          <a href={ELITESCORE_SUPPORT_MAILTO}>{ELITESCORE_SUPPORT_EMAIL}</a> (include “GDPR / privacy” in the subject
          line).
        </p>
      </section>
    </LegalPageLayout>
  )
}
