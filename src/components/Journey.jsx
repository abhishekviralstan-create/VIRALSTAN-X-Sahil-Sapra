import { useLayoutEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useSpring } from "framer-motion";
import { EASE, Icon, SectionHead } from "./shared";
import { PROCESS } from "../data/content";

const BADGES = ["search", "map", "play", "chart", "eye", "target"];

// Builds the curvy road path that zig-zags between the milestone cards.
function buildRoad(container, cards) {
  const box = container.getBoundingClientRect();
  let d = "";
  for (let i = 0; i < cards.length - 1; i++) {
    const a = cards[i].getBoundingClientRect();
    const b = cards[i + 1].getBoundingClientRect();
    const dir = i % 2 === 0 ? 1 : -1;
    const x = (dir === 1 ? a.right : a.left) - box.left;
    const y = a.top + a.height / 2 - box.top;
    const ex = x + dir * 90;
    const ey = b.top - box.top + 20;
    d += `M ${x} ${y} C ${x + dir * 140} ${y + 6}, ${ex + dir * 110} ${ey - 70}, ${ex} ${ey} `;
  }
  return d;
}

export default function Journey() {
  const ref = useRef(null);
  const cards = useRef([]);
  const lineRef = useRef(null);
  const [path, setPath] = useState("");
  const [dot, setDot] = useState(null);

  useLayoutEffect(() => {
    const update = () => ref.current && setPath(buildRoad(ref.current, cards.current.filter(Boolean)));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 65%", "end 70%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 80, damping: 22 });

  useMotionValueEvent(progress, "change", (v) => {
    const line = lineRef.current;
    if (!line || !path) return;
    if (v <= 0.001 || v >= 0.999) return setDot(null);
    const p = line.getPointAtLength(line.getTotalLength() * v);
    setDot({ x: p.x, y: p.y });
  });

  return (
    <section className="section" id="journey">
      <div className="container">
        <SectionHead
          center
          eyebrow="How we work"
          title={<>A simple process <span className="grad-text">from start to finish.</span></>}
          sub="Audit the market, launch the content and campaigns, measure lead quality, and scale what works over 90 days."
        />
        <div className="roadmap" ref={ref}>
          <svg className="road-svg" aria-hidden="true">
            <defs>
              <linearGradient id="road-g" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#315eea" />
                <stop offset="100%" stopColor="#7c3aed" />
              </linearGradient>
            </defs>
            <path d={path} className="road-track" />
            <motion.path ref={lineRef} d={path} className="road-line" style={{ pathLength: progress }} />
            {dot && <circle cx={dot.x} cy={dot.y} r="7" className="road-dot" />}
          </svg>
          {PROCESS.map((m, i) => {
            const left = i % 2 === 0;
            return (
              <motion.article
                key={m.year}
                ref={(el) => (cards.current[i] = el)}
                className={`road-card ${left ? "left" : "right"}`}
                initial={{ opacity: 0, x: left ? -80 : 80 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "0px 0px -120px 0px" }}
                transition={{ duration: 0.9, ease: EASE }}
                whileHover={{ y: -6 }}
              >
                <span className="road-step">Step {m.year}</span>
                <h3>{m.title}</h3>
                <p>{m.text}</p>
                <motion.span
                  className="road-badge"
                  style={{ [left ? "right" : "left"]: -34 }}
                  initial={{ scale: 0, rotate: -90 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: true, margin: "0px 0px -120px 0px" }}
                  transition={{ type: "spring", stiffness: 220, damping: 16, delay: 0.35 }}
                >
                  <Icon name={BADGES[i]} />
                </motion.span>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
