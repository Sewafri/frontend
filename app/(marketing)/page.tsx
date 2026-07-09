import HeroGeometric from "./_components/hero-geometric";
import FocusCards from "./_components/focus-cards";
import StatBlock from "./_components/stat-block";
import CoursesSection from "./_components/courses-section";
import TracksGrid from "./_components/tracks-grid";
import UpdatesList from "./_components/updates-list";
import CTASection from "./_components/cta-section";
import Footer from "./_components/footer";

export default function LandingPage() {
  return (
    <>
      <HeroGeometric />
      <div className="mx-auto max-w-6xl px-6">
        <FocusCards />
        <StatBlock />
        <CoursesSection />
        <TracksGrid />
        <UpdatesList />
        <CTASection />
        <Footer />
      </div>
    </>
  );
}
