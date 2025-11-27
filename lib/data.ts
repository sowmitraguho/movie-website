import { IMovie } from "@/models/Movie";
const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

export async function getMovies(): Promise<IMovie[]> {
    try {
        const res = await fetch(`${baseURL}/api/Movies`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await res.json();
            console.log(data);
        if (!data || !data.data) return [];
        return data.data as IMovie[];
    } catch (error) {
        console.error("Error fetching movies:", error);
        return [];
    }
}