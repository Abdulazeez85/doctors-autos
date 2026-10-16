
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const heroImages = [
  "https://res.cloudinary.com/da7jzmy2g/image/upload/v1792086926/doctors-autos/vehicles/kyjvmqndbjom9kbz7u0w.jpg",
  "https://res.cloudinary.com/da7jzmy2g/image/upload/v1792086548/doctors-autos/vehicles/wnvrwpuhdvujers0blul.jpg",
  "https://res.cloudinary.com/da7jzmy2g/image/upload/v1792086594/doctors-autos/vehicles/v4bgtctshmzkzu6r5ogu.jpg",
  "https://res.cloudinary.com/da7jzmy2g/image/upload/v1792117929/doctors-autos/vehicles/jc2icww0o4aq1iomvonn.jpg",
  "https://res.cloudinary.com/da7jzmy2g/image/upload/v1792117691/doctors-autos/vehicles/apu094w8n9gz9masynjf.jpg",
];

export function Hero() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const interval = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroImages.length);
    }, 6000);

    return () => window.clearInterval(interval);
  }, [paused]);

  const showPrevious = () => {
    setActiveSlide((current) =>
      (current - 1 + heroImages.length) % heroImages.length
    );
  };

  const showNext = () => {
    setActiveSlide((current) => (current + 1) % heroImages.length);
  };

  return (
    <section
      aria-label="Doctors Autos featured vehicles"
      className="relative isolate flex min-h-[720px] items-center overflow-hidden bg-[#101722] text-white sm:min-h-[760px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setPaused(false);
        }
      }}
    >
      {/* Cinematic background slideshow */}
      <div className="absolute inset-0 -z-20">
        {heroImages.map((image, index) => (
          <div
            key={image + index}
            aria-hidden="true"
            className={`absolute inset-0 bg-cover bg-center transition-[opacity,transform] duration-[1500ms] ease-in-out motion-reduce:transition-none ${
              index === activeSlide
                ? "scale-100 opacity-100"
                : "scale-110 opacity-0"
            }`}
            style={{
              backgroundImage: `url("${image}")`,
              transitionProperty: "opacity, transform",
            }}
          />
        ))}
      </div>

      {/* Dark overlay keeps the headline readable */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-r from-black/90 via-black/65 to-black/20"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-t from-black/65 via-transparent to-black/15"
      />

      <div className="mx-auto w-full max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
        <div className="max-w-3xl">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/25 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
            Ilorin, Kwara State
          </div>

          <h1 className="max-w-3xl text-5xl font-bold leading-[1.02] tracking-[-0.04em] sm:text-6xl lg:text-8xl">
            Drive with
            <span className="mt-2 block text-amber-400">
              confidence.
            </span>
          </h1>

          <p className="mt-7 max-w-xl text-base leading-7 text-white/85 sm:text-lg sm:leading-8">
            Discover quality vehicles selected for drivers who value
            reliability, style, and a buying experience they can trust.
          </p>

          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/inventory"
              className="inline-flex items-center justify-center rounded-full bg-amber-400 px-8 py-4 text-sm font-bold text-[#101722] transition-colors hover:bg-amber-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              Explore Inventory
            </Link>

            <a
              href="https://wa.me/2348113545998"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-white/50 bg-white/10 px-8 py-4 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              Chat on WhatsApp
            </a>
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-white/25 pt-7">
            <div>
              <p className="text-xl font-bold">Quality</p>
              <p className="mt-1 text-xs text-white/70">Selected vehicles</p>
            </div>

            <div className="h-10 w-px bg-white/25" />

            <div>
              <p className="text-xl font-bold">Trusted</p>
              <p className="mt-1 text-xs text-white/70">Customer focused</p>
            </div>
          </div>
        </div>

        {/* Slide controls */}
        <div className="mt-12 flex items-center gap-3">
          <button
            type="button"
            onClick={showPrevious}
            aria-label="Previous featured vehicle image"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/40 bg-black/25 text-xl text-white backdrop-blur-sm transition hover:bg-white/20"
          >
            &#8592;
          </button>

          <div className="flex items-center gap-2" aria-label="Choose hero image">
            {heroImages.map((image, index) => (
              <button
                key={`slide-${index}`}
                type="button"
                onClick={() => setActiveSlide(index)}
                aria-label={`Show image ${index + 1} of ${heroImages.length}`}
                aria-current={activeSlide === index ? "true" : undefined}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  activeSlide === index
                    ? "w-9 bg-amber-400"
                    : "w-2.5 bg-white/60 hover:bg-white"
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={showNext}
            aria-label="Next featured vehicle image"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/40 bg-black/25 text-xl text-white backdrop-blur-sm transition hover:bg-white/20"
          >
            &#8594;
          </button>

          <span className="ml-2 text-xs tabular-nums text-white/75">
            {String(activeSlide + 1).padStart(2, "0")} /{" "}
            {String(heroImages.length).padStart(2, "0")}
          </span>
        </div>
      </div>
    </section>
  );
}
