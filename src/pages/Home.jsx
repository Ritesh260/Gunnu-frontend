import { useState } from "react";

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

// 🔥 PWA INSTALL BANNER
import InstallBanner from "../components/InstallBanner";

// 🔥 SPLASH SCREEN
import SplashScreen from "../components/SplashScreen";

function Home() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {/* 🔥 SPLASH SCREEN FIRST */}
      {loading ? (
        <SplashScreen onFinish={() => setLoading(false)} />
      ) : (
        <div className="bg-black text-white overflow-x-hidden">

          {/* 🔥 Install Banner */}
          <InstallBanner />

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
      )}
    </>
  );
}

export default Home;