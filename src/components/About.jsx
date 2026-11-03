import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Icon, Reveal, SectionHead } from "./shared";
import { ABOUT, ABOUT_STATEMENT } from "../data/content";

function Word({ children, progress, range }) {
  const opacity = useTransform(progress, range, [0.15, 1]);
  return (
    <span className="ww-word">
      <motion.span style={{ opacity }}>{children}</motion.span>{" "}
    </span>
  );
}

export default function About() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 45%"] });
  const words = ABOUT_STATEMENT.split(" ");

  return (
    <section className="section" id="about">
      <div className="container">
        <SectionHead
          eyebrow="Viralstan × Sahil Sapra — one system, real results."
          title={<>More than just marketing. <span className="grad-text">A complete growth engine built for Sahil Sapra.</span></>}
        />
        <div className="ww-grid">
          <p className="ww-statement" ref={ref}>
            {words.map((w, i) => (
              <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
                {w}
              </Word>
            ))}
          </p>
          <div>
            {ABOUT.paragraphs.map((text, i) => (
              <Reveal as="p" className="ww-text" delay={i * 0.1} key={i}>{text}</Reveal>
            ))}
            <div className="ww-facts">
              {ABOUT.facts.map((f, i) => (
                <Reveal key={f.label} className="ww-fact" delay={0.15 + i * 0.08} x={30} y={0}>
                  <i><Icon name={f.icon} /></i>
                  {f.label}
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
