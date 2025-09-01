/* global React, ReactDOM, framerMotion */
const { useState, useEffect, useMemo, useRef } = React;
const { motion, useScroll, useTransform } = framerMotion || {};

// --- Safe fallback if framerMotion failed to load ---
const FM_OK = !!(motion && useScroll && useTransform);
const Fallback = ({ children, ...props }) => <div {...props}>{children}</div>;
const Motion = FM_OK ? motion : new Proxy(Fallback, { get: () => Fallback });

function useScrollSafe() {
  if (!FM_OK) return { scrollY: { on: () => {}, get: () => 0 } };
  return useScroll();
}
function useTransformSafe(...args) {
  if (!FM_OK) return 1;
  return useTransform(...args);
}

// ------- Shared Animation Variants -------
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};
const staggerParent = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

// ------- Utility: Smooth scroll to id -------
const scrollToId = (id) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

// ------- Check Icon -------
const CheckIcon = (props) => (
  <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <path d="M16 6L8.5 14 4 9.5" strokeLinecap="round" strokeLinejoin="round"></path>
  </svg>
);

// ------- Logo -------
function LogoMark({ withText = true }) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative h-8 w-8 rounded-full bg-gradient-to-br from-cyan-400 via-fuchsia-500 to-violet-600 shadow-[0_0_40px_rgba(34,211,238,0.35)]" />
      {withText && (
        <div className="leading-none">
          <div className="text-[11px] tracking-[0.28em] text-white/80">PEPPER</div>
          <div className="text-[11px] tracking-[0.28em] text-white">MILLS</div>
        </div>
      )}
    </div>
  );
}

