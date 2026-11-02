import { useState } from "react";
import { motion } from "framer-motion";
import { EASE, Reveal } from "./shared";
import { GOOGLE_REVIEW_URL } from "../data/content";

export function Thanks() {
  return (
    <section className="section thanks" id="thanks">
      <div className="container thanks-inner">
        <motion.img
          src="/logoicon.png"
          alt=""
          className="thanks-icon"
          initial={{ scale: 0, rotate: -180 }}
          whileInView={{ scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: EASE }}
        />
        <h2 className="thanks-title">
          {["Thank", "you."].map((w, i) => (
            <span className="intro-mask" key={w}>
              <motion.span
                className={i === 1 ? "grad-text" : undefined}
                initial={{ y: "110%" }}
                whileInView={{ y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: 0.2 + i * 0.12, ease: EASE }}
              >
                {w}
              </motion.span>
            </span>
          ))}
        </h2>
        <Reveal as="p" className="thanks-text" delay={0.4}>
          Thank you for taking the time to explore the partnership. We help manufacturers offer more to their customers,
          without building a full marketing team in-house.
        </Reveal>
        <Reveal as="p" className="thanks-sign" delay={0.55}>— Team Viralstan</Reveal>
      </div>
    </section>
  );
}

export function Review() {
  const [hover, setHover] = useState(0);
  const openGoogle = () => window.open(GOOGLE_REVIEW_URL, "_blank", "noopener");

  return (
    <section className="section review" id="review">
      <div className="container">
        <Reveal className="review-card">
          <span className="review-orb o1" />
          <span className="review-orb o2" />
          <span className="review-eyebrow">Your feedback matters</span>
          <h2>How was your experience with Viralstan?</h2>
          <p>Worked with us? Tap a star and share your review on Google. It takes less than a minute and helps other brands find us.</p>
          <div className="review-stars" onMouseLeave={() => setHover(0)} role="group" aria-label="Rate Viralstan on Google">
            {[1, 2, 3, 4, 5].map((n) => (
              <motion.button
                key={n}
                className={n <= (hover || 5) ? "on" : ""}
                onMouseEnter={() => setHover(n)}
                onFocus={() => setHover(n)}
                onClick={openGoogle}
                aria-label={`Rate ${n} star${n > 1 ? "s" : ""} on Google`}
                initial={{ opacity: 0, scale: 0, rotate: -90 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 260, damping: 14, delay: 0.3 + n * 0.08 }}
                whileHover={{ scale: 1.25, rotate: 12 }}
                whileTap={{ scale: 0.9 }}
              >
                ★
              </motion.button>
            ))}
          </div>
          <motion.a
            href={GOOGLE_REVIEW_URL}
            target="_blank"
            rel="noreferrer"
            className="review-btn"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            <svg viewBox="0 0 48 48" aria-hidden="true">
              <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.6-.4-3.9z" />
              <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
              <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2A11.9 11.9 0 0 1 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" />
              <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3a12 12 0 0 1-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.6-.4-3.9z" />
            </svg>
            Write a review on Google <span aria-hidden="true">→</span>
          </motion.a>
        </Reveal>
        <p className="copyright">© {new Date().getFullYear()} Viralstan. All rights reserved.</p>
      </div>
    </section>
  );
}
