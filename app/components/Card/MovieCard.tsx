"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Star,
  Clock,
  Play,
  Share2,
  Expand,
  Minimize,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

//
// Types
//
export interface IMovie {
  _id: string;
  title: string;
  releaseDate: Date | string;
  genre: string[];
  runtime: number; // minutes
  plotSummary: string;
  posterUrl: string;
  trailerUrl?: string; // youtube/watch?v=... or embed
  rating: number; // 0..10 (we adapt to 0..5 for stars)
  reviewCount: number;
  director?: string;
  year?: number;
  client?: string;
  // any other optional fields used in modal
}

interface MovieCardWithModalProps {
  movie: IMovie;
  index?: number; // optional index for gallery navigation
  total?: number; // optional total count for display
  onNavigate?: (dir: "prev" | "next") => void; // optional prev/next handlers
  // optional callback when favorite toggled
  onToggleFavorite?: (movieId: string) => void;
}

//
// Rating display (0..10 -> 0..5 star scale)
//
const RatingDisplay = ({ rating }: { rating: number }) => {
  // Accept rating as 0..10, convert to 0..5
  const fiveScale = Math.max(0, Math.min(5, rating / 2));
  const rounded = Math.round(fiveScale);
  const stars = [];
  for (let i = 0; i < 5; i++) {
    stars.push(
      <Star
        key={i}
        className={`h-4 w-4 transition-colors duration-200 ${
          i < rounded ? "text-yellow-400 fill-yellow-400" : "text-gray-500/30"
        }`}
      />
    );
  }
  return <div className="flex items-center space-x-0.5">{stars}</div>;
};

//
// Helper to create a friendly slug for Link
//
const makeSlug = (title: string, id: string) =>
  `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}-${id}`;

//
// Helper to convert many youtube urls into embeddable url
//
const getEmbedUrl = (url?: string | undefined) => {
  if (!url) return "";
  try {
    // comfortable handling of common YouTube patterns
    const u = new URL(url.includes("http") ? url : `https://www.youtube.com/watch?v=${url}`);
    // if it's youtube watch?v=...
    if ((u.hostname || "").includes("youtube") || (u.hostname || "").includes("youtu.be")) {
      // get video id
      const id = u.searchParams.get("v") || u.pathname.split("/").pop();
      if (id) return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
    }
  } catch (e) {
    // fallback: return as-is
  }
  // If already embed url or other provider, return it
  return url;
};

