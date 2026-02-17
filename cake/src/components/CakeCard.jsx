import API from "../services/api";

export default function CakeCard({ cake }) {
  const apiBase = API.defaults.baseURL ? API.defaults.baseURL.replace(/\/api\/?$/, "") : "";
  const imgSrc = cake.imageUrl
    ? cake.imageUrl.startsWith("http")
      ? cake.imageUrl
      : `${apiBase}${cake.imageUrl}`
    : "";

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition">
      <img
        src={imgSrc}
        alt={cake.name}
        className="w-full h-36 object-cover"
      />

      <div className="p-3">
        <h3 className="font-semibold text-gray-800 text-sm">
          {cake.name}
        </h3>

        <p className="text-xs text-gray-500 mt-1">
          by {cake.bakerId?.bakerProfile?.bakeryName || cake.bakerId?.name || 'Bakery'}
        </p>

        <div className="flex justify-between items-center mt-3">
          <span className="text-pink-600 font-bold text-sm">
            Rs. {cake.price}
          </span>

          <span className="text-xs bg-pink-100 text-pink-600 px-2 py-1 rounded-full">
            ⭐ 4.8
          </span>
        </div>
      </div>
    </div>
  );
}
