import { NextResponse } from "next/server";
import {getMovies, addMovie} from "@/lib/data";
// GET: Fetch all movies
export async function GET() {
  const movies = getMovies();
  return NextResponse.json({ success: true, data: movies }, { status: 200 });
}

// POST: Add a new movie
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newMovie = {
      id: Date.now(),        // auto ID
      ...body,               // movie fields from frontend
      createdAt: new Date(),
    };
    addMovie(newMovie);

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
