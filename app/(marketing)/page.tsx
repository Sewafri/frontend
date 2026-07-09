import HeroGeometric from "./_components/hero-geometric";
import FocusCards from "./_components/focus-cards";
import StatBlock from "./_components/stat-block";
import CoursesSection from "./_components/courses-section";
import TracksGrid from "./_components/tracks-grid";
import UpdatesList from "./_components/updates-list";
import CTASection from "./_components/cta-section";
import Footer from "./_components/footer";
import SproutScene from "./_components/sprout-scene";

export default function LandingPage() {
  return (
    <>
      <HeroGeometric />
      <div className="mx-auto max-w-6xl px-6">
        <FocusCards />

        <SproutScene
          sproots={[
            { variant: "celebrating", size: "sm" },
            { variant: "laughing", size: "default" },
            { variant: "happy", size: "sm" },
          ]}
          message="Play is the highest form of learning!"
        />

        <StatBlock />

        <SproutScene
          sproots={[
            { variant: "eating", size: "lg" },
          ]}
          message="Sweet skills to grow on!"
        />

        <CoursesSection />

        <SproutScene
          sproots={[
            { variant: "sympathetic", size: "lg" },
            { variant: "happy", size: "sm" },
          ]}
          message="Growing together, every step of the way!"
        />

        <TracksGrid />

        <SproutScene
          sproots={[
            { variant: "thinking", size: "default" },
          ]}
          message="Curious minds are always learning!"
        />

        <UpdatesList />

        <SproutScene
          sproots={[
            { variant: "excited", size: "lg" },
          ]}
          message="Big things are coming!"
        />

        <CTASection />

        <SproutScene
          sproots={[
            { variant: "waving", size: "lg" },
          ]}
          message="Ready to start your adventure?"
        />

        <Footer />
      </div>
    </>
  );
}
