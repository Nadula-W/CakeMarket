import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { browseCakes } from "../services/api";
import ImageModal from "../components/ImageModal";
import { useCart } from "../context/CartContext";

const CATEGORY_OPTIONS = [
  "Wedding",
  "Birthday",
  "Cupcakes",
  "Vegan",
  "Gluten Free",
  "Macarons",
  "Customized",
];

const API_BASE = "http://localhost:5000"; // backend

function truncate(text = "", max = 90) {
  if (!text) return "";
  return text.length > max ? text.slice(0, max) + "..." : text;
}
function getImgSrc(imageUrl) {
  if (!imageUrl) return "";
  return imageUrl.startsWith("http") ? imageUrl : `${API_BASE}${imageUrl}`;
}

export default function Browse() {
  const { addToCart } = useCart();
  const [params, setParams] = useSearchParams();


  const [cakes, setCakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selected, setSelected] = useState(null);

  const category = params.get("category") || "";
  const sort = params.get("sort") || "newest";
  const district = params.get("district") || "";
  const q = params.get("q") || "";

  const queryObj = useMemo(() => {
    const obj = { sort };
    if (category) obj.category = category;
    if (district) obj.district = district;
    if (q) obj.q = q;
    return obj;
  }, [category, sort, district, q]);
  
  

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await browseCakes(queryObj);
        setCakes(res.data);
      } catch (e) {
        setError(e.response?.data?.message || "Failed to load cakes");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [queryObj]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(params);
    if (!value) next.delete(key);
    else next.set(key, value);
    setParams(next);
  };

  const closeModal = () => setSelected(null);

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-semibold text-neutral-900">Browse Cakes</h1>
        <p className="text-neutral-500 mt-1">
          {category ? `Category: ${category}` : "All categories"}
        </p>

        {/* Filters */}
        <div className="mt-6 bg-white border rounded-xl p-4 flex flex-col md:flex-row gap-3">
          <input
            value={q}
            onChange={(e) => updateParam("q", e.target.value)}
            placeholder="Search cakes..."
            className="h-11 px-3 rounded-lg border w-full md:w-1/3"
          />

          <select
            value={category}
            onChange={(e) => updateParam("category", e.target.value)}
            className="h-11 px-3 rounded-lg border w-full md:w-1/4 bg-white"
          >
            <option value="">All categories</option>
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <input
            value={district}
            onChange={(e) => updateParam("district", e.target.value)}
            placeholder="District (optional)"
            className="h-11 px-3 rounded-lg border w-full md:w-1/4"
          />

          <select
            value={sort}
            onChange={(e) => updateParam("sort", e.target.value)}
            className="h-11 px-3 rounded-lg border w-full md:w-1/4 bg-white"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="priceAsc">Price: Low → High</option>
            <option value="priceDesc">Price: High → Low</option>
          </select>
        </div>

        {/* Results */}
        {loading && <p className="mt-6 text-neutral-500">Loading...</p>}
        {error && <p className="mt-6 text-pink-600">{error}</p>}

        {!loading && !error && (
          <div className="mt-6">
            {cakes.length === 0 ? (
              <p className="text-neutral-500">No cakes found.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {cakes.map((c) => {
                  const src = getImgSrc(c.imageUrl);

                  return (
                    <div
                      key={c._id}
                      className="bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition"
                    >
                      <div className="h-44 bg-neutral-100">
                        {src ? (
                          <img
                            src={src}
                            alt={c.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-neutral-400">
                            No image
                          </div>
                        )}
                      </div>

                      <div className="p-4">
                        <p className="text-sm text-neutral-500">{c.category}</p>

                        <div className="mt-1">
                          <div className="flex items-start justify-between gap-3">
                            <h3 className="font-semibold text-neutral-900 leading-snug">
                              {c.name}
                            </h3>
                            <span className="shrink-0 font-semibold text-pink-600">
                              Rs {c.price}
                            </span>
                          </div>

                          <p className="text-sm text-neutral-700 mt-1">
                            {c.bakerId?.bakerProfile?.bakeryName || c.bakerId?.name || "Bakery"}
                          </p>
                        </div>

                        <p className="mt-2 text-sm text-neutral-700">
                          {truncate(c.description || "No description", 90)}
                        </p>

                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-xs text-neutral-500">
                            {c.district || ""}
                          </span>

                          <button
                            type="button"
                            onClick={() => setSelected(c)}
                            className="h-9 px-4 rounded-lg border border-pink-600 text-pink-600 text-sm font-medium hover:bg-pink-50 transition"
                          >
                            View more
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODAL */}
      {selected && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div
            className="w-full max-w-2xl bg-white rounded-2xl overflow-hidden shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <h2 className="text-lg font-semibold text-neutral-900">
                {selected.name}
              </h2>
              <button
                className="h-9 w-9 rounded-full hover:bg-neutral-100 text-neutral-700"
                onClick={closeModal}
                type="button"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="bg-neutral-100">
                {getImgSrc(selected.imageUrl) ? (
                  <img
                    src={getImgSrc(selected.imageUrl)}
                    alt={selected.name}
                    className="w-full h-64 md:h-full object-contain cursor-zoom-in"
                    onClick={() => setSelected((s) => ({ ...s, full: true }))}
                  />
                ) : (
                  <div className="w-full h-64 md:h-full flex items-center justify-center text-neutral-400">
                    No image
                  </div>
                )}
              </div>

              <div className="p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-neutral-600">{selected.category}</p>
                  <p className="text-xl font-bold text-pink-600">
                    Rs {selected.price}
                  </p>
                </div>

                <div className="mt-4 space-y-2 text-sm text-neutral-800">
                  <p>
                    <span className="font-semibold text-neutral-900">
                      District:
                    </span>{" "}
                    {selected.district || "Not added"}
                  </p>

                  <p>
                    <span className="font-semibold text-neutral-900">
                      Availability:
                    </span>{" "}
                    {selected.available ? "Available" : "Hidden"}
                  </p>

                  {/* Works only if backend returns baker data (populate) */}
                  <p>
                    <span className="font-semibold text-neutral-900">Baker:</span>{" "}
                    {selected.bakerId?.bakerProfile?.bakeryName || selected.bakerId?.name || "Not available"}
                  </p>

                  <p className="pt-2">
                    <span className="font-semibold text-neutral-900">
                      Description:
                    </span>
                  </p>
                  <p className="text-neutral-700 leading-relaxed">
                    {selected.description || "No description"}
                  </p>

                  <button
                    type="button"
                    onClick={() => addToCart(selected, 1)}
                    className="mt-3 w-full h-10 rounded-lg bg-pink-600 text-white font-medium hover:bg-pink-700"
                  >
                    Add to Cart
                  </button>

                </div>

                
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen image modal when user clicks the image */}
      {selected?.full && (
        <ImageModal
          open={true}
          src={getImgSrc(selected.imageUrl)}
          alt={selected.name}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
