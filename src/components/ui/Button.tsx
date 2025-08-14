import { motion } from "framer-motion";
import { ReactNode } from "react";
import styles from "./Button.module.css";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "accent";
  size?: "sm" | "md" | "lg";
  className?: string;
  disabled?: boolean;
}

export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
}: ButtonProps) {
  const baseClasses = styles.button;

  const variantClasses = {
    primary: styles.primary,
    secondary: styles.secondary,
    accent: styles.accent,
  };

  const sizeClasses = {
    sm: styles.small,
    md: styles.medium,
    lg: styles.large,
  };

  const disabledClasses = disabled ? styles.disabled : "";

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`}
      whileHover={disabled ? {} : { scale: 1.05 }}
      whileTap={disabled ? {} : { scale: 0.95 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}>
      {children}
    </motion.button>
  );
}
