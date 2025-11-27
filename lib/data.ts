import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "movies.json");

// Read JSON file
function readMovies() {
  try {
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

// Write to JSON file
function writeMovies(movies: any[]) {
  fs.writeFileSync(filePath, JSON.stringify(movies, null, 2));
}

// GET: Fetch all movies
export async function getMovies(): Promise<any[]> {
  const movies = readMovies();
  return movies;
}

// POST: Add a new movie
export async function addMovie(movie: any) {
  const movies = readMovies();
  movies.push(movie);
  writeMovies(movies);
}
