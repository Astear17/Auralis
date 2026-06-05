import Link from "next/link";
import { EmptyState } from "@/components/ui/empty-state";

export default function NotFound() {
  return (
    <EmptyState
      title="That music slipped away"
      description="The page or catalog item does not exist in this Auralis library."
      action={
        <Link
          href="/"
          className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-black"
        >
          Return home
        </Link>
      }
    />
  );
}
