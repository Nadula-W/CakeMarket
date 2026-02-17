import { motion } from "framer-motion";

export default function HowItWorks() {
  const steps = [
    {
      title: "Find a Baker",
      description:
        "Browse trusted local bakers, explore their work, and choose the perfect match for your occasion.",
    },
    {
      title: "Customize",
      description:
        "Select flavors, designs, and special requests to create a cake that's uniquely yours.",
    },
    {
      title: "Enjoy",
      description:
        "Receive your freshly baked cake and make your celebration unforgettable.",
    },
  ];

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-rose-50 font-serif">
      <div className="px-6 mx-auto max-w-7xl">

        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center">
          <motion.h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-rose-950"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            How it works
          </motion.h2>

          <motion.p
            className="max-w-lg mx-auto mt-4 text-base leading-relaxed text-rose-800/70"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            Ordering a custom cake is simple — pick a baker, customize, and enjoy. Here's a quick overview.
          </motion.p>
        </div>

        {/* Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              viewport={{ once: true }}
              className="bg-white border border-rose-100 rounded-2xl p-7 text-center shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="mx-auto w-14 h-14 flex items-center justify-center rounded-full bg-pink-50 border border-pink-200 text-pink-500">
                {i === 0 && (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M3 7h18" />
                    <rect x="3" y="7" width="18" height="12" rx="2" />
                    <path d="M16 3v4" />
                  </svg>
                )}
                {i === 1 && (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 3v18" />
                    <path d="M3 12h18" />
                  </svg>
                )}
                {i === 2 && (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M3 7h3l2 5 3-6 3 6 2-5h3" />
                  </svg>
                )}
              </div>

              <h3 className="mt-4 text-base font-semibold text-rose-950">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-rose-800/60">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}