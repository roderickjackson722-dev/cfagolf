import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/landing/Footer';

const EFFECTIVE_DATE = 'January 1, 2026';

export default function TermsOfUse() {
  useEffect(() => {
    document.title = 'Terms of Use | College Fairway Advisors';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', 'Terms of Use governing access to College Fairway Advisors website, ebook, self-paced online course, and consulting services.');
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12 max-w-3xl">
        <article className="prose prose-slate max-w-none prose-headings:font-display prose-headings:text-cfa-forest prose-a:text-cfa-forest">
          <h1>Terms of Use</h1>
          <p><strong>Effective Date:</strong> {EFFECTIVE_DATE}</p>

          <p>
            <strong>College Fairway Advisors</strong> ("Company," "we," "us," or "our") operates the website www.cfa.golf
            (the "Site") and provides digital products including an ebook, self-paced online course, member dashboard,
            and consulting services (collectively, the "Services").
          </p>
          <p>
            By accessing or using our Site or Services, you ("User," "you," or "your") agree to be bound by these Terms
            of Use. If you do not agree, do not use our Site or Services.
          </p>

          <hr />

          <h2>1. License to Use Content</h2>
          <p>
            All content on this Site and within our Services – including but not limited to text, PDFs, worksheets,
            templates, checklists, recruiting timelines, course lessons, logos, and graphics – is the intellectual
            property of College Fairway Advisors and is protected by United States and international copyright laws.
          </p>
          <p>
            When you purchase or access our Services, we grant you a <strong>limited, non-exclusive, non-transferable,
            revocable license</strong> to access and use the content for your <strong>personal, non-commercial use only</strong>.
          </p>
          <p><strong>You may NOT:</strong></p>
          <ul>
            <li>Copy, reproduce, distribute, or publicly display any portion of our content without prior written permission.</li>
            <li>Share your login credentials with any other person.</li>
            <li>Download, save, or store our course lessons or worksheets for offline use (other than legitimate printing for personal reference).</li>
            <li>Use any of our content to create a competing product or service.</li>
            <li>Sell, resell, or sublicense any portion of our Services.</li>
          </ul>
          <p>All rights not expressly granted are reserved by College Fairway Advisors.</p>

          <h2>2. Prohibited Conduct</h2>
          <p>You agree not to:</p>
          <ul>
            <li>Attempt to bypass any technical measures we use to protect our content (including disabling right-click, text selection, or watermarking features).</li>
            <li>Use robots, scrapers, or automated tools to extract data from our Site or Services.</li>
            <li>Share, post, or upload our content to any file-sharing website, social media platform, or online forum.</li>
            <li>Modify, adapt, translate, or create derivative works based on our content.</li>
          </ul>
          <p>Violation of these terms may result in immediate termination of your access and legal action.</p>

          <h2>3. User Accounts</h2>
          <p>You are responsible for maintaining the confidentiality of your login credentials. You agree to:</p>
          <ul>
            <li>Not share your account with anyone else.</li>
            <li>Notify us immediately of any unauthorized use of your account.</li>
            <li>Log out after each session on shared devices.</li>
          </ul>
          <p>We reserve the right to suspend or terminate any account that is used in violation of these Terms.</p>

          <h2>4. Purchases and Refunds</h2>
          <ul>
            <li><strong>Ebook ($25):</strong> Due to the digital nature of this product, all sales are final.</li>
            <li><strong>Self-Paced Online Course ($299):</strong> Due to immediate access to all course materials and downloadable worksheets, all sales are final.</li>
            <li><strong>One-on-One Consulting ($2,499):</strong> Refunds are governed by the separate consulting agreement signed by both parties.</li>
          </ul>
          <p>We reserve the right to change prices at any time without prior notice.</p>

          <h2>5. Disclaimer of Warranties</h2>
          <p>
            Our Services are provided "as is" without any warranties, express or implied. We do not guarantee that you
            will receive a college golf scholarship, roster spot, or admission to any school. Results vary based on
            individual effort, talent, and other factors beyond our control.
          </p>

          <h2>6. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, College Fairway Advisors shall not be liable for any indirect,
            incidental, or consequential damages arising from your use of our Services. Our total liability shall not
            exceed the amount you paid for the specific Service giving rise to the claim.
          </p>

          <h2>7. Indemnification</h2>
          <p>
            You agree to indemnify and hold harmless College Fairway Advisors, its founders, employees, and affiliates
            from any claims, damages, or expenses arising from your violation of these Terms or misuse of our Services.
          </p>

          <h2>8. Termination</h2>
          <p>
            We may suspend or terminate your access to our Services at any time, without notice, if we believe you have
            violated these Terms. Upon termination, your license to use the content immediately ceases.
          </p>

          <h2>9. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of the State of Georgia, without
            regard to its conflict of law principles.
          </p>

          <h2>10. Changes to These Terms</h2>
          <p>
            We may update these Terms from time to time. Continued use of our Site or Services after any changes
            constitutes your acceptance of the new Terms.
          </p>

          <h2>11. Contact Information</h2>
          <p>If you have any questions about these Terms, please contact us at:</p>
          <p>
            <strong>College Fairway Advisors</strong><br />
            Email: <a href="mailto:contact@cfa.golf">contact@cfa.golf</a><br />
            Website: <a href="https://www.cfa.golf">www.cfa.golf</a>
          </p>

          <hr />
          <p className="text-sm text-muted-foreground">
            <strong>Last Updated:</strong> {EFFECTIVE_DATE} · See also our{' '}
            <Link to="/privacy">Privacy Policy</Link>.
          </p>
        </article>
      </main>
      <Footer />
    </div>
  );
}
