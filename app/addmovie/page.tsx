'use client'
import { Label } from '@radix-ui/react-menubar';
import axios from 'axios';
import { MailIcon } from 'lucide-react';
import React, { useState, useRef } from 'react';
import { toast } from 'sonner';


// Main Component with shadcn/ui styling
const AddMovie: React.FC = () => {
  const [form, setForm] = useState({
    title: '',
    releaseDate: '',
    genre: '',
    runtime: '',
    plotSummary: '',
    posterUrl: '',
    trailerUrl: '',
    rating: '',
    reviewCount: '',
  });

  const onSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    // Convert form values to correct types (important for MongoDB)
    const payload = {
      title: form.title,
      releaseDate: new Date(form.releaseDate),
      genre: form.genre.split(",").map((g) => g.trim()), // convert comma-separated -> array
      runtime: Number(form.runtime),
      plotSummary: form.plotSummary,
      posterUrl: form.posterUrl,
      trailerUrl: form.trailerUrl,
      rating: Number(form.rating),
      reviewCount: Number(form.reviewCount),
    };

    console.log("Submitting:", payload);

    const res = await axios.post("https://movie-website-server-ebon.vercel.app/api/movies", payload);

    if (res.status === 201) {
      // Optional: show toast here if you use sonner/shadcn toast
       toast.success("Movie added successfully!");
    }

    // Reset form
    setForm({
      title: "",
      releaseDate: "",
      genre: "",
      runtime: "",
      plotSummary: "",
      posterUrl: "",
      trailerUrl: "",
      rating: "",
      reviewCount: "",
    });

  } catch (err) {
    console.error("Movie submission error:", err);
    // toast.error("Failed to add movie");
  }
};

  return (
    <>
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-2xl relative">
          {/* Main Card with shadcn/ui styling */}
          <div
            className="relative bg-white dark:bg-black border border-border rounded-lg p-6 shadow-sm transition-all duration-200 hover:shadow-md"
          >
            {/* Header */}
            <div className="flex flex-col space-y-2 text-center mb-6">
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                Add Movie
              </h1>
              <p className="text-sm text-muted-foreground">
                Enter movie details below to add a movie
              </p>
            </div>

            <form className="space-y-4" onSubmit={onSubmit}>
              {/* Full Name Input */}
              <div className="space-y-2">
                <input
                  id="title"
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Title"
                  className='w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
                />
              </div>
              {/* Genre Input */}
              <div className="space-y-2">
                <input
                  id="genre"
                  type="text"
                  value={form.genre}
                  onChange={(e) => setForm({ ...form, genre: e.target.value })}
                  placeholder="Genre"
                  className='w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
                />
              </div>
              {/* Runtime Input */}
              <div className="space-y-2">
                <input
                  id="runtime"
                  type="text"
                  value={form.runtime}
                  onChange={(e) => setForm({ ...form, runtime: e.target.value })}
                  placeholder="Runtime"
                  className='w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
                />
              </div>
              {/* Plot Summary Input */}
              <div className="space-y-2">
                <input
                  id="plotSummary"
                  type="text"
                  value={form.plotSummary}
                  onChange={(e) => setForm({ ...form, plotSummary: e.target.value })}
                  placeholder="Plot Summary"
                  className='w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
                />
              </div>
              {/* Poster URL Input */}
              <div className="space-y-2">
                <input
                  id="posterUrl"
                  type="text"
                  value={form.posterUrl}
                  onChange={(e) => setForm({ ...form, posterUrl: e.target.value })}
                  placeholder="Poster URL"
                  className='w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
                />
              </div>
              {/* Trailer URL Input */}
              <div className="space-y-2">
                <input
                  id="trailerUrl"
                  type="text"
                  value={form.trailerUrl}
                  onChange={(e) => setForm({ ...form, trailerUrl: e.target.value })}
                  placeholder="Trailer URL"
                  className='w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
                />
              </div>
              {/* Rating Input */}
              <div className="space-y-2">
                <input
                  id="rating"
                  type="text"
                  value={form.rating}
                  onChange={(e) => setForm({ ...form, rating: e.target.value })}
                  placeholder="Rating"
                  className='w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
                />
              </div>
              {/* Review Count Input */}
              <div className="space-y-2">
                <input
                  id="reviewCount"
                  type="text"
                  value={form.reviewCount}
                  onChange={(e) => setForm({ ...form, reviewCount: e.target.value })}
                  placeholder="Review Count"
                  className='w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
                />
              </div>

              {/* Date Input */}
              <div className="space-y-2">
                <input
                  id="releaseDate"
                  type="date"
                  value={form.releaseDate}
                  onChange={(e) => setForm({ ...form, releaseDate: e.target.value })}
                  placeholder="Release Date"
                  className='w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
                />
              </div>

              

              {/* Submit Button */}
              <button
                type="submit"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
              >
                Add Movie
              </button>
            </form>
            
          </div>
        </div>
      </div>
    </>
  );
};

export default AddMovie;
