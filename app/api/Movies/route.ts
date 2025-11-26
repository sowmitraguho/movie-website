import { dbConnect } from "@/lib/dbConnect";
import Movie from "@/models/Movie";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();

    const movies = await Movie.find({}).sort({ createdAt: -1 });

    return NextResponse.json(
      {
        success: true,
        count: movies.length,
        data: movies,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/Movies Error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  await dbConnect();

  const data = await req.json();
  const newMovie = await Movie.create(data);

  return Response.json(newMovie, { status: 201 });
}
