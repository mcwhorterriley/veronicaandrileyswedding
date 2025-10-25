import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  Film,
  Gift,
  Home as HomeIcon,
  ExternalLink,
} from "lucide-react";

const ASSETS = {
  background: "/background.png",
  pooh: "/pooh-silhouette.png",
  envelope: "/envelope.png",
  footer: "/footer.png",
  chime: "/magic-chime.mp3",
  amazon: "/amazon.png",
 
  albumA: [
    "/ePhotos/1.jpg", "/ePhotos/2.jpg", "/ePhotos/3.jpg", "/ePhotos/4.jpg", "/ePhotos/5.jpg", "/ePhotos/6.jpg", "/ePhotos/7.jpg", "/ePhotos/8.jpg", "/ePhotos/9.jpg", "/ePhotos/10.jpg",
    "/ePhotos/11.jpg", "/ePhotos/12.jpg", "/ePhotos/13.jpg", "/ePhotos/14.jpg", "/ePhotos/15.jpg", "/ePhotos/16.jpg", "/ePhotos/17.jpg", "/ePhotos/18.jpg", "/ePhotos/19.jpg", "/ePhotos/20.jpg",
  ],
  albumB: [
    "/italy/1.jpg", "/italy/2.jpg", "/italy/3.jpg", "/italy/4.jpg", "/italy/5.jpg", "/italy/6.jpg", "/italy/7.jpg", "/italy/8.jpg", "/italy/9.jpg", "/italy/10.jpg", "/italy/11.jpg", "/italy/13.jpg", "/italy/28.jpg", "/italy/14.jpg", "/italy/27.jpg",
    "/italy/15.jpg", "/italy/16.jpg", "/italy/17.jpg", "/italy/18.jpg", "/italy/19.jpg", "/italy/20.jpg", "/italy/21.jpg", "/italy/22.jpg", "/italy/23.jpg", "/italy/24.jpg", "/italy/25.jpg", "/italy/26.jpg", "/italy/27.jpg", "/italy/29.jpg", "/italy/30.jpg",
    "/italy/31.jpg", "/italy/32.jpg", "/italy/33.jpg", "/italy/34.jpg", "/italy/35.jpg", "/italy/36.jpg", "/italy/37.jpg", "/italy/38.jpg", "/italy/39.jpg", "/italy/40.jpg", "/italy/41.jpg", "/italy/42.jpg", "/italy/43.jpg", "/italy/44.jpg", "/italy/45.jpg", 
    "/italy/46.jpg", "/italy/47.jpg", "/italy/48.jpg", "/italy/49.jpg", "/italy/50.jpg", "/italy/51.jpg", "/italy/52.jpg", "/italy/53.jpg", "/italy/54.jpg", "/italy/55.jpg", "/italy/56.jpg", "/italy/57.jpg", "/italy/58.jpg", "/italy/59.jpg", "/italy/60.jpg",
    "/italy/61.jpg", "/italy/62.jpg", "/italy/63.jpg", "/italy/64.jpg", "/italy/65.jpg", "/italy/66.jpg", "/italy/67.jpg", "/italy/68.jpg", "/italy/69.jpg", "/italy/70.jpg", "/italy/71.jpg", "/italy/72.jpg", "/italy/73.jpg", "/italy/74.jpg", "/italy/75.jpg", 
    "/italy/76.jpg", "/italy/77.jpg", "/italy/78.jpg", "/italy/79.jpg", "/italy/80.jpg", "/italy/81.jpg",  "/italy/82.jpg", "/italy/83.jpg", "/italy/84.jpg", "/italy/85.jpg", "/italy/86.jpg", "/italy/87.jpg", "/italy/88.jpg", "/italy/89.jpg", "/italy/90.jpg",
    "/italy/91.jpg", "/italy/92.jpg", "/italy/93.jpg",
  ],
};

ASSETS.slideshow = [...ASSETS.albumA, ...ASSETS.albumB].sort(
  () => Math.random() - 0.5,
);

