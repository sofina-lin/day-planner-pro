import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, MapPin, Plus } from "lucide-react";

interface SearchResult {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  category: string;
}

const mockResults: SearchResult[] = [
  { id: "s1", name: "Central Park", address: "Central Park, New York, NY", lat: 40.7829, lng: -73.9654, category: "Park" },
  { id: "s2", name: "MoMA", address: "11 W 53rd St, New York, NY", lat: 40.7614, lng: -73.9776, category: "Museum" },
  { id: "s3", name: "Times Square", address: "Manhattan, NY 10036", lat: 40.758, lng: -73.9855, category: "Landmark" },
  { id: "s4", name: "Grand Central Terminal", address: "89 E 42nd St, New York, NY", lat: 40.7527, lng: -73.9772, category: "Transit" },
  { id: "s5", name: "Brooklyn Bridge", address: "Brooklyn Bridge, New York, NY", lat: 40.7061, lng: -73.9969, category: "Landmark" },
  { id: "s6", name: "Chelsea Market", address: "75 9th Ave, New York, NY", lat: 40.7424, lng: -74.0061, category: "Food" },
  { id: "s7", name: "The High Line", address: "New York, NY 10011", lat: 40.748, lng: -74.0048, category: "Park" },
  { id: "s8", name: "Shake Shack", address: "Madison Square Park, New York, NY", lat: 40.7408, lng: -73.988, category: "Food" },
];

interface LocationSearchProps {
  onAddLocation: (result: { name: string; address: string; lat: number; lng: number }) => void;
}

const LocationSearch = ({ onAddLocation }: LocationSearchProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = query.trim()
    ? mockResults.filter(
        (r) =>
          r.name.toLowerCase().includes(query.toLowerCase()) ||
          r.address.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const handleAdd = (result: SearchResult) => {
    onAddLocation({ name: result.name, address: result.address, lat: result.lat, lng: result.lng });
    setQuery("");
    setIsOpen(false);
  };

  return (
    <>
      {/* Search trigger */}
      {!isOpen && (
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="absolute top-12 left-4 z-20 flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-card shadow-lg border border-border/50"
        >
          <Search className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Search places...</span>
        </motion.button>
      )}

      {/* Expanded search */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-12 left-4 right-4 z-20"
          >
            <div className="bg-card rounded-2xl shadow-xl border border-border/50 overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3">
                <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for a place to add..."
                  className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
                />
                <button onClick={() => { setIsOpen(false); setQuery(""); }} className="p-1 rounded-full hover:bg-muted">
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>

              {filtered.length > 0 && (
                <div className="border-t border-border max-h-64 overflow-y-auto">
                  {filtered.map((result) => (
                    <button
                      key={result.id}
                      onClick={() => handleAdd(result)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors text-left"
                    >
                      <div className="w-8 h-8 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-4 h-4 text-accent" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{result.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{result.address}</p>
                      </div>
                      <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-accent/10 text-accent text-xs font-medium flex-shrink-0">
                        <Plus className="w-3 h-3" />
                        Add
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {query.trim() && filtered.length === 0 && (
                <div className="border-t border-border px-4 py-6 text-center">
                  <p className="text-sm text-muted-foreground">No places found for "{query}"</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default LocationSearch;
