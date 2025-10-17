
/**
 * @author Daniel Innocent (@mdtbmw)
 * @copyright Copyright (c) 2024 Ugbekun. All rights reserved.
 */
'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Shield,
  Lock,
  KeyRound,
  DatabaseZap,
  Fingerprint,
  CloudCog,
  Code,
  Bell,
  ShieldCheck,
  Recycle,
  Mail,
  CircleDot,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const sections = [
  { id: 'commitment', title: 'Our Commitment', icon: <Shield /> },
  { id: 'encryption', title: 'Data Encryption', icon: <Lock /> },
  { id: 'auth', title: 'Access Control', icon: <KeyRound /> },
  { id: 'infra', title: 'Infrastructure', icon: <CloudCog /> },
  { id: 'development', title: 'Secure Development', icon: <Code /> },
  { id: 'compliance', title: 'Compliance', icon: <ShieldCheck /> },
  { id: 'incident-response', title: 'Incident Response', icon: <Bell /> },
  { id: 'retention-disposal', title: 'Data Disposal', icon: <Recycle /> },
  { id: 'contact', title: 'Contact Us', icon: <Mail /> },
];

export default function SecurityPage() {
  const [activeSection, setActiveSection] = useState('commitment');
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
        if(observer.current) {
            observer.current.observe(el)
        }
    });

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
            Security at Ugbekun
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            How we build a trusted, secure platform for your school.
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
            <section id="commitment">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground flex items-center gap-3"><Shield className="text-primary"/>Our Commitment to Security</h2>
              <div className="mt-4 prose prose-neutral dark:prose-invert max-w-none text-muted-foreground space-y-4">
                <p>At Ugbekun, trust is the foundation of our relationship with the schools, students, parents, and educators we serve. We are deeply committed to protecting the confidentiality, integrity, and availability of all data entrusted to us. Our comprehensive security program is built on industry best practices and is designed to safeguard sensitive information from the ground up, ensuring a secure and reliable environment for your entire school community.</p>
              </div>
            </section>
            
            <section id="encryption">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground flex items-center gap-3"><Lock className="text-primary"/>Data Encryption</h2>
               <div className="mt-4 prose prose-neutral dark:prose-invert max-w-none text-muted-foreground space-y-4">
                  <p>Encryption is a critical layer of our defense-in-depth strategy, protecting your data both as it travels over the internet and while it is stored on our servers.</p>
                </div>
              <div className="mt-6 space-y-6">
                <div className="p-6 rounded-2xl border bg-card">
                    <h3 className="font-semibold flex items-center gap-2 text-foreground">Encryption in Transit</h3>
                    <p className="text-sm text-muted-foreground mt-2">All data transmitted between your device and our servers is encrypted using industry-standard Transport Layer Security (TLS) 1.2 or higher. This enforces a secure channel, preventing unauthorized parties from eavesdropping on or tampering with data as it travels over the network.</p>
                </div>
                 <div className="p-6 rounded-2xl border bg-card">
                    <h3 className="font-semibold flex items-center gap-2 text-foreground">Encryption at Rest</h3>
                    <p className="text-sm text-muted-foreground mt-2">All sensitive user data stored in our databases, including student records, financial information, and system backups, is encrypted at rest using the Advanced Encryption Standard (AES-256). This ensures that even in the extremely unlikely event of a physical breach of our data centers, the underlying data remains unreadable.</p>
                </div>
              </div>
            </section>

             <section id="auth">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground flex items-center gap-3"><KeyRound className="text-primary"/>Access Control & Authentication</h2>
              <div className="mt-4 prose prose-neutral dark:prose-invert max-w-none text-muted-foreground space-y-4">
                <p>We enforce strict, multi-layered access control policies to ensure that users can only access the specific information and functions relevant to their designated roles.</p>
                <ul className="space-y-3">
                    <li className="flex items-start gap-3"><CircleDot className="h-4 w-4 mt-1 text-primary shrink-0"/><span><strong>Role-Based Access Control (RBAC):</strong> Our system is built on the principle of least privilege. Permissions are granted based on predefined roles (e.g., Administrator, Teacher, Parent, Student). This granular control ensures, for example, that a teacher can only see information for students in their own classes, and a parent can only see information for their own child.</span></li>
                    <li className="flex items-start gap-3"><CircleDot className="h-4 w-4 mt-1 text-primary shrink-0"/><span><strong>Strong Password Policies:</strong> We enforce complexity requirements for user passwords and provide options for Single Sign-On (SSO) and multi-factor authentication (MFA) to add critical extra layers of security to user accounts.</span></li>
                    <li className="flex items-start gap-3"><CircleDot className="h-4 w-4 mt-1 text-primary shrink-0"/><span><strong>Comprehensive Audit Logs:</strong> All significant actions taken within the platform—such as logins, grade changes, fee payments, and data exports—are securely logged. This provides a comprehensive audit trail, ensuring accountability and traceability for all user activities.</span></li>
                </ul>
              </div>
            </section>

             <section id="infra">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground flex items-center gap-3"><CloudCog className="text-primary"/>Infrastructure Security</h2>
               <div className="mt-4 prose prose-neutral dark:prose-invert max-w-none text-muted-foreground space-y-4">
                <p>Our platform is hosted on leading, secure cloud infrastructure (such as Google Cloud Platform or Amazon Web Services) that provides a highly secure, scalable, and resilient environment.</p>
                 <ul className="space-y-3">
                   <li className="flex items-start gap-3"><CircleDot className="h-4 w-4 mt-1 text-primary shrink-0"/><span><strong>Network Security:</strong> We utilize Virtual Private Clouds (VPCs), firewalls, and strict network access control lists to isolate our services and protect against unauthorized network access. Regular network vulnerability scans are performed to identify and mitigate risks.</span></li>
                   <li className="flex items-start gap-3"><CircleDot className="h-4 w-4 mt-1 text-primary shrink-0"/><span><strong>Continuous Monitoring & Threat Detection:</strong> Our systems are monitored 24/7 for security threats, suspicious activity, and potential vulnerabilities using advanced intrusion detection systems (IDS) and security information and event management (SIEM) tools.</span></li>
                   <li className="flex items-start gap-3"><CircleDot className="h-4 w-4 mt-1 text-primary shrink-0"/><span><strong>Data Redundancy and Disaster Recovery:</strong> Regular, automated backups of all critical data are performed. These backups are encrypted and stored securely in geographically separate locations to ensure we can restore the service and your data in the case of a regional disaster.</span></li>
                </ul>
              </div>
            </section>

             <section id="development">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground flex items-center gap-3"><Code className="text-primary"/>Secure Software Development Lifecycle (SDLC)</h2>
               <div className="mt-4 prose prose-neutral dark:prose-invert max-w-none text-muted-foreground space-y-4">
                <p>Security is not an afterthought; it is integrated into every phase of our software development lifecycle.</p>
                 <ul className="space-y-3">
                   <li className="flex items-start gap-3"><CircleDot className="h-4 w-4 mt-1 text-primary shrink-0"/><span><strong>Secure Coding Practices & Code Reviews:</strong> Our developers are trained in secure coding practices. All code changes undergo rigorous peer review and are scanned by Static Application Security Testing (SAST) tools to identify potential vulnerabilities before they are deployed to production.</span></li>
                   <li className="flex items-start gap-3"><CircleDot className="h-4 w-4 mt-1 text-primary shrink-0"/><span><strong>Vulnerability Management:</strong> We conduct regular penetration tests and vulnerability assessments with certified third-party security experts to proactively identify and remediate security weaknesses in our platform.</span></li>
                   <li className="flex items-start gap-3"><CircleDot className="h-4 w-4 mt-1 text-primary shrink-0"/><span><strong>Dependency Scanning:</strong> We continuously scan all third-party libraries and dependencies used in our software for known vulnerabilities (CVEs) and apply patches or updates in a timely manner.</span></li>
                </ul>
              </div>
            </section>
            
             <section id="compliance">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground flex items-center gap-3"><ShieldCheck className="text-primary"/>Compliance</h2>
               <div className="mt-4 prose prose-neutral dark:prose-invert max-w-none text-muted-foreground space-y-4">
                <p>Ugbekun is committed to meeting and exceeding industry standards for security and data privacy. Our infrastructure providers are certified for leading international standards, including SOC 2, ISO 27001, and PCI DSS.</p>
                <p>We design our platform to help schools comply with relevant data protection regulations, including the Nigerian Data Protection Regulation (NDPR) and the General Data Protection Regulation (GDPR).</p>
              </div>
            </section>
            
            <section id="incident-response">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground flex items-center gap-3"><Bell className="text-primary"/>Incident Response Plan</h2>
               <div className="mt-4 prose prose-neutral dark:prose-invert max-w-none text-muted-foreground space-y-4">
                <p>In the event of a security incident, we have a documented incident response plan to ensure we can respond quickly and effectively. Our process follows a standard framework:</p>
                 <ul className="space-y-3">
                   <li className="flex items-start gap-3"><CircleDot className="h-4 w-4 mt-1 text-primary shrink-0"/><span><strong>Containment:</strong> Immediately isolating affected systems to prevent further damage.</span></li>
                   <li className="flex items-start gap-3"><CircleDot className="h-4 w-4 mt-1 text-primary shrink-0"/><span><strong>Investigation:</strong> Conducting a thorough forensic analysis to determine the scope and root cause of the incident.</span></li>
                   <li className="flex items-start gap-3"><CircleDot className="h-4 w-4 mt-1 text-primary shrink-0"/><span><strong>Eradication & Recovery:</strong> Removing the threat and restoring systems to a secure, operational state from backups.</span></li>
                   <li className="flex items-start gap-3"><CircleDot className="h-4 w-4 mt-1 text-primary shrink-0"/><span><strong>Communication:</strong> We are committed to transparent communication and will notify affected customers and relevant authorities promptly, in accordance with our legal and contractual obligations.</span></li>
                </ul>
              </div>
            </section>
            
             <section id="retention-disposal">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground flex items-center gap-3"><Recycle className="text-primary"/>Secure Data Disposal</h2>
               <div className="mt-4 prose prose-neutral dark:prose-invert max-w-none text-muted-foreground space-y-4">
                <p>When a school terminates its service with Ugbekun, we follow a strict data disposal process. All of the school's data is securely and permanently deleted from our production systems within a contractually defined period. We ensure that the data is irrecoverable from our systems after this disposal process is complete.</p>
              </div>
            </section>
            
             <section id="contact">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground flex items-center gap-3"><Mail className="text-primary"/>Contact Us & Reporting Vulnerabilities</h2>
               <div className="mt-4 prose prose-neutral dark:prose-invert max-w-none text-muted-foreground space-y-4">
                <p>We value the work of independent security researchers and have a responsible disclosure program. If you have any questions about our security practices or believe you have discovered a vulnerability in our Service, please contact our security team immediately. We are committed to working with the community to verify and respond to any potential vulnerabilities.</p>
                <p>Please contact us at <a href="mailto:security@ugbekun.com" className="text-primary hover:underline">security@ugbekun.com</a>.</p>
              </div>
            </section>

          </main>
        </div>
      </div>
    </div>
  );
}