//
// Main component
//
export default function MovieCardWithModal({
  movie,
  index = 0,
  total = 1,
  onNavigate,
  onToggleFavorite,
}: MovieCardWithModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);

  const releaseYear = new Date(movie.releaseDate).getFullYear();
  const posterFallback = `https://placehold.co/400x600/1f2937/f9fafb?text=${encodeURIComponent(
    movie.title
  )}`;
  const embedUrl = getEmbedUrl(movie.trailerUrl);

  // Open modal
  const openModal = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIsOpen(true);
  };

  // Close modal and reset playing state if needed
  const closeModal = () => {
    setIsOpen(false);
    setIsPlaying(false);
    setIsFullscreen(false);
  };

  // Toggle favorite locally and propagate
  const toggleFavorite = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const newVal = !isFavorited;
    setIsFavorited(newVal);
    if (onToggleFavorite) onToggleFavorite(movie._id);
  };

  const toggleFullscreen = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIsFullscreen((s) => !s);
  };

  const handlePlayClick = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (embedUrl) setIsPlaying(true);
  };

  // keyboard handlers for modal controls
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === "Escape") closeModal();
      if (ev.key === " " || ev.code === "Space") {
        ev.preventDefault();
        if (!isPlaying) handlePlayClick();
      }
      if (ev.key === "ArrowLeft") onNavigate?.("prev");
      if (ev.key === "ArrowRight") onNavigate?.("next");
      if (ev.key.toLowerCase() === "f") toggleFullscreen();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, isPlaying, onNavigate]);

  // click outside to close (already handled via backdrop onClick)
  // guard focus trap minimal
  useEffect(() => {
    if (!isOpen) return;
    setTimeout(() => modalRef.current?.focus(), 100);
  }, [isOpen]);

  // friendly slug for view page link
  const movieLink = `/movie/${makeSlug(movie.title, movie._id)}`;

  return (
    <>
      {/* CARD */}
      <div
        onClick={openModal}
        className="relative group overflow-hidden rounded-2xl sm:rounded-3xl h-full cursor-pointer
                   bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 
                   shadow-lg shadow-gray-200/50 dark:shadow-black/20 
                   transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 
                   dark:hover:shadow-primary/40 hover:-translate-y-1 
                   hover:border-primary/50 dark:hover:border-primary/50 w-full"
        aria-label={`Open ${movie.title} details`}
      >
        <div className="relative p-2 sm:p-2.5 flex flex-col h-full">
          {/* Poster */}
          <div className="relative aspect-[2/3] overflow-hidden flex-shrink-0">
            <img
              src={movie.posterUrl || posterFallback}
              alt={`Poster for ${movie.title}`}
              className="w-full h-full rounded-xl sm:rounded-2xl object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = posterFallback;
              }}
            />

            <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-primary/90 text-white text-xs sm:text-sm font-bold px-3 py-1 sm:px-4 sm:py-2 rounded-full flex items-center shadow-lg">
              <span className="truncate">{releaseYear}</span>
            </div>

            <button
              onClick={toggleFavorite}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 
                         bg-black/70 dark:bg-black/70 text-white p-2 sm:p-3 
                         rounded-full transition-colors hover:text-red-500 
                         backdrop-blur-sm border border-white/20 opacity-0 group-hover:opacity-100"
              title={isFavorited ? "Remove Favorite" : "Add Favorite"}
            >
              <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="mt-3 sm:mt-4 px-1 sm:px-1.5 pb-2 sm:pb-3 pt-1 sm:pt-2 flex flex-col flex-grow">
            <div className="flex justify-between items-start">
              <h3
                className="text-base sm:text-lg font-bold text-gray-900 dark:text-white line-clamp-2 leading-tight pr-2 transition-colors group-hover:text-primary"
                title={movie.title}
              >
                {movie.title}
              </h3>
              <span className="text-sm sm:text-lg font-extrabold text-cyan-600 dark:text-cyan-400 flex-shrink-0 ml-1">
                {movie.rating.toFixed(1)}
              </span>
            </div>

            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 flex items-center space-x-2">
              <RatingDisplay rating={movie.rating} />
              <span className="text-xs text-muted-foreground">({movie.reviewCount} Reviews)</span>
            </div>

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

      {/* MODAL / DETAIL (AnimatePresence) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={`fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 sm:p-6 ${
              isFullscreen ? "p-0" : ""
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            aria-modal="true"
            role="dialog"
          >
            <motion.div
              ref={modalRef}
              tabIndex={-1}
              className={`relative bg-black w-full overflow-y-auto rounded shadow border border-gray-800 ${
                isFullscreen ? "max-w-none max-h-none h-full rounded-none" : "max-w-6xl max-h-[90vh]"
              }`}
              initial={{ scale: 0.95, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 40 }}
              transition={{ damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top bar */}
              <div className="absolute top-0 left-0 right-0 z-20 flex justify-between items-center p-4 bg-gradient-to-b from-black/80 to-transparent">
                <div className="flex items-center space-x-4">
                  <span className="text-white text-sm">
                    {index + 1} / {total}
                  </span>
                  <span className="text-gray-400 text-sm">Use ← → to navigate</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      // share stub
                      try {
                        if (navigator.share) {
                          navigator.share({
                            title: movie.title,
                            text: movie.plotSummary,
                            url: typeof window !== "undefined" ? window.location.href : movieLink,
                          });
                        } else {
                          // fallback: copy link
                          navigator.clipboard?.writeText(typeof window !== "undefined" ? window.location.href : movieLink);
                          alert("Link copied to clipboard");
                        }
                      } catch {
                        // ignore
                      }
                    }}
                    className="w-10 h-10 rounded bg-gray-800/80 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors duration-300"
                    title="Share (S)"
                  >
                    <Share2 size={16} />
                  </button>
                  <button
                    onClick={toggleFullscreen}
                    className="w-10 h-10 rounded bg-gray-800/80 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors duration-300"
                    title="Fullscreen (F)"
                  >
                    {isFullscreen ? <Minimize size={16} /> : <Expand size={16} />}
                  </button>
                  <button
                    onClick={closeModal}
                    className="w-10 h-10 rounded bg-gray-800/80 flex items-center justify-center text-white hover:bg-gray-500 transition-colors duration-300"
                    title="Close (Esc)"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Prev/Next */}
              {total > 1 && onNavigate && (
                <>
                  <button
                    onClick={() => onNavigate("prev")}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 w-12 h-12 rounded bg-black/60 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors duration-300"
                    title="Previous (←)"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={() => onNavigate("next")}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 w-12 h-12 rounded bg-black/60 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors duration-300"
                    title="Next (→)"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}

              {/* Media area */}
              <div className={`relative bg-black ${isFullscreen ? "h-full" : "aspect-video"}`}>
                {isPlaying && embedUrl ? (
                  <iframe
                    src={embedUrl}
                    className="w-full h-full"
                    title={movie.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <>
                    <img
                      src={movie.posterUrl || posterFallback}
                      alt={movie.title}
                      className="w-full h-full object-cover"
                    />

                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.button
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded bg-white flex items-center justify-center"
                        whileHover={{ scale: 1.06 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={handlePlayClick}
                        title="Play (Space)"
                      >
                        <Play className="text-black ml-1" size={24} />
                      </motion.button>
                    </div>
                  </>
                )}
              </div>

              {/* Details */}
              {!isFullscreen && (
                <motion.div
                  className="p-6 sm:p-8 md:p-10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 text-white">
                    {movie.title}
                  </h2>
                  <p className="text-gray-300 text-sm uppercase tracking-widest mb-4">
                    {movie.genre?.join(" • ")}
                  </p>
                  <p className="text-gray-200 mb-8 text-base sm:text-lg leading-relaxed">
                    {movie.plotSummary}
                  </p>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-white font-semibold mb-4 text-lg">Project Details</h3>
                      <ul className="text-gray-200 space-y-3">
                        <li>
                          <span className="font-semibold">Director:</span> {movie.director ?? "—"}
                        </li>
                        <li>
                          <span className="font-semibold">Year:</span> {releaseYear}
                        </li>
                        <li>
                          <span className="font-semibold">Runtime:</span> {movie.runtime} min
                        </li>
                        <li>
                          <span className="font-semibold">Rating:</span> {movie.rating.toFixed(1)} (
                          {movie.reviewCount} reviews)
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-white font-semibold mb-4 text-lg">Technical Specs</h3>
                      <ul className="text-gray-200 space-y-3">
                        <li>
                          <span className="font-semibold">Format:</span> Digital
                        </li>
                        <li>
                          <span className="font-semibold">Aspect Ratio:</span> 16:9
                        </li>
                        <li>
                          <span className="font-semibold">Language:</span> English
                        </li>
                        <li>
                          <span className="font-semibold">Location:</span> {movie.year ?? "—"}
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-8 flex items-center space-x-3">
                    <Link href={movieLink} className="inline-block">
                      <a
                        // Next.js <Link> does not accept className on children when using <a> inside
                        // We'll just use an anchor element
                        href={movieLink}
                        className="inline-flex items-center px-4 py-2 rounded bg-primary text-white font-semibold hover:opacity-90 transition"
                      >
                        View Page
                      </a>
                    </Link>

                    <button
                      onClick={() => {
                        // Example: toggle favorite from modal
                        toggleFavorite();
                      }}
                      className="inline-flex items-center px-3 py-2 rounded bg-gray-800 text-white hover:bg-gray-700 transition"
                    >
                      <Heart className="mr-2" /> {isFavorited ? "Unfavorite" : "Add Favorite"}
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
