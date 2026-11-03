import { motion } from "framer-motion";
import { EASE, SectionHead } from "./shared";
import { SPECIALITIES } from "../data/content";

const GRADS = ["var(--g-pink)", "var(--g-violet)", "var(--g-cyan)"];

export default function Specialities() {
  return (
    <section className="section spec" id="specialities">
      <div className="container">
        <SectionHead
          center
          eyebrow="What Viralstan does for Sahil Sapra"
          title={<>Five services. One complete <span className="grad-text">real estate growth system.</span></>}
          sub="From a fast SEO website and AI Reels to video editing, a dedicated caller and local SEO — every piece works together to grow Sahil's business."
        />
        <div className="spec-grid">
          {SPECIALITIES.map((s, i) => (
            <motion.article
              key={s.name}
              className="spec-card"
              style={{ "--g": GRADS[i % GRADS.length] }}
              initial={{ opacity: 0, y: 50, rotateX: 14 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, delay: (i % 4) * 0.08, ease: EASE }}
              whileHover={{ y: -8 }}
            >
              <h3>{s.name}</h3>
              <p>{s.text}</p>
              <span className="spec-no">{String(i + 1).padStart(2, "0")}</span>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
