
import HeroSection from "./components/HeroSection/HeroSection";
import TrendingSection from "./components/TrendingSection/TrendingSection";



export default async function Home() {
  const movies = await fetch("https://movie-website-server-ebon.vercel.app/api/movies").then((res) => res.json());
  console.log(movies);
  return (
    <main className="min-h-screen">
      <HeroSection movies={movies} />
      <TrendingSection movies={movies} />
    </main>
  );
}
