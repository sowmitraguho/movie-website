import HeroSection from "./components/HeroSection/HeroSection";
import TrendingSection from "./components/TrendingSection/TrendingSection";
import { IMovie } from "@/models/Movie";

async function getMovies(baseURL: string): Promise<IMovie[]> {
    try {
        const res = await fetch(`${baseURL}/api/Movies`);
        const data = await res.json();
        console.log(data);
        if (!data || !data.data) return [];
        return data.data as IMovie[];
    } catch (error) {
        console.error("Error fetching movies:", error);
        return [];
    }
}

export default async function Home() {
  const movies = await getMovies(process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000");
  console.log(movies);
  return (
    <main className="min-h-screen">
      <HeroSection movies={movies} />
      <TrendingSection movies={movies} />
    </main>
  );
}
