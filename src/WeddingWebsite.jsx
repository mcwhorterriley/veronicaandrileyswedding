import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Camera, Film, Gift, Home as HomeIcon } from "lucide-react";

const ASSETS = {
  background: "/background.png",
  pooh: "/pooh-silhouette.png",
  envelope: "/envelope.png",
  footer: "/footer.png",
  chime: "/magic-chime.mp3",
  amazon: "/amazon.png",

  albumA: [
    "/ePhotos/1.jpg", "/ePhotos/2.jpg", "/ePhotos/3.jpg", "/ePhotos/4.jpg", "/ePhotos/5.jpg", "/ePhotos/6.jpg", "/ePhotos/7.jpg", "/ePhotos/8.jpg", "/ePhotos/9.jpg",
    "/ePhotos/10.jpg", "/ePhotos/11.jpg", "/ePhotos/12.jpg", "/ePhotos/13.jpg", "/ePhotos/14.jpg", "/ePhotos/15.jpg", "/ePhotos/16.jpg", "/ePhotos/17.jpg", "/ePhotos/18.jpg", "/ePhotos/19.jpg", "/ePhotos/20.jpg", ],
  albumB: [
    "/italy/1.jpg", "/italy/2.jpg", "/italy/3.jpg", "/italy/4.jpg", "/italy/5.jpg", "/italy/6.jpg", "/italy/7.jpg", "/italy/8.jpg", "/italy/9.jpg", "/italy/10.jpg", "/italy/11.jpg",
    "/italy/13.jpg", "/italy/28.jpg", "/italy/14.jpg", "/italy/27.jpg", "/italy/15.jpg", "/italy/16.jpg", "/italy/17.jpg", "/italy/18.jpg", "/italy/19.jpg", "/italy/20.jpg", "/italy/21.jpg",
    "/italy/22.jpg", "/italy/23.jpg", "/italy/24.jpg", "/italy/25.jpg", "/italy/26.jpg",  "/italy/29.jpg", "/italy/30.jpg", "/italy/31.jpg", "/italy/32.jpg",
    "/italy/33.jpg", "/italy/34.jpg", "/italy/35.jpg", "/italy/36.jpg", "/italy/37.jpg", "/italy/38.jpg", "/italy/39.jpg", "/italy/40.jpg", "/italy/41.jpg", "/italy/42.jpg",
    "/italy/43.jpg", "/italy/44.jpg", "/italy/45.jpg", "/italy/46.jpg", "/italy/47.jpg", "/italy/48.jpg", "/italy/49.jpg", "/italy/50.jpg", "/italy/51.jpg", "/italy/52.jpg",
    "/italy/53.jpg", "/italy/54.jpg", "/italy/55.jpg", "/italy/56.jpg", "/italy/57.jpg", "/italy/58.jpg", "/italy/59.jpg", "/italy/60.jpg", "/italy/61.jpg", "/italy/62.jpg", "/italy/63.jpg",
    "/italy/64.jpg", "/italy/65.jpg", "/italy/66.jpg", "/italy/67.jpg", "/italy/68.jpg", "/italy/69.jpg", "/italy/70.jpg", "/italy/71.jpg", "/italy/72.jpg", "/italy/73.jpg",
    "/italy/74.jpg", "/italy/75.jpg", "/italy/76.jpg", "/italy/77.jpg", "/italy/78.jpg", "/italy/79.jpg", "/italy/80.jpg", "/italy/81.jpg", "/italy/82.jpg", "/italy/83.jpg",
    "/italy/84.jpg",  "/italy/85.jpg",  "/italy/86.jpg",  "/italy/87.jpg",  "/italy/88.jpg",  "/italy/89.jpg",  "/italy/90.jpg",  "/italy/91.jpg",  "/italy/92.jpg",  "/italy/93.jpg",],
};

ASSETS.slideshow = [...ASSETS.albumA, ...ASSETS.albumB].sort(() => Math.random() - 0.5);

const REGISTRY_LINKS = [
  {
    label: "Amazon",
    href: "https://www.amazon.com/wedding/registry/FS3BNV5M1DJC",
    img: "/amazon.png",
  },
];

/* ----------------------------------------------------------
   Global site background
---------------------------------------------------------- */
const GlobalBackground = () => {
  useEffect(() => {
    const img = new Image();
    img.src = ASSETS.background;
  }, []);

  return (
    <div
      aria-hidden
      className="fixed inset-0 z-0 bg-no-repeat bg-center bg-cover"
      style={{ backgroundImage: `url(${ASSETS.background})` }}
    />
  );
};