// ------- Sticky Header -------
function StickyHeader() {
  const { scrollY } = useScrollSafe();
  const show = useTransformSafe(scrollY, [0, 60], [0, 1]);
  const scale = useTransformSafe(scrollY, [0, 120], [0.98, 1]);

  const style = FM_OK ? { opacity: show, scale } : {};
  const Comp = FM_OK ? Motion.div : "div";

  return (
    <Comp style={style} className="fixed inset-x-0 top-4 z-50 flex justify-center">
      <div className="mx-4 w-full max-w-6xl rounded-full border border-white/10 bg-black/40 backdrop-blur-lg">
        <div className="flex items-center justify-between px-4 py-2">
          <LogoMark />
          <nav className="hidden gap-6 md:flex">
            {[
              { id: "experience", label: "Experience" },
              { id: "platform", label: "Platform" },
              { id: "circuits", label: "Circuits" },
              { id: "membership", label: "Membership" },
              { id: "mission", label: "Mission" },
            ].map((link) => (
              <button key={link.id} onClick={() => scrollToId(link.id)} className="text-sm text-white/70 transition-colors hover:text-white">
                {link.label}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <button onClick={() => scrollToId("franchise")} className="rounded-full border border-cyan-400/50 bg-white/5 px-4 py-2 text-sm text-cyan-300 backdrop-blur-md transition-transform hover:scale-[1.03]">
              Request Access
            </button>
          </div>
        </div>
      </div>
    </Comp>
  );
}

// ------- Background Carousel -------
function BackgroundCarousel({ images = [], interval = 4500 }) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (!images.length) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % images.length), interval);
    return () => clearInterval(id);
  }, [images, interval]);

  const Comp = FM_OK ? Motion.div : "div";

  return (
    <div className="absolute inset-0 -z-20">
      {images.map((src, i) => (
        <Comp
          key={src}
          initial={{ opacity: 0 }}
          animate={{ opacity: i === index ? 1 : 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${src})` }}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/80" />
    </div>
  );
}

// ------- Hero -------
function Hero() {
  const heroImages = [
    "https://images.unsplash.com/photo-1521804906057-1df8fdb718b6?q=80&w=2484&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1558611848-73f7eb4001a1?q=80&w=2484&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1579758629938-03607ccdbaba?q=80&w=2484&auto=format&fit=crop",
  ];
  const Comp = FM_OK ? Motion.div : "div";

  return (
    <section id="home" className="relative min-h-[100svh] w-full">
      <BackgroundCarousel images={heroImages} />
      <div className="mx-auto flex h-full max-w-6xl flex-col items-start justify-center px-6 py-28">
        <Comp variants={staggerParent} initial="hidden" animate="visible" className="max-w-3xl">
          <Comp variants={fadeUp} className="bg-gradient-to-b from-white via-white to-cyan-300 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent sm:text-6xl">
            Forge Your Prime
          </Comp>
          <Comp variants={fadeUp} className="mt-4 max-w-2xl text-lg leading-relaxed text-white/85">
            A private studio for founders and builders engineering the upper limits of human potential. Your biology is your biography.
          </Comp>
          <Comp variants={fadeUp} className="mt-8 flex flex-wrap items-center gap-3">
            <button onClick={() => scrollToId("platform")} className="rounded-full border border-cyan-400/50 bg-white/5 px-5 py-3 text-sm font-medium text-cyan-300 backdrop-blur md:hover:scale-[1.03] md:transition-transform">
              Explore the Platform
            </button>
            <button onClick={() => scrollToId("membership")} className="rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-medium text-white/90 backdrop-blur md:hover:scale-[1.03] md:transition-transform">
              View Membership
            </button>
          </Comp>
        </Comp>
      </div>
    </section>
  );
}

// ------- Philosophy -------
function Philosophy() {
  const Comp = FM_OK ? Motion.div : "div";
  return (
    <section id="experience" className="relative w-full py-24">
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center opacity-60"
        style={{ backgroundImage: "linear-gradient(rgba(0,0,0,0.60),rgba(0,0,0,0.85)), url('https://images.unsplash.com/photo-1533449422022-6928940b0e91?q=80&w=2574&auto=format&fit=crop')" }}
      />
      <div className="mx-auto max-w-3xl px-6 text-center">
        <Comp variants={staggerParent} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
          <Comp variants={fadeUp} className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs text-cyan-300">
            THE THESIS
          </Comp>
          <Comp variants={fadeUp} className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Biology is Biography.
          </Comp>
          <Comp variants={fadeUp} className="mt-5 text-white/80">
            We believe the stories we live are written in our cells long before they're written in the world. Performance, creativity, and impact are not hustled for; they are outputs of a precisely calibrated human system. Pepper Mills is a laboratory for living your most potent narrative—not just adding years to your life, but life to your years.
          </Comp>
        </Comp>
      </div>
    </section>
  );
}

// ------- Platform Cards -------
const platformCards = [
  { title: "Reversal Labs", desc: "HBOT, cryo, and red light therapies to accelerate recovery and cellular rejuvenation.", img: "https://images.unsplash.com/photo-1550439062-609e1531270e?q=80&w=2484&auto=format&fit=crop" },
  { title: "Mind Sanctuary", desc: "Minimalist meditation and breathwork studios crafted for cognitive clarity.", img: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2484&auto=format&fit=crop" },
  { title: "Metabolic Bar", desc: "Nutrient-dense cuisine engineered for energy, focus, and longevity.", img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2484&auto=format&fit=crop" },
  { title: "NuVentures Incubator", desc: "Deep work bays and venture tooling to translate clarity into creation.", img: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2484&auto=format&fit=crop" },
];

function AIArchitect() {
  const [goal, setGoal] = useState("");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState(null);

  const mockResponse = (goalText) => `# 3-Day Protocol

**Goal:** ${goalText || "Build focus, energy, and recovery"}

## Day 1
- **Reversal Labs:** 3× Cryo (2 min) + 10 min Red Light (post-cryo)
- **Mind Sanctuary:** 15 min box-breath priming + 10 min body scan (evening)
- **Metabolic Bar:** High-protein, low-glycemic meals; hydration target 3L
- **NuVentures:** 2× 90-min deep-work blocks (AM/PM), phone in locker

## Day 2
- **Reversal Labs:** HBOT 60 min + 10 min Red Light
- **Mind Sanctuary:** 20 min mindfulness + 5 min physiological sighs pre-work
- **Metabolic Bar:** Omega-3 rich lunch; caffeine cutoff 2pm
- **NuVentures:** 1× 120-min build sprint + 30 min review/plan

## Day 3
- **Reversal Labs:** Contrast: Cryo (2 min) → Red Light (10 min) ×2
- **Mind Sanctuary:** 10 min breath cadence (6 bpm) + gratitude journaling
- **Metabolic Bar:** Polyphenol-heavy dinner; evening magnesium
- **NuVentures:** 2× 60-min focus blocks + founder walk debrief`;

  async function generateProtocol() {
    if (!goal.trim()) { setOutput("Please enter a goal first."); return; }
    setLoading(true); setOutput(null);
    try { await new Promise((r) => setTimeout(r, 700)); setOutput(mockResponse(goal)); }
    catch (e) { setOutput("We couldn't reach the generator. Showing a local sample instead.\n\n" + mockResponse(goal)); }
    finally { setLoading(false); }
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-black/40 p-6 backdrop-blur">
      <div className="space-y-1">
        <h4 className="text-2xl font-semibold text-white">AI Protocol Architect</h4>
        <p className="mt-1 text-sm text-white/70">Describe your goal and generate a 3-day protocol using our modalities.</p>
      </div>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <input value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="e.g., Improve deep sleep and morning focus" className="w-full rounded-full border border-white/15 bg-black/50 px-4 py-3 text-sm text-white outline-none placeholder:text-white/40" />
        <button onClick={generateProtocol} disabled={loading} className="inline-flex items-center justify-center rounded-full border border-cyan-400/50 bg-white/5 px-5 py-3 text-sm font-medium text-cyan-300 backdrop-blur transition-transform disabled:opacity-60 md:hover:scale-[1.03]">
          {loading ? "Generating…" : "Generate Protocol"}
        </button>
      </div>
      {output && <pre className="mt-4 whitespace-pre-wrap rounded-2xl border border-white/10 bg-black/50 p-4 font-mono text-[13px] leading-relaxed text-white/90">{output}</pre>}
    </div>
  );
}

function Platform() {
  const Comp = FM_OK ? Motion.div : "div";
  return (
    <section id="platform" className="relative w-full py-24">
      <div className="mx-auto max-w-6xl px-6">
        <h3 className="mb-10 text-3xl font-bold tracking-tight text-white sm:text-4xl">An Architecture for Potentiation</h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {platformCards.map((c) => (
            <Comp key={c.title} className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/5 to-white/[0.03]">
              <div className="absolute inset-0 -z-10 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.35),rgba(0,0,0,0.75)), url(${c.img})` }} />
              <div className="relative p-6 sm:p-7">
                <h4 className="text-xl font-semibold text-white">{c.title}</h4>
                <p className="mt-2 text-white/75">{c.desc}</p>
                <div className="mt-5 inline-flex items-center gap-2 text-sm text-cyan-300">
                  <span className="inline-flex h-2 w-2 rounded-full bg-cyan-400/80" /> Learn more
                </div>
              </div>
            </Comp>
          ))}
        </div>
        <div className="mt-12"><AIArchitect /></div>
      </div>
    </section>
  );
}

