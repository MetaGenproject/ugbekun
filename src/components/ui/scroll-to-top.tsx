
/**
 * @author Daniel Innocent (@mdtbmw)
 * @copyright Copyright (c) 2024 Ugbekun. All rights reserved.
 */
"use client";

import { useEffect, useState, useRef } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleScroll = () => {
    // Set scrolling state
    setIsScrolling(true);
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }
    scrollTimeout.current = setTimeout(() => {
      setIsScrolling(false);
    }, 200); // User is considered "stopped" after 200ms

    // Visibility and progress logic
    const scrolled = document.documentElement.scrollTop;
    const maxHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    
    if (scrolled > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }

    if (maxHeight > 0) {
      setScrollProgress((scrolled / maxHeight) * 100);
    } else {
      setScrollProgress(0);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, []);
  
  const circumference = 2 * Math.PI * 20; // 2 * pi * radius
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;


  return (
    <button
      onClick={scrollToTop}
      className={cn(
        "fixed bottom-6 right-6 h-14 w-14 rounded-full border border-border bg-background/80 text-foreground backdrop-blur-md shadow-lg outline-none ring-ring transition-all focus-visible:ring-2 z-50",
        "hover:-translate-y-1",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      )}
      aria-label="Scroll to top"
    >
        {isScrolling ? (
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-medium">
            {`${Math.round(scrollProgress)}%`}
          </span>
        ) : (
          <ArrowUp className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-5 w-5" />
        )}
        <svg
            className="h-full w-full"
            viewBox="0 0 44 44"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <circle
                cx="22"
                cy="22"
                r="20"
                stroke="hsl(var(--border))"
                strokeWidth="3"
            />
            <circle
                cx="22"
                cy="22"
                r="20"
                stroke="hsl(var(--primary))"
                strokeWidth="3"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                transform="rotate(-90 22 22)"
                className="transition-[stroke-dashoffset] duration-150 ease-linear"
            />
        </svg>
    </button>
  );
}
