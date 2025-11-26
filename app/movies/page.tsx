"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence, useInView, Variants, Transition } from 'framer-motion';
import { Play, X, ChevronLeft, ChevronRight, Expand, Minimize, Share2, Search, XCircle, Heart, Star, Clock } from 'lucide-react';

// --- Redesigned Data Structure (IMovie) ---
interface IMovie {
  id: number;
  title: string;
  releaseDate: Date;
  genre: string[];
  runtime: number; // in minutes
  plotSummary: string;
  posterUrl: string; // URL to a movie poster image
  trailerUrl: string;
  rating: number; // Calculated average rating (e.g., 0.0 - 5.0)
  reviewCount: number; // Number of reviews
}

interface Category {
  id: number;
  name: string;
}

interface AnimationVariants extends Variants {
  hidden: {
    opacity: number;
    y?: number;
    scale?: number;
    width?: number | string;
  };
  visible: {
    opacity: number;
    y?: number;
    scale?: number;
    width?: number | string;
    transition: Transition;
  };
}

// --- Data Redesign (Mapping old Project to new IMovie structure) ---
const categories: Category[] = [
  { id: 1, name: 'Action' },
  { id: 2, name: 'Comedy' },
  { id: 3, name: 'Thriller' },
  { id: 4, name: 'Drama' },
];

const movieData: IMovie[] = [
  {
    id: 1,
    title: "The Silent Code",
    releaseDate: new Date('2023-10-26'),
    genre: ["Thriller", "Action"],
    runtime: 145,
    plotSummary: "A brilliant cryptographer must race against time to decode a message that threatens global security.",
    posterUrl: "https://images.unsplash.com/photo-1542204165-21d1b5a59663?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
    trailerUrl: "https://www.youtube.com/embed/EngW7tLk6R8?si=JqVwUbeK03kWJPcE",
    rating: 4.2,
    reviewCount: 3400
  },
  {
    id: 2,
    title: "Neon City Lights",
    releaseDate: new Date('2024-03-15'),
    genre: ["Sci-Fi", "Drama"],
    runtime: 98,
    plotSummary: "In a futuristic megalopolis, two lonely souls find connection amid the blinding neon lights.",
    posterUrl: "https://images.unsplash.com/photo-1518331535741-dd8250073289?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
    trailerUrl: "https://www.youtube.com/embed/D0UnqGm_miA?si=0f0PwzfJNJ-CWQpq",
    rating: 3.8,
    reviewCount: 1200
  },
  {
    id: 3,
    title: "The Grand Expedition",
    releaseDate: new Date('2023-07-01'),
    genre: ["Adventure", "Documentary"],
    runtime: 180,
    plotSummary: "A stunning chronicle of the journey across the world's most remote mountain ranges.",
    posterUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop",
    trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    rating: 4.9,
    reviewCount: 9800
  },
  {
    id: 4,
    title: "Heartbeat of the Earth",
    releaseDate: new Date('2024-01-20'),
    genre: ["Drama", "Romance"],
    runtime: 105,
    plotSummary: "A story of star-crossed lovers set against the backdrop of a changing global climate.",
    posterUrl: "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=400&h=600&fit=crop",
    trailerUrl: "https://www.youtube.com/embed/u_sIfs7Yom4?si=MOYOivOMl5mAc-wk",
    rating: 4.5,
    reviewCount: 5200
  },
  {
    id: 5,
    title: 'The Wedding Crashers',
    releaseDate: new Date('2022-05-10'),
    genre: ['Comedy', 'Romance'],
    runtime: 110,
    plotSummary: 'Two friends sneak into weddings to meet women, until one of them falls for a bridesmaid.',
    posterUrl: 'https://images.unsplash.com/photo-1587902035650-25272a275464?w=400&h=600&fit=crop',
    trailerUrl: 'https://www.youtube.com/embed/rkpzYNB6xks?si=0ukSpD6me3CYdRiY',
    rating: 4.0,
    reviewCount: 2100,
  },
];

