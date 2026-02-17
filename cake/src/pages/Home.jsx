import Hero from "../components/Hero";
import CategorySection from "../components/CategorySection";
import FeaturedCakes from "../components/FeaturedCakes";
import HowItWorks from "../components/HowItWorks";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <>
      <Hero />
      <CategorySection />
      <FeaturedCakes />
      <HowItWorks />
      <Footer />
    </>
  );
}
