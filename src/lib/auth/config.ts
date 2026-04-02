import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authenticateAD } from "@/lib/auth/ad";
import { DEFAULT_ADMIN_REDIRECT, getSafeCallbackUrl } from "@/lib/auth/redirect";
import { syncAdminUser } from "@/lib/auth/user-sync";

export const ADMIN_SESSION_MAX_AGE = 4 * 60 * 60;

function isAuthDebugEnabled() {
  return process.env.AUTH_DEBUG === "true";
}

function logAuthDebug(event: string, details: Record<string, unknown>) {
  if (!isAuthDebugEnabled()) return;
  console.info(`[auth][nextauth] ${event}`, details);
}

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: "Active Directory",
      credentials: {
        username: { label: "Usuário", type: "text" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          logAuthDebug("authorize_missing_credentials", {});
          return null;
        }

        try {
          const ldapUser = await authenticateAD(credentials.username, credentials.password);
          const adminUser = await syncAdminUser(ldapUser);

          logAuthDebug("authorize_success", {
            username: credentials.username,
          });

          return {
            id: adminUser.id,
            name: adminUser.displayName,
            email: adminUser.email ?? ldapUser.email,
            username: adminUser.username,
          };
        } catch (error) {
          logAuthDebug("authorize_failed", {
            username: credentials.username,
            message: error instanceof Error ? error.message : "unknown_error",
          });
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: ADMIN_SESSION_MAX_AGE,
    updateAge: 0,
  },
  jwt: {
    maxAge: ADMIN_SESSION_MAX_AGE,
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.name = user.name;
        token.email = user.email;
        token.username = (user as { username?: string }).username;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user && token.name) {
        session.user.name = token.name;
        session.user.email = typeof token.email === "string" ? token.email : null;
        (session.user as { username?: string }).username =
          typeof token.username === "string" ? token.username : undefined;
      }

      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) {
        return `${baseUrl}${getSafeCallbackUrl(url)}`;
      }

      try {
        const target = new URL(url);
        if (target.origin === baseUrl) {
          return `${baseUrl}${getSafeCallbackUrl(`${target.pathname}${target.search}`)}`;
        }
      } catch {
        return `${baseUrl}${DEFAULT_ADMIN_REDIRECT}`;
      }

      return `${baseUrl}${DEFAULT_ADMIN_REDIRECT}`;
    },
  },
};
