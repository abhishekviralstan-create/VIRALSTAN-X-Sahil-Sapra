import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { EASE, Icon, SectionHead } from "./shared";
import { SERVICES } from "../data/content";

function StackCard({ s, i, total, progress }) {
  const start = i / total;
  const scale = useTransform(progress, [start, 1], [1, 1 - (total - i) * 0.035]);
  const brightness = useTransform(progress, [start, Math.min(1, start + 0.35)], [1, i === total - 1 ? 1 : 0.9]);
  const filter = useTransform(brightness, (v) => `brightness(${v})`);

  return (
    <div className="stack-card-wrap" style={{ top: `calc(60px + ${i * 14}px)` }}>
      <motion.article
        className="stack-card"
        style={{ scale, filter, "--c": s.color }}
        initial={{ opacity: 0, y: 80, rotateX: -12 }}
        whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
        viewport={{ once: true, margin: "0px 0px -100px 0px" }}
        transition={{ duration: 0.9, ease: EASE }}
      >
        <div className="sc-top">
          <motion.div className="sc-icon" whileHover={{ rotate: -10, scale: 1.08 }}>
            <Icon name={s.icon} />
          </motion.div>
          <span className="sc-no">{s.no}</span>
        </div>
        <span className="sc-kicker">{s.kicker}</span>
        <h3>{s.title}</h3>
        <p>{s.text}</p>
        <div className="tags">
          {s.tags.map((t) => <span className="tag" key={t}>{t}</span>)}
        </div>
      </motion.article>
    </div>
  );
}

export default function Services() {
  const ref = useRef(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setActive(Math.min(SERVICES.length - 1, Math.max(0, Math.floor(v * SERVICES.length))));
  });

  return (
    <section className="section services" id="services">
      <div className="container services-layout">
        <div className="services-intro">
          <SectionHead
            eyebrow="What we offer"
            title={<>Everything your clinic needs <span className="grad-text">to grow.</span></>}
            sub="Every healthcare marketing service under one roof, from doctor branding to booked appointments, with one accountable team and clear monthly reporting."
          />
          <div className="services-count" aria-hidden="true">
            <motion.b key={active} initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="grad-text">
              {SERVICES[active].no}
            </motion.b>
            <span>/ 0{SERVICES.length}</span>
          </div>
          <div className="services-dots" aria-hidden="true">
            {SERVICES.map((s, i) => <i key={s.no} className={i === active ? "on" : ""} />)}
          </div>
        </div>
        <div ref={ref}>
          {SERVICES.map((s, i) => (
            <StackCard key={s.no} s={s} i={i} total={SERVICES.length} progress={scrollYProgress} />
          ))}
        </div>
      </div>
    </section>
  );
}