// Helper to render lucide-react Star icons based on rating (0-5 scale)
const RatingDisplay = ({ rating }: { rating: number }) => {
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

// --- Custom Hook for Scroll Animations ---
const useScrollAnimation = () => {
  const containerAnimation: AnimationVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemAnimation: AnimationVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut' as const,
      },
    },
  };

  return { containerAnimation, itemAnimation };
};

// --- Movie Card Component (Refactored) ---
const MovieCard: React.FC<{ movie: IMovie, openProject: (movie: IMovie) => void }> = ({ movie, openProject }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const cardHoverAnimation = {
    scale: 1.05,
    y: -5,
    boxShadow: "0 10px 20px rgba(0, 0, 0, 0.4)",
    transition: { stiffness: 300, damping: 20 }
  };

  const itemAnimation: AnimationVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut' as const,
      },
    },
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent modal from opening
    e.preventDefault(); // Prevent navigation
    setIsFavorite(prev => !prev);
    // Add real favorite logic here
  };

  const handleError = () => {
    setImageError(true);
  };

  const releaseYear = new Date(movie.releaseDate).getFullYear();

  return (
    <motion.div
      layout
      variants={itemAnimation}
      className="relative group cursor-pointer rounded-xl overflow-hidden aspect-[2/3] bg-gray-800 border border-gray-700 shadow-xl"
      onClick={() => openProject(movie)}
      whileHover={cardHoverAnimation}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.4 }}
    >
      <div className="w-full h-full">
        {!imageError ? (
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            onError={handleError}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gray-900 flex items-center justify-center">
            <span className="text-gray-400 text-sm font-medium">Poster N/A</span>
          </div>
        )}

        {/* Overlay Content */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-4 sm:p-5">
          <h3 className="text-lg sm:text-xl font-bold text-white mb-1 line-clamp-2">
            {movie.title} ({releaseYear})
          </h3>
          <div className="flex items-center space-x-2 text-gray-300 text-sm mb-3">
             <RatingDisplay rating={movie.rating} />
             <span className="text-xs text-yellow-400 font-bold">{movie.rating.toFixed(1)}</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center shadow-lg hover:bg-white transition-colors duration-300">
              <Play className="text-white ml-1 w-5 h-5 group-hover:text-black" />
            </div>
            <span className="text-white text-sm font-medium">Watch Trailer</span>
          </div>
        </div>
      </div>
      
      {/* Top Badges and Heart Button */}
      <div className="absolute top-3 right-3 z-10">
        <motion.button
          onClick={handleFavoriteClick}
          className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white border border-white/20 hover:bg-red-500 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Heart 
            className={`w-4 h-4 transition-colors ${isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-300 fill-gray-300/20'}`} 
          />
        </motion.button>
      </div>

      <div className="absolute top-3 left-3 px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-xs text-white uppercase tracking-wider font-semibold">
        {movie.genre[0] || 'Unknown'}
      </div>
    </motion.div>
  );
}

