import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EASE, SectionHead } from "./shared";
import { PROJECTS } from "../data/content";

const PAGE_EASE = [0.645, 0.045, 0.355, 1];

function Folder({ p, i, onOpen }) {
  return (
    <motion.button
      className="folder"
      style={{ "--f1": p.colors[0], "--f2": p.colors[1] }}
      onClick={() => onOpen(i)}
      aria-label={`Open ${p.name} case study`}
      initial={{ opacity: 0, y: 70, rotate: i % 2 ? 4 : -4 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, delay: (i % 3) * 0.12, ease: EASE }}
    >
      <span className="folder-back" />
      <span className="folder-paper">
        {p.logo ? <img src={p.logo} alt="" loading="lazy" /> : <span className="project-monogram">{p.name.slice(0, 2)}</span>}
      </span>
      <span className="folder-paper second" />
      <span className="folder-front">
        <span className="folder-no">{String(i + 1).padStart(2, "0")}</span>
        <span className="folder-name">{p.name}</span>
        <span className="folder-meta">{p.services.length} services · {p.industry}</span>
        <span className="folder-open">Open case study →</span>
      </span>
    </motion.button>
  );
}

function Book({ index, setIndex, onClose }) {
  const p = PROJECTS[index];
  const firstOpen = useRef(true);
  const shotRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);
  const [turn, setTurn] = useState(null);
  const isMobile = typeof window !== "undefined" && window.matchMedia("(max-width: 800px)").matches;

  const go = useCallback(
    (dir) => {
      if (turn || PROJECTS.length < 2) return;
      setTurn({ direction: dir, project: p });
      setIndex((n) => (n + dir + PROJECTS.length) % PROJECTS.length);
    },
    [p, setIndex, turn],
  );

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    document.documentElement.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    const t = setTimeout(() => (firstOpen.current = false), 1600);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      clearTimeout(t);
    };
  }, [go, onClose]);

  useEffect(() => {
    setScrolled(false);
    if (shotRef.current) shotRef.current.scrollTop = 0;
  }, [index]);

  const contentDelay = firstOpen.current ? 0.9 : 0;

  const pageOpen = (side) => {
    const s = side === "left" ? 1 : -1;
    return isMobile
      ? {
          style: { transformOrigin: side === "left" ? "center bottom" : "center top" },
          initial: { rotateX: -90 * s, opacity: 0 },
          animate: { rotateX: 0, opacity: 1 },
        }
      : {
          style: { transformOrigin: side === "left" ? "right center" : "left center" },
          initial: { rotateY: 90 * s, opacity: 0 },
          animate: { rotateY: 0, opacity: 1 },
        };
  };
  const pageTransition = { duration: 1.05, delay: 0.25, ease: PAGE_EASE, opacity: { duration: 0.3, delay: 0.25 } };

  return (
    <motion.div className="book-backdrop" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <button className="book-close" onClick={onClose} aria-label="Close case study">✕</button>
      <motion.div
        className="book"
        role="dialog"
        aria-modal="true"
        aria-label={`${p.name} case study`}
        style={{ "--f1": p.colors[0], "--f2": p.colors[1], transformOrigin: "center center" }}
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.92, opacity: 0, y: 24 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 24 }}
        transition={{ duration: 0.55, ease: EASE }}
      >
        <span className="book-spine" aria-hidden="true" />

        <AnimatePresence>
          {turn && (
            <motion.div
              key={`${turn.project.id}-${turn.direction}`}
              className={`case-page-turn ${turn.direction > 0 ? "turn-next" : "turn-prev"}`}
              style={{ "--turn-a": turn.project.colors[0], "--turn-b": turn.project.colors[1] }}
              initial={isMobile ? { rotateX: 0 } : { rotateY: 0 }}
              animate={isMobile ? { rotateX: turn.direction > 0 ? -180 : 180 } : { rotateY: turn.direction > 0 ? -180 : 180 }}
              transition={{ duration: 0.82, ease: PAGE_EASE }}
              onAnimationComplete={() => setTurn(null)}
            >
              <span className="turn-face turn-front">
                <small>Case study</small>
                <strong>{turn.project.name}</strong>
                <i>{turn.direction > 0 ? "Next →" : "← Previous"}</i>
              </span>
              <span className="turn-face turn-back" />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div className="page page-left" {...pageOpen("left")} transition={pageTransition}>
          <motion.div
            key={p.id}
            className="page-inner"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25, delay: contentDelay }}
          >
            {p.image ? (
              <>
                <div className="shot-frame" ref={shotRef} onScroll={(e) => e.currentTarget.scrollTop > 40 && setScrolled(true)}>
                  <div className="shot-bar">
                    <i /><i /><i />
                    <span>{p.name}</span>
                  </div>
                  <img src={p.image} alt={`${p.name} website designed by Viralstan`} />
                </div>
                <AnimatePresence>
                  {!scrolled && (
                    <motion.span
                      className="scroll-hint"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0, transition: { delay: contentDelay + 0.6 } }}
                      exit={{ opacity: 0, transition: { duration: 0.2 } }}
                    >
                      Scroll to explore the full site ↓
                    </motion.span>
                  )}
                </AnimatePresence>
              </>
            ) : (
              <div className="brand-showcase">
                <span className="brand-lines" aria-hidden="true" />
                <div className="brand-mark">
                  {p.logo ? <img src={p.logo} alt={`${p.name} logo`} /> : <span>{p.name.slice(0, 2)}</span>}
                </div>
                <span className="brand-kicker">Viralstan × {p.name}</span>
                <h4>{p.summary}</h4>
              </div>
            )}
          </motion.div>
        </motion.div>

        <motion.div className="page page-right" {...pageOpen("right")} transition={pageTransition}>
          <motion.div
            key={p.id}
            className="page-inner copy"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25, delay: contentDelay }}
          >
            <div className="book-logo">
              {p.logo ? <img src={p.logo} alt={`${p.name} logo`} /> : <span className="project-monogram">{p.name.slice(0, 2)}</span>}
            </div>
            <span className="book-eyebrow">{p.industry}</span>
            <h3>{p.name}</h3>
            <div className="book-tags">
              {p.services.map((s) => <span className="book-tag" key={s}>{s}</span>)}
            </div>
            <p className="book-detail">{p.detail}</p>
            <h4>Project highlights</h4>
            <ul className="book-list">
              {p.highlights.map((h, i) => (
                <motion.li
                  key={h}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: contentDelay + 0.2 + i * 0.07 }}
                >
                  {h}
                </motion.li>
              ))}
            </ul>
          </motion.div>
          <div className="book-foot">
            <button onClick={() => go(-1)} disabled={!!turn || PROJECTS.length < 2} aria-label="Previous case study">←</button>
            <span>
              Case study {String(index + 1).padStart(2, "0")} / {String(PROJECTS.length).padStart(2, "0")}
            </span>
            <button onClick={() => go(1)} disabled={!!turn || PROJECTS.length < 2} aria-label="Next case study">→</button>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default function CaseStudies() {
  const [open, setOpen] = useState(null);
  const close = useCallback(() => setOpen(null), []);
  const setIndex = useCallback((v) => setOpen((cur) => (typeof v === "function" ? v(cur) : v)), []);

  return (
    <section className="section" id="work">
      <div className="container">
        <SectionHead
          center
          eyebrow="Industry sectors"
          title={<>Marketing support for Indian <span className="grad-text">manufacturers.</span></>}
          sub="Explore the sectors we support with brand building, digital presence and sales-ready marketing assets."
        />
        <div className={`folder-grid ${PROJECTS.length < 3 ? "few" : ""}`} style={{ "--n": PROJECTS.length }}>
          {PROJECTS.map((p, i) => <Folder key={p.id} p={p} i={i} onOpen={setOpen} />)}
        </div>
      </div>
      <AnimatePresence>
        {open !== null && <Book index={open} setIndex={setIndex} onClose={close} />}
      </AnimatePresence>
    </section>
  );
}
