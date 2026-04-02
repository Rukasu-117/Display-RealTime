import ldap from "ldapjs";

export interface AuthenticatedAdUser {
  id: string;
  username: string;
  name: string;
  email?: string;
}

function isAuthDebugEnabled() {
  return process.env.AUTH_DEBUG === "true";
}

function logAuthDebug(event: string, details: Record<string, unknown>) {
  if (!isAuthDebugEnabled()) return;
  console.info(`[auth][ldap] ${event}`, details);
}

function getBindCandidates(username: string) {
  const domain = process.env.AD_DOMAIN?.trim();

  return [
    domain ? `${domain}\\${username}` : null,
    domain ? `${username}@${domain}` : null,
    username,
  ].filter((value): value is string => Boolean(value));
}

export async function authenticateAD(
  username: string,
  password: string
): Promise<AuthenticatedAdUser> {
  const bindCandidates = getBindCandidates(username);
  const domain = process.env.AD_DOMAIN?.trim();
  const email = username.includes("@") ? username : domain ? `${username}@${domain}` : undefined;

  return new Promise<AuthenticatedAdUser>((resolve, reject) => {
    const client = ldap.createClient({
      url: process.env.AD_URL!,
      timeout: 5000,
      connectTimeout: 5000,
    });

    let currentIndex = 0;

    const tryNextBind = () => {
      const bindDn = bindCandidates[currentIndex];

      if (!bindDn) {
        client.unbind();
        reject(new Error("Credenciais inválidas"));
        return;
      }

      logAuthDebug("bind_attempt", {
        username,
        adUrl: process.env.AD_URL,
        bindDn,
        strategy: currentIndex,
      });

      client.bind(bindDn, password, (err) => {
        if (!err) {
          logAuthDebug("bind_success", {
            username,
            bindDn,
          });

          client.unbind();
          resolve({
            id: username,
            username,
            name: username,
            email,
          });
          return;
        }

        logAuthDebug("bind_failed", {
          username,
          bindDn,
          code: err.code,
          name: err.name,
          message: err.message,
        });

        currentIndex += 1;
        tryNextBind();
      });
    };

    client.on("error", (error) => {
      logAuthDebug("client_error", {
        username,
        code: (error as NodeJS.ErrnoException).code,
        name: error.name,
        message: error.message,
      });
    });

    tryNextBind();
  });
}
