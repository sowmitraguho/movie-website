
import { Separator } from "@/components/ui/separator";
import { TrendingUp } from 'lucide-react';
import MovieCard from '../Card/MovieCard';
import { IMovie } from "@/models/Movie";





export default async function TrendingPage({ movies }: { movies: IMovie[] }) {
    
    return (
        <div className="relative pt-6 sm:pt-8 lg:pt-12 pb-12 overflow-hidden bg-[#0f172a]">
            <div className="relative z-10 w-full max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8">

                <header className="mb-6 sm:mb-8 lg:mb-10">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight flex items-center 
                                           bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 text-transparent bg-clip-text">
                                <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 text-white mr-3" />
                                Trending Movies
                            </h1>
                            <p className="mt-2 text-base sm:text-lg text-white max-w-3xl">
                                Explore the most popular and highest-rated films watched by our community right now.
                            </p>
                        </div>
                    </div>
                </header>

                <Separator className="mb-8" />

                {movies.length > 0 ? (
                    <div className="grid 
                        grid-cols-2    
                        sm:grid-cols-3 
                        md:grid-cols-4 
                        gap-4">
                        {movies.map((movie, idx) => (
                            <MovieCard key={idx} movie={movie as IMovie} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-xl text-white">
                            No trending movies found at this time. Check back later!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}