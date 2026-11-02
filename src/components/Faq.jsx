import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EASE, Reveal, SectionHead } from "./shared";
import { FAQS } from "../data/content";

export default function Faq() {
  const [open, setOpen] = useState(0);

  return (
    <section className="section faq" id="faq">
      <div className="container faq-layout">
        <SectionHead
          eyebrow="Questions manufacturers ask"
          title={<>Good questions, <span className="grad-text">straight answers.</span></>}
          sub="Everything businesses usually ask before working with us. Still unsure? Message us and we will reply."
        />
        <div className="faq-list">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={f.q} className={`faq-item ${isOpen ? "open" : ""}`} delay={i * 0.06} y={30}>
                <button className="faq-q" onClick={() => setOpen(isOpen ? -1 : i)} aria-expanded={isOpen}>
                  <span>{f.q}</span>
                  <i aria-hidden="true">+</i>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      className="faq-a"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.45, ease: EASE }}
                    >
                      <p>{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