// --- Main Gallery Component ---
const MovieGallery: React.FC = () => {
  const [selectedMovie, setSelectedMovie] = useState<IMovie | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [category, setCategory] = useState<string>('all');
  const [currentMovieIndex, setCurrentMovieIndex] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isSearchActive, setIsSearchActive] = useState<boolean>(false);

  const ref = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const { containerAnimation, itemAnimation } = useScrollAnimation();

  const categoryOptions = ['all', ...Array.from(new Set(movieData.flatMap(m => m.genre))).map(g => g.toLowerCase())];

  const filteredMovies = useMemo(() => {
    return movieData.filter(movie => {
      const matchesCategory = category === 'all' || movie.genre.map(g => g.toLowerCase()).includes(category);
      const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            movie.plotSummary.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [category, searchTerm]);

  const openMovie = useCallback((movie: IMovie) => {
    const movieIndex = filteredMovies.findIndex(p => p.id === movie.id);
    setCurrentMovieIndex(movieIndex);
    setSelectedMovie(movie);
    setIsPlaying(false);
    document.body.style.overflow = 'hidden';
  }, [filteredMovies]);

  const closeMovie = useCallback(() => {
    setSelectedMovie(null);
    setIsPlaying(false);
    setIsFullscreen(false);
    document.body.style.overflow = 'auto';
  }, []);

  const navigateMovie = useCallback((direction: 'next' | 'prev') => {
    const newIndex = direction === 'next'
      ? (currentMovieIndex + 1) % filteredMovies.length
      : (currentMovieIndex - 1 + filteredMovies.length) % filteredMovies.length;

    setCurrentMovieIndex(newIndex);
    setSelectedMovie(filteredMovies[newIndex]);
    setIsPlaying(false);
  }, [currentMovieIndex, filteredMovies]);

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlaying(true);
  };

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(prev => !prev);
  }, []);

  const handleShare = useCallback(async () => {
    if (navigator.share && selectedMovie) {
      try {
        await navigator.share({
          title: selectedMovie.title,
          text: selectedMovie.plotSummary,
          url: window.location.href // Use a dedicated URL in a real app
        });
      } catch {
         // Fallback: Copy URL to clipboard
         navigator.clipboard.writeText(window.location.href);
      }
    }
  }, [selectedMovie]);

  const getEmbedUrl = (url: string): string => {
    if (!url.includes('autoplay')) {
      return url + (url.includes('?') ? '&' : '?') + 'autoplay=1&rel=0';
    }
    return url;
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedMovie) {
        if (e.key === '/' && !isSearchActive) {
          e.preventDefault();
          setIsSearchActive(true);
          setTimeout(() => searchInputRef.current?.focus(), 100);
        }
        return;
      }
      switch (e.key) {
        case 'Escape':
          closeMovie();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          navigateMovie('prev');
          break;
        case 'ArrowRight':
          e.preventDefault();
          navigateMovie('next');
          break;
        case ' ':
          e.preventDefault();
          if (!isPlaying) {
            setIsPlaying(true);
          }
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 's':
        case 'S':
          e.preventDefault();
          handleShare();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedMovie, isPlaying, navigateMovie, closeMovie, handleShare, toggleFullscreen, isSearchActive]);

  const toggleSearch = () => {
    setIsSearchActive(!isSearchActive);
    if (!isSearchActive) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    } else {
      setSearchTerm('');
    }
  };

  const searchVariants: AnimationVariants = {
    hidden: { width: 0, opacity: 0 },
    visible: {
      width: "100%",
      opacity: 1,
      transition: {
        stiffness: 300,
        damping: 25
      }
    }
  };

  const buttonHoverAnimation = {
    scale: 1.05,
    transition: {
      stiffness: 400,
      damping: 10
    }
  };


  return (
    <section id="movie-gallery" className="py-12 sm:py-16 md:py-20 bg-black min-h-screen relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          ref={ref}
          variants={containerAnimation}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center mb-12 sm:mb-16"
        >
          <motion.h2
            variants={itemAnimation}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 text-white tracking-tight"
          >
            Stream the Latest Releases
          </motion.h2>
          <motion.div
            variants={itemAnimation}
            className="w-24 h-1 bg-red-600 mx-auto mb-6"
          />
          <motion.p
            variants={itemAnimation}
            className="text-gray-300 max-w-3xl mx-auto text-lg md:text-xl leading-relaxed"
          >
            Explore a curated selection of movies showcasing the best of modern cinema.
            <span className="block text-sm text-gray-400 mt-2">Press &quot;/&quot; to search or use arrow keys to navigate the modal</span>
          </motion.p>
        </motion.div>

        {/* Filter and Search Bar */}
        <motion.div
          variants={containerAnimation}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mb-12 sm:mb-16 flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <div className="flex flex-wrap justify-center md:justify-start gap-3 sm:gap-4 order-2 md:order-1">
            {categoryOptions.map((cat) => (
              <motion.button
                key={cat}
                variants={itemAnimation}
                className={`px-4 sm:px-6 py-2 rounded-full uppercase tracking-widest text-xs font-semibold transition-all duration-300 ${
                  category === cat
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/50'
                    : 'border border-gray-600 text-gray-300 hover:border-red-600 hover:text-white'
                } focus:outline-none`}
                onClick={() => setCategory(cat)}
                whileHover={buttonHoverAnimation}
                whileTap={{ scale: 0.95 }}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </motion.button>
            ))}
          </div>

          {/* Search Input */}
          <motion.div className="relative w-full max-w-md order-1 md:order-2">
            <div className="relative flex items-center">
              <motion.button
                onClick={toggleSearch}
                className={`flex items-center justify-center h-10 px-4 py-2 bg-black border border-gray-700 rounded-full text-gray-300 hover:bg-gray-800 transition-all duration-300 ${
                  isSearchActive ? 'opacity-0 pointer-events-none absolute' : 'w-40'
                }`}
                whileHover={buttonHoverAnimation}
                whileTap={{ scale: 0.95 }}
              >
                <Search size={20} />
                {!isSearchActive && <span className='ml-2'>Search</span>}
              </motion.button>
              <AnimatePresence>
                {isSearchActive && (
                  <motion.div
                    variants={searchVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="absolute inset-0 flex items-center"
                  >
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onBlur={() => !searchTerm && setIsSearchActive(false)}
                      placeholder="Search movie titles or plot summaries..."
                      className="w-full h-10 px-4 pl-10 bg-gray-900 border border-red-600/50 rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-red-600 transition-all duration-300"
                    />
                    <Search size={20} className="absolute left-3 text-red-600" />
                    {searchTerm && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                          setSearchTerm('');
                          searchInputRef.current?.focus();
                        }}
                        className="absolute right-3 text-gray-400 hover:text-white"
                      >
                        <XCircle size={20} />
                      </motion.button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>

        {/* Movie Grid */}
        <motion.div
          layout
          variants={containerAnimation}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredMovies.map((movie) => (
              <MovieCard 
                key={movie.id} 
                movie={movie} 
                openProject={openMovie} 
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* No Results Message */}
        {filteredMovies.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <p className="text-gray-400 text-lg">No movies found matching your criteria. 🎥</p>
            <motion.button
              onClick={() => { setCategory('all'); setSearchTerm(''); }}
              className="mt-4 px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
              whileHover={buttonHoverAnimation}
              whileTap={{ scale: 0.95 }}
            >
              Clear Filters
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* --- Movie Trailer Modal (Retaining Original Structure/Style) --- */}
      <AnimatePresence>
        {selectedMovie && (
          <motion.div
            className={`fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 sm:p-6 ${isFullscreen ? 'p-0' : ''}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeMovie}
          >
            <motion.div
              // Removed modalRef as it's not strictly necessary for this refactoring
              className={`relative bg-black w-full overflow-y-auto rounded shadow border border-gray-800 ${
                isFullscreen ? 'max-w-none max-h-none h-full rounded-none' : 'max-w-6xl max-h-[90vh]'
              }`}
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              transition={{ damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Control Bar */}
              <div className="absolute top-0 left-0 right-0 z-20 flex justify-between items-center p-4 bg-gradient-to-b from-black/80 to-transparent">
                <div className="flex items-center space-x-4">
                  <span className="text-white text-sm">
                    {currentMovieIndex + 1} / {filteredMovies.length}
                  </span>
                  <span className="text-gray-400 text-sm hidden sm:inline">Use ← → to navigate</span>
                </div>
                <div className="flex items-center space-x-2">
                  <motion.button
                    onClick={handleShare}
                    className="w-10 h-10 rounded bg-gray-800/80 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors duration-300"
                    title="Share (S)"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Share2 size={16} />
                  </motion.button>
                  <motion.button
                    onClick={toggleFullscreen}
                    className="w-10 h-10 rounded bg-gray-800/80 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors duration-300"
                    title="Fullscreen (F)"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {isFullscreen ? <Minimize size={16} /> : <Expand size={16} />}
                  </motion.button>
                  <motion.button
                    onClick={closeMovie}
                    className="w-10 h-10 rounded bg-gray-800/80 flex items-center justify-center text-white hover:bg-gray-500 transition-colors duration-300"
                    title="Close (Esc)"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X size={16} />
                  </motion.button>
                </div>
              </div>

              {/* Navigation Arrows */}
              {filteredMovies.length > 1 && (
                <>
                  <motion.button
                    onClick={() => navigateMovie('prev')}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors duration-300"
                    title="Previous (←)"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <ChevronLeft size={20} />
                  </motion.button>
                  <motion.button
                    onClick={() => navigateMovie('next')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors duration-300"
                    title="Next (→)"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <ChevronRight size={20} />
                  </motion.button>
                </>
              )}

              {/* Video Player */}
              <div className={`relative bg-black ${isFullscreen ? 'h-full' : 'aspect-video'}`}>
                {isPlaying ? (
                  <iframe
                    key={selectedMovie.id} // Key ensures iframe re-renders on navigation
                    src={getEmbedUrl(selectedMovie.trailerUrl)}
                    className="w-full h-full"
                    title={selectedMovie.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <>
                    <img
                      src={selectedMovie.posterUrl}
                      alt={selectedMovie.title}
                      className="w-full h-full object-cover opacity-80"
                    />
                    
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.button
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-red-600 flex items-center justify-center shadow-2xl"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handlePlayClick}
                        title="Play (Space)"
                      >
                        <Play className="text-white ml-1" size={24} />
                      </motion.button>
                    </div>
                  </>
                )}
              </div>

              {/* Movie Details */}
              {!isFullscreen && (
                <motion.div
                  className="p-6 sm:p-8 md:p-10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 text-white">
                    {selectedMovie.title} ({new Date(selectedMovie.releaseDate).getFullYear()})
                  </h2>
                  <div className="flex flex-wrap items-center space-x-4 text-gray-300 text-sm uppercase tracking-widest mb-4">
                    <p className="font-semibold text-yellow-400 flex items-center space-x-1"><Star size={16} className="fill-yellow-400 text-yellow-400" /> <span>{selectedMovie.rating.toFixed(1)} / 5.0</span></p>
                    <p className="font-semibold text-red-500">{selectedMovie.genre.join(' / ')}</p>
                    <p className="font-semibold flex items-center space-x-1"><Clock size={16} /> <span>{selectedMovie.runtime} min</span></p>
                  </div>
                  <p className="text-gray-200 mb-8 text-base sm:text-lg leading-relaxed">
                    {selectedMovie.plotSummary}
                  </p>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-white font-semibold mb-4 text-lg border-b border-gray-700/50 pb-2">Movie Details</h3>
                      <ul className="text-gray-200 space-y-3">
                        <li><span className="font-semibold text-gray-400">Release Date:</span> {new Date(selectedMovie.releaseDate).toLocaleDateString()}</li>
                        <li><span className="font-semibold text-gray-400">Runtime:</span> {selectedMovie.runtime} minutes</li>
                        <li><span className="font-semibold text-gray-400">Reviews:</span> {selectedMovie.reviewCount.toLocaleString()}</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-4 text-lg border-b border-gray-700/50 pb-2">Technical Specs (Placeholder)</h3>
                      <ul className="text-gray-200 space-y-3">
                        {/* Technical details fields are removed as they are irrelevant to the new IMovie schema */}
                        <li><span className="font-semibold text-gray-400">Director:</span> TBD</li>
                        <li><span className="font-semibold text-gray-400">Aspect Ratio:</span> 2.39:1 (Cinemascope)</li>
                        <li><span className="font-semibold text-gray-400">Format:</span> 4K Digital</li>
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default MovieGallery;