/* ----------------------------------------------------------
   ScreenFlash (respects reduced motion)
---------------------------------------------------------- */
const ScreenFlash = ({ duration = 1400 }) => {
  const reduce = useReducedMotion();
  if (reduce) return null;
  return (
    <motion.div
      className="fixed inset-0 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 0] }}
      transition={{ duration: duration / 1000, ease: "easeInOut" }}
      style={{
        background:
          "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.75) 25%, rgba(255,255,255,0.25) 55%, rgba(255,255,255,0) 80%)",
        mixBlendMode: "screen",
        filter: "blur(2px) brightness(1.1)",
    }}
  />
  );
};

/* ----------------------------------------------------------
   FireworkBurst
---------------------------------------------------------- */
const FireworkBurst = ({ origin = { x: "50%", y: "50%" }, local = false }) => {
  const ref = useRef(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return; // skip for reduced motion users

    const host = ref.current;
    if (!host) return;

    const make = (count, painter) => {
      for (let i = 0; i < count; i++) painter(i);
    };
    const toCss = (v) => (typeof v === "number" ? `${v}px` : v);

    const addParticle = ({ size = 3, color = "rgba(255,255,255,1)", blur = 0, opacity = 1, life = 1600, delay = 0, keyframes = [], shadow = "" }) => {
      const p = document.createElement("span");
      p.className = "absolute rounded-full pointer-events-none";
      p.style.width = `${size}px`;
      p.style.height = `${size}px`;
      p.style.left = toCss(origin.x);
      p.style.top = toCss(origin.y);
      p.style.background = color;
      p.style.opacity = opacity;
      p.style.transform = "translate(-50%, -50%)";
      if (blur > 0) p.style.filter = `blur(${blur}px)`;
      if (shadow) p.style.boxShadow = shadow;
      p.animate(keyframes, { duration: life, delay, easing: "cubic-bezier(.2,.7,.2,1)", fill: "forwards" });
      host.appendChild(p);
      setTimeout(() => p.remove(), life + delay + 50);
    };

    const rand = (min, max) => Math.random() * (max - min) + min;
    const angleToVec = (theta, r) => [Math.cos(theta) * r, Math.sin(theta) * r];

    // LAYER 1: Golden Core
    make(140, () => {
      const theta = rand(0, Math.PI * 2);
      const r = rand(120, 220);
      const [x, y] = angleToVec(theta, r);
      addParticle({
        size: rand(2, 5),
        color:
          "radial-gradient(circle, rgba(255,242,189,1) 0%, rgba(253,230,138,0.95) 50%, rgba(250,204,21,0) 75%)",
        blur: 0.2,
        opacity: 0.9,
        life: rand(1300, 1700),
        delay: rand(0, 120),
        shadow: "0 0 12px rgba(250,204,21,0.8)",
        keyframes: [
          { transform: "translate(-50%,-50%) scale(0.6)", opacity: 0 },
          {
            transform: `translate(calc(-50% + ${x * 0.6}px), calc(-50% + ${y * 0.6}px)) scale(1)`,
            opacity: 1,
            offset: 0.35,
          },
          {
            transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(0.9)`,opacity: 0,
          },
        ],
      });
    });

    // LAYER 2: White Flares
    make(80, () => {
      const theta = rand(0, Math.PI * 2);
      const r = rand(180, 300);
      const [x, y] = angleToVec(theta, r);
      addParticle({
        size: rand(3, 6),
        color: "rgba(255,255,255,1)",
        blur: 0.6,
        opacity: 0.95,
        life: rand(1400, 2000),
        delay: rand(40, 160),
        shadow: "0 0 18px rgba(255,255,255,0.9)",
        keyframes: [
          { transform: "translate(-50%,-50%) scale(0.8)", opacity: 0 },
          {
            transform: `translate(calc(-50% + ${x * 0.5}px), calc(-50% + ${y * 0.5}px)) scale(1.1)`,
            opacity: 1,
            offset: 0.3,
          },
          {
            transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(1)`,
            opacity: 0,
          },
        ],
      });
    });

    // LAYER 3: Colored Embers
    const emberColors = ["rgba(253,164,175,1)", "rgba(186,230,253,1)", "rgba(147,197,253,1)", "rgba(244,114,182,1)"];
    make(120, () => {
      const theta = rand(0, Math.PI * 2);
      const r = rand(220, 380);
      const [x, y] = angleToVec(theta, r);
      addParticle({
        size: rand(2, 4),
        color: emberColors[Math.floor(rand(0, emberColors.length))],
        blur: 0.4,
        opacity: 0.85,
        life: rand(1600, 2300),
        delay: rand(60, 220),
        shadow: "0 0 10px rgba(255,255,255,0.6)",
        keyframes: [
          { transform: "translate(-50%,-50%) scale(0.8)", opacity: 0 },
          {
            transform: `translate(calc(-50% + ${x * 0.45}px), calc(-50% + ${y * 0.45}px)) scale(1)`,
            opacity: 1,
            offset: 0.35,
          },
          {
            transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(0.9)`,
            opacity: 0,
          },
        ],
      });
    });

    // LAYER 4: Glitter Drift
    make(90, () => {
      const theta = rand(0, Math.PI * 2);
      const r = rand(140, 420);
      const [x, y] = angleToVec(theta, r);
      addParticle({
        size: rand(1.5, 2.5),
        color: "rgba(255,255,255,0.95)",
        blur: 0.6,
        opacity: 0.9,
        life: rand(2200, 3200),
        delay: rand(80, 260),
        shadow: "0 0 8px rgba(255,255,255,0.7)",
        keyframes: [
          { transform: "translate(-50%,-50%) scale(0.8)", opacity: 0 },
          {
            transform: `translate(calc(-50% + ${x * 0.35}px), calc(-50% + ${y * 0.35}px)) scale(1)`,
            opacity: 1,
            offset: 0.45,
          },
          {
            transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(1)`,
            opacity: 0,
          },
        ],
      });
    });
  }, [origin.x, origin.y, reduce]);

  return <div ref={ref} className={`${local ? "absolute inset-0" : "fixed inset-0"} pointer-events-none`} />;
};

