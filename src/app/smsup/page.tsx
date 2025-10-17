
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import { Hero } from "@/components/smsup/hero";
import { Features } from "@/components/smsup/features";
import { HowItWorks } from "@/components/smsup/how-it-works";
import { ForRoles } from "@/components/smsup/for-roles";
import { Cta } from "@/components/smsup/cta";

export default function SmsupPage() {
  return (
    <div className="flex flex-col min-h-[100dvh]">
      <Navbar />
      <main className="flex-1 pt-20">
        <Hero />
        <Features />
        <HowItWorks />
        <ForRoles />
        <Cta />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
