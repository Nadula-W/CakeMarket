import { useNavigate, useLocation } from "react-router-dom";
import { useMemo } from "react";

const categories = [
  {
    name: "Wedding",
    img: "https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?auto=format&fit=crop&w=600&q=60",
  },
  {
    name: "Birthday",
    img: "https://images.unsplash.com/photo-1542826438-bd32f43d626f?auto=format&fit=crop&w=600&q=60",
  },
  {
    name: "Cupcakes",
    img: "https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=600&q=60",
  },
  {
    name: "Vegan",
    img: "https://images.unsplash.com/photo-1514517220017-8ce97a34a7b6?auto=format&fit=crop&w=600&q=60",
  },
  {
    name: "Gluten Free",
    img: "https://images.unsplash.com/photo-1601972602237-8c79241e468b?auto=format&fit=crop&w=600&q=60",
  },
  {
    name: "Macarons",
    img: "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=600&q=60",
  },
  {
    name: "Customized",
    img: "https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?auto=format&fit=crop&w=600&q=60",
  },
];

export default function CategoryRow() {
  const navigate = useNavigate();
  const location = useLocation();

  const activeCategory = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("category");
  }, [location.search]);

  const go = (category) => {
    navigate(`/browse?category=${encodeURIComponent(category)}`);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        {/* BLACK title */}
        <h2 className="text-2xl font-bold text-black">
          Shop by Category
        </h2>

        {/* PINK subtitle */}
        <p className="text-brand-accent font-medium mt-1">
          Find the perfect cake for every occasion
        </p>
      </div>

      <div className="flex gap-10 items-start overflow-x-auto pb-3 scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {categories.map((c) => {
          const isActive =
            activeCategory?.toLowerCase() === c.name.toLowerCase();

          return (
            <button
              key={c.name}
              type="button"
              onClick={() => go(c.name)}
              className="flex flex-col items-center shrink-0 group focus:outline-none"
            >
              <div
                className={[
                  "w-28 h-28 rounded-full overflow-hidden border transition-all duration-200",
                  isActive
                    ? "border-brand-accent ring-2 ring-brand-accent/40"
                    : "border-gray-200 group-hover:border-brand-accent",
                ].join(" ")}
              >
                <img
                  src={c.img}
                  alt={c.name}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                />
              </div>

              <span
                className={[
                  "mt-3 font-medium transition-colors",
                  isActive
                    ? "text-brand-accent"
                    : "text-black group-hover:text-brand-accent",
                ].join(" ")}
              >
                {c.name}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
