import { useRef } from "react";
import About from "./components/About";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import { SectionMotion } from "./components/SectionMotion";
import Strengths from "./components/Strengths";
import Works from "./components/Works";
import { useScrollReveal } from "./hooks/useScrollReveal";

export default function App() {
  // 整页统一接管滚动渐入动画
  const rootRef = useRef<HTMLDivElement>(null);
  useScrollReveal(rootRef);

  return (
    <div ref={rootRef}>
      <SectionMotion />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Works />
        <Strengths />
      </main>
      <Footer />
    </div>
  );
}
