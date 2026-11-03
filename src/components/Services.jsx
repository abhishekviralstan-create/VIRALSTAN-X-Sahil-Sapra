import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { EASE, Icon, SectionHead } from "./shared";
import { SERVICES } from "../data/content";

const SERVICE_VIDEOS = {
  "Website Redesign & SEO":   { folder: "WEBSITE",          count: 4 },
  "Instagram & AI Content":   { folder: "REELS",            count: 4 },
  "Agent Video Marketing":    { folder: "VIDEO EDITING",    count: 3 },
  "Lead Generation & Caller": { folder: "LEAD GENERATION",  count: 4 },
  "Local & Technical SEO":    { folder: "SEO",              count: 5 },
};
const OPENABLE_SERVICES = new Set(Object.keys(SERVICE_VIDEOS));

function StackCard({ s, i, total, progress, onOpen }) {
  const start = i / total;
  const scale = useTransform(progress, [start, 1], [1, 1 - (total - i) * 0.035]);
  const brightness = useTransform(progress, [start, Math.min(1, start + 0.35)], [1, i === total - 1 ? 1 : 0.9]);
  const filter = useTransform(brightness, (v) => `brightness(${v})`);

  return (
    <div className="stack-card-wrap" style={{ top: `calc(60px + ${i * 14}px)` }}>
      <motion.article
        className={`stack-card ${onOpen ? "is-openable" : "is-unavailable"}`}
        onClick={onOpen || undefined}
        role="button"
        tabIndex={onOpen ? 0 : -1}
        onKeyDown={(e) => { if (onOpen && (e.key === "Enter" || e.key === " ")) onOpen(); }}
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
  const [showCatalogue, setShowCatalogue] = useState(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setActive(Math.min(SERVICES.length - 1, Math.max(0, Math.floor(v * SERVICES.length))));
  });

  return (
    <section className="section services" id="services">
      <div className="container services-layout">
        <div className="services-intro">
          <SectionHead
            eyebrow="The Viralstan × Sahil Sapra growth system"
          title={<>Five proven services. <span className="grad-text">One partner. Zero gaps.</span></>}
          sub="Website, Instagram content, agent videos, lead generation calling and SEO — all working together so Sahil Sapra stays ahead in Sydney’s Hills District."
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
            <StackCard key={s.no} s={s} i={i} total={SERVICES.length} progress={scrollYProgress} onOpen={OPENABLE_SERVICES.has(s.title) ? () => setShowCatalogue(s) : null} />
          ))}
        </div>
      </div>
      {showCatalogue && (() => {
        const svc = SERVICE_VIDEOS[showCatalogue.title];
        return (
          <div className="catalogue-modal-backdrop" role="presentation" onClick={() => setShowCatalogue(false)}>
            <div className="catalogue-modal" role="dialog" aria-modal="true" aria-labelledby="catalogue-title" onClick={(e) => e.stopPropagation()}>
              <button className="catalogue-close" type="button" onClick={() => setShowCatalogue(false)} aria-label="Close">×</button>
              <span className="eyebrow">{showCatalogue.kicker}</span>
              <h2 id="catalogue-title">{showCatalogue.title}</h2>
              <p className="catalogue-description">{showCatalogue.text}</p>
              <div className="tags catalogue-tags">
                {showCatalogue.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}
              </div>
              {svc && (
                <div className="service-popup-video-wrap">
                  <div className="service-popup-video-grid">
                    {Array.from({ length: svc.count }, (_, i) => i + 1).map((n) => (
                      <video
                        key={n}
                        className="service-popup-video"
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        controls={false}
                        disablePictureInPicture
                        aria-label={`${showCatalogue.title} sample ${n}`}
                      >
                        <source src={`/${svc.folder}/${n}.mp4`} type="video/mp4" />
                      </video>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })()}
    </section>
  );
}
