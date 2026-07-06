import HeroSection from "./_components/hero-section";
import FeaturesSection from "./_components/catalog-section";
import CoursesSection from "./_components/courses-section";
import Footer from "./_components/footer";

export default function LandingPage() {
  return (
    <div className="mx-auto max-w-6xl px-6">
      <HeroSection />
      <FeaturesSection />
      <CoursesSection />
      <Footer />
    </div>
  );
}
