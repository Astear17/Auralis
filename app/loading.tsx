import { LoadingSkeleton } from "@/components/ui/loading-skeleton";

export default function Loading() {
  return (
    <div className="space-y-7">
      <LoadingSkeleton className="h-72 w-full rounded-[2rem]" />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <LoadingSkeleton key={index} className="aspect-square" />
        ))}
      </div>
    </div>
  );
}
