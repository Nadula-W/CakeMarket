import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

export default function CakeDetails() {
  const { id } = useParams();
  const [cake, setCake] = useState(null);

  useEffect(() => {
    api.get(`/cakes`).then(res => {
      setCake(res.data.find(c => c._id === id));
    });
  }, [id]);

  if (!cake) return null;

  return (
    <div className="p-4">
      <img src={cake.image} className="rounded-2xl h-64 w-full object-cover" />
      <h2 className="text-2xl font-bold mt-3">{cake.name}</h2>
      <p className="text-gray-600">{cake.description}</p>

      <div className="flex justify-between mt-4">
        <span className="text-2xl text-primary font-bold">${cake.price}</span>
        <button className="bg-primary text-white px-6 py-3 rounded-full">
          Add to Cart
        </button>
      </div>
    </div>
  );
}
