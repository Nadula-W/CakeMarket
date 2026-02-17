import React, { useEffect, useState } from "react";

export default function ImageModal({ src, alt = "", open, onClose }) {
  const [fit, setFit] = useState(true);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "f") setFit((s) => !s);
    };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full h-full max-w-[98vw] max-h-[98vh] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white bg-black/40 rounded-full p-2 hover:bg-black/60 z-20"
          aria-label="Close image"
        >
          ✕
        </button>

        <button
          onClick={() => setFit((s) => !s)}
          className="absolute top-3 left-3 text-white bg-black/40 rounded-full p-2 hover:bg-black/60 z-20"
          aria-label="Toggle fit"
        >
          {fit ? "Actual" : "Fit"}
        </button>

        <div className="overflow-auto max-w-full max-h-full flex items-center justify-center">
          <img
            src={src}
            alt={alt}
            className={`block ${fit ? "max-w-full max-h-full object-contain" : "object-none"}`}
          />
        </div>
      </div>
    </div>
  );
}
