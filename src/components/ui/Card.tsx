import { motion } from "framer-motion";
import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export default function Card({
  children,
  className = "",
  // hover = true,
  onClick,
}: CardProps) {
  const baseClasses =
    "bg-white rounded-lg shadow-md transition-all duration-300";
  const clickableClasses = onClick ? "cursor-pointer" : "";

  return (
    <motion.div
      className={`${baseClasses}  ${clickableClasses} ${className}`}
      onClick={onClick}
      transition={{ duration: 0.3 }}>
      {children}
    </motion.div>
  );
}
