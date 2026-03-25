import ldap from "ldapjs";

interface AuthenticatedAdUser {
  id: string;
  name: string;
}

export async function authenticateAD(
  username: string,
  password: string
): Promise<AuthenticatedAdUser> {
  return new Promise<AuthenticatedAdUser>((resolve, reject) => {
    const client = ldap.createClient({
      url: process.env.AD_URL!,
      timeout: 5000,
      connectTimeout: 5000,
    });

    const dn = `${process.env.AD_DOMAIN}\\${username}`;

    client.bind(dn, password, (err) => {
      client.unbind();

      if (err) {
        reject(new Error("Credenciais inválidas"));
      } else {
        resolve({
          id: username,
          name: username,
        });
      }
    });
  });
}
