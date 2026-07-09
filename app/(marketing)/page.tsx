import HeroGeometric from "./_components/hero-geometric";
import FocusCards from "./_components/focus-cards";
import StatBlock from "./_components/stat-block";
import CoursesSection from "./_components/courses-section";
import TracksGrid from "./_components/tracks-grid";
import UpdatesList from "./_components/updates-list";
import CTASection from "./_components/cta-section";
import Footer from "./_components/footer";
import PlayScene from "./_components/scenes/play-scene";
import EatScene from "./_components/scenes/eat-scene";
import LaughScene from "./_components/scenes/laugh-scene";
import ThinkScene from "./_components/scenes/think-scene";
import ScrollScene from "./_components/scenes/scroll-scene";
import WaveScene from "./_components/scenes/wave-scene";

export default function LandingPage() {
  return (
    <>
      <HeroGeometric />
      <div className="mx-auto max-w-6xl px-6">
        <FocusCards />
        <PlayScene />
        <StatBlock />
        <EatScene />
        <CoursesSection />
        <LaughScene />
        <TracksGrid />
        <ThinkScene />
        <UpdatesList />
        <ScrollScene />
        <CTASection />
        <WaveScene />
        <Footer />
      </div>
    </>
  );
}
