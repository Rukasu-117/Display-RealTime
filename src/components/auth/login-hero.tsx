"use client";

import { Check, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export function LoginHero() {
  return (
    <motion.section
      initial={{ opacity: 0, x: -24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, delay: 0.15 }}
      className="login-fade-up max-w-xl text-white"
    >
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#9FB4CC]">
          Plataforma corporativa
        </p>
        <h1
          className="text-4xl font-semibold tracking-tight sm:text-5xl"
          style={{ fontFamily: "var(--font-heading), sans-serif" }}
        >
          Riopae <span className="text-[#FF922F]">Nexus</span>
        </h1>
        <p className="max-w-lg text-sm leading-7 text-[#AFC0D4] sm:text-base">
          Acesse o painel administrativo para gerenciar displays, playlists,
          previews e publicações em tempo real com autenticação corporativa.
        </p>
      </div>

      <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.04)] px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.16em] text-[#C8D7E8]">
        Portal administrativo seguro
      </div>

      <div className="mt-10 rounded-[1.5rem] border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.03)] p-5 backdrop-blur-xl">
        <div className="mb-4 flex items-center gap-3 text-sm font-semibold text-white">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[rgba(255,146,47,0.12)] text-[#FF922F]">
            <ShieldCheck className="h-4 w-4" />
          </div>
          Camada administrativa protegida
        </div>
        <div className="space-y-4 text-sm text-[#D6E0EC]">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-lg bg-[rgba(255,146,47,0.12)] text-[#FF922F]">
              <Check className="h-3.5 w-3.5" />
            </div>
            <p>Monitore a operação dos displays em um painel centralizado.</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-lg bg-[rgba(255,146,47,0.12)] text-[#FF922F]">
              <Check className="h-3.5 w-3.5" />
            </div>
            <p>Atualize conteúdos e reflita alterações no player em tempo real.</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-lg bg-[rgba(255,146,47,0.12)] text-[#FF922F]">
              <Check className="h-3.5 w-3.5" />
            </div>
            <p>Proteja o ambiente administrativo com credenciais LDAP e sessão limitada.</p>
          </div>
        </div>
      </div>

      <div className="mt-8 text-xs uppercase tracking-[0.2em] text-[#9FB4CC]">
        Digital Signage • Controle Operacional • Sessão Corporativa
      </div>
    </motion.section>
  );
}
