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
export async function GET() {
  const movies = readMovies();
  return NextResponse.json({ success: true, data: movies }, { status: 200 });
}

// POST: Add a new movie
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const movies = readMovies();

    const newMovie = {
      id: Date.now(),        // auto ID
      ...body,               // movie fields from frontend
      createdAt: new Date(),
    };

    movies.push(newMovie);
    writeMovies(movies);

    return NextResponse.json(
      { success: true, data: newMovie },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/movies ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Error writing data" },
      { status: 500 }
    );
  }
}
