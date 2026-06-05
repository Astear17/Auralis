import type { Metadata } from "next";
import { LibraryExperience } from "@/components/library/library-experience";

export const metadata: Metadata = { title: "Library" };
export default function LibraryPage() {
  return (
    <div>
      <p className="text-xs font-semibold tracking-[0.2em] text-cyan-300 uppercase">
        Everything you love
      </p>
      <h1 className="mt-2 mb-7 text-4xl font-bold tracking-tight md:text-6xl">
        Your library
      </h1>
      <LibraryExperience />
    </div>
  );
}
