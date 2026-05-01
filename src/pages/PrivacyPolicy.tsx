import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/landing/Footer';

const EFFECTIVE_DATE = 'January 1, 2026';

export default function PrivacyPolicy() {
  useEffect(() => {
    document.title = 'Privacy Policy | College Fairway Advisors';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', 'How College Fairway Advisors collects, uses, and protects your personal information.');
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12 max-w-3xl">
        <article className="prose prose-slate max-w-none prose-headings:font-display prose-headings:text-cfa-forest prose-a:text-cfa-forest">
          <h1>Privacy Policy</h1>
          <p><strong>Effective Date:</strong> {EFFECTIVE_DATE}</p>

          <p>
            <strong>College Fairway Advisors</strong> ("Company," "we," "us," or "our") respects your privacy. This
            Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our
            website www.cfa.golf (the "Site") or use our Services (ebook, self-paced online course, member dashboard,
            and consulting).
          </p>
          <p>
            Please read this Privacy Policy carefully. By using our Site or Services, you consent to the data practices
            described in this policy.
          </p>

          <hr />

          <h2>1. Information We Collect</h2>
          <p><strong>Personal Information You Voluntarily Provide:</strong></p>
          <p>We may collect personal information that you provide to us when you:</p>
          <ul>
            <li>Register for an account</li>
            <li>Purchase a product or service</li>
            <li>Sign up for a newsletter or free resource</li>
            <li>Contact us via email, phone, or contact form</li>
          </ul>
          <p>This information may include:</p>
          <ul>
            <li>Name</li>
            <li>Email address</li>
            <li>Phone number</li>
            <li>Billing address and payment information (processed securely by third-party payment processors)</li>
            <li>Graduation year (for student accounts)</li>
            <li>Golf statistics (handicap, scoring average) – provided voluntarily</li>
          </ul>
          <p><strong>Automatically Collected Information:</strong></p>
          <p>When you visit our Site, we may automatically collect certain information about your device and usage, including:</p>
          <ul>
            <li>IP address</li>
            <li>Browser type and version</li>
            <li>Pages you visit and time spent on those pages</li>
            <li>Referring website URLs</li>
            <li>Device identifiers</li>
          </ul>
          <p><strong>Cookies and Similar Technologies:</strong></p>
          <p>
            We use cookies and similar tracking technologies (e.g., web beacons, pixels) to enhance your experience,
            analyze site traffic, and personalize content. You can control cookies through your browser settings.
          </p>

          <h2>2. How We Use Your Information</h2>
          <p>We may use the information we collect for legitimate business purposes, including:</p>
          <ul>
            <li>To provide, operate, and maintain our Services</li>
            <li>To process your transactions and send you confirmations</li>
            <li>To communicate with you (e.g., order updates, support inquiries, important notices)</li>
            <li>To improve our website, products, and user experience</li>
            <li>To detect, prevent, and address technical or security issues</li>
            <li>To comply with legal obligations</li>
          </ul>

          <h2>3. How We Share Your Information</h2>
          <p>
            We do <strong>not</strong> sell, trade, or rent your personal information to third parties. We may share
            your information in the following limited circumstances:
          </p>
          <ul>
            <li><strong>Service Providers:</strong> We may share data with trusted third parties who assist us in operating our website, processing payments, or delivering services (e.g., Stripe for payments, Resend for email). These parties are contractually obligated to keep your information confidential and use it only for the services they perform for us.</li>
            <li><strong>College Coaches (with your consent):</strong> If you are a junior golfer using our recruiting services, we will only share your athletic and academic information with college coaches after you have given explicit consent (e.g., by signing our Player Release Form).</li>
            <li><strong>Legal Requirements:</strong> We may disclose your information if required to do so by law or in response to valid requests by public authorities (e.g., a subpoena).</li>
          </ul>

          <h2>4. Data Security</h2>
          <p>
            We implement reasonable administrative, technical, and physical safeguards to protect your personal
            information. However, no method of transmission over the Internet or method of electronic storage is 100%
            secure. While we strive to protect your data, we cannot guarantee its absolute security.
          </p>

          <h2>5. Your Rights and Choices</h2>
          <p>
            Depending on your location (e.g., California residents under CCPA, EU residents under GDPR), you may have
            certain rights regarding your personal information, including:
          </p>
          <ul>
            <li><strong>Access:</strong> Request a copy of the personal information we hold about you.</li>
            <li><strong>Correction:</strong> Request that we correct inaccurate or incomplete information.</li>
            <li><strong>Deletion:</strong> Request that we delete your personal information (subject to certain exceptions).</li>
            <li><strong>Opt-Out:</strong> Opt out of marketing communications (by clicking "unsubscribe" in our emails).</li>
          </ul>
          <p>
            To exercise any of these rights, please contact us at <a href="mailto:contact@cfa.golf">contact@cfa.golf</a>.
            We will respond within 30 days.
          </p>

          <h2>6. Children's Privacy</h2>
          <p>
            Our Services are not directed to children under the age of 13. We do not knowingly collect personal
            information from children under 13. If you are a parent or guardian and believe your child under 13 has
            provided us with personal information, please contact us and we will promptly delete it.
          </p>
          <p>For users between 13 and 18, we require parental consent before collecting any personal information.</p>

          <h2>7. Third-Party Links</h2>
          <p>
            Our Site may contain links to third-party websites, services, or applications (e.g., Stripe, Calendly). We
            are not responsible for the privacy practices or content of those third parties. We encourage you to read
            their privacy policies.
          </p>

          <h2>8. Retention of Data</h2>
          <p>
            We will retain your personal information only for as long as necessary to fulfill the purposes described in
            this Privacy Policy, unless a longer retention period is required or permitted by law.
          </p>

          <h2>9. International Data Transfers</h2>
          <p>
            Our website is hosted in the United States. If you access our Site from outside the United States, please
            be aware that your information may be transferred to, stored, and processed in the United States, where
            privacy laws may differ from those in your jurisdiction.
          </p>

          <h2>10. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. The "Effective Date" at the top of this page indicates
            when the policy was last revised. Your continued use of the Site or Services after any changes constitutes
            your acceptance of the new policy.
          </p>

          <h2>11. Contact Us</h2>
          <p>
            If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:
          </p>
          <p>
            <strong>College Fairway Advisors</strong><br />
            Email: <a href="mailto:contact@cfa.golf">contact@cfa.golf</a><br />
            Website: <a href="https://www.cfa.golf">www.cfa.golf</a>
          </p>

          <hr />
          <p className="text-sm text-muted-foreground">
            <strong>Last Updated:</strong> {EFFECTIVE_DATE} · See also our{' '}
            <Link to="/terms-of-use">Terms of Use</Link>.
          </p>
        </article>
      </main>
      <Footer />
    </div>
  );
}
