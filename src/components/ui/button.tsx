import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-medium tracking-wide whitespace-nowrap select-none rounded-full outline-none transition-[background-color,color,box-shadow,transform,opacity] duration-150 ease-out active:not-disabled:scale-[0.96] disabled:pointer-events-none disabled:opacity-40",
  {
    variants: {
      variant: {
        primary:
          "bg-fg text-bg hover:bg-fg/90 shadow-[0_0_0_1px_rgb(238_234_227_/_8%)]",
        iron:
          "bg-iron text-fg hover:bg-iron/90",
        ghost:
          "bg-transparent text-fg shadow-[0_0_0_1px_rgb(238_234_227_/_16%)] hover:bg-fg/6",
        quiet: "bg-transparent text-muted hover:text-fg",
      },
      size: {
        md: "h-11 px-5 text-sm",
        lg: "h-12 px-6 text-[0.9375rem]",
        sm: "h-9 px-4 text-xs",
        icon: "size-11",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { buttonVariants };
