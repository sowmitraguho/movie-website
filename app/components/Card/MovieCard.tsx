"use client";
import React from 'react';
import Link from 'next/link';
import { Heart, Star, Clock } from 'lucide-react';

// --- Data Structure (IMovie) based on user request ---
interface IMovie {
  _id: string; // Used as key
  title: string;
  releaseDate: Date;
  genre: string[];
  runtime: number; // in minutes
  plotSummary: string;
  posterUrl: string; // URL to a movie poster image
  trailerUrl: string;
  rating: number; // Calculated average rating
  reviewCount: number; // Number of reviews
}

interface MovieCardProps {
  movie: IMovie;
}

// Helper to render lucide-react Star icons based on rating (0-5 scale)
const RatingDisplay = ({ rating }: { rating: number }) => {
  // Assuming rating is 0 to 5. We round it to the nearest whole star.
  const roundedRating = Math.round(rating); 
  const stars = [];
  for (let i = 0; i < 5; i++) {
    stars.push(
      <Star
        key={i}
        className={`h-4 w-4 transition-colors duration-200 ${
          i < roundedRating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-500/30'
        }`}
      />
    );
  }
  return <div className="flex items-center space-x-0.5">{stars}</div>;
};

// --- Custom Movie Card Component (Styled like NftCard) ---
export default function MovieCard({ movie }: MovieCardProps) {
  // Generate a friendly slug for the link
  const slug = movie.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const movieLink = `/movie/${slug}-${movie._id.toString()}`;

  // Get the year from the release date
  const releaseYear = new Date(movie.releaseDate).getFullYear();
  
  // Custom font import (similar to NFT card's style)
  const fontStyle = {
    fontFamily: 'Inter, sans-serif' // Using Inter as default for Tailwind/shadcn context
  }

  return (
    <Link href={movieLink} style={fontStyle} className="block h-full">
      <div 
        className="relative group overflow-hidden rounded-2xl sm:rounded-3xl h-full
                   bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 
                   shadow-lg shadow-gray-200/50 dark:shadow-black/20 
                   transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 
                   dark:hover:shadow-primary/40 hover:-translate-y-1 
                   hover:border-primary/50 dark:hover:border-primary/50 w-full"
      >
        <div className="relative p-2 sm:p-2.5 flex flex-col h-full">
          {/* Card Image Section (Poster) */}
          <div className="relative aspect-[2/3] overflow-hidden flex-shrink-0">
            <img 
              src={movie.posterUrl || `https://placehold.co/400x600/1f2937/f9fafb?text=${movie.title.replace(/\s/g, '+')}`} 
              alt={`Poster for ${movie.title}`} 
              className="w-full h-full rounded-xl sm:rounded-2xl object-cover transition-transform duration-500 group-hover:scale-105" 
              loading="lazy"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = `https://placehold.co/400x600/1f2937/f9fafb?text=${movie.title.replace(/\s/g, '+')}`;
              }}
            />

            {/* Overlays: Release Year (Replacing Time Left) */}
            {/* Using a sleek, primary-colored badge for the year */}
            <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-primary/90 text-white text-xs sm:text-sm font-bold px-3 py-1 sm:px-4 sm:py-2 rounded-full flex items-center shadow-lg">
                <span className="truncate">{releaseYear}</span>
            </div>

            {/* Favorite Button (Replacing Heart Icon) */}
            <button 
              className="absolute top-3 right-3 sm:top-4 sm:right-4 
                         bg-black/70 dark:bg-black/70 text-white p-2 sm:p-3 
                         rounded-full transition-colors hover:text-red-500 
                         backdrop-blur-sm border border-white/20 opacity-0 group-hover:opacity-100"
              onClick={(e) => { e.preventDefault(); /* Handle favorite logic here */ }}
            >
              <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Card Content Section */}
          <div className="mt-3 sm:mt-4 px-1 sm:px-1.5 pb-2 sm:pb-3 pt-1 sm:pt-2 flex flex-col flex-grow">
            
            {/* Title and Rating Score */}
            <div className="flex justify-between items-start">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white line-clamp-2 leading-tight pr-2 transition-colors group-hover:text-primary" title={movie.title}>
                {movie.title}
              </h3>
              {/* Display score like the Eth price */}
              <span className="text-sm sm:text-lg font-extrabold text-cyan-600 dark:text-cyan-400 flex-shrink-0 ml-1">
                {movie.rating.toFixed(1)}
              </span>
            </div>

            {/* Star Rating (Replacing Highest Bid) */}
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 flex items-center space-x-2">
                <RatingDisplay rating={movie.rating} />
                <span className="text-xs text-muted-foreground">({movie.reviewCount} Reviews)</span>
            </div>

            {/* Runtime / Main Stat (Replacing Price) */}
            <div className="mt-3 sm:mt-4 flex justify-between items-center border-t pt-3 border-gray-100 dark:border-gray-800 flex-grow justify-end flex-col">
              <p className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center space-x-1">
                <Clock className="w-3 h-3 text-muted-foreground" />
                <span>Runtime</span>
              </p>
              <p className="text-sm sm:text-lg font-bold text-primary dark:text-primary mt-1">
                {movie.runtime} min
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}