import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EASE, Icon, Reveal } from "./shared";
import { CONTACT, CONTACT_GOALS, SPECIALITIES } from "../data/content";

const AUDIT_POINTS = [
  "Google Business Profile & Maps ranking check",
  "Website speed, booking flow and SEO review",
  "Social media and competitor comparison",
  "A clear partnership model for your business",
];

const EMPTY = { name: "", clinic: "", phone: "", speciality: "", goals: [] };

export default function Contact() {
  const [form, setForm] = useState(EMPTY);
  // idle → sending → sent | error
  const [status, setStatus] = useState("idle");
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const toggleGoal = (g) =>
    setForm((f) => ({ ...f, goals: f.goals.includes(g) ? f.goals.filter((x) => x !== g) : [...f.goals, g] }));

  const whatsappText = () =>
    [
      `Hi Viralstan, I'd like to discuss the manufacturer partnership.`,
      `Name: ${form.name}`,
      `Company & city: ${form.clinic}`,
      `Phone: ${form.phone}`,
      form.speciality && `Services required: ${form.speciality}`,
      form.goals.length && `Looking for: ${form.goals.join(", ")}`,
    ]
      .filter(Boolean)
      .join("\n");

  const openWhatsApp = () =>
    window.open(`https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(whatsappText())}`, "_blank", "noopener");

  const onSubmit = async (e) => {
    e.preventDefault();
    // No sheet connected yet: fall back to sending the details on WhatsApp.
    if (!CONTACT.sheetUrl) return openWhatsApp();

    setStatus("sending");
    try {
      // Google Apps Script doesn't send CORS headers, so the response is opaque;
      // a request that resolves means the row reached the sheet.
      await fetch(CONTACT.sheetUrl, {
        method: "POST",
        mode: "no-cors",
        body: new URLSearchParams({
          name: form.name,
          clinic: form.clinic,
          phone: form.phone,
          speciality: form.speciality,
          goals: form.goals.join(", "),
          page: window.location.href,
        }),
      });
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  const reset = () => {
    setForm(EMPTY);
    setStatus("idle");
  };

  return (
    <section className="section contact" id="contact">
      <div className="container">
        <Reveal className="contact-card">
          <span className="review-orb o1" />
          <span className="review-orb o2" />
          <div className="contact-copy">
            <span className="review-eyebrow">Discuss the partnership</span>
            <h2>Let’s fill your appointment book.</h2>
            <p>
              Share a few details and we will discuss the right white-label services, charges and working model for your business.
            </p>
            <ul className="contact-points">
              {AUDIT_POINTS.map((p) => (
                <li key={p}><Icon name="shield" />{p}</li>
              ))}
            </ul>
            <div className="contact-direct">
              <a href={`https://wa.me/${CONTACT.whatsapp}`} target="_blank" rel="noreferrer"><Icon name="chat" />WhatsApp us</a>
              <a href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}><Icon name="phone" />{CONTACT.phone}</a>
              <a href={`mailto:${CONTACT.email}`}><Icon name="mail" />{CONTACT.email}</a>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {status === "sent" ? (
              <motion.div
                key="sent"
                className="contact-form contact-done"
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: EASE }}
              >
                <motion.span
                  className="contact-done-icon"
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 220, damping: 14, delay: 0.15 }}
                >
                  ✓
                </motion.span>
                <h3>Thank you, {form.name.split(" ").slice(0, 2).join(" ") || "there"}!</h3>
                <p>We have received your details. Our team will reach out within one working day to discuss the partnership.</p>
                <button type="button" className="contact-submit" onClick={openWhatsApp}>
                  <Icon name="chat" /> Chat with us on WhatsApp
                </button>
                <button type="button" className="contact-again" onClick={reset}>Submit another enquiry</button>
              </motion.div>
            ) : (
              <motion.form key="form" className="contact-form" onSubmit={onSubmit} exit={{ opacity: 0, scale: 0.96 }}>
                <label>
                  Your name
                  <input required value={form.name} onChange={set("name")} placeholder="Dr. Your Name" />
                </label>
                <label>
                  Company name & city
                  <input required value={form.clinic} onChange={set("clinic")} placeholder="Your Manufacturing Company" />
                </label>
                <label>
                  Phone / WhatsApp
                  <input required type="tel" value={form.phone} onChange={set("phone")} placeholder="+91 98765 43210" />
                </label>
                <label>
                  Services you need
                  <select value={form.speciality} onChange={set("speciality")}>
                    <option value="">Select a service</option>
                    {SPECIALITIES.map((s) => <option key={s.name}>{s.name}</option>)}
                    <option>Other</option>
                  </select>
                </label>
                <fieldset>
                  <legend>What do you need?</legend>
                  <div className="contact-goals">
                    {CONTACT_GOALS.map((g) => (
                      <button
                        type="button"
                        key={g}
                        className={form.goals.includes(g) ? "on" : ""}
                        onClick={() => toggleGoal(g)}
                        aria-pressed={form.goals.includes(g)}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </fieldset>
                <motion.button
                  type="submit"
                  className="contact-submit"
                  disabled={status === "sending"}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {status === "sending" ? "Sending…" : <>Discuss the partnership <span aria-hidden="true">→</span></>}
                </motion.button>
                {status === "error" ? (
                  <small className="contact-error">
                    Couldn’t send right now. Please check your internet and try again, or{" "}
                    <button type="button" onClick={openWhatsApp}>send it on WhatsApp</button>.
                  </small>
                ) : (
                  <small>{CONTACT.sheetUrl ? "We reply within one working day." : "Opens WhatsApp with your details filled in."}</small>
                )}
              </motion.form>
            )}
          </AnimatePresence>
        </Reveal>
      </div>
    </section>
  );
}
