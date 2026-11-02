import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { EASE, Icon, SectionHead } from "./shared";
import { SERVICES } from "../data/content";

const WEBSITE_VIDEOS = [1, 2, 3, 4, 5, 6].map((n) => `/Websites & Online Presence/${n}.mp4`);
const PRINT_FOLDERS = [
  { label: "Banners", path: "banners", count: 6, extensions: { 3: "png" } },
  { label: "Standees", path: "standies", count: 4 },
  { label: "Flyers", path: "Flyers", count: 6 },
  { label: "Promotional Materials", path: "Promotional Materials", count: 3 },
];
const MEDIA_FOLDERS = {
  "Photo & Video": [
    { label: "Product Photography", path: "product photography", count: 6, type: "image" },
    { label: "Campaign Content", path: "Campaign Content", count: 2, type: "video" },
  ],
  "Digital Marketing": [
    { label: "Creative Design", path: "Creative Design", count: 2, type: "video" },
    { label: "Lead Generation", path: "Lead Generation", count: 2, type: "video" },
  ],
};
const OPENABLE_SERVICES = new Set(["Branding & Design", "Websites & Online Presence", "Print & Promotional Materials", ...Object.keys(MEDIA_FOLDERS)]);

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
            eyebrow="One partner for different marketing needs"
            title={<>Marketing services your customers can buy <span className="grad-text">through your company.</span></>}
            sub="Choose the services that fit your business. Viralstan handles the agreed marketing work while you manage your customer relationships."
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
            <StackCard key={s.no} s={s} i={i} total={SERVICES.length} progress={scrollYProgress} onOpen={OPENABLE_SERVICES.has(s.title) ? () => setShowCatalogue(s.title === "Branding & Design" ? { ...s, preview: "brochure" } : s) : null} />
          ))}
        </div>
      </div>
      {showCatalogue && (
        <div className="catalogue-modal-backdrop" role="presentation" onClick={() => setShowCatalogue(false)}>
          <div className="catalogue-modal" role="dialog" aria-modal="true" aria-labelledby="catalogue-title" onClick={(e) => e.stopPropagation()}>
            <button className="catalogue-close" type="button" onClick={() => setShowCatalogue(false)} aria-label="Close catalogue preview">×</button>
            <span className="eyebrow">{showCatalogue.kicker}</span>
            <h2 id="catalogue-title">{showCatalogue.title}</h2>
            <p className="catalogue-description">{showCatalogue.text}</p>
            <div className="tags catalogue-tags">
              {showCatalogue.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}
            </div>
            {showCatalogue.title === "Websites & Online Presence" && (
              <div className="service-popup-video-wrap">
                <div className="service-popup-video-grid">
                  {WEBSITE_VIDEOS.map((video, index) => (
                    <video key={video} className="service-popup-video" autoPlay muted loop playsInline preload="metadata" controls={false} disablePictureInPicture aria-label={`Website sample video ${index + 1}`}>
                      <source src={video} type="video/mp4" />
                    </video>
                  ))}
                </div>
              </div>
            )}
            {showCatalogue.title === "Print & Promotional Materials" && (
              <div className="print-popup-sections">
                {PRINT_FOLDERS.map((folder) => (
                  <section className="catalogue-preview" key={folder.path}>
                    <div className="catalogue-preview-head"><strong>{folder.label}</strong><span>Sample work</span></div>
                    <div className="catalogue-grid">
                      {Array.from({ length: folder.count }, (_, index) => index + 1).map((n) => (
                        <img key={n} src={`/${folder.path}/${n}.${folder.extensions?.[n] || "jpg"}`} alt={`${folder.label} sample ${n}`} />
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            )}
            {MEDIA_FOLDERS[showCatalogue.title] && (
              <div className="print-popup-sections">
                {MEDIA_FOLDERS[showCatalogue.title].map((folder) => (
                  <section className="catalogue-preview" key={folder.path}>
                    <div className="catalogue-preview-head"><strong>{folder.label}</strong><span>Sample work</span></div>
                    <div className="catalogue-grid">
                      {Array.from({ length: folder.count }, (_, index) => index + 1).map((n) => folder.type === "video" ? (
                        <video key={n} className="catalogue-media-video" src={`/${folder.path}/${n}.mp4`} autoPlay muted loop playsInline preload="auto" controls={false} />
                      ) : (
                        <img key={n} src={`/${folder.path}/${n}.jpg`} alt={`${folder.label} sample ${n}`} />
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            )}
            {showCatalogue.title === "Branding & Design" && <>
            <h3 className="catalogue-subtitle">Explore design samples</h3>
            <button className={`catalogue-select ${showCatalogue.preview === "brochure" ? "active" : ""}`} type="button" onClick={() => setShowCatalogue({ ...showCatalogue, preview: "brochure" })}>Brochure Design <span>→</span></button>
            <button className={`catalogue-select catalogue-select-secondary ${showCatalogue.preview === "brand" ? "active" : ""}`} type="button" onClick={() => setShowCatalogue({ ...showCatalogue, preview: "brand" })}>Logo &amp; Brand Identity <span>→</span></button>
            <button className={`catalogue-select catalogue-select-secondary ${showCatalogue.preview === "packaging" ? "active" : ""}`} type="button" onClick={() => setShowCatalogue({ ...showCatalogue, preview: "packaging" })}>Packaging &amp; Labels <span>→</span></button>
            <button className={`catalogue-select catalogue-select-secondary ${showCatalogue.preview === "profile" ? "active" : ""}`} type="button" onClick={() => setShowCatalogue({ ...showCatalogue, preview: "profile" })}>Company Profile <span>→</span></button>
            </>}
            {showCatalogue.preview === "brochure" && (
              <div className="catalogue-preview">
                <div className="catalogue-preview-head"><strong>Brochure Design</strong><span>Sample work</span></div>
                <div className="catalogue-grid">
                  {[1, 2, 3, 4, 5, 6].map((n) => <img key={n} src={`/catalogue/${n}.jpg`} alt={`Catalogue design sample ${n}`} />)}
                </div>
              </div>
            )}
            {showCatalogue.preview === "brand" && (
              <div className="catalogue-preview brand-preview">
                <div className="catalogue-preview-head"><strong>Logo &amp; Brand Identity</strong><span>Brand sample</span></div>
                <div className="catalogue-grid">
                  {[1, 2, 3, 4, 5, 6].map((n) => <img key={n} src={`/logo%20and%20brand%20identity/${n}.jpg`} alt={`Logo and brand identity sample ${n}`} />)}
                </div>
              </div>
            )}
            {showCatalogue.preview === "profile" && (
              <div className="catalogue-preview">
                <div className="catalogue-preview-head"><strong>Company Profile</strong><span>Sample work</span></div>
                <div className="catalogue-grid">
                  {[1, 2, 3, 4].map((n) => <img key={n} src={`/company%20profile/${n}.jpg`} alt={`Company profile sample ${n}`} />)}
                </div>
              </div>
            )}
            {showCatalogue.preview === "packaging" && (
              <div className="catalogue-preview">
                <div className="catalogue-preview-head"><strong>Packaging &amp; Labels</strong><span>Sample work</span></div>
                <div className="catalogue-grid">
                  {[1, 2, 3, 4, 5, 6].map((n) => <img key={n} src={`/packaging%20and%20labeling/${n}.jpg`} alt={`Packaging and labeling sample ${n}`} />)}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
