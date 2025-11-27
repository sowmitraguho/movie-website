import HeroSection from "./components/HeroSection/HeroSection";
import TrendingSection from "./components/TrendingSection/TrendingSection";

import { getMovies } from "@/lib/data";


export default async function Home() {
  const movies = await getMovies();
  console.log(movies);
  return (
    <main className="min-h-screen">
      <HeroSection movies={movies} />
      <TrendingSection movies={movies} />
    </main>
  );
}
