import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Movie from '@/models/Movie';

export async function GET() {
  await dbConnect();
  try {
    const movies = await Movie.find({}).limit(20).sort({ releaseDate: -1 });
    return NextResponse.json(movies, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Failed to fetch movies' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  await dbConnect();
  try {
    const body = await request.json();
    const movie = await Movie.create(body);
    return NextResponse.json(movie, { status: 201 });
  } catch (error) {
    // Handle validation errors or duplicate key errors
    return NextResponse.json({ message: 'Failed to create movie' }, { status: 400 });
  }
}
