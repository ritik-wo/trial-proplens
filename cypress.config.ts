import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    supportFile: "cypress/support/e2e.ts",
    specPattern: "cypress/e2e/**/*.cy.ts",
    setupNodeEvents(on) {
      on("task", {
        async setStaticAuthCookie(user) {
          return {
            name: 'auth_logged_in',
            value: 'true',
            path: '/',
            maxAge: 3600,
            userId: user?.id || "670cdc3dbeaad47a838e3dea",
            userEmail: user?.email || "admin@proplens.ai",
            userName: user?.name || "Proplens Admin",
            userRole: user?.role || "admin",
            userOrgId: user?.org_id || "6645dc2f76aefc4f72970f05"
          };
        },
      });
    },
  },

  component: {
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
  },
});
