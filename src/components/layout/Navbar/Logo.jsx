import { Link } from "react-router-dom";
import { Plane } from "lucide-react";

export default function Logo() {
    return (
        <Link to="/" className="flex items-center gap-2 group">
            <div className="p-1.5 rounded-lg shadow-lg transition-transform group-hover:scale-105" style={{ backgroundColor: "var(--brand-color)" }}>
                <Plane className="text-white w-5 h-5" />
            </div>
            <span className="text-xl sm:text-2xl font-black tracking-tighter italic" style={{ color: "var(--brand-color)" }}>
                JETTURA
            </span>
        </Link>
    );
}
