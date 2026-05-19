import React from "react";
import { Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SearchButton({ onClick, loading, label, className = "" }) {
    return (
        <Button
            onClick={onClick}
            disabled={loading}
            className={`h-12 md:h-14 bg-[var(--brand-color)] hover:bg-opacity-90 text-white font-black italic uppercase search-button-text rounded-xl lg:rounded-2xl shadow-inner active:scale-95 transition-all flex items-center justify-center gap-2 md:gap-3 border-none ${className}`}
        >
            {loading ? (
                <Loader2 className="animate-spin" size={16} />
            ) : (
                <>
                    <Search className="w-4 h-4 md:w-5 md:h-5" strokeWidth={3} />
                    <span>{label}</span>
                </>
            )}
        </Button>
    );
}
