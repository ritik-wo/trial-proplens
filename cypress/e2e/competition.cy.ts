describe('Competition page', () => {
  beforeEach(() => {
    cy.loginByNextAuth();
    cy.visit('/competition', {
      onBeforeLoad(win) {
        win.localStorage.setItem('access_token', 'test');
        win.localStorage.setItem('refresh_token', 'test');
      },
    });
  });

  it('creates, views, and deletes a competing project (CRUD)', () => {
    const name = `Cypress Competitor ${Date.now()}`;

    cy.contains('button', '+ Add New Project').click();
    cy.get('#project-name').type(name);
    cy.get('#project-url').type('https://example.com/launch');
    cy.get('#coordinates').type('19.0760, 72.8777');
    cy.contains('button', 'Save Project').click();
    cy.contains('Project saved');

    cy.contains('[data-testid="list-row"]', name).should('exist');

    cy.contains('[data-testid="list-row"]', name).within(() => {
      cy.contains('button', 'View').click();
    });
    cy.contains('Project Details');
    cy.contains('button', '✕ Close').click();

    cy.contains('[data-testid="list-row"]', name).within(() => {
      cy.contains('button', 'Delete').click();
    });
    cy.get('[data-testid="dialog-confirm"]').click();
    cy.contains('Project deleted');
    cy.contains('[data-testid="list-row"]', name).should('not.exist');
  });
  it('renders seeded competing projects and can open/close details', () => {
    cy.contains('Information on competing projects');
    cy.get('[data-testid="list-row"]').should('have.length.at.least', 1);

    cy.get('[data-testid="list-row"]').first().within(() => {
      cy.contains('button', 'View').click();
    });
    cy.contains('Project Details');
    cy.contains('button', '✕ Close').click();
  });

  it('deletes a competing project from the list', () => {
    cy.get('[data-testid="list-row"]').its('length').as('count');
    cy.get('[data-testid="list-row"]').first().within(() => {
      cy.contains('button', 'Delete').click();
    });
    cy.get('[data-testid="dialog-confirm"]').click();
    cy.contains('Project deleted');
  });

  it('add new competing project validates required fields', () => {
    cy.contains('button', '+ Add New Project').click();
    cy.contains('button', 'Save Project').click();
    cy.contains('Project name is required');
    cy.contains('Location coordinates are required');
  });
});
