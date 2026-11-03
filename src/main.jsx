import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { MotionConfig, motion, useMotionValue, useScroll, useSpring } from "framer-motion";
import Intro from "./components/Intro";
import Hero from "./components/Hero";
import About from "./components/About";
import Journey from "./components/Journey";
import Services from "./components/Services";
import Reels from "./components/Reels";
import Specialities from "./components/Specialities";
import Pricing from "./components/Pricing";
import Contact from "./components/Contact";
import { Review, Thanks } from "./components/Closing";
import { REELS } from "./data/content";
import "./styles.css";
import "./clinic.css";

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 25 });
  return <motion.div className="scroll-progress" style={{ scaleX }} />;
}

function CursorGlow() {
  const mx = useMotionValue(-500);
  const my = useMotionValue(-500);
  const x = useSpring(mx, { stiffness: 90, damping: 20 });
  const y = useSpring(my, { stiffness: 90, damping: 20 });
  useEffect(() => {
    const onMove = (e) => {
      mx.set(e.clientX);
      my.set(e.clientY);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [mx, my]);
  return <motion.div className="cursor-glow" style={{ x, y }} />;
}

function App() {
  return (
    <MotionConfig reducedMotion="user">
      <Intro />
      <ScrollProgress />
      <CursorGlow />
      <main>
        <Hero />
        <About />
        <Journey />
        <Specialities />
        <Services />
        <Pricing />
        {REELS.length > 0 && <Reels />}
        <Contact />
        <Thanks />
        <Review />
      </main>
    </MotionConfig>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
