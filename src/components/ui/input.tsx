import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(({ className, type, ...props }, ref) => (
  <input
    type={type}
    ref={ref}
    className={cn(
      "flex h-12 w-full rounded-md bg-raised px-4 text-base text-fg shadow-[0_0_0_1px_rgb(238_234_227_/_12%)] placeholder:text-subtle outline-none transition-[box-shadow] duration-150 ease-out focus-visible:shadow-[0_0_0_1px_var(--color-iron)]",
      className,
    )}
    {...props}
  />
));
Input.displayName = "Input";
