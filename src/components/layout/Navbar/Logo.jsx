"use client";
import Link from "next/link";
import { Plane } from "lucide-react";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 group">
      <div className="p-1 sm:p-1.5 rounded-lg shadow-lg transition-transform group-hover:scale-105" style={{ backgroundColor: "var(--brand-color)" }}>
        <Plane className="text-white w-4 h-4 sm:w-5 sm:h-5" />
      </div>
      <span className="text-[7px] sm:text-[8px] sm:text-[9px] sm:text-[10px] sm:text-xs sm:text-sm sm:text-base sm:text-lg sm:text-2xl font-black tracking-tighter italic" style={{ color: "var(--brand-color)" }}>
        JETTURA
      </span>
    </Link>
  );
}
