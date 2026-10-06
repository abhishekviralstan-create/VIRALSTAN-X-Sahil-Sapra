import { useEffect, useRef } from "react";
import { motion, useMotionTemplate, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { EASE } from "./shared";
import { HERO_TAGLINE } from "../data/content";

const fadeIn = (delay) => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 1.6, delay: 3.5 + delay, ease: EASE },
});

export default function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const sceneY = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const sceneScale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
  const sceneOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const sx = useSpring(mx, { stiffness: 50, damping: 18 });
  const sy = useSpring(my, { stiffness: 50, damping: 18 });
  const rotateY = useTransform(sx, (v) => (v - 0.5) * 10);
  const rotateX = useTransform(sy, (v) => (v - 0.5) * -8);
  const ribbonX = useTransform(sx, (v) => (v - 0.5) * -34);
  const ribbonY = useTransform(sy, (v) => (v - 0.5) * -24);
  const px = useTransform(sx, (v) => `${v * 100}%`);
  const py = useTransform(sy, (v) => `${v * 100}%`);
  const spot = useMotionTemplate`radial-gradient(600px circle at ${px} ${py}, rgba(255,255,255,0.55), transparent 60%)`;
  const field = useMotionTemplate`radial-gradient(420px circle at ${px} ${py}, rgba(124,58,237,.12), transparent 70%)`;

  useEffect(() => {
    const onMove = (e) => {
      mx.set(e.clientX / window.innerWidth);
      my.set(e.clientY / window.innerHeight);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [mx, my]);

  return (
    <header className="hero" id="top" ref={ref}>
      <div className="hero-grid" aria-hidden="true" />
      <motion.div className="cursor-field" style={{ background: field }} aria-hidden="true" />
      <motion.div className="ribbon-field" style={{ x: ribbonX, y: ribbonY }} aria-hidden="true" {...fadeIn(0)}>
        <span className="light-beam beam-one" />
        <span className="light-beam beam-two" />
        <span className="light-beam beam-three" />
        <svg className="flow-lines" viewBox="0 0 1600 900" preserveAspectRatio="none">
          <defs>
            <linearGradient id="flow-gradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#f4295e" stopOpacity="0" />
              <stop offset=".25" stopColor="#f4295e" />
              <stop offset=".52" stopColor="#8256ed" />
              <stop offset=".78" stopColor="#248cec" />
              <stop offset="1" stopColor="#0ea5e9" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path className="flow flow-one" d="M-120 625 C 260 210, 580 790, 880 410 S 1390 150, 1740 380" />
          <path className="flow flow-two" d="M-100 690 C 250 300, 520 820, 900 470 S 1420 230, 1710 425" />
          <path className="flow flow-three" d="M-160 535 C 230 120, 610 700, 920 325 S 1430 80, 1750 310" />
        </svg>
      </motion.div>
      <motion.div className="hero-spot" style={{ background: spot }} aria-hidden="true" />
      <div className="hero-noise" aria-hidden="true" />
      <motion.div
        className="hero-scene"
        style={{ y: sceneY, scale: sceneScale, opacity: sceneOpacity, rotateX, rotateY }}
      >
        <motion.div
          className="hero-logo"
          initial={{ opacity: 0, scale: 0.6, filter: "blur(14px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.3, delay: 3.6, ease: EASE }}
        >
          <span className="logo-aura" aria-hidden="true" />
          <img src="/viralstan-logo.png" alt="Viralstan" />
          <span className="logo-shine" aria-hidden="true" />
        </motion.div>
        <motion.div
          className="hero-tag"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 4.2, ease: EASE }}
        >
          <span className="eyebrow">{HERO_TAGLINE.eyebrow}</span>
          <p>{HERO_TAGLINE.line}</p>
        </motion.div>
      </motion.div>
      <motion.a
        href="#about"
        className="scroll-cue"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 5 }}
        aria-label="Scroll to about"
      >
        <span className="mouse" />
        Scroll
      </motion.a>
    </header>
  );
}
