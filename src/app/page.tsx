import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Capabilities from "@/components/Capabilities";
import GlobalReach from "@/components/GlobalReach";
import Showcase from "@/components/Showcase";
import TechStack from "@/components/TechStack";
import Focus from "@/components/Focus";
import Products from "@/components/Products";
import Testimonials from "@/components/Testimonials";
import MiniGame from "@/components/MiniGame";
import Legal from "@/components/Legal";
import Contact from "@/components/Contact";
import Collaborate from "@/components/Collaborate";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      <Header />
      <Hero />
      <About />
      <Capabilities />
      <GlobalReach />
      <Showcase />
      <TechStack />
      <Focus />
      <Products />
      <Testimonials />
      <MiniGame />
      <Legal />
      <Contact />
      <Collaborate />
      <Footer />
    </main>
  );
}
