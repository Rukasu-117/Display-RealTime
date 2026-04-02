"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface LoginCardProps {
  children: ReactNode;
}

export function LoginCard({ children }: LoginCardProps) {
  return (
    <motion.section
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, delay: 0.22 }}
      className="login-fade-up login-card-panel rounded-[1.75rem] border border-[#334761] bg-[#26354dd9] p-5 shadow-[0_18px_42px_rgba(8,17,30,0.55)] backdrop-blur-xl sm:p-6"
    >
      {children}
    </motion.section>
  );
}
