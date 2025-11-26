'use client'
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Info, Star, Clock, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { IMovie } from '@/models/Movie';

async function getTrendingMovies(): Promise<IMovie[]> {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/Movies`);
        const data = await res.json();
        if (!data || !data.data) return [];
        return data.data as IMovie[];
    } catch (error) {
        console.error("Error fetching movies:", error);
        return [];
    }
}
function HeroSection(): React.JSX.Element {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [featuredMovies, setFeaturedMovies] = useState<IMovie[]>([]);
  
  useEffect(() => {
    getTrendingMovies().then((movies) => {
      setFeaturedMovies(movies.slice(0, 3));
    });
  }, []);
  
  const currentMovie = featuredMovies[currentIndex];
  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 5000);

    return () => clearInterval(timer);
  }, [currentIndex]);

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % featuredMovies.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + featuredMovies.length) % featuredMovies.length);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="relative w-full h-[600px] md:h-[700px] lg:h-[800px] overflow-hidden">
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.4 }
          }}
          className="absolute inset-0"
        >
          {/* Background Image with Overlay */}
          <div className="absolute inset-0">
            <img
              src={currentMovie.posterUrl}
              alt={currentMovie.title}
              className="w-full h-full object-cover"
            />
            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

            {/* Animated Gradient Glow */}
            <motion.div
              className="absolute inset-0 opacity-30"
              animate={{
                background: [
                  "radial-gradient(circle at 20% 50%, rgba(147,51,234,0.3) 0%, transparent 50%)",
                  "radial-gradient(circle at 80% 50%, rgba(239,68,68,0.3) 0%, transparent 50%)",
                  "radial-gradient(circle at 50% 80%, rgba(59,130,246,0.3) 0%, transparent 50%)",
                  "radial-gradient(circle at 20% 50%, rgba(147,51,234,0.3) 0%, transparent 50%)",
                ]
              }}
              transition={{
                duration: 1000,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          </div>

          {/* Content */}
          <div className="relative h-full flex items-center">
            <div className="container mx-auto px-4 md:px-6 lg:px-8">
              <motion.div
                className="max-w-2xl lg:max-w-3xl"
                
                initial="hidden"
                animate="visible"
              >
                {/* Badge */}
                <motion.div variants={itemVariants} className="mb-4">
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-600/90 backdrop-blur-sm text-white text-sm font-semibold shadow-lg">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    Featured Movie
                  </span>
                </motion.div>

                {/* Title */}
                <motion.h1
                  variants={itemVariants}
                  className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-4 md:mb-6 leading-tight"
                >
                  {currentMovie.title}
                </motion.h1>

                {/* Meta Info */}
                <motion.div
                  variants={itemVariants}
                  className="flex flex-wrap items-center gap-3 md:gap-4 mb-4 md:mb-6"
                >
                  <div className="flex items-center gap-1 text-yellow-400">
                    <Star className="h-5 w-5 fill-current" />
                    <span className="text-white font-semibold text-lg">{currentMovie.rating}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <Calendar className="h-4 w-4" />
                    <span>{currentMovie.releaseDate.toString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <Clock className="h-4 w-4" />
                    <span>{currentMovie.runtime}</span>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                    <span className="text-white text-sm font-medium">{currentMovie.genre}</span>
                  </div>
                </motion.div>

                {/* Description */}
                <motion.p
                  variants={itemVariants}
                  className="text-gray-200 text-base md:text-lg lg:text-xl mb-6 md:mb-8 leading-relaxed max-w-xl"
                >
                  {currentMovie.plotSummary}
                </motion.p>

                {/* Buttons */}
                <motion.div
                  variants={itemVariants}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button className="w-full sm:w-auto bg-[#0f172a] hover:bg-[#0f172a]/80 text-white px-8 py-6 rounded-xl text-lg font-semibold shadow-2xl flex items-center justify-center gap-3 group">
                      <Play className="h-6 w-6 fill-current group-hover:scale-110 transition-transform" />
                      Watch Now
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button className="w-full sm:w-auto bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-8 py-6 rounded-xl text-lg font-semibold border border-white/20 flex items-center justify-center gap-3 group">
                      <Info className="h-6 w-6 group-hover:scale-110 transition-transform" />
                      More Info
                    </Button>
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4 md:px-8 pointer-events-none z-10">
        <motion.button
          onClick={handlePrev}
          className="pointer-events-auto p-3 md:p-4 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm border border-white/20 text-white transition-all group"
          whileHover={{ scale: 1.1, x: -5 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronLeft className="h-6 w-6 md:h-8 md:w-8 group-hover:scale-110 transition-transform" />
        </motion.button>
        <motion.button
          onClick={handleNext}
          className="pointer-events-auto p-3 md:p-4 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm border border-white/20 text-white transition-all group"
          whileHover={{ scale: 1.1, x: 5 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronRight className="h-6 w-6 md:h-8 md:w-8 group-hover:scale-110 transition-transform" />
        </motion.button>
      </div>

      {/* Pagination Dots */}
      <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex gap-2 md:gap-3 z-10">
        {featuredMovies.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
            }}
            className="group relative"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            <div
              className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all ${index === currentIndex
                ? 'bg-white w-8 md:w-12'
                : 'bg-white/40 hover:bg-white/60'
                }`}
            />
          </motion.button>
        ))}
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />
    </div>
  );
}

export default HeroSection;