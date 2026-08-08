"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={
        mounted ? `Switch to ${isDark ? "light" : "dark"} mode` : "Toggle colour mode"
      }
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn("relative overflow-hidden", className)}
    >
      {/* Rendered only after mount so the icon never contradicts the resolved theme */}
      <AnimatePresence initial={false} mode="wait">
        {mounted && (
          <motion.span
            key={isDark ? "moon" : "sun"}
            initial={{ opacity: 0, rotate: -70, scale: 0.6 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 70, scale: 0.6 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 grid place-items-center"
          >
            {isDark ? <Moon className="size-4.5" /> : <Sun className="size-4.5" />}
          </motion.span>
        )}
      </AnimatePresence>
      <span className="sr-only">Toggle colour mode</span>
    </Button>
  );
}
