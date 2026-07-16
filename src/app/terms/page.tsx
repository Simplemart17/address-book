import { type Metadata } from 'next'

import LegalLayout from '@/components/legal/LegalLayout'

const CONTACT_EMAIL = 'contact@simplemart.dev'
const LAST_UPDATED = 'July 16, 2026'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'The terms and conditions that govern your use of ContactRef, the contact management application.',
}

export default function TermsOfServicePage() {
  return (
    <LegalLayout
      title="Terms of Service"
      lastUpdated={LAST_UPDATED}
      intro="These Terms of Service (“Terms”) govern your access to and use of ContactRef (the “Service”). By creating an account or using the Service, you agree to be bound by these Terms. If you do not agree, do not use the Service."
    >
      <h2>1. Acceptance of Terms</h2>
      <p>
        By accessing or using ContactRef, you confirm that you have read,
        understood, and agree to these Terms and our{' '}
        <a href="/privacy">Privacy Policy</a>. These Terms form a binding
        agreement between you and ContactRef (“we,” “us,” or “our”).
      </p>

      <h2>2. Description of the Service</h2>
      <p>
        ContactRef is a contact management application that lets you store,
        organize, and manage contact information — including names, phone numbers,
        addresses, notes, and photos — in a single account. We may add, change, or
        remove features at any time.
      </p>

      <h2>3. Eligibility and Accounts</h2>
      <p>
        You must be at least 13 years old (or the minimum age required in your
        jurisdiction) to use the Service. You are responsible for maintaining the
        confidentiality of your account credentials and for all activity that
        occurs under your account. If you sign in using a third-party provider
        such as Google, you are also subject to that provider&apos;s terms. Notify
        us promptly of any unauthorized use of your account.
      </p>

      <h2>4. Your Content</h2>
      <p>
        You retain ownership of the contact information, images, and other content
        you add to the Service (“Your Content”). You grant us a limited license to
        store, process, and display Your Content solely for the purpose of
        operating and providing the Service to you.
      </p>
      <p>
        You are solely responsible for Your Content and represent that you have
        the necessary rights and, where required, consent to store and manage the
        personal information of the contacts you add. You agree to handle other
        people&apos;s information lawfully and respect their privacy.
      </p>

      <h2>5. Acceptable Use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Use the Service for any unlawful, harmful, or fraudulent purpose;</li>
        <li>
          Upload content that infringes the rights of others or violates any law;
        </li>
        <li>
          Attempt to gain unauthorized access to the Service, other accounts, or
          our systems;
        </li>
        <li>
          Interfere with, disrupt, or overload the Service or its infrastructure;
        </li>
        <li>
          Reverse engineer, scrape, or misuse the Service or any data within it;
          or
        </li>
        <li>
          Use the Service to send spam or to store data you are not authorized to
          hold.
        </li>
      </ul>

      <h2>6. Third-Party Services</h2>
      <p>
        The Service relies on third-party providers, including Clerk for
        authentication and Supabase for data storage, and may offer sign-in
        through Google. Your use of these services may be subject to their
        respective terms and privacy policies. We are not responsible for the
        practices of third-party services.
      </p>

      <h2>7. Intellectual Property</h2>
      <p>
        The Service, including its software, design, branding, and content
        (excluding Your Content), is owned by ContactRef and protected by
        intellectual property laws. We grant you a limited, non-exclusive,
        non-transferable, revocable license to use the Service for its intended
        purpose. You may not copy, modify, distribute, or create derivative works
        without our permission.
      </p>

      <h2>8. Termination</h2>
      <p>
        You may stop using the Service and delete your account at any time. We may
        suspend or terminate your access if you violate these Terms or if we
        reasonably believe your use poses a risk to the Service or other users.
        Upon termination, your right to use the Service ends, and we will handle
        your data as described in our <a href="/privacy">Privacy Policy</a>.
      </p>

      <h2>9. Disclaimers</h2>
      <p>
        The Service is provided “as is” and “as available” without warranties of
        any kind, whether express or implied, including warranties of
        merchantability, fitness for a particular purpose, and non-infringement.
        We do not warrant that the Service will be uninterrupted, error-free, or
        secure, or that any data will be preserved without loss.
      </p>

      <h2>10. Limitation of Liability</h2>
      <p>
        To the maximum extent permitted by law, ContactRef and its providers will
        not be liable for any indirect, incidental, special, consequential, or
        punitive damages, or for any loss of data, profits, or goodwill, arising
        from or related to your use of the Service. Our total liability for any
        claim relating to the Service will not exceed the greater of the amount
        you paid us in the twelve months before the claim or USD 50.
      </p>

      <h2>11. Indemnification</h2>
      <p>
        You agree to indemnify and hold harmless ContactRef from any claims,
        damages, liabilities, and expenses arising out of your use of the Service,
        Your Content, or your violation of these Terms or the rights of others.
      </p>

      <h2>12. Changes to These Terms</h2>
      <p>
        We may update these Terms from time to time. When we do, we will revise
        the “Last updated” date above and, where appropriate, notify you through
        the Service or by email. Your continued use of the Service after changes
        take effect constitutes acceptance of the updated Terms.
      </p>

      <h2>13. Governing Law</h2>
      <p>
        These Terms are governed by the laws applicable in the jurisdiction in
        which ContactRef operates, without regard to conflict-of-law principles.
        Any disputes will be resolved in the courts of that jurisdiction, unless
        otherwise required by applicable law.
      </p>

      <h2>14. Contact Us</h2>
      <p>
        If you have questions about these Terms, contact us at{' '}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>
    </LegalLayout>
  )
}
