import HeroSection from "./components/HeroSection/HeroSection";
import TrendingSection from "./components/TrendingSection/TrendingSection";

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <TrendingSection />
    </main>
  );
}
