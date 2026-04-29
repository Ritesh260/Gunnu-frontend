// src/pages/Home.jsx

import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import About from "../components/About";
import MenuPreview from "../components/MenuPreview";
import Specials from "../components/Specials";
import Gallery from "../components/Gallery";
import Testimonials from "../components/Testimonials";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import ScrollTop from "../components/ScrollTop";

function Home() {
  return (
    <div className="bg-black text-white overflow-x-hidden">
      <Navbar />

      <main>
        <Hero />
        <About />
        <MenuPreview />
        <Specials />
        <Gallery />
        <Testimonials />
        <Contact />
      </main>

      <Footer />
      <ScrollTop />
    </div>
  );
}

export default Home;