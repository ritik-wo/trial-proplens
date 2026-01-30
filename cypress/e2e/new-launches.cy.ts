describe('New Launches page', () => {
  beforeEach(() => {
    cy.loginByNextAuth();
    cy.visit('/new-launches', {
      onBeforeLoad(win) {
        win.localStorage.setItem('access_token', 'test');
        win.localStorage.setItem('refresh_token', 'test');
      },
    });
  });

  it('renders sections and allows saving a link', () => {
    cy.contains('Manage latest market updates on new launches and transaction trends');
    cy.contains('New project launches');
    cy.contains('Links for new project launches');
    cy.contains('button', 'Save').click();
    cy.contains('Saved');
  });

  it('shows previously uploaded projects and can open/close details', () => {
    cy.contains('Previously Uploaded Projects');
    cy.get('[data-testid="list-row"]').should('have.length.at.least', 1);

    cy.get('[data-testid="list-row"]').first().within(() => {
      cy.contains('button', 'View').click();
    });
    cy.contains('Project Details');
    cy.contains('button', '✕ Close').click();
  });

  it('deletes an item from Existing market research reports list (limited to one)', () => {
    cy.contains('Existing market research reports');
    cy.get('[data-testid="list-row"]').filter(':contains("Uploaded:")').its('length').as('initial');
    cy.get('[data-testid="list-row"]').filter(':contains("Uploaded:")').first().within(() => {
      cy.contains('button', 'Delete').click();
    });
    cy.contains('Report removed');
  });
});
