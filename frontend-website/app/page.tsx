import { RemoteAccessSection } from "@/components/sections/remote-access";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { HeroSection } from "@/components/sections/hero";
import { DemoSection } from "@/components/sections/demo";
import { PillarsSection } from "@/components/sections/pillars";
import { IntroSection } from "@/components/sections/intro";
import { WhyAshwatthamaSection } from "@/components/sections/why-ashwatthama";
import { FeaturesSection } from "@/components/sections/features";
import { ExperienceSection } from "@/components/sections/experience";
import { PrivacySection } from "@/components/sections/privacy";
import { FAQSection } from "@/components/sections/faq";
import { ContactSection } from "@/components/sections/contact";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <DemoSection />
        <PillarsSection />
        <IntroSection />
        <WhyAshwatthamaSection />
        <FeaturesSection />
        <RemoteAccessSection />
        <ExperienceSection />
        <PrivacySection />
        <FAQSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
