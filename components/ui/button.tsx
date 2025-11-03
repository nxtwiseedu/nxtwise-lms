import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Rounded, approachable button variant — behavior-first, colorless.
 */
const buttonVariants = cva(
  [
    // layout
    "inline-flex select-none items-center justify-center gap-2 whitespace-nowrap",
    // typography
    "text-sm font-medium tracking-[-0.01em]",
    // rounded shape for edutech tone
    "rounded-xl", // softer corners
    // interactivity
    "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "transition-[transform,box-shadow,opacity] duration-150 ease-out motion-reduce:transition-none",
    // tactile feel
    "[@media(hover:hover)]:hover:-translate-y-[2px] active:translate-y-[1px]",
    "shadow-sm [@media(hover:hover)]:hover:shadow-md active:shadow-sm",
    // disabled
    "disabled:pointer-events-none disabled:opacity-50",
    "aria-busy:cursor-progress aria-busy:opacity-70",
    // icons
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      variant: {
        default: "",
        destructive: "",
        outline:
          "border border-input bg-background/50 backdrop-blur-sm supports-[backdrop-filter]:bg-background/40",
        secondary:
          "bg-secondary/60 [@media(hover:hover)]:hover:bg-secondary/70",
        ghost:
          "bg-transparent [@media(hover:hover)]:hover:bg-accent/40 hover:shadow-sm",
        link: "underline underline-offset-4 [@media(hover:hover)]:hover:no-underline",
      },
      size: {
        default: "h-9 px-4",
        sm: "h-8 px-3 text-xs rounded-lg",
        lg: "h-11 px-6 text-base rounded-2xl", // larger buttons = softer radius
        xl: "h-12 px-8 text-base rounded-3xl",
        icon: "h-9 w-9 p-0 rounded-lg",
      },
      block: {
        true: "w-full",
        false: "",
      },
      loading: {
        true: "pointer-events-none opacity-80",
        false: "",
      },
    },
    compoundVariants: [{ size: "icon", class: "[&_svg]:size-5" }],
    defaultVariants: {
      variant: "default",
      size: "default",
      block: false,
      loading: false,
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, block, loading, asChild = false, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(
          buttonVariants({ variant, size, block, loading }),
          className
        )}
        aria-busy={loading || undefined}
        data-state={loading ? "loading" : undefined}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
