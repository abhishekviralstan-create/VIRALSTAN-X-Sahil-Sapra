import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { EASE, SectionHead } from "./shared";
import { REEL_FILTERS, REELS } from "../data/content";

const media = (id, ext) => `/reels/${id}.${ext}`;

function useIsMobile() {
  const [mobile, setMobile] = useState(
    () => window.matchMedia("(max-width: 760px)").matches,
  );
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 760px)");
    const onChange = () => setMobile(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return mobile;
}

function Reel({ r, i, onOpen, paused }) {
  const videoRef = useRef(null);
  const cardRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.55 },
    );
    io.observe(cardRef.current);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (visible && !paused) v.play().catch(() => {});
    else v.pause();
  }, [visible, paused]);

  return (
    <motion.button
      ref={cardRef}
      layout
      className={`reel ${visible ? "is-playing" : ""}`}
      onClick={() => onOpen(r)}
      aria-label={`Watch ${r.title} by ${r.client}`}
      initial={{ opacity: 0, y: 60, rotate: i % 2 ? 3 : -3 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      exit={{ opacity: 0, scale: 0.85 }}
      transition={{ duration: 0.6, delay: Math.min(i, 6) * 0.05, ease: EASE }}
      whileHover={{ y: -10 }}
    >
      <span className="reel-media">
        <video
          ref={videoRef}
          src={media(r.id, "mp4")}
          poster={media(r.poster || r.id, "jpg")}
          muted
          loop
          playsInline
          preload="metadata"
        />
        <span className="reel-shade" />
        <span className="reel-cat">{r.category}</span>
        <span className="reel-play" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
        <span className="reel-bars" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
      </span>
      <span className="reel-info">
        <b>{r.client}</b>
        <small>{r.title}</small>
      </span>
    </motion.button>
  );
}

function Player({ list, index, setIndex, onClose }) {
  const r = list[index];
  const step = useCallback(
    (d) => setIndex((n) => (n + d + list.length) % list.length),
    [list.length, setIndex],
  );

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.documentElement.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [step, onClose]);

  return (
    <motion.div
      className="player-backdrop"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <button
        className="player-close"
        onClick={onClose}
        aria-label="Close video"
      >
        ✕
      </button>
      {list.length > 1 && (
        <button
          className="player-nav prev"
          onClick={(e) => (e.stopPropagation(), step(-1))}
          aria-label="Previous video"
        >
          ←
        </button>
      )}
      <motion.div
        className="player"
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.8, y: 40, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        <AnimatePresence mode="wait">
          <motion.video
            key={r.id}
            src={media(r.id, "mp4")}
            poster={media(r.poster || r.id, "jpg")}
            controls
            autoPlay
            playsInline
            initial={{ opacity: 0, rotateY: 25 }}
            animate={{ opacity: 1, rotateY: 0 }}
            exit={{ opacity: 0, rotateY: -25 }}
            transition={{ duration: 0.35 }}
          />
        </AnimatePresence>
        <div className="player-meta">
          <span>{r.category}</span>
          <b>{r.title}</b>
          <small>
            {r.client} · {index + 1} / {list.length}
          </small>
        </div>
      </motion.div>
      {list.length > 1 && (
        <button
          className="player-nav next"
          onClick={(e) => (e.stopPropagation(), step(1))}
          aria-label="Next video"
        >
          →
        </button>
      )}
    </motion.div>
  );
}

export default function Reels() {
  const mobile = useIsMobile();
  const [filter, setFilter] = useState("All");
  const [open, setOpen] = useState(null);
  const list =
    filter === "All" ? REELS : REELS.filter((r) => r.category === filter);

  const outerRef = useRef(null);
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const [distance, setDistance] = useState(0);

  useLayoutEffect(() => {
    const measure = () => {
      if (trackRef.current && viewportRef.current) {
        setDistance(
          Math.max(
            0,
            trackRef.current.scrollWidth - viewportRef.current.clientWidth,
          ),
        );
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(trackRef.current);
    ro.observe(viewportRef.current);
    return () => ro.disconnect();
  }, [filter, mobile]);

  const { scrollYProgress } = useScroll({
    target: outerRef,
    offset: ["start start", "end end"],
  });
  const smooth = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    mass: 0.4,
  });
  const x = useTransform(smooth, (v) => -v * distance);
  const [progress, setProgress] = useState(0);
  useMotionValueEvent(smooth, "change", setProgress);

  const openReel = (r) => setOpen(list.findIndex((item) => item.id === r.id));
  const close = useCallback(() => setOpen(null), []);

  const head = (
    <div className="container reels-head">
      <SectionHead
        eyebrow="Video production"
        title={
          <>
            Reels that <span className="grad-text">stop the scroll.</span>
          </>
        }
        sub="Treatment explainers for Ouransh and healthcare campaigns for Vitoxyz, shot and edited by our in-house team. Scroll to play, click to watch with sound."
      />
      {REEL_FILTERS.length > 2 && (
        <div className="filters" role="tablist" aria-label="Filter videos">
          {REEL_FILTERS.map((f) => (
            <button
              key={f}
              role="tab"
              aria-selected={filter === f}
              className={filter === f ? "on" : ""}
              onClick={() => setFilter(f)}
            >
              {filter === f && (
                <motion.span
                  layoutId="reel-pill"
                  className="filter-pill"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <span>{f}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );

  const reels = (
    <AnimatePresence>
      {list.map((r, i) => (
        <Reel key={r.id} r={r} i={i} onOpen={openReel} paused={open !== null} />
      ))}
    </AnimatePresence>
  );

  return (
    <section className="reels-section" id="videos">
      {!mobile && list.length === 1 ? (
        <div className="section">
          <div className="reels-single">
            {head}
            <div ref={viewportRef}>
              <div ref={trackRef}>{reels}</div>
            </div>
          </div>
        </div>
      ) : mobile ? (
        <div className="section">
          {head}
          <div className="reels-swipe" ref={viewportRef}>
            <div className="reels-track" ref={trackRef}>
              {reels}
            </div>
          </div>
        </div>
      ) : (
        <div ref={outerRef} style={{ height: `calc(100vh + ${distance}px)` }}>
          <div className="reels-sticky">
            {head}
            <div className="reels-viewport" ref={viewportRef}>
              <motion.div className="reels-track" ref={trackRef} style={{ x }}>
                {reels}
              </motion.div>
            </div>
            {distance > 0 && (
              <div className="container reels-progress">
                <span className="rp-bar">
                  <i
                    style={{ transform: `scaleX(${Math.max(0.04, progress)})` }}
                  />
                </span>
                <span className="rp-hint">
                  {progress < 0.98 ? "Keep scrolling →" : "That’s a wrap ✦"}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
      <AnimatePresence>
        {open !== null && (
          <Player list={list} index={open} setIndex={setOpen} onClose={close} />
        )}
      </AnimatePresence>
    </section>
  );
}
