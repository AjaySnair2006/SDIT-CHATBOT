"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface HeroBackgroundProps {
  /** Paths under /public, e.g. ["/hero-bg-1.jpg", "/hero-bg-2.jpg"] */
  images: string[];
  /** Milliseconds between transitions */
  intervalMs?: number;
}

export default function HeroBackground({
  images,
  intervalMs = 5000,
}: HeroBackgroundProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const id = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % images.length);
    }, intervalMs);

    return () => clearInterval(id);
  }, [images.length, intervalMs]);

  return (
    <>
      {images.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt=""
          fill
          priority={i === 0}
          sizes="(min-width: 1024px) 896px, 100vw"
          aria-hidden="true"
          className={`object-cover transition-opacity duration-1000 ease-in-out ${
            i === activeIndex ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
    </>
  );
}