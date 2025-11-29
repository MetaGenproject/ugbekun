
/**
 * @author Daniel Innocent (@mdtbmw)
 * @copyright Copyright (c) 2024 Ugbekun. All rights reserved.
 */
'use client';

import { useState, useEffect, useRef } from 'react';
import {
  FileText,
  UserCheck,
  ShieldBan,
  Lightbulb,
  CreditCard,
  XCircle,
  AlertTriangle,
  Landmark,
  Gavel,
  Mail,
  CircleDot,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const sections = [
  { id: 'acceptance', title: 'Acceptance of Terms', icon: <FileText /> },
  { id: 'accounts', title: 'User Accounts', icon: <UserCheck /> },
  { id: 'acceptable-use', title: 'Acceptable Use', icon: <ShieldBan /> },
  { id: 'ip-rights', title: 'Intellectual Property', icon: <Lightbulb /> },
  { id: 'payments', title: 'Fees & Payments', icon: <CreditCard /> },
  { id: 'termination', title: 'Termination', icon: <XCircle /> },
  { id: 'disclaimers', title: 'Disclaimers', icon: <AlertTriangle /> },
  { id: 'liability', title: 'Limitation of Liability', icon: <Landmark /> },
  { id: 'governing-law', title: 'Governing Law', icon: <Gavel /> },
  { id: 'contact-us', title: 'Contact Us', icon: <Mail /> },
];

export default function TermsOfServicePage() {
  const [activeSection, setActiveSection] = useState('acceptance');
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observer.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -80% 0px' }
    );

    const elements = document.querySelectorAll('section[id]');
    elements.forEach((el) => {
      if (observer.current) {
        observer.current.observe(el);
      }
    });

    return () => {
      elements.forEach((el) => {
        if (observer.current) {
            observer.current.unobserve(el);
        }
      });
    };
  }, []);

  return (
    <div className="bg-background py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="max-w-3xl mx-auto text-center">
          <h1 className="display text-4xl sm:text-5xl tracking-tight font-semibold text-foreground">
            Terms of Service
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            The rules of the road for using our platform.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">Last Updated: October 26, 2023</p>
        </header>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <aside className="lg:col-span-3 lg:sticky lg:top-24 h-max">
            <nav className="space-y-2">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className={cn(
                    'group flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors',
                    activeSection === section.id
                      ? 'bg-secondary text-secondary-foreground'
                      : 'hover:bg-muted/50'
                  )}
                >
                  <div
                    className={cn(
                      'h-8 w-8 rounded-lg grid place-items-center shrink-0 transition-colors',
                      activeSection === section.id
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted group-hover:bg-secondary'
                    )}
                  >
                    <div className="h-5 w-5">{section.icon}</div>
                  </div>
                  <span className="text-sm font-medium">{section.title}</span>
                </a>
              ))}
            </nav>
          </aside>

          <main className="lg:col-span-9 space-y-16">
            <section id="acceptance">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground flex items-center gap-3"><FileText className="text-primary"/>Acceptance of Terms</h2>
              <div className="mt-4 prose prose-neutral dark:prose-invert max-w-none text-muted-foreground space-y-4">
                <p>This Terms of Service agreement ("Terms") governs your use of the Ugbekun school management platform, including all related websites, mobile applications, and services (collectively, the "Service"), provided by Ugbekun ("Company," "we," "us," or "our").</p>
                <p>By accessing or using the Service, you, on behalf of yourself or the institution you represent, agree to be bound by these Terms and our Privacy Policy. If you do not agree with any part of these Terms, you may not access or use the Service. This agreement applies to all visitors, users (including administrators, teachers, parents, and students), and others who access or use the Service.</p>
              </div>
            </section>
            
            <section id="accounts">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground flex items-center gap-3"><UserCheck className="text-primary"/>User Accounts</h2>
              <div className="mt-4 prose prose-neutral dark:prose-invert max-w-none text-muted-foreground space-y-4">
                <p>To use most features of the Service, you must register for an account. Accounts are provisioned by a school administrator.</p>
                <ul className="space-y-3">
                    <li className="flex items-start gap-3"><CircleDot className="h-4 w-4 mt-1 text-primary shrink-0"/><span><strong>Account Accuracy:</strong> You agree to provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account.</span></li>
                    <li className="flex items-start gap-3"><CircleDot className="h-4 w-4 mt-1 text-primary shrink-0"/><span><strong>Account Security:</strong> You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password. You agree not to disclose your password to any third party and to log out from your account at the end of each session. You must notify us and your school administrator immediately upon becoming aware of any breach of security or unauthorized use of your account.</span></li>
                    <li className="flex items-start gap-3"><CircleDot className="h-4 w-4 mt-1 text-primary shrink-0"/><span><strong>Authorized Users:</strong> Access is restricted to authorized users as defined by the school (e.g., enrolled students, their legal guardians, and current staff). You may not share your account with others.</span></li>
                </ul>
              </div>
            </section>

             <section id="acceptable-use">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground flex items-center gap-3"><ShieldBan className="text-primary"/>Acceptable Use Policy</h2>
              <div className="mt-4 prose prose-neutral dark:prose-invert max-w-none text-muted-foreground space-y-4">
                <p>You agree not to use the Service for any unlawful purpose or in any way that could harm, disable, overburden, or impair the Service. Specifically, you agree not to:</p>
                <ul className="space-y-3">
                    <li className="flex items-start gap-3"><CircleDot className="h-4 w-4 mt-1 text-primary shrink-0"/><span>Violate any applicable national or international law or regulation.</span></li>
                    <li className="flex items-start gap-3"><CircleDot className="h-4 w-4 mt-1 text-primary shrink-0"/><span>Upload, post, or transmit any content that is unlawful, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, or otherwise objectionable.</span></li>
                    <li className="flex items-start gap-3"><CircleDot className="h-4 w-4 mt-1 text-primary shrink-0"/><span>Attempt to gain unauthorized access to any part of the Service, other accounts, computer systems, or networks connected to the Service.</span></li>
                    <li className="flex items-start gap-3"><CircleDot className="h-4 w-4 mt-1 text-primary shrink-0"/><span>Introduce any viruses, trojan horses, worms, or other material that is malicious or technologically harmful.</span></li>
                    <li className="flex items-start gap-3"><CircleDot className="h-4 w-4 mt-1 text-primary shrink-0"/><span>Use the service to transmit, or procure the sending of, any advertising or promotional material, including any "junk mail", "chain letter," or "spam."</span></li>
                </ul>
              </div>
            </section>

             <section id="ip-rights">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground flex items-center gap-3"><Lightbulb className="text-primary"/>Intellectual Property</h2>
               <div className="mt-4 prose prose-neutral dark:prose-invert max-w-none text-muted-foreground space-y-4">
                <p><strong>Our Property:</strong> The Service and its original content (excluding Content provided by you), features, and functionality are and will remain the exclusive property of Ugbekun and its licensors. The Service is protected by copyright, trademark, and other laws of both Nigeria and foreign countries. Our trademarks may not be used in connection with any product or service without our prior written consent.</p>
                <p><strong>Your Content:</strong> You (or your institution) retain all rights to the data and content you upload to the Service ("User Content"). You grant us a limited, royalty-free license to use, reproduce, modify, and display your User Content solely for the purpose of providing and improving the Service.</p>
              </div>
            </section>

             <section id="payments">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground flex items-center gap-3"><CreditCard className="text-primary"/>Fees and Payments</h2>
               <div className="mt-4 prose prose-neutral dark:prose-invert max-w-none text-muted-foreground space-y-4">
                <p>Certain features of the Service are provided to schools on a subscription basis ("Subscription(s)").</p>
                <ul className="space-y-3">
                    <li className="flex items-start gap-3"><CircleDot className="h-4 w-4 mt-1 text-primary shrink-0"/><span><strong>Billing:</strong> Subscriptions are billed in advance on a recurring basis (e.g., per term or annually), as agreed upon in the service contract with the school.</span></li>
                    <li className="flex items-start gap-3"><CircleDot className="h-4 w-4 mt-1 text-primary shrink-0"/><span><strong>Fee Payments:</strong> Parents and guardians may use the Service to pay school fees. These transactions are processed through secure third-party payment gateways. The Company is not responsible for any payment processing fees charged by these gateways.</span></li>
                    <li className="flex items-start gap-3"><CircleDot className="h-4 w-4 mt-1 text-primary shrink-0"/><span><strong>Refunds:</strong> Subscription fees are non-refundable except as required by law or as otherwise stated in the service contract.</span></li>
                </ul>
              </div>
            </section>
            
             <section id="termination">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground flex items-center gap-3"><XCircle className="text-primary"/>Termination</h2>
               <div className="mt-4 prose prose-neutral dark:prose-invert max-w-none text-muted-foreground space-y-4">
                <p><strong>By Us:</strong> We may terminate or suspend your account immediately, without prior notice or liability, if you breach these Terms. We may also terminate or suspend access to the Service for operational reasons, with reasonable notice where possible.</p>
                <p><strong>By You:</strong> The school administration may terminate their Subscription according to the terms of their service agreement. Individual users may request account deactivation through their school administrator.</p>
                <p><strong>Effect of Termination:</strong> Upon termination, your right to use the Service will immediately cease. We will handle data according to our Data Retention policy and the school's instructions.</p>
              </div>
            </section>
            
            <section id="disclaimers">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground flex items-center gap-3"><AlertTriangle className="text-primary"/>Disclaimers of Warranties</h2>
               <div className="mt-4 prose prose-neutral dark:prose-invert max-w-none text-muted-foreground space-y-4">
                <p>The Service is provided on an "AS IS" and "AS AVAILABLE" basis. Your use of the Service is at your sole risk. We expressly disclaim all warranties of any kind, whether express or implied, including, but not to, the implied warranties of merchantability, fitness for a particular purpose, and non-infringement.</p>
                <p>We do not warrant that a) the Service will function uninterrupted, secure, or available at any particular time or location; b) any errors or defects will be corrected; or c) the results of using the Service will meet your requirements.</p>
              </div>
            </section>
            
             <section id="liability">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground flex items-center gap-3"><Landmark className="text-primary"/>Limitation of Liability</h2>
               <div className="mt-4 prose prose-neutral dark:prose-invert max-w-none text-muted-foreground space-y-4">
                <p>In no event shall Ugbekun, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the Service; (iii) any content obtained from the Service; and (iv) unauthorized access, use or alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence) or any other legal theory, whether or not we have been informed of the possibility of such damage.</p>
              </div>
            </section>

             <section id="governing-law">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground flex items-center gap-3"><Gavel className="text-primary"/>Governing Law & Dispute Resolution</h2>
               <div className="mt-4 prose prose-neutral dark:prose-invert max-w-none text-muted-foreground space-y-4">
                <p>These Terms shall be governed and construed in accordance with the laws of the Federal Republic of Nigeria, without regard to its conflict of law provisions. Any disputes arising out of or in connection with these Terms shall be resolved through amicable negotiation. If a resolution cannot be reached, such disputes shall be subject to the exclusive jurisdiction of the courts of Nigeria.</p>
              </div>
            </section>
            
             <section id="contact-us">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground flex items-center gap-3"><Mail className="text-primary"/>Contact Us</h2>
               <div className="mt-4 prose prose-neutral dark:prose-invert max-w-none text-muted-foreground space-y-4">
                <p>If you have any questions about these Terms, please contact us at:</p>
                <p><a href="mailto:legal@ugbekun.com" className="text-primary hover:underline">legal@ugbekun.com</a></p>
              </div>
            </section>

          </main>
        </div>
      </div>
    </div>
  );
}