/* ----------------------------------------------------------
   Landing (Pooh + envelope)
---------------------------------------------------------- */
const Landing = ({ onEnter }) => {
  const [hover, setHover] = useState(false);
  const [fire, setFire] = useState(false);
  const [flash, setFlash] = useState(false);
  const [entering, setEntering] = useState(false);

  const origin = { xPct: 51.5, yPct: 67.5 };

  // Preload chime
  const chimeRef = useRef(null);
  useEffect(() => {
    const a = new Audio(ASSETS.chime);
    a.preload = "auto";
    chimeRef.current = a;
  }, []);

  const handleClick = () => {
    try {
      chimeRef.current?.play().catch(() => {});
    } catch {}
    setEntering(true);
    setFlash(true);
    setFire(false);
    requestAnimationFrame(() => setFire(true));
    setTimeout(() => onEnter(true), 1200);
    setTimeout(() => onEnter(true), 3000); // fallback
  };

  const envelopeVariants = {
    idle: { rotate: -4 },
    entering: { rotate: -6, scale: 1.06, boxShadow: "0 0 22px rgba(255,215,0,0.75)" },
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="flex min-h-screen flex-col items-center justify-center text-center px-4">
        {/* Pooh wrapper: use CSS var for width */}
        <div
          className="relative"
          style={{ width: "var(--pooh-w)", ["--pooh-w"]: "clamp(560px, 52vmin, 1200px)" }}
        >
          {/* Pooh */}
          <motion.img
            src={ASSETS.pooh}
            alt="Pooh silhouette"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="w-full select-none pointer-events-none drop-shadow-[0_10px_30px_rgba(244,63,94,0.25)]"
          />

          {/* Envelope (clickable; local fireworks live INSIDE this button) */}
          <button
            className="group absolute -translate-x-1/2 -translate-y-1/2 bg-transparent p-0 border-none outline-none appearance-none z-20"
            style={{ left: `${origin.xPct}%`, top: `${origin.yPct}%` }}
            onClick={handleClick}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            aria-label="Click to go on adventure"
          >
            <motion.img
              src={ASSETS.envelope}
              alt="Invitation envelope"
              className="w-[95%] md:w-[55%] lg:w-[65%] rounded-2xl select-none cursor-pointer block drop-shadow-[0_8px_24px_rgba(0,0,0,0.35)]"
              variants={envelopeVariants}
              animate={entering ? "entering" : "idle"} 
              whileHover={{ y: -4, scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
            />

            {/* Local fireworks layer inside the button, centered on it */}
            {fire && (
              <div className="absolute inset-0 pointer-events-none">
                <FireworkBurst local origin={{ x: "50%", y: "42%" }} />
              </div>
            )}

            <AnimatePresence>
              {hover && !entering && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  className="absolute left-1/2 top-full mt-2 -translate-x-1/2 rounded-lg px-3 py-1.5 shadow-lg"
                  style={{ color: "navy", fontWeight: 700, fontStyle: "bold", fontSize: "0.9rem", opacity: 1, mixBlendMode: "normal" }}
                >
                  SOUND ON FOR MAGIC ✨
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Global flash on top */}
      <AnimatePresence>{flash && <ScreenFlash />}</AnimatePresence>
    </div>
  );
};

/* ----------------------------------------------------------
   Simple slideshow
---------------------------------------------------------- */
const MiniSlideshow = ({ imgs = [], interval = 7000 }) => {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (!imgs.length) return;
    const id = setInterval(() => setI((x) => (x + 1) % imgs.length), interval);
    return () => clearInterval(id);
  }, [imgs, interval]);

  if (!imgs.length) return null;

  return (
    <div className="relative w-full max-w-xl md:max-w-2xl mx-auto overflow-hidden rounded-2xl ring-1 ring-[#a48000]/50 shadow-sm bg-amber-50/85">
      <div className="w-full h-56 sm:h-64 md:h-80">
        <AnimatePresence mode="wait">
          <motion.img
            key={imgs[i]}
            src={imgs[i]}
            alt="Trip photo"
            decoding="async"
            className="h-full w-full object-cover"
            initial={{ opacity: 0, scale: 1.01 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.01 }}
            transition={{ duration: 1.1, ease: "easeInOut" }}
          />
        </AnimatePresence>
      </div>

      {/* dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
        {imgs.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setI(idx)}
            className="h-2 w-3 rounded-full"
            aria-label={`Go to slide ${idx + 1}`}
            style={{ backgroundColor: idx === i ? "#000080" : "rgba(0,0,128,0.35)" }}
          />
        ))}
      </div>
    </div>
  );
};

/* ----------------------------------------------------------
   Pages
---------------------------------------------------------- */
const HomePage = () => (
  <section className="mx-auto max-w-6xl px-4 py-12">
    <div className="grid gap-10 items-start md:grid-cols-2">
      {/* LEFT: title, subtitle, body */}
      <div className="space-y-4 rounded-2xl bg-amber-50/85 backdrop-blur-sm ring-1 ring-amber-200 shadow p-6">
        <h1 className="font-serif text-3xl md:text-4xl tracking-tight text-navy-900">
          The Future Mrs. and Mr. McWhorter Welcome You To,
        </h1>
        <p className="text-amber-700/90 italic">Una Settimana d’Amore</p>
        <p className="text-stone-800 leading-relaxed max-w-prose">
          Ciao, <em>Una Settimana d’Amore</em>, or <span className="italic">A Week of Love</span>. Join us as we begin our journey through Italy.
          Our adventure started in <strong>Roma</strong>, where we spent four incredible days getting lost in winding streets and being amazed by the breathtaking architecture.
          From there, Veronica and I traveled to <strong>Florence</strong>, a city full of charm and unforgettable moments. Between exploring local shops and taking an amazing cooking class, we learned how to make <em>fettuccine</em>, <em>ravioli</em>, and <em>tiramisu</em> completely from scratch.
          Last was <strong>Venice</strong>, a city that no movie could ever truly capture. There were plenty of stairs and no quick way to get anywhere, but every moment was worth it. From designing our own masks and finding a hidden tower to visiting the Murano Glass Factory, it was nothing short of magical.
          Still, nothing could compare to <strong>July 4th</strong>, when <strong>Veronica LeBlanc said “yes”</strong> to being my wife.
          Click through to experience our journey — enjoy the slideshow or watch <em>Italy: The Movie</em>.  Buon viaggio!
        </p>
      </div>

      {/* RIGHT: slideshow preview */}
      <div className="md:justify-self-end">
        <div className="rounded-2xl overflow-hidden ring-1 ring-amber-200 shadow bg-amber-50/80 backdrop-blur-sm">
          <MiniSlideshow imgs={ASSETS.slideshow} interval={7000} />
        </div>
        <div className="mt-3 text-center text-sm text-amber-700/80">See Photos for more</div>
      </div>
    </div>
  </section>
);

/* ---------- Album preview card (2x2 collage) ---------- */
const AlbumCard = ({ title, images = [], onOpen }) => {
  const thumbs = images.slice(0, 4);
  return (
    <button onClick={onOpen} className="group w-full overflow-hidden rounded-2xl bg-amber-50/85 border border-amber-400 shadow-md hover:shadow-lg transition">
      <div className="relative aspect-4/3 grid grid-cols-2 grid-rows-2 gap-0.5 bg-amber-400">
        {thumbs.map((src, i) => (
          <img key={i} src={src} alt="Album thumbnail" loading="lazy" className="h-full w-full object-cover" />
        ))}
        <div className="absolute inset-0 ring-1 ring-transparent group-hover:ring-amber-300 rounded" />
      </div>
      <div className="flex items-center justify-between p-3">
        <div className="text-left">
          <div className="font-medium text-amber-800">{title}</div>
          <div className="text-xs text-amber-700/80">{images.length} photos</div>
        </div>
        <span className="text-xs px-2 py-1 rounded-full bg-amber-400 text-amber-800 ring-1 ring-amber-400">Open</span>
      </div>
    </button>
  );
};

/* ---------- Modal with Grid / Slideshow modes ---------- */
const GRID_BG = "/album-frame.png"; // PNG frame in /public

const AlbumModal = ({ open, onClose, title, images = [] }) => {
  const [mode, setMode] = useState("grid"); // 'grid' | 'slide'
  const [i, setI] = useState(0); // slideshow index
  const [page, setPage] = useState(0); // grid page
  const pageSize = 12;
  const totalPages = Math.max(1, Math.ceil(images.length / pageSize));
  const start = page * pageSize;
  const pageImages = images.slice(start, start + pageSize);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (mode === "slide") {
        if (e.key === "ArrowRight") setI((x) => (x + 1) % images.length);
        if (e.key === "ArrowLeft") setI((x) => (x - 1 + images.length) % images.length);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, mode, images.length, onClose]);

  if (!open) return null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 flex items-center justify-center" style={{ zIndex: 9999 }}>
      {/* no grey backdrop */}
      <motion.div
        initial={{ scale: 0.98, y: 8 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.98, y: 8 }}
        className="relative w-[min(96vw,1100px)] max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-xl border border-amber-300"
      >
        {/* Header (honey + navy) */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-amber-400 bg-amber-400">
          <div className="font-semibold text-amber-800">{title}</div>
          <div className="flex items-center gap-2">
            <button
              className={`px-3 py-1.5 rounded-lg text-sm ring-1 ring-amber-400 ${mode === "grid" ? "bg-amber-100 text-amber-800" : "hover:bg-amber-100/60 text-amber-800"}`}
              onClick={() => setMode("grid")}
            >
              Grid
            </button>
            <button
              className={`px-3 py-1.5 rounded-lg text-sm ring-1 ring-amber-400 ${mode === "slide" ? "bg-amber-100 text-amber-800" : "hover:bg-amber-100/60 text-amber-800"}`}
              onClick={() => setMode("slide")}
            >
              Slideshow
            </button>
            <button onClick={onClose} className="ml-1 rounded-lg px-3 py-1.5 text-sm text-amber-800 hover:bg-amber-100/60">
              Close
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 overflow-auto max-h-[calc(90vh-56px)]">
          {mode === "grid" ? (
            <>
              {/* PNG frame behind grid; no grey/rose overlays */}
              <div
                className="relative mx-auto w-full rounded-2xl"
                style={{ backgroundImage: `url(${GRID_BG})`, backgroundRepeat: "no-repeat", backgroundPosition: "center", backgroundSize: "contain" }}
              >
                {/* Pad so thumbs sit inside your frame nicely */}
                <div className="px-4 py-6">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {pageImages.map((src, idx) => (
                      <button
                        key={start + idx}
                        onClick={() => {
                          setI(start + idx);
                          setMode("slide");
                        }}
                        className="group relative overflow-hidden rounded-xl bg-amber-50/90 ring-1 ring-amber-400 hover:ring-amber-300 shadow-sm hover:shadow transition"
                      >
                        <img src={src} alt="Gallery thumbnail" loading="lazy" className="h-36 w-full object-cover sm:h-40 md:h-44 transition-transform duration-200 group-hover:scale-[1.03]" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Centered pagination (honey colors) */}
              <div className="mt-5 flex items-center justify-center gap-4">
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className={`rounded-full px-4 py-2 text-amber-800 font-bold ring-1 ring-amber-300 ${page === 0 ? "opacity-40 cursor-not-allowed" : "bg-amber-100 hover:bg-amber-400"}`}
                >
                  ‹ Prev
                </button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }).map((_, pi) => (
                    <button
                      key={pi}
                      onClick={() => setPage(pi)}
                      className={`h-2.5 w-2.5 rounded-full ${pi === page ? "bg-amber-400" : "bg-amber-400 hover:bg-amber-300"}`}
                      aria-label={`Go to page ${pi + 1}`}
                    />
                  ))}
                </div>

                <button
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1}
                  className={`rounded-full px-4 py-2 text-amber-800 font-bold ring-1 ring-amber-300 ${page >= totalPages - 1 ? "opacity-40 cursor-not-allowed" : "bg-amber-100 hover:bg-amber-400"}`}
                >
                  Next ›
                </button>
              </div>
            </>
          ) : (
            // Slideshow (Pooh colors, centered controls)
            <div className="flex flex-col items-center">
              <img src={images[i]} alt="Selected gallery photo" className="mx-auto max-h-[70vh] w-auto rounded-xl shadow ring-1 ring-amber-400" />
              <div className="mt-4 flex items-center justify-center gap-6">
                <button
                  onClick={() => setI((x) => (x - 1 + images.length) % images.length)}
                  className="rounded-full bg-amber-100 px-4 py-2 shadow hover:bg-amber-400 font-bold text-amber-800 ring-1 ring-amber-300"
                >
                  ‹ Prev
                </button>
                <div className="text-amber-800 font-semibold">
                  {i + 1} / {images.length}
                </div>
                <button onClick={() => setI((x) => (x + 1) % images.length)} className="rounded-full bg-amber-100 px-4 py-2 shadow hover:bg-amber-400 font-bold text-amber-800 ring-1 ring-amber-300">
                  Next ›
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ---------- Photos ---------- */
const Photos = () => {
  const [openFor, setOpenFor] = useState(null); // 'A' | 'B' | null
  const albums = [
    { key: "A", title: "Engagement", images: ASSETS.albumA },
    { key: "B", title: "Italy", images: ASSETS.albumB }, // renamed from "/italy" for cleanliness
  ];

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <h2 className="font-serif text-3xl text-amber-800 font-bold mb-6">Photos</h2>

      <div className="grid gap-6 sm:grid-cols-2">
        {albums.map((al) => (
          <AlbumCard key={al.key} title={al.title} images={al.images} onOpen={() => setOpenFor(al.key)} />
        ))}
      </div>

      <AnimatePresence>
        {albums.map((al) => (openFor === al.key ? <AlbumModal key={al.key} open title={al.title} images={al.images} onClose={() => setOpenFor(null)} /> : null))}
      </AnimatePresence>
    </section>
  );
};

/* ---------- OneDrive embed helper ---------- */
const toOneDriveEmbed = (url) => {
  try {
    const u = new URL(url);
    if (u.hostname.includes("1drv.ms")) {
      if (!u.searchParams.has("embed")) u.searchParams.set("embed", "1");
      return u.toString();
    }
  } catch {}
  return url;
};

// ---------- Video Card with graceful fallback (honey look, no titles) ----------
const VideoCard = ({ src, title, desc, poster, preferExternal = false }) => {
  const [useEmbed, setUseEmbed] = useState(!preferExternal);
  const [failed, setFailed] = useState(false);
  const [loading, setLoading] = useState(useEmbed);

  return (
    <div className="bg-[#ffd27a]/40 backdrop-blur-[2px] rounded-2xl shadow-lg overflow-hidden border border-amber-400 ring-1 ring-amber-300">
      {/* Media area */}
      <div className="relative aspect-video w-full rounded-t-2xl bg-amber-100/60">
        {/* Skeleton (honey gradient) */}
        {loading && !failed && (
          <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-amber-100/70 to-amber-200/70" />
        )}

        {/* Poster fallback */}
        {(failed || !useEmbed) && (
          <button
            onClick={() => window.open(src, "_blank", "noopener,noreferrer")}
            className="absolute inset-0 flex items-center justify-center group"
            aria-label={`Open ${title || 'video'} in OneDrive`}
          >
            {/* Poster image if provided */}
            {poster ? (
              <img src={poster} alt="" className="absolute inset-0 w-full h-full object-cover opacity-80" />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-amber-50/80 to-amber-200/70" />
            )}
            {/* Play overlay */}
            <div className="relative flex items-center gap-3 rounded-full px-5 py-3 bg-amber-50/90 group-hover:bg-white shadow">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-amber-800">
                <path d="M8 5v14l11-7z" />
              </svg>
              <span className="text-amber-800 font-semibold">Open in OneDrive</span>
            </div>
          </button>
        )}

        {/* Embed */}
        {useEmbed && !failed && (
          <iframe
            src={toOneDriveEmbed(src)}
            className="absolute inset-0 w-full h-full"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer"
            title={title || "Video"}
            onLoad={() => setLoading(false)}
            onError={() => {
              setLoading(false);
              setFailed(true);
            }}
          />
        )}

        {/* Top-right external button */}
        {useEmbed && !failed && (
          <div className="absolute right-3 top-3">
            <button
              onClick={() => window.open(src, "_blank", "noopener,noreferrer")}
              className="rounded-full bg-amber-50/90 hover:bg-white px-3 py-1 text-xs font-semibold text-amber-800 shadow"
            >
              Open in OneDrive
            </button>
          </div>
        )}
      </div>

      {/* Meta (no title — OneDrive shows filename) */}
      <div className="p-4 text-center bg-amber-100/60">
        {desc && <p className="text-sm text-amber-800/90">{desc}</p>}
        {failed && (
          <div className="mt-3 text-xs text-caramel/70">
            Having trouble embedding large files from OneDrive. The button above will open it reliably.
          </div>
        )}
      </div>
    </div>
  );
};

const Videos = () => {
  const videoData = [
    {
      src: "https://1drv.ms/v/c/f11f5828b26f7c89/UQSJfG-yKFgfIIDxK3YKAAAAAM-2z6OdWK-WjK0" ,
      desc: "A 2½‑hour movie of our trip around Roma, Florence, and Venice — culminating in the big moment on July 4th!",
      },
    {
      src: "https://1drv.ms/v/c/f11f5828b26f7c89/UQSJfG-yKFgfIIDxfXUKAAAAAPya3SVv-wRtwRA",
      desc: "A magical slideshow of our trip (about 90 minutes).",
    },
    {
      src: "https://1drv.ms/v/c/f11f5828b26f7c89/IQQZ1m-hI900QpQh9_OE3vSRAYQ-BB3mMFcupu5nzqK2ces?",
      desc: "See me embarrass myself trying to propose, and Veronica's surprised reaction!",
    },
    {
      src: "https://1drv.ms/v/c/f11f5828b26f7c89/IQQwcVVsoCMtSYAgPsDKk6UJAUiBCvgDfeMEsikydtkbs6Y",
      desc: "A quick TikTok‑style compilation of highlights from our trip.",
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 py-10 min-h-[calc(100vh-var(--headerH)-var(--footerH))] flex flex-col justify-center">
      <h2 className="font-serif text-3xl md:text-4xl text-navy-800 mb-8 text-center">Videos</h2>

      <div className="grid gap-10 md:grid-cols-2">
        {videoData.map((v, i) => (
          <VideoCard key={i} src={v.src} title={v.title} desc={v.desc} poster={v.poster} preferExternal={v.preferExternal} />
        ))}
      </div>
    </section>
  );
};
 () => {
  const videoData = [
    {
      src: "https://1drv.ms/v/c/f11f5828b26f7c89/UQSJfG-yKFgfIIDxK3YKAAAAAM-2z6OdWK-WjK0",
      title: "The Italian Proposal",
      desc: "A 2½‑hour movie of our trip around Roma, Florence, and Venice — culminating in the big moment on July 4th!",
      // Prefer external for super‑long files to avoid flaky embeds
      preferExternal: true,
    },
    {
      src: "https://1drv.ms/v/c/f11f5828b26f7c89/UQSJfG-yKFgfIIDxfXUKAAAAAPya3SVv-wRtwRA",
      title: "Magical Slideshow",
      desc: "A magical slideshow of our trip (about 90 minutes).",
    },
    {
      src: "https://1drv.ms/v/c/f11f5828b26f7c89/IQQZ1m-hI900QpQh9_OE3vSRAYQ-BB3mMFcupu5nzqK2ces?",
      title: "The Proposal",
      desc: "See me embarrass myself trying to propose, and Veronica's surprised reaction!",
    },
    {
      src: "https://1drv.ms/v/c/f11f5828b26f7c89/IQQwcVVsoCMtSYAgPsDKk6UJAUiBCvgDfeMEsikydtkbs6Y",
      title: "Quick Roundup: The Trip",
      desc: "A quick TikTok‑style compilation of highlights from our trip.",
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 py-10 min-h-[calc(100vh-var(--headerH)-var(--footerH))] flex flex-col justify-center">
      <h2 className="font-serif text-3xl md:text-4xl text-navy-800 mb-8 text-center">Videos</h2>

      <div className="grid gap-10 md:grid-cols-2">
        {videoData.map((v, i) => (
          <VideoCard key={i} src={v.src} title={v.title} desc={v.desc} poster={v.poster} preferExternal={v.preferExternal} />
        ))}
      </div>
    </section>
  );
};

const Registry = () => {
  const cols = Math.min(REGISTRY_LINKS.length, 3);
  const gridColsClass = cols === 1 ? "sm:grid-cols-1" : cols === 2 ? "sm:grid-cols-2" : "sm:grid-cols-3";

  return (
    <section className="mx-auto max-w-5xl px-4 py-16 text-center bg-transparent">
      <h2 className="font-serif text-3xl md:text-4xl text-amber-800 mb-8 drop-shadow-sm">Wedding Registry</h2>

      {/* Registry Button Grid (Tailwind can't parse dynamic class names at build-time) */}
      <div className={`grid gap-8 ${gridColsClass} justify-items-center`}>
        {REGISTRY_LINKS.map((r) => (
          <a key={r.href} href={r.href} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center transition-transform hover:scale-105 bg-transparent">
            <div className="rounded-2xl overflow-hidden shadow-md border-4 border-[#a48000] bg-transparent backdrop-blur-sm p-4 w-48 h-48 flex items-center justify-center hover:shadow-[0_0_20px_#ffd966]">
              <img src={r.img} alt={`${r.label} Registry`} className="w-full h-full object-contain" />
            </div>
            <span className="mt-3 text-amber-800 font-semibold text-lg drop-shadow-sm">{r.label}</span>
          </a>
        ))}
      </div>
    </section>
  );
};

const tabs = [
  { key: "home", label: "Home", icon: HomeIcon, comp: <HomePage /> },
  { key: "photos", label: "Photos", icon: Camera, comp: <Photos /> },
  { key: "videos", label: "Videos", icon: Film, comp: <Videos /> },
  { key: "registry", label: "Registry", icon: Gift, comp: <Registry /> },
];

/* ----------------------------------------------------------
   Shell with tabs
---------------------------------------------------------- */
const Shell = () => {
  const [tab, setTab] = useState("home");

  return (
    <div className="min-h-screen flex flex-col" style={{ "--headerH": "75px", "--footerH": "100px" }}>
      {/* Header with tabs */}
      <header className="h-[75px] sticky top-0 z-30 bg-gold backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <nav className="flex gap-2" aria-label="Primary">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`px-3 py-1.5 rounded-xl text-sm transition ring-1 ${
                  tab === t.key ? "bg-[#DAA520] text-white ring-[#a48000]" : "bg-amber-50/85 text-[#DAA520] hover:bg-amber-100 ring-[#a48000]/40"
                }`}
                aria-current={tab === t.key ? "page" : undefined}
              >
                <t.icon size={14} className="inline mr-1" />
                {t.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main content (animated) */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            {tabs.find((x) => x.key === tab)?.comp}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer – fixed height so Videos page can size to viewport */}
      <footer className="relative border-t border-[#a48000]" style={{ height: "var(--footerH)" }}>
        <img src={ASSETS.footer} alt="Footer decoration" className="block w-full h-full object-cover select-none pointer-events-none" />
        <div aria-hidden className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to top, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.75) 35%, rgba(255,255,255,0) 80%)" }} />
        <div className="absolute inset-0 flex items-center justify-center px-4" />
      </footer>
    </div>
  );
};

/* ----------------------------------------------------------
   Root
---------------------------------------------------------- */
export default function WeddingWebsite() {
  const [entered, setEntered] = useState(false);

  return (
    <div className="text-caramel font-semibold">
      <GlobalBackground />

      <div className="relative z-20">
        <AnimatePresence mode="wait">
          {!entered ? (
            <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Landing onEnter={() => setEntered(true)} />
            </motion.div>
          ) : (
            <motion.div key="site" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} transition={{ duration: 1.2, ease: "easeOut" }}>
              <Shell />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
