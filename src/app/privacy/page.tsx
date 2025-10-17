
/**
 * @author Daniel Innocent (@mdtbmw)
 * @copyright Copyright (c) 2024 Ugbekun. All rights reserved.
 */
'use client';

import { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck,
  Database,
  Users,
  Fingerprint,
  BookUser,
  GraduationCap,
  HeartHandshake,
  Server,
  Share2,
  Lock,
  Cog,
  Scale,
  Clock,
  Baby,
  RefreshCw,
  Mail,
  CircleDot,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const sections = [
  { id: 'introduction', title: 'Introduction', icon: <ShieldCheck /> },
  { id: 'info-collect', title: 'Information We Collect', icon: <Database /> },
  { id: 'how-we-use', title: 'How We Use Information', icon: <Cog /> },
  { id: 'data-sharing', title: 'Data Sharing & Disclosure', icon: <Share2 /> },
  { id: 'data-security', title: 'Data Security', icon: <Lock /> },
  { id: 'your-rights', title: 'Your Rights & Choices', icon: <Scale /> },
  { id: 'data-retention', title: 'Data Retention', icon: <Clock /> },
  { id: 'children-privacy', title: "Children's Privacy", icon: <Baby /> },
  { id: 'policy-changes', title: 'Changes to This Policy', icon: <RefreshCw /> },
  { id: 'contact-us', title: 'Contact Us', icon: <Mail /> },
];

export default function PrivacyPolicyPage() {
  const [activeSection, setActiveSection] = useState('introduction');
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
    elements.forEach((el) => observer.current?.observe(el));

    return () => {
      elements.forEach((el) => {
        if(observer.current) {
            observer.current.unobserve(el)
        }
      });
    };
  }, []);

  return (
    <div className="bg-background py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="max-w-3xl mx-auto text-center">
          <h1 className="display text-4xl sm:text-5xl tracking-tight font-semibold text-foreground">
            Privacy Policy
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Your trust is our priority. Here’s how we protect your data.
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
            <section id="introduction">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground flex items-center gap-3"><ShieldCheck className="text-primary"/>Introduction</h2>
              <div className="mt-4 prose prose-neutral dark:prose-invert max-w-none text-muted-foreground space-y-4">
                <p>Welcome to Ugbekun ("we," "us," or "our"). We are committed to protecting the privacy and security of the personal information of our users—including students, parents, guardians, teachers, and school administrators (collectively, "you"). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our school management platform, services, and website (collectively, the "Service").</p>
                <p>By using our Service, you agree to the collection and use of information in accordance with this policy. This policy is designed to help you understand our practices and to comply with applicable data protection laws, including the Nigerian Data Protection Regulation (NDPR).</p>
              </div>
            </section>
            
            <section id="info-collect">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground flex items-center gap-3"><Database className="text-primary"/>Information We Collect</h2>
               <div className="mt-4 prose prose-neutral dark:prose-invert max-w-none text-muted-foreground space-y-4">
                  <p>We collect information that is necessary to provide and improve our Service. The types of personal data we collect depend on your role and interaction with our platform.</p>
                </div>
              <div className="mt-6 space-y-6">
                <div className="p-6 rounded-2xl border bg-card">
                    <h3 className="font-semibold flex items-center gap-2 text-foreground"><GraduationCap className="h-4 w-4 text-primary" />Student Data</h3>
                    <p className="text-sm text-muted-foreground mt-2">At the direction of a school, we collect student information necessary for educational purposes. This may include:</p>
                    <ul className="mt-3 space-y-2 text-sm text-muted-foreground list-disc pl-5">
                      <li><strong>Identity Data:</strong> Full name, date of birth, gender, admission number, and photographs.</li>
                      <li><strong>Academic & Enrollment Data:</strong> Class, grade level, subjects, attendance records, grades, assessment scores, and timetables.</li>
                      <li><strong>Health & Wellness Data (Optional):</strong> Medical conditions, allergies, and emergency contact information provided by the school or guardian for the student's safety.</li>
                      <li><strong>Behavioral Data:</strong> Commendations, disciplinary records, and behavioral notes entered by authorized school staff.</li>
                    </ul>
                </div>
                 <div className="p-6 rounded-2xl border bg-card">
                    <h3 className="font-semibold flex items-center gap-2 text-foreground"><HeartHandshake className="h-4 w-4 text-primary" />Parent & Guardian Data</h3>
                    <p className="text-sm text-muted-foreground mt-2">To facilitate communication, billing, and parental involvement, we collect:</p>
                    <ul className="mt-3 space-y-2 text-sm text-muted-foreground list-disc pl-5">
                      <li><strong>Contact Information:</strong> Full name, email address, phone number, and home address.</li>
                       <li><strong>Relationship Data:</strong> Your relationship to the student(s) you are associated with.</li>
                       <li><strong>Financial Data:</strong> Billing information for fee payments (processed by our secure payment partners).</li>
                    </ul>
                </div>
                 <div className="p-6 rounded-2xl border bg-card">
                    <h3 className="font-semibold flex items-center gap-2 text-foreground"><BookUser className="h-4 w-4 text-primary" />Teacher & Staff Data</h3>
                    <p className="text-sm text-muted-foreground mt-2">To manage school operations and staff roles, we collect:</p>
                    <ul className="mt-3 space-y-2 text-sm text-muted-foreground list-disc pl-5">
                        <li><strong>Professional Information:</strong> Full name, contact details, role/title, and subjects taught.</li>
                        <li><strong>Account Credentials:</strong> Email address and password for accessing the Service.</li>
                    </ul>
                </div>
                 <div className="p-6 rounded-2xl border bg-card">
                    <h3 className="font-semibold flex items-center gap-2 text-foreground"><Server className="h-4 w-4 text-primary" />Technical & Usage Data</h3>
                    <p className="text-sm text-muted-foreground mt-2">We automatically collect data when you interact with our Service to ensure its performance and security:</p>
                    <ul className="mt-3 space-y-2 text-sm text-muted-foreground list-disc pl-5">
                        <li><strong>Device and Connection Information:</strong> IP address, browser type and version, operating system, and device identifiers.</li>
                        <li><strong>Usage Data:</strong> Features used, pages visited, links clicked, and time spent on the platform to help us improve user experience.</li>
                    </ul>
                </div>
              </div>
            </section>

             <section id="how-we-use">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground flex items-center gap-3"><Cog className="text-primary"/>How We Use Information</h2>
              <div className="mt-4 prose prose-neutral dark:prose-invert max-w-none text-muted-foreground space-y-4">
                <p>We use the information we collect for the following legitimate and educational purposes:</p>
                <ul className="space-y-3">
                    <li className="flex items-start gap-3"><CircleDot className="h-4 w-4 mt-1 text-primary shrink-0"/><span><strong>To Provide and Maintain the Service:</strong> To operate our platform, including functions like academic record-keeping, timetabling, attendance tracking, and financial management.</span></li>
                    <li className="flex items-start gap-3"><CircleDot className="h-4 w-4 mt-1 text-primary shrink-0"/><span><strong>To Facilitate Communication:</strong> To enable seamless communication between school administration, teachers, parents, and students through our messaging and announcement features.</span></li>
                    <li className="flex items-start gap-3"><CircleDot className="h-4 w-4 mt-1 text-primary shrink-0"/><span><strong>To Manage Finances:</strong> To process school fees, generate invoices and receipts, and provide financial reporting tools for school administrators.</span></li>
                    <li className="flex items-start gap-3"><CircleDot className="h-4 w-4 mt-1 text-primary shrink-0"/><span><strong>To Improve Our Service:</strong> To monitor and analyze usage patterns, identify trends, and make improvements to the user experience, features, and overall functionality of our platform.</span></li>
                    <li className="flex items-start gap-3"><CircleDot className="h-4 w-4 mt-1 text-primary shrink-0"/><span><strong>For Security and Compliance:</strong> To protect the security and integrity of our platform, prevent fraud, and comply with our legal obligations and regulatory requirements.</span></li>
                    <li className="flex items-start gap-3"><CircleDot className="h-4 w-4 mt-1 text-primary shrink-0"/><span><strong>To Provide Support:</strong> To respond to your requests, questions, and feedback.</span></li>
                </ul>
              </div>
            </section>

             <section id="data-sharing">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground flex items-center gap-3"><Share2 className="text-primary"/>Data Sharing & Disclosure</h2>
               <div className="mt-4 prose prose-neutral dark:prose-invert max-w-none text-muted-foreground space-y-4">
                <p>We are committed to maintaining your trust, and we do not sell your personal information to third parties. We may share information only under the following limited circumstances:</p>
                <ul className="space-y-3">
                   <li className="flex items-start gap-3"><CircleDot className="h-4 w-4 mt-1 text-primary shrink-0"/><span><strong>With Your School:</strong> Your information is accessible to authorized school personnel based on their roles and permissions as defined by the school's administration.</span></li>
                   <li className="flex items-start gap-3"><CircleDot className="h-4 w-4 mt-1 text-primary shrink-0"/><span><strong>With Trusted Third-Party Service Providers:</strong> We work with reputable third-party companies to help us operate, provide, and improve our Service. These providers perform services such as cloud hosting (e.g., Google Cloud), payment processing (e.g., Paystack), and communication services (e.g., Twilio). They are contractually obligated to protect your data and are prohibited from using it for any other purpose.</span></li>
                   <li className="flex items-start gap-3"><CircleDot className="h-4 w-4 mt-1 text-primary shrink-0"/><span><strong>For Legal Reasons:</strong> We may disclose your information if we believe it is reasonably necessary to comply with a law, regulation, legal process (such as a subpoena), or governmental request; to protect the safety of any person; to address fraud, security, or technical issues; or to protect our rights or property.</span></li>
                   <li className="flex items-start gap-3"><CircleDot className="h-4 w-4 mt-1 text-primary shrink-0"/><span><strong>Business Transfers:</strong> In connection with any merger, sale of company assets, financing, or acquisition of all or a portion of our business by another company, your information may be transferred as a business asset.</span></li>
                </ul>
              </div>
            </section>

             <section id="data-security">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground flex items-center gap-3"><Lock className="text-primary"/>Data Security</h2>
               <div className="mt-4 prose prose-neutral dark:prose-invert max-w-none text-muted-foreground space-y-4">
                <p>We implement a variety of industry-standard security measures to maintain the safety and integrity of your personal information. These measures include:</p>
                 <ul className="space-y-3">
                   <li className="flex items-start gap-3"><CircleDot className="h-4 w-4 mt-1 text-primary shrink-0"/><span><strong>Data Encryption:</strong> All data is encrypted in transit using Transport Layer Security (TLS) and at rest using AES-256 encryption.</span></li>
                   <li className="flex items-start gap-3"><CircleDot className="h-4 w-4 mt-1 text-primary shrink-0"/><span><strong>Access Controls:</strong> We employ strict, role-based access controls to ensure that users can only access the information relevant to their roles and responsibilities (Principle of Least Privilege).</span></li>
                   <li className="flex items-start gap-3"><CircleDot className="h-4 w-4 mt-1 text-primary shrink-0"/><span><strong>Secure Infrastructure:</strong> Our platform is hosted on secure cloud infrastructure that provides robust physical and network security.</span></li>
                   <li className="flex items-start gap-3"><CircleDot className="h-4 w-4 mt-1 text-primary shrink-0"/><span><strong>Regular Audits:</strong> We conduct regular security audits and vulnerability scanning to identify and remediate potential threats.</span></li>
                </ul>
                <p>While we take all reasonable measures to protect your data, no security system is impenetrable. In the event of a security breach, we will notify affected users and relevant authorities as required by law.</p>
              </div>
            </section>
            
             <section id="your-rights">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground flex items-center gap-3"><Scale className="text-primary"/>Your Rights & Choices</h2>
               <div className="mt-4 prose prose-neutral dark:prose-invert max-w-none text-muted-foreground space-y-4">
                <p>Under the Nigerian Data Protection Regulation (NDPR) and other applicable laws, you have certain rights regarding your personal information. You can typically review and update your profile information by logging into your account. For other requests, please contact us. Your rights include:</p>
                <ul className="space-y-3">
                   <li className="flex items-start gap-3"><CircleDot className="h-4 w-4 mt-1 text-primary shrink-0"/><span><strong>The Right to Access:</strong> You have the right to request copies of your personal data.</span></li>
                   <li className="flex items-start gap-3"><CircleDot className="h-4 w-4 mt-1 text-primary shrink-0"/><span><strong>The Right to Rectification:</strong> You have the right to request that we correct any information you believe is inaccurate or complete information you believe is incomplete.</span></li>
                   <li className="flex items-start gap-3"><CircleDot className="h-4 w-4 mt-1 text-primary shrink-0"/><span><strong>The Right to Erasure:</strong> You have the right to request that we erase your personal data, under certain conditions.</span></li>
                    <li className="flex items-start gap-3"><CircleDot className="h-4 w-4 mt-1 text-primary shrink-0"/><span><strong>The Right to Object to Processing:</strong> You have the right to object to our processing of your personal data, under certain conditions.</span></li>
                </ul>
                <p>Please note that for student data, requests may need to be facilitated through your school, as they are the primary data controller.</p>
              </div>
            </section>
            
            <section id="data-retention">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground flex items-center gap-3"><Clock className="text-primary"/>Data Retention</h2>
               <div className="mt-4 prose prose-neutral dark:prose-invert max-w-none text-muted-foreground space-y-4">
                <p>We retain personal information for as long as it is necessary to provide our services to the school, to comply with our legal obligations, to resolve disputes, and to enforce our agreements. The retention period for student records is primarily determined by the school's data retention policy and applicable educational regulations. When a school's subscription ends, we will work with them to either securely transfer or delete the data according to their instructions.</p>
              </div>
            </section>
            
            <section id="children-privacy">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground flex items-center gap-3"><Baby className="text-primary"/>Children's Privacy</h2>
               <div className="mt-4 prose prose-neutral dark:prose-invert max-w-none text-muted-foreground space-y-4">
                <p>Protecting the privacy of children is especially important. Ugbekun is intended for use by educational institutions. The collection of student data, including that of children under the age of 13, is done for educational purposes and only at the direction and with the consent of the school, which is responsible for obtaining parental/guardian consent as required by law. We do not knowingly collect personal information directly from children without such consent.</p>
              </div>
            </section>

             <section id="policy-changes">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground flex items-center gap-3"><RefreshCw className="text-primary"/>Changes to This Policy</h2>
               <div className="mt-4 prose prose-neutral dark:prose-invert max-w-none text-muted-foreground space-y-4">
                <p>We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. We may also notify your school's administrator directly. You are advised to review this Privacy Policy periodically for any changes.</p>
              </div>
            </section>
            
             <section id="contact-us">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground flex items-center gap-3"><Mail className="text-primary"/>Contact Us</h2>
               <div className="mt-4 prose prose-neutral dark:prose-invert max-w-none text-muted-foreground space-y-4">
                <p>If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact our Data Protection Officer at:</p>
                <p><a href="mailto:privacy@ugbekun.com" className="text-primary hover:underline">privacy@ugbekun.com</a></p>
              </div>
            </section>

          </main>
        </div>
      </div>
    </div>
  );
}
