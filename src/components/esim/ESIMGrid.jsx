import { useState, useEffect } from "react";
import ESIMCard from "./ESIMCard";
import { esimApi } from "../../services/esimApi";
import { Loader2 } from "lucide-react";

export default function ESIMCardGrid({ searchTerm, onBook, isBookingGlobal }) {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      setLoading(true);
      try {
        const results = await esimApi.searchPackages(searchTerm);
        setPackages(results);
      } catch (err) {
        console.error("Error fetching eSIM packages:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, [searchTerm]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="animate-spin text-[var(--brand-color)]" size={40} />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {packages.map((esim) => (
        <ESIMCard
          key={esim.id}
          esim={esim}
          onBook={() => onBook(esim)}
          isBooking={isBookingGlobal}
        />
      ))}
    </div>
  );
}
