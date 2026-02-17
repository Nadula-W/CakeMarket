import { createContext, useContext, useMemo, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]); // { cake, qty }

  const count = useMemo(
    () => items.reduce((sum, it) => sum + (it.qty || 0), 0),
    [items]
  );

  const addToCart = (cake, qty = 1) => {
    setItems((prev) => {
      const idx = prev.findIndex((x) => x.cake?._id === cake?._id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + qty };
        return copy;
      }
      return [...prev, { cake, qty }];
    });
    setOpen(true);
  };

  const removeFromCart = (cakeId) => {
    setItems((prev) => prev.filter((x) => x.cake?._id !== cakeId));
  };

  const setQty = (cakeId, qty) => {
    setItems((prev) =>
      prev
        .map((x) =>
          x.cake?._id === cakeId ? { ...x, qty: Math.max(1, Number(qty) || 1) } : x
        )
        .filter((x) => x.qty > 0)
    );
  };

  const clearCart = () => setItems([]);

  const value = useMemo(
    () => ({
      open,
      setOpen,
      items,
      count,
      addToCart,
      removeFromCart,
      setQty,
      clearCart,
    }),
    [open, items, count]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
};
