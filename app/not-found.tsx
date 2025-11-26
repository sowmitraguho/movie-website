
'use client'
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function UnderConstructionPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white p-4">
      <h1 className="text-5xl font-extrabold mb-4">🚧 Page Under Construction</h1>
      <p className="text-lg sm:text-xl mb-8 text-center max-w-lg">
        Sorry! This page is currently being built. Check back later or go back to the home page.
      </p>
      <Link href="/">
        <Button className="bg-white text-purple-600 hover:bg-gray-100 hover:text-purple-700">
          Go Home
        </Button>
      </Link>
    </div>
  );
}
