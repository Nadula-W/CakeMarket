import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section
      className="relative h-screen flex items-center justify-center text-center"
      style={{
        backgroundImage: "url('/images/home.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Content */}
      <motion.div
        className="relative z-10 max-w-4xl px-6 text-white font-serif"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.25,
            },
          },
        }}
      >
        {/* Heading */}
        <motion.h1
          className="text-4xl md:text-6xl font-bold leading-tight"
          variants={{
            hidden: { opacity: 0, y: 40 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.8, ease: "easeOut" },
            },
          }}
        >
          Discover and Order Cakes from{" "}
          <span className="text-pink-400">Local Bakers</span>
        </motion.h1>

        {/* Buttons */}
        <motion.div
          className="mt-10 flex flex-col sm:flex-row justify-center gap-6"
          variants={{
            hidden: { opacity: 0, y: 40 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.8, ease: "easeOut" },
            },
          }}
        >
          <Link
            to="/browse"
            className="px-8 py-4 rounded-full
                       bg-pink-600 hover:bg-pink-700 transition
                       text-white font-semibold text-lg"
          >
            Explore Cakes
          </Link>

          <Link
            to="Signup"
            className="px-8 py-4 rounded-full
                       bg-white/90 text-gray-900 hover:bg-white transition
                       font-semibold text-lg"
          >
            Be a Baker
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
