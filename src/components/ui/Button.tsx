import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "gold" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    const baseStyles =
      "relative inline-flex items-center justify-center font-sans tracking-wide transition-all duration-300 rounded-full select-none cursor-pointer focus:outline-none disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]";

    const sizeStyles = {
      sm: "min-h-[40px] px-4 py-1.5 text-xs font-medium",
      md: "min-h-[48px] px-6 py-2.5 text-sm font-medium",
      lg: "min-h-[54px] px-8 py-3.5 text-base font-semibold",
    };

    const variantStyles = {
      primary:
        "bg-accent text-white shadow-md hover:bg-accent/90 hover:shadow-lg border border-accent/20",
      secondary:
        "bg-surfaceDark text-textMain hover:bg-accentSoft/30 border border-borderLight",
      outline:
        "bg-transparent text-textMain border border-accent/40 hover:bg-accent/5 hover:border-accent",
      gold:
        "bg-gradient-to-r from-accentGold to-[#B89345] text-white shadow-md hover:shadow-accentGold/20 hover:brightness-105 border border-accentGold/40",
      ghost:
        "bg-transparent text-textMuted hover:text-textMain hover:bg-black/5",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
