import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EASE } from "./shared";

const LOGO_AT = 2300;
const DONE_AT = 3600;
const WORD = "Viralstan";

export default function Intro() {
  const [stage, setStage] = useState("welcome");

  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    document.documentElement.style.overflow = "hidden";
    const toLogo = setTimeout(() => setStage("logo"), LOGO_AT);
    const toDone = setTimeout(() => {
      setStage("done");
      document.documentElement.style.overflow = "";
    }, DONE_AT);
    return () => {
      clearTimeout(toLogo);
      clearTimeout(toDone);
      document.documentElement.style.overflow = "";
    };
  }, []);

  return (
    <AnimatePresence>
      {stage !== "done" && (
        <motion.div
          key="intro"
          className="intro"
          exit={{ opacity: 0, transition: { duration: 0.6, ease: EASE } }}
          aria-hidden="true"
        >
          <AnimatePresence mode="wait">
            {stage === "welcome" ? (
              <motion.div
                key="welcome"
                className="intro-welcome"
                exit={{ opacity: 0, y: -30, filter: "blur(10px)", transition: { duration: 0.45 } }}
              >
                <motion.span
                  className="intro-hello"
                  initial={{ opacity: 0, y: 14, letterSpacing: "0.7em" }}
                  animate={{ opacity: 1, y: 0, letterSpacing: "0.35em" }}
                  transition={{ duration: 0.9, ease: EASE }}
                >
                  Welcome to
                </motion.span>
                <h1 className="intro-word">
                  {WORD.split("").map((ch, i) => (
                    <span className="intro-mask" key={i}>
                      <motion.span
                        className={i === 0 ? "intro-v" : i >= 5 ? "intro-s" : undefined}
                        initial={{ y: "110%", rotate: 8 }}
                        animate={{ y: 0, rotate: 0 }}
                        transition={{ duration: 0.8, delay: 0.35 + i * 0.06, ease: EASE }}
                      >
                        {ch}
                      </motion.span>
                    </span>
                  ))}
                </h1>
                <motion.span
                  className="intro-line"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1, delay: 1, ease: EASE }}
                />
              </motion.div>
            ) : (
              <motion.img
                key="logo"
                src="/logoicon.png"
                alt=""
                className="intro-icon"
                initial={{ scale: 5, opacity: 0, rotate: -120, filter: "blur(16px)" }}
                animate={{ scale: 1, opacity: 1, rotate: 0, filter: "blur(0px)" }}
                exit={{ scale: 0.4, opacity: 0, transition: { duration: 0.4 } }}
                transition={{ duration: 1.1, ease: EASE }}
              />
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
