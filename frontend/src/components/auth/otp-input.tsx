"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

const LENGTH = 6;

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  /** Fired when all six boxes are full, so nobody hunts for a submit button. */
  onComplete?: (value: string) => void;
  disabled?: boolean;
  invalid?: boolean;
  autoFocus?: boolean;
}

/**
 * Six boxes that behave the way people expect a code field to behave.
 *
 * The fiddly parts are deliberate: pasting the whole code from an email fills
 * every box rather than dumping six characters into the first; backspace on an
 * empty box steps back instead of doing nothing; and the numeric keypad opens
 * on phones. Getting these wrong is the difference between a five-second step
 * and an abandoned signup.
 */
export function OtpInput({
  value,
  onChange,
  onComplete,
  disabled,
  invalid,
  autoFocus,
}: OtpInputProps) {
  const refs = React.useRef<(HTMLInputElement | null)[]>([]);
  const digits = value.padEnd(LENGTH).slice(0, LENGTH).split("");

  const commit = React.useCallback(
    (next: string) => {
      onChange(next);
      if (next.length === LENGTH) onComplete?.(next);
    },
    [onChange, onComplete],
  );

  function handleChange(index: number, raw: string) {
    const typed = raw.replace(/\D/g, "");
    if (!typed) return;

    // Covers both a single keystroke and a paste landing mid-field.
    const next = (value.slice(0, index) + typed).slice(0, LENGTH);
    commit(next);

    const focus = Math.min(index + typed.length, LENGTH - 1);
    refs.current[focus]?.focus();
  }

  function handleKeyDown(index: number, event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace") {
      event.preventDefault();
      if (value[index]) {
        commit(value.slice(0, index) + value.slice(index + 1));
      } else if (index > 0) {
        commit(value.slice(0, index - 1));
        refs.current[index - 1]?.focus();
      }
      return;
    }

    if (event.key === "ArrowLeft" && index > 0) {
      event.preventDefault();
      refs.current[index - 1]?.focus();
    }
    if (event.key === "ArrowRight" && index < LENGTH - 1) {
      event.preventDefault();
      refs.current[index + 1]?.focus();
    }
  }

  function handlePaste(event: React.ClipboardEvent) {
    event.preventDefault();
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, LENGTH);
    if (!pasted) return;
    commit(pasted);
    refs.current[Math.min(pasted.length, LENGTH - 1)]?.focus();
  }

  return (
    <div className="flex justify-center gap-2 sm:gap-2.5" onPaste={handlePaste}>
      {Array.from({ length: LENGTH }, (_, index) => (
        <input
          key={index}
          ref={(node) => {
            refs.current[index] = node;
          }}
          // `text` with a numeric pattern, not `number`: type=number shows
          // spinners and lets people type "e" and "-".
          type="text"
          inputMode="numeric"
          pattern="\d*"
          maxLength={LENGTH}
          autoComplete={index === 0 ? "one-time-code" : "off"}
          autoFocus={autoFocus && index === 0}
          disabled={disabled}
          aria-label={`Digit ${index + 1} of ${LENGTH}`}
          aria-invalid={invalid || undefined}
          value={digits[index]?.trim() ?? ""}
          onChange={(event) => handleChange(index, event.target.value)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          onFocus={(event) => event.target.select()}
          className={cn(
            "border-border bg-background size-12 rounded-xl border text-center text-lg font-semibold",
            "tabular-nums transition-[color,box-shadow,border-color] outline-none sm:size-14 sm:text-xl",
            "focus-visible:border-primary focus-visible:ring-primary/25 focus-visible:ring-[3px]",
            "disabled:opacity-50",
            invalid && "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/25",
          )}
        />
      ))}
    </div>
  );
}
