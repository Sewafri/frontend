import HeroGeometric from "./_components/hero-geometric";
import FocusCards from "./_components/focus-cards";
import StatBlock from "./_components/stat-block";
import CoursesSection from "./_components/courses-section";
import TracksGrid from "./_components/tracks-grid";
import CTASection from "./_components/cta-section";
import Footer from "./_components/footer";
import TrustedEmployers from "./_components/trusted-employers";
import WhatIsSewafri from "./_components/what-is-sewafri";
import HowItWorks from "./_components/how-it-works";

export default function LandingPage() {
  return (
    <>
      <HeroGeometric />
      <div className="mx-auto max-w-6xl px-6 pb-20">
        <StatBlock />
        <TrustedEmployers />
        <WhatIsSewafri />
        <HowItWorks />
        <CoursesSection />
        <FocusCards />
        <TracksGrid />
        <CTASection />
        <Footer />
      </div>
    </>
  );
}
