import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authenticateAD } from "@/lib/auth/ad";

const handler = NextAuth({
  providers: [
    Credentials({
      name: "Active Directory",
      credentials: {
        username: { label: "Usuário", type: "text" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        try {
          return await authenticateAD(
            credentials.username,
            credentials.password
          );
        } catch {
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
});

export { handler as GET, handler as POST };
