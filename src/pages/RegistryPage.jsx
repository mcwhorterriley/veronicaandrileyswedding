import { ExternalLink, Gift } from "lucide-react";

const AMAZON_REGISTRY_URL = "https://www.amazon.com/wedding/registry/FS3BNV5M1DJC";

export default function RegistryPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-12">
      <div className="rounded-3xl bg-amber-50/90 backdrop-blur-sm ring-1 ring-amber-200 shadow-xl p-6 md:p-10 text-center">
        <Gift className="mx-auto text-[#DAA520]" size={42} />
        <p className="mt-4 text-xs uppercase tracking-[0.28em] text-amber-700">
          Celebrating Together
        </p>
        <h2 className="mt-2 font-serif text-4xl md:text-5xl text-amber-900">
          Registry
        </h2>
        <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-stone-700">
          Please don't feel obligated to get anything, we all work for a living. Just come through if you're invited. However, instead of asking a hundred times, here yall go!
      
        </p>

        <a
          href={AMAZON_REGISTRY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group mx-auto mt-8 flex w-full max-w-sm flex-col items-center rounded-3xl border border-amber-300 bg-white/75 p-6 shadow-md transition hover:-translate-y-1 hover:shadow-xl"
        >
          <div className="flex h-44 w-44 items-center justify-center rounded-2xl border-4 border-[#a48000] bg-amber-50/80 p-4 shadow-sm">
            <img
              src="/amazon.png"
              alt="Amazon Wedding Registry"
              className="h-full w-full object-contain"
            />
          </div>
          <span className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#DAA520] px-5 py-3 font-semibold text-white transition group-hover:bg-[#b88918]">
            View Our Amazon Registry <ExternalLink size={17} />
          </span>
        </a>
      </div>
    </section>
  );
}
