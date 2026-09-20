import Link from "next/link";
import { cn } from "@/lib/utils";

export function Brand({ light = false, className }: { light?: boolean; className?: string }) {
  return (
    <Link href="/" className={cn("inline-flex items-baseline font-black tracking-[-.05em]", light ? "text-white" : "text-forest", className)} aria-label="Saunders Group — Inicio">
      <span className="text-xl">Saunders</span>
      <span className="ml-1.5 text-xl text-coral">Group</span>
    </Link>
  );
}
