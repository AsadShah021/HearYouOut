import * as React from "react";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Native input under a styled box — keeps form semantics, keyboard behaviour and
 * `required` validation without pulling in another Radix package.
 */
function Checkbox({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <span className="relative inline-grid shrink-0 place-items-center">
      <input
        type="checkbox"
        data-slot="checkbox"
        className={cn(
          "peer border-input bg-background/60 checked:border-primary checked:bg-primary focus-visible:ring-ring/40 size-5 cursor-pointer appearance-none rounded-md border transition-colors outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      />
      <Check
        aria-hidden
        strokeWidth={3.5}
        className="text-primary-foreground pointer-events-none absolute size-3 opacity-0 transition-opacity peer-checked:opacity-100"
      />
    </span>
  );
}

export { Checkbox };
