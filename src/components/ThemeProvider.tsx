"use client";

import { useEffect } from "react";

function applyThemeFromSystem() {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  document.documentElement.dataset.theme = prefersDark ? "dark" : "light";
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    applyThemeFromSystem();

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyThemeFromSystem();

    // Safari fallback supports addListener
    if (media.addEventListener) media.addEventListener("change", onChange);
    else media.addListener(onChange);

    return () => {
      if (media.removeEventListener) media.removeEventListener("change", onChange);
      else media.removeListener(onChange);
    };
  }, []);

  return <>{children}</>;
}