// ------- Circuits -------
const circuits = [
  { name: "Prime Reset", tag: "Founders • 35 min", focus: "Nervous system downshift + clarity", blocks: ["Breath cadence 6 bpm", "Red Light 10 min", "Deep Work 60 min"] },
  { name: "Metabolic Charge", tag: "Builders • 45 min", focus: "Energy + insulin sensitivity", blocks: ["Cryo 2 min", "HBOT 30–60 min", "Polyphenol meal"] },
  { name: "Cognition Forge", tag: "Elite • 50 min", focus: "Focus + context switching", blocks: ["Mindfulness 15 min", "HBOT 60 min", "Build sprint 90 min"] },
];

function Circuits() {
  return (
    <section id="circuits" className="relative w-full py-24">
      <div className="mx-auto max-w-6xl px-6">
        <h3 className="mb-10 text-3xl font-bold tracking-tight text-white sm:text-4xl">Precision Circuits</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {circuits.map((c) => (
            <div key={c.name} className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-black/40 px-3 py-1 text-xs text-cyan-300">{c.tag}</div>
              <h4 className="mt-3 text-xl font-semibold text-white">{c.name}</h4>
              <p className="mt-1 text-white/70">{c.focus}</p>
              <ul className="mt-4 space-y-2 text-white/80">
                {c.blocks.map((b) => (
                  <li key={b} className="flex items-start gap-2">
                    <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-cyan-400" /> {b}
                  </li>
                ))}
              </ul>
              <button className="mt-5 w-full rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/90 backdrop-blur transition-transform hover:scale-[1.02]">
                Add to Protocol
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ------- Membership -------
const tiers = [
  { name: "Catalyst", price: "$249/mo", popular: false, features: ["Mind Sanctuary access","Metabolic Bar member pricing","Monthly protocol refresh","Community events"] },
  { name: "Architect", price: "$589/mo", popular: true, features: ["All Catalyst benefits","2× HBOT or Cryo sessions / week","Red Light bundle","Weekly deep-work bay reservation"] },
  { name: "Luminary", price: "$1,290/mo", popular: false, features: ["All Architect benefits","Unlimited Cryo + Red Light","4× HBOT sessions / month","Concierge scheduling + founder labs"] },
];

function Membership() {
  return (
    <section id="membership" className="w-full py-24">
      <div className="mx-auto max-w-6xl px-6">
        <h3 className="mb-10 text-3xl font-bold tracking-tight text-white sm:text-4xl">Commit to Your Trajectory</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {tiers.map((t) => (
            <div key={t.name} className={`relative rounded-3xl border bg-gradient-to-b from-white/5 to-white/[0.03] p-6 ${t.popular ? "border-cyan-400/40 shadow-[0_0_60px_rgba(34,211,238,0.15)]" : "border-white/10"}`}>
              {t.popular && <div className="absolute -top-3 right-4 rounded-full border border-cyan-400/40 bg-black/60 px-3 py-1 text-xs text-cyan-300">Most Popular</div>}
              <h4 className="text-xl font-semibold text-white">{t.name}</h4>
              <div className="mt-2 text-3xl font-bold text-white">{t.price}</div>
              <ul className="mt-5 space-y-2">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-white/80">
                    <CheckIcon className="mt-[2px] text-cyan-300" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6"><button className="w-full rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/90 backdrop-blur transition-transform hover:scale-[1.02]">Choose {t.name}</button></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ------- Testimonials -------
const testimonials = [
  { quote: "We replaced hustle with design. My recovery scores and investor updates both improved in the same quarter.", name: "Elena Ruiz", title: "Founder, Biotech Startup", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop" },
  { quote: "Deep-work bays + HBOT changed my cadence. I ship faster without the rollercoaster.", name: "Marcus Lee", title: "CTO, Fintech", img: "https://images.unsplash.com/photo-1541534401786-2077eed87a72?q=80&w=800&auto=format&fit=crop" },
];

function Testimonials() {
  return (
    <section id="mission" className="w-full py-24">
      <div className="mx-auto max-w-6xl px-6">
        <h3 className="mb-10 text-3xl font-bold tracking-tight text-white sm:text-4xl">Results, Not Resolutions</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {testimonials.map((t) => (
            <div key={t.name} className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
              <div className="flex items-start gap-4">
                <img src={t.img} alt={t.name} className="h-14 w-14 rounded-full object-cover" />
                <div>
                  <p className="text-white/90">“{t.quote}”</p>
                  <div className="mt-3 text-sm text-white/60"><span className="text-white/90">{t.name}</span> — {t.title}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ------- Franchise CTA -------
function FranchiseCTA() {
  return (
    <section id="franchise" className="relative w-full py-20">
      <div className="absolute inset-0 -z-10 bg-cover bg-center" style={{ backgroundImage: "linear-gradient(rgba(0,0,0,0.6),rgba(0,0,0,0.8)), url('https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=2574&auto=format&fit=crop')" }} />
      <div className="mx-auto flex max-w-4xl flex-col items-center px-6 text-center">
        <h3 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Bring the Platform to Your City</h3>
        <p className="mt-3 max-w-2xl text-white/80">Launch a Pepper Mills node with our turnkey playbook for space, services, and systems.</p>
        <div className="mt-6">
          <button className="rounded-full border border-cyan-400/50 bg-white/5 px-5 py-3 text-sm font-medium text-cyan-300 backdrop-blur transition-transform hover:scale-[1.03]">Request Partnership Brief</button>
        </div>
      </div>
    </section>
  );
}

// ------- Footer -------
function Footer() {
  return (
    <footer className="w-full border-t border-white/10 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 text-center md:flex-row md:text-left">
        <div className="flex items-center gap-3">
          <LogoMark withText={false} />
          <div>
            <div className="text-white">Pepper Mills Studios</div>
            <div className="text-sm text-white/60">Reverse Age. Accelerate Life.</div>
          </div>
        </div>
        <button onClick={() => scrollToId("home")} className="text-sm text-white/70 hover:text-white">Back to top ↑</button>
      </div>
    </footer>
  );
}

// ------- Page Container -------
function App() {
  useEffect(() => {
    document.body.classList.add("bg-black");
    return () => document.body.classList.remove("bg-black");
  }, []);

  return (
    <div className="min-h-screen text-white">
      <StickyHeader />
      <Hero />
      <Philosophy />
      <Platform />
      <Circuits />
      <Membership />
      <Testimonials />
      <FranchiseCTA />
      <Footer />
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
