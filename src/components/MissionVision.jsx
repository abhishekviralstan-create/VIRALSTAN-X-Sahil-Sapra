import { motion } from "framer-motion";
import { EASE, Icon, SectionHead } from "./shared";
import { MISSION_VISION } from "../data/content";

const ICONS = { "The idea": "star", "The outcome": "target" };

export default function MissionVision() {
  return (
    <section className="section mv" id="mission">
      <div className="container">
        <SectionHead
          center
          eyebrow="Our mission & vision"
          title={<>What drives us <span className="grad-text">every day.</span></>}
        />
        <div className="mv-grid">
          {MISSION_VISION.map((m, i) => (
            <motion.article
              key={m.label}
              className="mv-card"
              style={{ "--g": m.grad }}
              initial={{ opacity: 0, y: 60, rotateX: 18 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.9, delay: i * 0.15, ease: EASE }}
              whileHover={{ y: -8 }}
            >
              <span className="mv-glow" />
              <motion.span
                className="mv-icon"
                initial={{ scale: 0, rotate: -120 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.3 + i * 0.15 }}
              >
                <Icon name={ICONS[m.label]} />
              </motion.span>
              <span className="mv-label">Our {m.label}</span>
              <p>{m.text}</p>
              <span className="mv-num">0{i + 1}</span>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
