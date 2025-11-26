import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Separator } from "@/components/ui/separator";
// Assuming MovieCard component is in the standard components directory

import { ArrowLeft, Filter, TrendingUp } from 'lucide-react';
import MovieCard from '../Card/MovieCard';


// --- Data Structure (IMovie) based on user request ---
// This interface defines the expected data for each movie object.
interface IMovie {
  _id: string; // Used as key
  title: string;
  releaseDate: Date;
  genre: string[];
  runtime: number; 
  plotSummary: string;
  posterUrl: string; 
  trailerUrl: string;
  rating: number; 
  reviewCount: number; 
}

// --- Mock Data Setup for the Full Page ---
const mockTrendingMovies: IMovie[] = [
    // Reusing and extending mock data from app/page.tsx for a fuller page
    { _id: '65f6c6f6d2f3c7e7b5a1b3c4', 
        title: 'The Cybernetic Dream', 
        releaseDate: new Date('2024-10-25'), 
        genre: ['Sci-Fi', 'Action'], 
        runtime: 145, 
        plotSummary: 'A detective chases a rogue AI.', 
        posterUrl: 'https://placehold.co/400x600/0f172a/94a3b8?text=CYBERNETIC+DREAM', 
        trailerUrl: '', 
        rating: 4.7, 
        reviewCount: 1520 },
    { _id: '65f6c6f6d2f3c7e7b5a1b3c5', 
        title: 'Echoes of the Past', 
        releaseDate: new Date('2023-11-01'), 
        genre: ['Drama', 'History'], 
        runtime: 120, 
        plotSummary: 'A family uncovers a decades-old secret.', 
        posterUrl: 'https://placehold.co/400x600/16a34a/d1fae5?text=ECHOES', 
        trailerUrl: '', 
        rating: 3.9, 
        reviewCount: 890 },
    { _id: '65f6c6f6d2f3c7e7b5a1b3c6', 
        title: 'Midnight Heist', 
        releaseDate: new Date('2024-01-15'), 
        genre: ['Thriller', 'Crime'], 
        runtime: 105, 
        plotSummary: 'The perfect crime unravels.', 
        posterUrl: 'https://placehold.co/400x600/dc2626/fee2e2?text=MIDNIGHT+HEIST', 
        trailerUrl: '', 
        rating: 4.2, 
        reviewCount: 345 },
    { _id: '65f6c6f6d2f3c7e7b5a1b3c7', 
        title: 'The Last Starship', 
        releaseDate: new Date('2023-08-20'), 
        genre: ['Sci-Fi', 'Adventure'], 
        runtime: 160, 
        plotSummary: 'Humanity\'s final hope rests on a lone starship.', 
        posterUrl: 'https://placehold.co/400x600/7c3aed/ede9fe?text=STARSHIP', 
        trailerUrl: '', 
        rating: 4.5, 
        reviewCount: 1800 },
    { _id: '65f6c6f6d2f3c7e7b5a1b3c8', 
        title: 'A Quiet Place to Think', 
        releaseDate: new Date('2024-03-01'), 
        genre: ['Comedy', 'Slice of Life'], 
        runtime: 95, 
        plotSummary: 'A philosophy professor attempts to find silence.', 
        posterUrl: 'https://placehold.co/400x600/f59e0b/fffbeb?text=QUIET+PLACE', 
        trailerUrl: '', 
        rating: 3.5, 
        reviewCount: 50 },
    { _id: '65f6c6f6d2f3c7e7b5a1b3c9', 
        title: 'Ancient Whispers', 
        releaseDate: new Date('2024-05-10'), 
        genre: ['Mystery', 'Horror'], 
        runtime: 115, 
        plotSummary: 'Archaeologists awaken something ancient.', 
        posterUrl: 'https://placehold.co/400x600/581c87/e9d5ff?text=WHISPERS', 
        trailerUrl: '', 
        rating: 4.0, 
        reviewCount: 700 },
    { _id: '65f6c6f6d2f3c7e7b5a1b3ca', 
        title: 'The Algorithm King', 
        releaseDate: new Date('2024-06-01'), 
        genre: ['Tech', 'Documentary'], 
        runtime: 90, 
        plotSummary: 'A deep dive into social media manipulation.', 
        posterUrl: 'https://placehold.co/400x600/155e75/ccfbf1?text=ALGORITHM', 
        trailerUrl: '', 
        rating: 4.8, 
        reviewCount: 2200 },
    { _id: '65f6c6f6d2f3c7e7b5a1b3cb', 
        title: 'Rainy Day Romance', 
        releaseDate: new Date('2023-12-12'), 
        genre: ['Romance', 'Comedy'], 
        runtime: 100, 
        plotSummary: 'Two strangers meet on a delayed train.', 
        posterUrl: 'https://placehold.co/400x600/ec4899/fce7f3?text=ROMANCE', 
        trailerUrl: '', 
        rating: 3.7, 
        reviewCount: 450 },
    { _id: '65f6c6f6d2f3c7e7b5a1b3cc', 
        title: 'Infinite Loop', 
        releaseDate: new Date('2024-02-29'), 
        genre: ['Sci-Fi', 'Thriller'], 
        runtime: 130, 
        plotSummary: 'Trapped in a time paradox, he fights for survival.', 
        posterUrl: 'https://placehold.co/400x600/083344/e0f2f1?text=INFINITE+LOOP', 
        trailerUrl: '', 
        rating: 4.3, 
        reviewCount: 950 },
    { _id: '65f6c6f6d2f3c7e7b5a1b3cd', 
        title: 'The Green Planet', 
        releaseDate: new Date('2024-07-07'), 
        genre: ['Adventure', 'Fantasy'], 
        runtime: 155, 
        plotSummary: 'A journey to an undiscovered world.', 
        posterUrl: 'https://placehold.co/400x600/047857/d1fae5?text=GREEN+PLANET', 
        trailerUrl: '', 
        rating: 4.9, 
        reviewCount: 3100 },
];


async function getTrendingMovies(): Promise<IMovie[]> {
    // In a real application, this would fetch data from your API:
    /*
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/movies?sort=rating&limit=50`);
    if (!res.ok) return [];
    return res.json();
    */
    
    // For now, we use the mock data
    return mockTrendingMovies;
}

export default async function TrendingPage() {
    const movies = await getTrendingMovies();

    return (
        <div className="relative pt-6 sm:pt-8 lg:pt-12 pb-12 overflow-hidden bg-[#0f172a]">
            <div className="relative z-10 w-full max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Header Section (Inspired by NFT Marketplace style) */}
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

                {/* Movie Grid */}
                {movies.length > 0 ? (
                    <div className="grid 
                        grid-cols-2    /* Mobile */
                        sm:grid-cols-3 /* Tablet */
                        md:grid-cols-4 /* Small Desktop */
                        lg:grid-cols-5 /* Medium Desktop */
                        gap-2">
                        {movies.map((movie) => (
                            <MovieCard key={movie._id} movie={movie as any as IMovie} />
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