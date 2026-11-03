import { motion } from "framer-motion";
import { EASE, Icon, SectionHead } from "./shared";

const PLANS = [
  {
    no: "01",
    name: "SEO Package",
    price: "₹35,000",
    period: "/month",
    color: "#315eea",
    grad: "linear-gradient(135deg,#315eea,#0ea5e9)",
    tag: "Search Dominance",
    desc: "Own every local and technical search result in Sydney's Hills District.",
    features: [
      "On-Page SEO",
      "Off-Page SEO",
      "Technical SEO",
      "Local SEO",
      "Geo SEO",
      "5–7 Blogs per Month",
    ],
    icon: "globe",
  },
  {
    no: "02",
    name: "Social Media Management",
    price: "₹40,000",
    period: "/month",
    color: "#7c3aed",
    grad: "linear-gradient(135deg,#7c3aed,#df4da6)",
    tag: "Brand & Content",
    desc: "A complete monthly content system — posters, AI Reels and agent videos.",
    features: [
      "8 Premium Posters",
      "Festival & Occasion Posters",
      "5–6 AI Reel Videos",
      "5–6 Agent-led Videos",
      "Captions & Hashtags",
      "Monthly Performance Report",
    ],
    icon: "social",
  },
  {
    no: "03",
    name: "Ads Management",
    price: "₹10,000",
    period: "+ 30% of ad budget",
    color: "#f4295e",
    grad: "linear-gradient(135deg,#f4295e,#df4da6)",
    tag: "Paid Growth",
    desc: "Meta and Google ad campaigns managed end-to-end to maximise every rupee spent.",
    features: [
      "₹10,000 Monthly Service Charge",
      "30% of Ad Budget as Management Fee",
      "Meta (Facebook & Instagram) Ads",
      "Google Ads Campaigns",
      "Audience Research & Targeting",
      "Monthly Ad Performance Report",
    ],
    icon: "target",
  },
  {
    no: "04",
    name: "Website Design & Dev",
    price: "₹50,000",
    period: "one-time",
    color: "#0ea5e9",
    grad: "linear-gradient(135deg,#0ea5e9,#7c3aed)",
    tag: "Digital Foundation",
    desc: "A fast, animated, SEO-ready website with 15 pages and a full admin panel.",
    features: [
      "15 Pages Including Admin Panel",
      "Animated & Modern UI",
      "Responsive for All Screens",
      "Speed Optimised",
      "SEO-Friendly Structure",
      "Lead Capture & Enquiry Forms",
    ],
    icon: "code",
  },
];

export default function Pricing() {
  return (
    <section className="section pricing" id="pricing">
      <div className="container">
        <SectionHead
          center
          eyebrow="Transparent pricing"
          title={<>Simple packages. <span className="grad-text">Real results.</span></>}
          sub="Pick the services Sahil Sapra needs now — or stack them all for a complete growth system."
        />
        <div className="pricing-grid">
          {PLANS.map((plan, i) => (
            <motion.article
              key={plan.no}
              className="pricing-card"
              style={{ "--c": plan.color, "--g": plan.grad }}
              initial={{ opacity: 0, y: 70 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.85, delay: i * 0.1, ease: EASE }}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
            >
              {/* top bar accent */}
              <div className="pc-bar" />

              <div className="pc-header">
                <div className="pc-icon-wrap">
                  <Icon name={plan.icon} />
                </div>
                <div>
                  <span className="pc-no">{plan.no}</span>
                  <span className="pc-tag">{plan.tag}</span>
                </div>
              </div>

              <h3 className="pc-name">{plan.name}</h3>
              <p className="pc-desc">{plan.desc}</p>

              <div className="pc-price-block">
                <span className="pc-amount">{plan.price}</span>
                <span className="pc-period">{plan.period}</span>
              </div>

              <div className="pc-divider" />

              <ul className="pc-features">
                {plan.features.map((f) => (
                  <li key={f}>
                    <span className="pc-tick">
                      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 8l3.5 3.5L13 5" />
                      </svg>
                    </span>
                    {f}
                  </li>
                ))}
              </ul>

              <a href="#contact" className="pc-cta">
                Get Started
                <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                  <path d="M4 10h12M11 5l5 5-5 5" />
                </svg>
              </a>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
