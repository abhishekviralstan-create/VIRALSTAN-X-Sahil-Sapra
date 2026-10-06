import { motion } from "framer-motion";
import { EASE, SectionHead } from "./shared";
import { TESTIMONIALS } from "../data/content";

const initials = (name) =>
  name
    .replace(/[^A-Za-z ]/g, " ")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

export default function Testimonials() {
  return (
    <section className="section" id="testimonials">
      <div className="container">
        <SectionHead
          center
          eyebrow="Client testimonials"
          title={<>Trusted by <span className="grad-text">100+ clients.</span></>}
          sub="Real words from the healthcare brands we grow online."
        />
        <div className="tm-grid">
          {TESTIMONIALS.map((t, i) => (
            <motion.figure
              key={t.name}
              className="tm-card"
              initial={{ opacity: 0, y: 60, rotateX: 14 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.9, delay: i * 0.15, ease: EASE }}
              whileHover={{ y: -8 }}
            >
              <div className="cf-head">
                <span className="avatar">{initials(t.name)}</span>
                <div>
                  <b>{t.name}</b>
                  <small>{t.role}</small>
                </div>
              </div>
              <div className="stars" aria-label="5 out of 5 stars">★★★★★</div>
              <blockquote>
                <p>“{t.text}”</p>
              </blockquote>
              <span className="tm-mark" aria-hidden="true">”</span>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
