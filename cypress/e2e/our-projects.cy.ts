describe('Our Projects page', () => {
  beforeEach(() => {
    cy.loginByNextAuth();
    cy.visit('/our-projects', {
      onBeforeLoad(win) {
        win.localStorage.setItem('access_token', 'test');
        win.localStorage.setItem('refresh_token', 'test');
      },
    });
  });

  it('new project form shows validation errors on empty submit', () => {
    cy.contains('button', '+ Add New Project').click();
    cy.get('[data-testid="new-project-form"]').should('be.visible');
    cy.contains('button', 'Save Project').click();
    cy.contains('Project name is required');
    cy.contains('Project URL is required');
    cy.contains('Location coordinates are required');
  });
 
  it('renders existing projects from mocks', () => {
    cy.contains('Existing Projects');
    cy.get('[data-testid="list-row"]').should('have.length.at.least', 1);
  });

  it('opens and closes details for an existing project', () => {
    cy.get('[data-testid="list-row"]').first().within(() => {
      cy.contains('button', 'View').click();
    });
    cy.contains('Project Details');
    cy.contains('button', '✕ Close').click();
  });

  it('create project, view details modal, and delete', () => {
    cy.get('[data-testid="list-row"]').its('length').as('initialCount');
    cy.contains('button', '+ Add New Project').click();
    cy.get('[data-testid="new-project-form"]').should('be.visible');
    const name = `Cypress Project ${Date.now()}`;
    cy.get('#project-name').type(name);
    cy.get('#project-url').type('https://example.com/project');
    cy.get('#coordinates').type('19.076, 72.8777');
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

});
