import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { LoginCard } from "@/components/auth/login-card";
import { LoginHero } from "@/components/auth/login-hero";
import { LoginShell } from "@/components/auth/login-shell";
import { LoginForm } from "@/components/auth/LoginForm";
import { authOptions } from "@/lib/auth/config";
import { getSafeCallbackUrl } from "@/lib/auth/redirect";

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: { callbackUrl?: string };
}) {
  const session = await getServerSession(authOptions);
  const callbackUrl = getSafeCallbackUrl(searchParams?.callbackUrl);

  if (session) {
    redirect(callbackUrl);
  }

  return (
    <LoginShell
      hero={<LoginHero />}
      card={
        <LoginCard>
          <LoginForm callbackUrl={callbackUrl} />
        </LoginCard>
      }
    />
  );
}
