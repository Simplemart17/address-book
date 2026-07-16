import { type Metadata } from 'next'

import LegalLayout from '@/components/legal/LegalLayout'

const CONTACT_EMAIL = 'contact@simplemart.dev'
const LAST_UPDATED = 'July 16, 2026'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'How ContactRef collects, uses, stores, shares, and protects your personal information, including data obtained through Google sign-in.',
}

export default function PrivacyPolicyPage() {
  return (
    <LegalLayout
      title="Privacy Policy"
      lastUpdated={LAST_UPDATED}
      intro="This Privacy Policy explains how ContactRef (“we,” “us,” or “our”) collects, uses, stores, shares, and protects your information when you use our contact management application (the “Service”). By using the Service, you agree to the practices described here."
    >
      <h2>1. Information We Collect</h2>
      <p>We collect the following categories of information:</p>

      <h3>Account information</h3>
      <p>
        When you create an account, we collect your name, email address, and
        authentication credentials. Authentication is handled by our identity
        provider, Clerk. If you choose to sign in with Google, we receive basic
        profile information from your Google Account as described in the “Google
        User Data” section below.
      </p>

      <h3>Contact data you provide</h3>
      <p>
        The Service exists to store the contacts you add. This includes names,
        phone numbers, email addresses, physical addresses, notes, and any
        contact photos you upload. This information is provided by you and stored
        on your behalf.
      </p>

      <h3>Uploaded images</h3>
      <p>
        Contact photos you upload are stored in our secure cloud storage. These
        images are associated only with your account.
      </p>

      <h3>Technical and usage information</h3>
      <p>
        We and our service providers may automatically collect limited technical
        data such as your IP address, browser type, device information, and log
        data used to operate, secure, and improve the Service.
      </p>

      <h2>2. Google User Data</h2>
      <p>
        If you sign in with Google, we request access only to your basic Google
        Account profile — specifically your <strong>name</strong>,{' '}
        <strong>email address</strong>, and <strong>profile picture</strong>. We
        use this information solely to:
      </p>
      <ul>
        <li>Create and authenticate your ContactRef account;</li>
        <li>Identify you within the Service and display your profile; and</li>
        <li>Communicate with you about your account.</li>
      </ul>
      <p>
        We do <strong>not</strong> request access to your Gmail, Google Drive,
        Google Contacts, Calendar, or any other restricted or sensitive Google
        API scopes. We do not use Google user data for advertising, and we do not
        sell it.
      </p>
      <p>
        ContactRef&apos;s use and transfer of information received from Google
        APIs adheres to the{' '}
        <a
          href="https://developers.google.com/terms/api-services-user-data-policy"
          target="_blank"
          rel="noopener noreferrer"
        >
          Google API Services User Data Policy
        </a>
        , including the Limited Use requirements.
      </p>

      <h2>3. How We Use Your Information</h2>
      <p>We use the information we collect to:</p>
      <ul>
        <li>Provide, maintain, and operate the Service;</li>
        <li>Authenticate you and secure your account;</li>
        <li>Store and display the contacts and images you add;</li>
        <li>Respond to your requests and provide support;</li>
        <li>
          Detect, prevent, and address fraud, abuse, security, and technical
          issues; and
        </li>
        <li>Comply with legal obligations.</li>
      </ul>

      <h2>4. How We Share Your Information</h2>
      <p>
        We do not sell your personal information. We share information only in the
        following limited circumstances:
      </p>
      <ul>
        <li>
          <strong>Service providers.</strong> We use trusted third parties to
          operate the Service, including{' '}
          <a href="https://clerk.com/legal/privacy" target="_blank" rel="noopener noreferrer">
            Clerk
          </a>{' '}
          for authentication and{' '}
          <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer">
            Supabase
          </a>{' '}
          for database and image storage. These providers process data only to
          provide services to us and under their own privacy commitments.
        </li>
        <li>
          <strong>Legal reasons.</strong> We may disclose information if required
          by law, regulation, legal process, or a governmental request, or to
          protect the rights, property, or safety of ContactRef, our users, or the
          public.
        </li>
        <li>
          <strong>Business transfers.</strong> If ContactRef is involved in a
          merger, acquisition, or sale of assets, your information may be
          transferred as part of that transaction, subject to this Policy.
        </li>
      </ul>

      <h2>5. Data Retention and Deletion</h2>
      <p>
        We retain your account and contact data for as long as your account is
        active. You can delete individual contacts at any time from within the
        Service. When your account is deleted, we remove your account record and
        delete the associated contact data and uploaded images from our database
        and storage. Some information may be retained where required to comply
        with legal obligations or resolve disputes.
      </p>
      <p>
        To request deletion of your account or data, contact us at{' '}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>

      <h2>6. Data Security</h2>
      <p>
        We take reasonable technical and organizational measures to protect your
        information, including encryption in transit, access controls, and
        row-level security that restricts data access to the account that owns it.
        No method of transmission or storage is completely secure, so we cannot
        guarantee absolute security.
      </p>

      <h2>7. Your Rights and Choices</h2>
      <p>
        Depending on your location, you may have rights to access, correct,
        export, or delete your personal information, and to object to or restrict
        certain processing. You can access and update most of your data directly
        within the Service, or contact us to exercise these rights. You may also
        revoke ContactRef&apos;s access to your Google Account at any time through
        your{' '}
        <a
          href="https://myaccount.google.com/permissions"
          target="_blank"
          rel="noopener noreferrer"
        >
          Google Account permissions
        </a>{' '}
        page.
      </p>

      <h2>8. Children&apos;s Privacy</h2>
      <p>
        The Service is not directed to children under 13 (or the minimum age
        required in your jurisdiction), and we do not knowingly collect personal
        information from them. If you believe a child has provided us with
        personal information, please contact us so we can remove it.
      </p>

      <h2>9. International Users</h2>
      <p>
        The Service is operated using cloud infrastructure that may process and
        store data in countries other than your own. By using the Service, you
        understand that your information may be transferred to and processed in
        those locations.
      </p>

      <h2>10. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. When we do, we will
        revise the “Last updated” date above. Material changes will be
        communicated through the Service or by email where appropriate. Your
        continued use of the Service after changes take effect constitutes
        acceptance of the updated Policy.
      </p>

      <h2>11. Contact Us</h2>
      <p>
        If you have questions or concerns about this Privacy Policy or our data
        practices, contact us at{' '}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>
    </LegalLayout>
  )
}
