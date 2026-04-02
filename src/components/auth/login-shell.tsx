"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface LoginShellProps {
  hero: ReactNode;
  card: ReactNode;
}

export function LoginShell({ hero, card }: LoginShellProps) {
  return (
    <main className="login-screen relative min-h-screen overflow-hidden px-4 py-8 sm:px-6 lg:px-8">
      <div className="login-orb login-orb-primary" />
      <div className="login-orb login-orb-secondary" />
      <div className="login-orb login-orb-tertiary" />
      <div className="login-grid login-grid-left" />
      <div className="login-grid login-grid-right" />

      <motion.div
        initial={{ opacity: 0, scale: 0.985, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-7xl items-center rounded-[2rem] border border-[#27486A] bg-[linear-gradient(165deg,#0A1830_0%,#17335A_50%,#2E4F7D_100%)] px-6 py-8 shadow-[0_24px_80px_rgba(3,9,20,0.55)] sm:px-8 lg:px-12"
      >
        <div className="pointer-events-none absolute inset-[10px] rounded-[1.75rem] border border-[#3A5C86]/40" />
        <div className="relative grid w-full items-center gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-16">
          {hero}
          {card}
        </div>
      </motion.div>
    </main>
  );
}
