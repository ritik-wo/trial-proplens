declare global {
  namespace Cypress {
    interface Chainable {
      loginByNextAuth(user?: {
        id?: string;
        role?: string;
        org_id?: string;
        sessionId?: string;
        firstLogin?: boolean;
        email?: string;
        name?: string;
      }): Chainable<void>;
    }
  }
}

Cypress.Commands.add(
  "loginByNextAuth",
  (user?: {
    id?: string;
    role?: string;
    org_id?: string;
    sessionId?: string;
    firstLogin?: boolean;
    email?: string;
    name?: string;
  }) => {
    const isHttps = Cypress.config("baseUrl")?.startsWith("https://");
    const cookieName = Cypress.env("NEXTAUTH_COOKIE") || (isHttps ? "__Secure-next-auth.session-token" : "next-auth.session-token");

    return (cy
      .task("mintNextAuthToken", user || {})
      .then((token) => {
        cy.setCookie(cookieName, String(token), {
          httpOnly: true,
          secure: Boolean(isHttps),
          sameSite: "lax",
        });
      })
      .then(() => undefined) as unknown) as Cypress.Chainable<void>;
  },
);

export {};
