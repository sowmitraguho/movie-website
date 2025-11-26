"use client";

import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Heart, Play, X } from "lucide-react";

interface IMovie {
  _id: string;
  title: string;
  releaseDate: string; // ISO string
  genre: string[];
  runtime: number;
  plotSummary: string;
  posterUrl: string;
  trailerUrl: string;
  rating: number;
  reviewCount: number;
}

interface MovieCardProps {
  movie: IMovie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <Card className="relative group bg-gray-900 text-white rounded-xl overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300">
      
      {/* Poster & Heart Icon */}
      <div className="relative">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="w-full h-[400px] object-cover"
        />

        {/* Heart Icon */}
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setIsFavorite(!isFavorite)}
          className={`absolute top-2 right-2 rounded-full p-2 ${
            isFavorite ? "text-red-500" : "text-white"
          }`}
        >
          <Heart />
        </Button>

        {/* Play Button on Hover */}
        {movie.trailerUrl && (
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="secondary"
                className="absolute inset-0 m-auto w-16 h-16 flex items-center justify-center bg-white text-gray-900 rounded-full opacity-0 group-hover:opacity-90 transition-opacity"
              >
                <Play className="w-8 h-8" />
              </Button>
            </DialogTrigger>

            <DialogContent className="w-full max-w-3xl aspect-video bg-black p-0 rounded-lg overflow-hidden">
              <div className="relative w-full h-0" style={{ paddingBottom: "56.25%" }}>
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src={movie.trailerUrl}
                  title={movie.title}
                  allow="autoplay; fullscreen"
                  allowFullScreen
                />
              </div>
              <DialogClose className="absolute top-2 right-2 p-2 rounded-full bg-white text-black">
                <X />
              </DialogClose>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Card Content */}
      <CardContent className="p-4">
        <h3 className="text-lg font-bold mb-1">{movie.title}</h3>

        <div className="flex flex-wrap gap-2 mb-2">
          {movie.genre.map((g) => (
            <Badge key={g} variant="secondary" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              {g}
            </Badge>
          ))}
        </div>

        <p className="text-sm line-clamp-3">{movie.plotSummary}</p>
      </CardContent>

      {/* Card Footer */}
      <CardFooter className="flex justify-between items-center px-4 pt-0">
        <span className="text-yellow-400 font-semibold">{movie.rating.toFixed(1)}⭐</span>
        <span className="text-gray-300 text-sm">{movie.reviewCount} reviews</span>
      </CardFooter>
    </Card>
  );
}