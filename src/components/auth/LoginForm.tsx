"use client";

import { motion } from "framer-motion";
import { Eye, EyeOff, ShieldCheck, UserRound } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { getSafeCallbackUrl } from "@/lib/auth/redirect";

interface LoginFormProps {
  callbackUrl: string;
}

export function LoginForm({ callbackUrl }: LoginFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = new FormData(e.currentTarget);
    const target = getSafeCallbackUrl(callbackUrl);

    const result = await signIn("credentials", {
      username: form.get("username"),
      password: form.get("password"),
      callbackUrl: target,
      redirect: false,
    });

    if (!result || result.error) {
      setError("Não foi possível autenticar com suas credenciais LDAP.");
      setLoading(false);
      return;
    }

    router.push(result.url ?? target);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <h2
          className="text-[2rem] font-semibold leading-tight text-white"
          style={{ fontFamily: "var(--font-heading), sans-serif" }}
        >
          Bem-vindo de volta
        </h2>
        <p className="text-sm text-[#93A7C2]">
          Acesse sua conta corporativa para continuar no painel administrativo.
        </p>
      </div>

      {error ? (
        <div className="rounded-xl border border-[#6B2D25] bg-[#361A17] px-4 py-3 text-sm text-[#FFD1C8]">
          {error}
        </div>
      ) : null}

      <div className="rounded-2xl border border-[rgba(73,102,139,0.32)] bg-[rgba(19,34,56,0.5)] px-4 py-3 text-xs leading-6 text-[#C8D7E8]">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-lg bg-[rgba(255,146,47,0.12)] text-[#FF922F]">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <p>
            Utilize suas credenciais LDAP para acessar o ambiente administrativo.
            O acesso é restrito e a sessão expira em 4 horas.
          </p>
        </div>
      </div>

      <motion.div className="space-y-2" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-[#C0D0E4]">
          Usuário LDAP
        </label>
        <div className="relative">
          <UserRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8FA4BF]" />
          <input
            name="username"
            placeholder="seu.usuario"
            autoComplete="username"
            required
            disabled={loading}
            className="w-full rounded-xl border border-[#405774] bg-[#31445F]/70 py-3 pl-11 pr-4 text-sm text-white outline-none transition focus:border-[#FF922F] focus:ring-2 focus:ring-[#FF922F]/20 placeholder:text-[#92A5BD]"
          />
        </div>
      </motion.div>

      <motion.div className="space-y-2" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}>
        <div className="flex items-center justify-between gap-3">
          <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-[#C0D0E4]">
            Senha
          </label>
          <span className="text-[11px] text-[#FFB171]">Sessão válida por 4 horas</span>
        </div>
        <div className="relative">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Digite sua senha"
            autoComplete="current-password"
            required
            disabled={loading}
            className="w-full rounded-xl border border-[#405774] bg-[#31445F]/70 px-4 py-3 pr-12 text-sm text-white outline-none transition focus:border-[#FF922F] focus:ring-2 focus:ring-[#FF922F]/20 placeholder:text-[#92A5BD]"
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8FA4BF] transition hover:text-white"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </motion.div>

      <div className="flex items-center justify-between gap-3 px-1 text-[11px] text-[#8FA4BF]">
        <span>Acesso restrito às áreas administrativas</span>
        <span>LDAP corporativo</span>
      </div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}>
        <Button
          type="submit"
          disabled={loading}
          className="min-h-12 w-full rounded-xl bg-[linear-gradient(90deg,#FF922F_0%,#F36F12_100%)] text-sm font-semibold text-white shadow-[0_12px_28px_rgba(243,111,18,0.28)] hover:bg-[linear-gradient(90deg,#FFA549_0%,#FF7B21_100%)]"
        >
          {loading ? "Autenticando..." : "Entrar"}
        </Button>
      </motion.div>

      <p className="pt-2 text-center text-[11px] text-[#617692]">
        © 2026 Riopae Nexus - Todos os direitos reservados
      </p>
    </form>
  );
}
