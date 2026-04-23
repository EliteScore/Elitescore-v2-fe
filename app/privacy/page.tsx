import type { Metadata } from "next"
import Link from "next/link"
import { LegalPageLayout, LEGAL_LAST_UPDATED } from "@/components/legal-page-layout"
import { ELITESCORE_SUPPORT_EMAIL, ELITESCORE_SUPPORT_MAILTO } from "@/lib/supportContact"

export const metadata: Metadata = {
  title: "Privacy Policy | EliteScore",
  description:
    "How EliteScore processes personal data under the GDPR, accountability buddies, and Dutch (AVG/UAVG) law. Beta / pre-registration.",
}

const BETA_VERSION = "Beta / Pre-registration"

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout title="Privacy Policy" lastUpdated={LEGAL_LAST_UPDATED} version={BETA_VERSION}>
      <blockquote className="rounded-r-xl border-l-4 border-slate-400 bg-white/90 py-3 pl-4 pr-3 text-slate-700 shadow-sm not-italic">
        <p className="text-sm font-semibold text-slate-900">Beta notice.</p>
        <p className="mt-1.5 text-sm leading-relaxed">
          EliteScore is currently in beta. This Privacy Policy reflects our practices during this phase. Some technical
          infrastructure is still being finalised. We are committed to GDPR compliance and will update this Policy as
          the product develops.
        </p>
      </blockquote>

      <section>
        <h2>1. Who this Policy applies to</h2>
        <p>
          This Policy explains how the individual operator of EliteScore (the &quot;controller&quot; for GDPR purposes)
          collects and uses personal data when you use the EliteScore website, application, and related services
          (together, the &quot;Service&quot;), or when you contact us.
        </p>
        <p>
          This Policy also applies to accountability buddies — third parties whose email addresses are provided by
          users of the Service. If you have received an accountability buddy invitation email, this Policy explains what
          data we hold about you, why, and what rights you have. Your rights are set out in Section 8.
        </p>
        <p>This Policy is prepared in accordance with:</p>
        <ul>
          <li>Regulation (EU) 2016/679 (GDPR);</li>
          <li>The Dutch Uitvoeringswet AVG (UAVG) and other applicable Dutch implementing legislation;</li>
          <li>The ePrivacy Directive as transposed in the Netherlands (Telecommunicatiewet).</li>
        </ul>
        <p>
          Please read this Policy alongside the <Link href="/terms">Terms of Service</Link>.
        </p>
      </section>

      <section>
        <h2>2. Who is the data controller</h2>
        <p>
          The controller is the individual developer who operates EliteScore, based in the Netherlands. We are currently
          unregistered as a legal entity. Our registration details (KvK number, legal name, address) will be added here
          once registration is complete.
        </p>
        <p>
          <strong>Contact for privacy matters:</strong>{" "}
          <a href={ELITESCORE_SUPPORT_MAILTO}>{ELITESCORE_SUPPORT_EMAIL}</a> — please include &quot;GDPR / Privacy&quot; in
          the subject line.
        </p>
        <p>
          We are not currently required to appoint a Data Protection Officer (DPO). If this requirement changes, DPO
          contact details will be published here.
        </p>
      </section>

      <section>
        <h2>3. What personal data we collect</h2>
        <p>
          We may collect and process the following categories of personal data depending on how you use the Service:
        </p>
        <p>
          <strong>Account data:</strong> email address, display name or username, password (stored using appropriate
          hashing; never in plain text), and any authentication tokens from third-party sign-in providers.
        </p>
        <p>
          <strong>Service and activity data:</strong> challenges you join, tasks you complete, proof submissions, scores,
          streaks, ranks, and any content you submit as part of a challenge.
        </p>
        <p>
          <strong>Leaderboard display preference:</strong> your choice of whether your leaderboard entry shows your
          nickname (the default) or your real name. This preference can be changed at any time in your account settings.
        </p>
        <p>
          <strong>Communications data:</strong> messages and emails you send us, for example for support requests.
        </p>
        <p>
          <strong>Integration data:</strong> if you sign in using a third-party provider (such as Google), we receive
          only the information that provider makes available to us.
        </p>
        <p>
          <strong>Accountability buddy data:</strong> if you choose to use the accountability buddy feature, we collect
          your full name (as provided at registration) and the email address you supply for your buddy. Your full name
          may be included in notification emails sent to your buddy so they can identify who has added them. The
          buddy&apos;s email address is used solely to send challenge-related notifications and an initial opt-out
          notice (see Section 4 below for the legal basis).
        </p>
        <p>
          <strong>Technical and usage data:</strong> IP address, browser type, device type, operating system, language
          settings, timestamps of Service interactions, and security-related events.
        </p>
        <p>
          We do not intentionally collect special categories of personal data as defined in Article 9 GDPR (such as
          health data, religious beliefs, or biometric data). Please do not include such information in free-text fields
          or submissions. If you do, we may delete it if it is not necessary for the Service.
        </p>
      </section>

      <section>
        <h2>4. Why we process your data and our legal basis</h2>
        <p>We process personal data only where we have a lawful basis under Article 6 GDPR. The bases we rely on are:</p>
        <p>
          <strong>Performance of a contract (Art. 6(1)(b) GDPR):</strong> We process account data and activity data to
          provide the Service as described in the Terms of Service — running your account, processing challenge
          entries, maintaining leaderboards, and delivering the features you use.
        </p>
        <p>
          <strong>Legitimate interests (Art. 6(1)(f) GDPR):</strong> We process technical and usage data to keep the
          Service secure, detect and prevent abuse and fraud, fix bugs, and improve the Service. Our legitimate interests
          in running a functioning and secure service are balanced against your rights and interests. You may object to
          this processing at any time (see Section 8).
        </p>
        <p>
          <strong>Accountability buddy notifications (Art. 6(1)(f) GDPR — Legitimate interests):</strong> When you
          activate the accountability buddy feature, we process your full name and your buddy&apos;s email address to
          send the buddy notifications about your challenge progress. This processing is based on our legitimate interest
          in operating a feature you have explicitly activated. The buddy&apos;s legitimate interests and rights are
          protected by: (a) receiving a first-contact notification that explains the processing in accordance with Articles
          13–14 GDPR, sets out their rights, includes a link to these Terms and this Privacy Policy, and provides a clear
          opt-out mechanism; and (b) the deletion of their data when the challenge ends, when you delete your account, or
          when the buddy opts out — whichever occurs first. If you are an accountability buddy reading this, you can opt
          out at any time by clicking the unsubscribe link in any email you receive from us, or by contacting{" "}
          <a href={ELITESCORE_SUPPORT_MAILTO}>{ELITESCORE_SUPPORT_EMAIL}</a>.
        </p>
        <p>
          <strong>Legal obligation (Art. 6(1)(c) GDPR):</strong> We may process data where we are required to do so by
          applicable law, for example in response to a lawful request from a competent authority.
        </p>
        <p>
          <strong>Consent (Art. 6(1)(a) GDPR):</strong> Where we ask for your consent — for example for non-essential
          cookies — we will request it clearly and separately. You can withdraw consent at any time without affecting
          the lawfulness of any processing carried out before withdrawal.
        </p>
        <p>
          <strong>Marketing communications:</strong> We do not send marketing communications on the basis of legitimate
          interests. Any marketing or promotional communications will only be sent where you have given separate, explicit
          consent by ticking an opt-in checkbox at the relevant point of collection. You can withdraw that consent at
          any time.
        </p>
      </section>

      <section>
        <h2>5. Who we share data with</h2>
        <p>We do not sell your personal data.</p>
        <p>We may share data with the following categories of recipients:</p>
        <p>
          <strong>Service providers (processors):</strong> We use third-party providers for hosting, email delivery, and
          analytics. These providers act on our instructions and are bound by data processing agreements in accordance
          with Article 28 GDPR. A list of current sub-processors is available on request.
        </p>
        <p>
          <strong>Authorities:</strong> We may disclose data to law enforcement, courts, or regulators where we are
          legally required to do so, or where necessary to establish or defend legal claims.
        </p>
        <p>
          <strong>International transfers:</strong> If any of our processors are located outside the EEA, we rely on an
          adequacy decision by the European Commission, Standard Contractual Clauses (SCCs), or another approved transfer
          mechanism. Supplementary measures are applied where required by applicable guidance (including post-Schrems II
          requirements).
        </p>
        <p>
          <strong>Course publishers:</strong> We do not share your personal data with any of the third-party educational
          institutions or course publishers whose content is referenced on this Service. EliteScore has no data-sharing
          agreements, affiliate arrangements, or commercial relationships with these organisations.
        </p>
      </section>

      <section>
        <h2>6. Third-party courses and no affiliation</h2>
        <p>
          EliteScore is an independent gamification and accountability platform. We are not affiliated with, endorsed
          by, sponsored by, or in any commercial or legal partnership with any of the educational institutions or
          organisations whose courses appear on this Service, including but not limited to Harvard University, Google
          LLC, Massachusetts Institute of Technology (MIT), and Microsoft Corporation. All course names, trademarks,
          service marks, and logos referenced on this Service belong exclusively to their respective owners.
        </p>
      </section>

      <section>
        <h2>7. How long we keep your data</h2>
        <p>
          We keep your personal data only for as long as necessary for the purposes described above, or as required by
          law.
        </p>
        <p>As a general guide:</p>
        <ul>
          <li>
            <strong>Account data</strong> is kept for as long as your account is active.
          </li>
          <li>
            <strong>Activity and challenge data</strong> is kept for the duration of the relevant challenge, plus a
            reasonable period for dispute resolution.
          </li>
          <li>
            <strong>Accountability buddy data</strong> is deleted when the associated challenge ends, when you delete
            your account, or when the buddy opts out — whichever occurs first.
          </li>
          <li>
            <strong>Leaderboard entries</strong> are anonymised or removed upon account deletion.
          </li>
          <li>
            <strong>Security and technical logs</strong> are kept for a short period (typically weeks to a few months)
            for incident response purposes.
          </li>
          <li>
            <strong>Support correspondence</strong> is kept as long as reasonably necessary to resolve the matter and
            comply with any legal obligations.
          </li>
        </ul>
        <p>
          When the retention period ends, we delete or irreversibly anonymise your data unless a longer period is
          required by law (for example, a legal hold).
        </p>
      </section>

      <section>
        <h2>8. Your rights under GDPR (Articles 12–22)</h2>
        <p>
          As a data subject — including if you are an accountability buddy — you have the following rights, subject to
          the conditions and limitations set out in the GDPR:
        </p>
        <ul>
          <li>
            <strong>Right of access (Art. 15):</strong> You can request a copy of the personal data we hold about you.
          </li>
          <li>
            <strong>Right to rectification (Art. 16):</strong> You can ask us to correct inaccurate or incomplete data.
          </li>
          <li>
            <strong>Right to erasure (Art. 17):</strong> You can ask us to delete your data where the conditions under
            Art. 17 are met.
          </li>
          <li>
            <strong>Right to restriction of processing (Art. 18):</strong> You can ask us to limit how we use your data
            in certain circumstances.
          </li>
          <li>
            <strong>Right to data portability (Art. 20):</strong> Where processing is based on contract or consent
            and carried out by automated means, you can ask for your data in a structured, machine-readable format.
          </li>
          <li>
            <strong>Right to object (Art. 21):</strong> You can object at any time to processing based on legitimate
            interests, including profiling. You also have an unconditional right to object to processing for direct
            marketing.
          </li>
          <li>
            <strong>Right to withdraw consent:</strong> Where we rely on consent, you can withdraw it at any time.
            Withdrawal does not affect the lawfulness of prior processing.
          </li>
          <li>
            <strong>Rights related to automated decision-making (Art. 22):</strong> We do not currently make decisions
            about you solely by automated means that produce legal or similarly significant effects. If this changes, we
            will inform you and provide the applicable rights.
          </li>
        </ul>
        <p>
          To exercise any of these rights, contact us at{" "}
          <a href={ELITESCORE_SUPPORT_MAILTO}>
            <strong>{ELITESCORE_SUPPORT_EMAIL}</strong>
          </a>{" "}
          (subject line: &quot;GDPR / Privacy&quot;). We will respond within one month, extendable by up to two further
          months in complex cases as permitted by the GDPR. We may need to verify your identity before fulfilling a
          request.
        </p>
      </section>

      <section>
        <h2>9. Complaints and supervisory authority</h2>
        <p>
          If you are unhappy with how we handle your data, please contact us first. If your concern is not resolved, you
          have the right to lodge a complaint with a data protection supervisory authority.
        </p>
        <p>
          <strong>Netherlands:</strong> Autoriteit Persoonsgegevens (AP)
          <br />
          Website:{" "}
          <a href="https://www.autoriteitpersoonsgegevens.nl" target="_blank" rel="noopener noreferrer">
            https://www.autoriteitpersoonsgegevens.nl
          </a>
          <br />
          Post: Postbus 93374, 2509 AJ Den Haag, Netherlands
        </p>
        <p>If you are located in another EEA Member State, you may also contact your local supervisory authority.</p>
      </section>

      <section>
        <h2>10. Cookies and similar technologies</h2>
        <p>We may use cookies and similar technologies for the following purposes:</p>
        <ul>
          <li>
            <strong>Strictly necessary:</strong> These are required for the Service to function (for example, to keep
            you logged in). They do not require your consent.
          </li>
          <li>
            <strong>Analytics:</strong> We may use analytics tools to understand how the Service is used. Where this
            involves setting cookies or accessing information on your device, we will ask for your consent before doing
            so, in accordance with Dutch ePrivacy rules (Telecommunicatiewet) and the GDPR.
          </li>
          <li>
            <strong>Personalisation:</strong> Where features personalise your experience beyond what is strictly
            necessary, we will ask for consent where required.
          </li>
        </ul>
        <p>
          You can control or delete cookies through your browser settings. Disabling strictly necessary cookies may
          prevent parts of the Service from working.
        </p>
        <p>A more detailed cookie list will be added to this Policy as the Service develops.</p>
      </section>

      <section>
        <h2>11. Security and data breaches</h2>
        <p>
          We apply appropriate technical and organisational measures to protect your personal data, as required by
          Article 32 GDPR. During the beta phase, these measures include password hashing, encrypted data transmission
          (HTTPS), and access controls. We keep our security practices under review.
        </p>
        <p>
          In the event of a personal data breach, we will act in accordance with our obligations under Articles 33 and
          34 GDPR. Where a breach is likely to result in a risk to your rights and freedoms, we will notify the
          Autoriteit Persoonsgegevens within 72 hours. Where the risk is assessed as high, we will also notify you
          directly by email without undue delay, describing the nature of the breach, the categories of data affected,
          the likely consequences, and the measures taken or proposed to address it. We maintain an internal record of
          all data breaches in accordance with Article 33(5) GDPR.
        </p>
        <p>
          No system is completely secure. Please use a strong and unique password and notify us immediately if you
          suspect any unauthorised access to your account.
        </p>
      </section>

      <section>
        <h2>12. Children</h2>
        <p>
          The Service is not directed at anyone under the age of 16. We do not knowingly collect personal data from
          children under 16. If you believe a child has registered or provided us with data, please contact us at{" "}
          <a href={ELITESCORE_SUPPORT_MAILTO}>{ELITESCORE_SUPPORT_EMAIL}</a> and we will take steps to delete the
          relevant data promptly.
        </p>
      </section>

      <section>
        <h2>13. Changes to this Policy</h2>
        <p>
          We may update this Policy from time to time. The &quot;Last updated&quot; date at the top of this page will
          reflect any changes. If we make a material change to how we process your data, we will notify you by email or
          through the Service before the change takes effect. Where a change requires a new legal basis (for example, a
          new use of your data that requires consent), we will request that consent separately.
        </p>
      </section>

      <section>
        <h2>14. Contact</h2>
        <p>
          Privacy and data protection questions:{" "}
          <a href={ELITESCORE_SUPPORT_MAILTO}>
            <strong>{ELITESCORE_SUPPORT_EMAIL}</strong>
          </a>
        </p>
        <p>Please include &quot;GDPR / Privacy&quot; in the subject line.</p>
      </section>
    </LegalPageLayout>
  )
}
