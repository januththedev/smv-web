import * as React from "react";
import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "flex min-h-32 w-full rounded-lg bg-raised px-4 py-3 text-base text-fg shadow-[0_0_0_1px_rgb(238_234_227_/_12%)] placeholder:text-subtle outline-none transition-[box-shadow] duration-150 ease-out focus-visible:shadow-[0_0_0_1px_var(--color-iron)]",
      className,
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";
