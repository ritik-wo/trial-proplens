describe('Component: ProjectDetailModal', () => {
  it('opens from Competition list and is centered, then closes', () => {
    cy.loginByNextAuth();
    cy.visit('/competition', {
      onBeforeLoad(win) {
        win.localStorage.setItem('access_token', 'test');
        win.localStorage.setItem('refresh_token', 'test');
      },
    });
    cy.get('[data-testid="list-row"]').first().within(() => {
      cy.contains('button', 'View').click();
    });
    cy.contains('Project Details').should('exist');
    cy.get('[role="dialog"]').should('exist');
    cy.contains('button', '✕ Close').click();
    cy.contains('Project Details').should('not.exist');
  });
});
