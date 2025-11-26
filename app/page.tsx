import HeroSection from "./components/HeroSection/HeroSection";
import TrendingSection from "./components/TrendingSection/TrendingSection";
import { IMovie } from "@/models/Movie";

async function getTrendingMovies(): Promise<IMovie[]> {
    try {
        const res = await fetch(`http://localhost:3000/api/Movies`);
        const data = await res.json();
        if (!data || !data.data) return [];
        return data.data as IMovie[];
    } catch (error) {
        console.error("Error fetching movies:", error);
        return [];
    }
}

export default async function Home() {
  const movies = await getTrendingMovies();
  return (
    <main className="min-h-screen">
      <HeroSection movies={movies} />
      <TrendingSection movies={movies} />
    </main>
  );
}
