import { HeroSection } from "./_components/hero";
import { Mascot } from "./_components/mascot";
import { StatsBar } from "./_components/stats-bar";
import { TrustedLogos } from "./_components/trusted-logos";
import { HowItWorks } from "./_components/how-it-works";
import { CoursesSection } from "./_components/courses-section";
import { WhyChoose } from "./_components/why-choose";
import { CategoriesSection } from "./_components/categories";
import { CTASection } from "./_components/cta-section";
import { FooterSection } from "./_components/footer";

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <Mascot />
      <StatsBar />
      <TrustedLogos />
      <HowItWorks />
      <CoursesSection />
      <WhyChoose />
      <CategoriesSection />
      <CTASection />
      <FooterSection />
    </>
  );
}
