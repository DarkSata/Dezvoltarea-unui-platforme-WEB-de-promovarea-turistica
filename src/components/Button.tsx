import type { ButtonHTMLAttributes, ReactNode } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "ghost" | "small";
};

export default function Button({
  children,
  variant = "primary",
  className = "",
  ...rest
}: Props) {
  const variantClass = variant === "small" ? "btn small" : `btn ${variant}`;
  return (
    <button className={`${variantClass} ${className}`.trim()} {...rest}>
      {children}
    </button>
  );
}