/* , "/italy/94.jpg", "/italy/95.jpg", "/italy/96.jpg", "/italy/97.jpg", "/italy/98.jpg", "/italy/99.jpg", */

const REGISTRY_LINKS = [
  {
    href: "https://www.amazon.com/wedding/registry/FS3BNV5M1DJC",
    img: "/amazon.png",
  },
  /* {
    label: "Target",
    href: "https://example.com/target",
    img: "/images/registry/target.png", // placeholder
  },
  {
    label: "Zola",
    href: "https://example.com/zola",
    img: "/images/registry/zola.png", // placeholder
  },
  */
];

/* ----------------------------------------------------------
   Global site background (was previously in App.jsx)
   - fixed parallax image + soft gradient + vignette
---------------------------------------------------------- */
// ⬇️ Replace your GlobalBackground with this
const GlobalBackground = () => {
  useEffect(() => {
    const img = new Image();
    img.src = ASSETS.background; // e.g. "/background.jpg" in /public
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
   ScreenFlash: full-screen flash that blooms then fades
---------------------------------------------------------- */
const ScreenFlash = ({ duration = 1400 }) => (
  <motion.div
    className="fixed inset-0  pointer-events-none"
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

/* ----------------------------------------------------------
   FireworkBurst
---------------------------------------------------------- */
const FireworkBurst = ({ origin = { x: "50%", y: "50%" }, local = false }) => {
  const ref = useRef(null);

  useEffect(() => {
    const host = ref.current;
    if (!host) return;

    const make = (count, painter) => {
      for (let i = 0; i < count; i++) painter(i);
    };
    const toCss = (v) => (typeof v === "number" ? `${v}px` : v);

    const addParticle = ({
      size = 3,
      color = "rgba(255,255,255,1)",
      blur = 0,
      opacity = 1,
      life = 1600,
      delay = 0,
      keyframes = [],
      shadow = "",
    }) => {
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
      p.animate(keyframes, {
        duration: life,
        delay,
        easing: "cubic-bezier(.2,.7,.2,1)",
        fill: "forwards",
      });
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
            transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(0.9)`,
            opacity: 0,
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
    const emberColors = [
      "rgba(253,164,175,1)",
      "rgba(186,230,253,1)",
      "rgba(147,197,253,1)",
      "rgba(244,114,182,1)",
    ];
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
  }, [origin.x, origin.y]);

  return (
    <div
      ref={ref}
      className={`${local ? "absolute inset-0" : "fixed inset-0"} pointer-events-none`}
    />
  );
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
      chimeRef.current && chimeRef.current.play().catch(() => {});
    } catch (_) {}

    setEntering(true);
    setTimeout(() => setFlash(true), 80);

    setTimeout(() => {
      setFire(false);
      requestAnimationFrame(() => setFire(true));
    }, 100);

    setTimeout(() => onEnter(true), 1900);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="flex min-h-screen flex-col items-center justify-center text-center px-4">
        {/* Pooh wrapper scales with viewport */}
        <div
          className="relative [var(--pooh-w)]"
          style={{ ["--pooh-w"]: "clamp(560px, 52vmin, 1200px)" }}
        >
          {/* Pooh */}
          <motion.img
            src={ASSETS.pooh}
            alt="Pooh"
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
              alt="Click to go on adventure"
              className="
              w-[95%] md:w-[55%] lg:w-[65%]
              rounded-2xl
              select-none cursor-pointer block
               drop-shadow-[0_8px_24px_rgba(0,0,0,0.35)]
              "
              animate={
                entering
                  ? {
                      rotate: -6,
                      scale: 1.06,
                      filter: "drop-shadow(0 0 22px rgba(255,215,0,0.75))",
                    }
                  : { rotate: -4 }
              }
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
                  className="absolute left-1/2 top-full mt-2 -translate-x-1/2 rounded-lg px-3 py-1.5 shadow-lg "
                  style={{
                    color: "navy",
                    fontWeight: 700,
                    fontStyle: "bold",
                    fontSize: "0.9rem",
                    opacity: 1,
                    mixBlendMode: "normal",
                  }}
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
    <div
      className="relative w-full max-w-xl md:max-w-2xl mx-auto overflow-hidden
                 rounded-2xl ring-1 ring-[#a48000]/50 shadow-sm bg-white/80"
    >
      {/* set real heights (md:h-80 ≈ 20rem). Adjust as you like */}
      <div className="w-full h-56 sm:h-64 md:h-80">
        <AnimatePresence mode="wait">
          <motion.img
            key={imgs[i]}
            src={imgs[i]}
            alt=""
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
            style={{
              backgroundColor: idx === i ? "#000080" : "rgba(0,0,128,0.35)", // navy active/inactive
            }}
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
      <div className="space-y-4">
        <h1 className="font-serif text-3xl md:text-4xl tracking-tight text-[navy]">
          The Future Mrs. and Mr. McWhorter Welcome You To,
        </h1>

        <p className="text-[navy]/80 italic">Una Settimana d’Amore</p>

        <p className="text-[navy] leading-relaxed max-w-prose">
          Una Settimana d’Amore, or A Week of Love. Join us as we begin our
          Journey through Italy. Starting off in Roma, we spent four beautiful
          days getting lost in the streets and being astonished by all of the
          draw dropping architecture. From Roma, Veronica and I were off to the
          city of Florence. Florence was quite the experience. From shopping to
          our amazing cooking class where we learned how to make fettuccini,
          ravioli, and tiramisu from scratch! Last up, Venice. A city that
          movies don't do justice. Sure, there were hundreds of stairs and by no
          means, no quick transportation. From the mask designing, the hidden
          tower, and seeing the Murano Glass Factory. Nothing could compare to
          July 4th when Veronica LeBlanc said yes to being my wife. Click
          through and experience our journey with us. You can sing along a
          slideshow or see Italy the Movie. If you see this, we love you and
          cannot wait to celebrate with you.
        </p>
      </div>

      {/* RIGHT: slideshow preview */}
      <div className="md:justify-self-end">
        <MiniSlideshow imgs={ASSETS.slideshow} interval={7000} />
        <div className="mt-3 text-center text-sm text-[navy]/70">
          See Photos for more
        </div>
      </div>
    </div>
  </section>
);

/* ---------- Album preview card (2x2 collage) ---------- */
const AlbumCard = ({ title, images = [], onOpen }) => {
  const thumbs = images.slice(0, 4);
  return (
    <button
      onClick={onOpen}
      className="group w-full overflow-hidden rounded-2xl bg-white/90 border border-amber-400 shadow-md hover:shadow-lg transition"
    >
      <div className="relative aspect-4/3 grid grid-cols-2 grid-rows-2 gap-0.5 bg-amber-400">
        {thumbs.map((src, i) => (
          <img
            key={i}
            src={src}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ))}
        <div className="absolute inset-0 ring-1 ring-transparent group-hover:ring-amber-300 rounded"></div>
      </div>
      <div className="flex items-center justify-between p-3">
        <div className="text-left">
          <div className="font-medium text-[navy]">{title}</div>
          <div className="text-xs text-[navy]/70">{images.length} photos</div>
        </div>
        <span className="text-xs px-2 py-1 rounded-full bg-amber-400 text-[navy] ring-1 ring-amber-400">
          Open
        </span>
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
        if (e.key === "ArrowLeft")
          setI((x) => (x - 1 + images.length) % images.length);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, mode, images.length, onClose]);

  if (!open) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center"
      style={{ zIndex: 9999 }}
    >
      {/* no grey backdrop */}

      <motion.div
        initial={{ scale: 0.98, y: 8 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.98, y: 8 }}
        className="relative w-[min(96vw,1100px)] max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-xl border border-amber-300"
      >
        {/* Header (honey + navy) */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-amber-400 bg-amber-400">
          <div className="font-semibold text-[navy]">{title}</div>
          <div className="flex items-center gap-2">
            <button
              className={`px-3 py-1.5 rounded-lg text-sm ring-1 ring-amber-400 ${
                mode === "grid"
                  ? "bg-amber-100 text-[navy]"
                  : "hover:bg-amber-100/60 text-[navy]"
              }`}
              onClick={() => setMode("grid")}
            >
              Grid
            </button>
            <button
              className={`px-3 py-1.5 rounded-lg text-sm ring-1 ring-amber-400 ${
                mode === "slide"
                  ? "bg-amber-100 text-[navy]"
                  : "hover:bg-amber-100/60 text-[navy]"
              }`}
              onClick={() => setMode("slide")}
            >
              Slideshow
            </button>
            <button
              onClick={onClose}
              className="ml-1 rounded-lg px-3 py-1.5 text-sm text-[navy] hover:bg-amber-100/60"
            >
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
                style={{
                  backgroundImage: `url(${GRID_BG})`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                  backgroundSize: "contain",
                }}
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
                        className="group relative overflow-hidden rounded-xl bg-white ring-1 ring-amber-400 hover:ring-amber-300 shadow-sm hover:shadow transition"
                      >
                        <img
                          src={src}
                          alt=""
                          loading="lazy"
                          className="h-36 w-full object-cover sm:h-40 md:h-44 transition-transform duration-200 group-hover:scale-[1.03]"
                        />
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
                  className={`rounded-full px-4 py-2 text-[navy] font-bold ring-1 ring-amber-300 ${
                    page === 0
                      ? "opacity-40 cursor-not-allowed"
                      : "bg-amber-100 hover:bg-amber-400"
                  }`}
                >
                  ‹ Prev
                </button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }).map((_, pi) => (
                    <button
                      key={pi}
                      onClick={() => setPage(pi)}
                      className={`h-2.5 w-2.5 rounded-full ${
                        pi === page
                          ? "bg-amber-4000"
                          : "bg-amber-400 hover:bg-amber-300"
                      }`}
                      aria-label={`Go to page ${pi + 1}`}
                    />
                  ))}
                </div>

                <button
                  onClick={() =>
                    setPage((p) => Math.min(totalPages - 1, p + 1))
                  }
                  disabled={page >= totalPages - 1}
                  className={`rounded-full px-4 py-2 text-[navy] font-bold ring-1 ring-amber-300 ${
                    page >= totalPages - 1
                      ? "opacity-40 cursor-not-allowed"
                      : "bg-amber-100 hover:bg-amber-400"
                  }`}
                >
                  Next ›
                </button>
              </div>
            </>
          ) : (
            // Slideshow (Pooh colors, centered controls)
            <div className="flex flex-col items-center">
              <img
                src={images[i]}
                alt=""
                className="mx-auto max-h-[70vh] w-auto rounded-xl shadow ring-1 ring-amber-400"
              />
              <div className="mt-4 flex items-center justify-center gap-6">
                <button
                  onClick={() =>
                    setI((x) => (x - 1 + images.length) % images.length)
                  }
                  className="rounded-full bg-amber-100 px-4 py-2 shadow hover:bg-amber-400 font-bold text-[navy] ring-1 ring-amber-300"
                >
                  ‹ Prev
                </button>
                <div className="text-[navy] font-semibold">
                  {i + 1} / {images.length}
                </div>
                <button
                  onClick={() => setI((x) => (x + 1) % images.length)}
                  className="rounded-full bg-amber-100 px-4 py-2 shadow hover:bg-amber-400 font-bold text-[navy] ring-1 ring-amber-300"
                >
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

/* ---------- Photos (replaces your current Photos) ---------- */
const Photos = () => {
  const [openFor, setOpenFor] = useState(null); // 'A' | 'B' | null

  const albums = [
    { key: "A", title: "Engagement", images: ASSETS.albumA },
    { key: "B", title: "/italy", images: ASSETS.albumB },
  ];

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <h2 className="font-serif text-3xl text-[navy] font-bold mb-6">Photos</h2>

      <div className="grid gap-6 sm:grid-cols-2">
        {albums.map((al) => (
          <AlbumCard
            key={al.key}
            title={al.title}
            images={al.images}
            onOpen={() => setOpenFor(al.key)}
          />
        ))}
      </div>

      <AnimatePresence>
        {albums.map((al) =>
          openFor === al.key ? (
            <AlbumModal
              key={al.key}
              open
              title={al.title}
              images={al.images}
              onClose={() => setOpenFor(null)}
            />
          ) : null,
        )}
      </AnimatePresence>
    </section>
  );
};

const Videos = () => (
  <section className="mx-auto max-w-7xl px-12 py-16">
    <h2 className="font-serif text-3xl md:text-4xl text-navy-800 mb-10 text-center">
      Videos
    </h2>

    {/* Responsive grid with spacing */}
    <div className="grid gap-10 md:grid-cols-2">
      {[
        "https://1drv.ms/v/c/f11f5828b26f7c89/UQSJfG-yKFgfIIDxK3YKAAAAAM-2z6OdWK-WjK0",
        "https://1drv.ms/v/s!Aol8b7IoWB_xqep9_JrdJW_7BG3BEA?embed=1",
      ].map((src, i) => (
        <div
          key={i}
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden border border-[#a48000]"
        >
          <iframe
            src={src}
            className="w-full aspect-video rounded-2xl"
            allowFullScreen
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          ></iframe>
        </div>
      ))}
    </div>
  </section>
);

const Registry = () => (
  <section className="mx-auto max-w-5xl px-4 py-16 text-center bg-transparent">
    <h2 className="font-serif text-3xl md:text-4xl text-[navy] mb-8 drop-shadow-sm">
      Wedding Registry
    </h2>

    {/* Registry Button Grid */}
    <div
      className={`grid gap-8 sm:grid-cols-${Math.min(
        REGISTRY_LINKS.length,
        3,
      )} justify-items-center`}
    >
      {REGISTRY_LINKS.map((r) => (
        <a
          key={r.href}
          href={r.href}
          target="_blank"
          rel="noreferrer"
          className="flex flex-col items-center justify-center transition-transform hover:scale-105 bg-transparent"
        >
          <div className="rounded-2xl overflow-hidden shadow-md border-4 border-[#a48000] bg-wtransparent backdrop-blur-sm p-4 w-48 h-48 flex items-center justify-center hover:shadow-[0_0_20px_#ffd966]">
            <img
              src={r.img}
              alt={`${r.label} Registry`}
              className="w-full h-full object-contain"
            />
          </div>
          <span className="mt-3 text-[navy] font-semibold text-lg drop-shadow-sm">
            {r.label}
          </span>
        </a>
      ))}
    </div>
  </section>
);

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
    <div className="min-h-screen flex flex-col">
      <header className="h-[75px] sticky top-0 z-30 bg-[#fff64cb3]">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <nav className="flex gap-2">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`px-3 py-1.5 rounded-xl text-sm transition ring-1 ${
                  tab === t.key
                    ? "bg-[#DAA520] text-[#ffffff] ring-[#a48000]"
                    : "bg-white/80 text-[#DAA520] hover:bg-amber-100 ring-[#a48000]/40"
                }`}
              >
                <t.icon size={14} className="inline mr-1" />
                {t.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            {tabs.find((x) => x.key === tab)?.comp}
          </motion.div>
        </AnimatePresence>
      </main>



<footer className="relative mt-16 border-t border-[#a48000]">
  {/* image layer */}
  <img
    src={ASSETS.footer}
    alt=""
    className="block w-full h-[100px] md:h-[100px] object-cover select-none pointer-events-none"
  />

  {/* soft fade so the top blends into the page */}
  <div
    aria-hidden
    className="absolute inset-0 pointer-events-none"
    style={{
      background:
        "linear-gradient(to top, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.75) 35%, rgba(255,255,255,0) 80%)",
    }}
  />

  {/* content on top */}
  <div className="absolute inset-0 flex items-center justify-center px-4">
   
  </div>
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
    <div style={{ fontWeight: "bold", color: "navy" }}>
      <GlobalBackground />

      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {!entered ? (
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Landing onEnter={() => setEntered(true)} />
            </motion.div>
          ) : (
            <motion.div
              key="site"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            >
              <Shell />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
