import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API, { browseCakes } from "../services/api";
import { useCart } from "../context/CartContext";
import ImageModal from "./ImageModal";

function getImgSrc(imageUrl) {
  if (!imageUrl) return "";
  const apiBase = API.defaults.baseURL ? API.defaults.baseURL.replace(/\/api\/?$/, "") : "";
  return imageUrl.startsWith("http") ? imageUrl : `${apiBase}${imageUrl}`;
}

export default function FeaturedCakes() {
  const [cakes, setCakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const res = await browseCakes({ sort: "newest" });
        if (!mounted) return;
        const items = Array.isArray(res.data) ? res.data.slice(0, 4) : [];
        setCakes(items);
      } catch (err) {
        setCakes([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => (mounted = false);
  }, []);

  return (
    <>
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between mb-6">
            <h2 className="text-2xl font-bold">Fresh from the Oven</h2>
            <Link to="/browse" className="text-pink-600 font-semibold">
              View All
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading
              ? [1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl shadow hover:shadow-lg transition animate-pulse"
                  >
                    <div className="h-48 bg-gray-200 rounded-t-2xl" />
                    <div className="p-4">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
                      <div className="h-3 bg-gray-200 rounded w-1/2 mb-2" />
                      <div className="mt-3 flex justify-between">
                        <div className="h-6 bg-gray-200 rounded w-16" />
                        <div className="h-6 bg-gray-200 rounded w-12" />
                      </div>
                    </div>
                  </div>
                ))
              : cakes.map((c) => (
                  <div
                    key={c._id}
                    className="bg-white rounded-2xl shadow hover:shadow-xl transform hover:-translate-y-1 transition overflow-hidden"
                  >
                    <div className="relative h-48 bg-gray-200 overflow-hidden">
                      {c.imageUrl ? (
                        <img
                          src={getImgSrc(c.imageUrl)}
                          alt={c.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="h-48 bg-gray-100" />
                      )}

                      {/* Overlay: baker name */}
                      <div className="absolute left-3 top-3 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium">
                        {c.bakerId?.bakerProfile?.bakeryName || c.bakerId?.name || 'Bakery'}
                      </div>

                      {/* Price badge */}
                      <div className="absolute right-3 top-3 bg-pink-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        Rs {c.price}
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="font-semibold truncate text-neutral-900">{c.name}</h3>
                      <p className="text-xs text-neutral-500 mt-1">{c.category} • {c.district || '—'}</p>

                      <div className="mt-4 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => addToCart(c, 1)}
                          className="inline-flex items-center gap-2 h-9 px-3 rounded-lg bg-pink-600 text-white text-sm font-medium hover:bg-pink-700"
                        >
                          Add
                        </button>

                        <button
                          type="button"
                          onClick={() => setSelected(c)}
                          className="text-sm text-pink-600 font-semibold"
                        >
                          View
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </section>

      {/* Details modal for selected featured cake */}
      {selected && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="w-full max-w-2xl bg-white rounded-2xl overflow-hidden shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <h2 className="text-lg font-semibold text-neutral-900">{selected.name}</h2>
              <button
                className="h-9 w-9 rounded-full hover:bg-neutral-100 text-neutral-700"
                onClick={() => setSelected(null)}
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
                  <p className="text-xl font-bold text-pink-600">Rs {selected.price}</p>
                </div>

                <div className="mt-4 space-y-2 text-sm text-neutral-800">
                  <p>
                    <span className="font-semibold text-neutral-900">District:</span> {selected.district || 'Not added'}
                  </p>

                  <p>
                    <span className="font-semibold text-neutral-900">Availability:</span> {selected.available ? 'Available' : 'Hidden'}
                  </p>

                  <p>
                    <span className="font-semibold text-neutral-900">Baker:</span> {selected.bakerId?.name || 'Not available'}
                  </p>

                  <p className="pt-2">
                    <span className="font-semibold text-neutral-900">Description:</span>
                  </p>
                  <p className="text-neutral-700 leading-relaxed">{selected.description || 'No description'}</p>

                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={() => { addToCart(selected, 1); setSelected(null); }}
                      className="w-full h-10 rounded-lg bg-pink-600 text-white font-medium hover:bg-pink-700"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen image modal when user clicks the image */}
      {selected?.full && (
        <ImageModal open={true} src={getImgSrc(selected.imageUrl)} alt={selected.name} onClose={() => setSelected(null)} />
      )}
    </>
  );
}
