import { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md";
};

const variants = {
  primary:
    "bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)] disabled:opacity-50",
  secondary:
    "bg-white border border-[var(--border)] text-[var(--foreground)] hover:bg-slate-50",
  ghost: "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-slate-100",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm font-medium",
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: Props) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-lg transition-colors ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
