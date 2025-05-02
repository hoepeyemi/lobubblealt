"use client";
import useMouseMove from "~/hooks/useMouseMove";
import type { ReactNode } from "react";
import "./background.css";
import { usePathname } from "next/navigation";

interface BackgroundProps {
  children: ReactNode;
  animateDots?: boolean;
}

export default function Background({ children, animateDots = true }: BackgroundProps) {
  // --x and --y will be updated based on mouse position
  useMouseMove();
  const pathname = usePathname();
  
  // Only show background effects on pages other than the homepage
  const isHomepage = pathname === "/";

  return (
    <>
      {!isHomepage && (
        <div className="-z-50 fixed top-0 left-0">
          <div className="sticky top-0 left-0 h-screen w-screen overflow-hidden">
            <div className="absolute inset-0 z-[-1] bg-muted-foreground/10" />
            <div className="-translate-x-1/2 -translate-y-1/2 absolute top-[--y] left-[--x] z-[-1] h-56 w-56 rounded-full bg-gradient-radial from-0% from-muted-foreground/30 to-90% to-transparent blur-md" />
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" className={animateDots ? "animate-dots" : ""}>
              <defs>
                <pattern
                  id="dotted-pattern"
                  width="24"
                  height="24"
                  patternUnits="userSpaceOnUse"
                >
                  <circle cx="2" cy="2" r="1" fill="hsl(var(--foreground) / 0.4)" />
                </pattern>
                <mask id="dots-mask">
                  <rect width="100%" height="100%" fill="white" />
                  <rect width="100%" height="100%" fill="url(#dotted-pattern)" />
                </mask>
              </defs>
              <rect
                width="100%"
                height="100%"
                fill="hsl(var(--background))"
                mask="url(#dots-mask)"
              />
            </svg>
          </div>
        </div>
      )}

      {children}
    </>
  );
}
