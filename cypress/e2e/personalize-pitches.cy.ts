describe('Personalize Pitches', () => {
  beforeEach(() => {
    cy.viewport(1280, 900);
    cy.loginByNextAuth();
    cy.intercept('POST', '**/api/pitch/sales_pitch_using_query', {
      statusCode: 200,
      body: { pitch: 'This is a generated pitch.' },
    }).as('generatePitch');
    cy.visit('/personalize-pitches', {
      onBeforeLoad(win) {
        win.localStorage.setItem('access_token', 'test');
        win.localStorage.setItem('refresh_token', 'test');
      },
    });
  });

  it('fills the form and opens the generated pitch dialog', () => {
    cy.get('[role="combobox"]').eq(0).click();
    cy.get('[role="option"]').first().click({ force: true });

    cy.get('[role="combobox"]').eq(1).click();
    cy.get('[role="option"]').contains(/Message|Email|Bulleted/).first().click({ force: true });

    cy.get('[role="combobox"]').eq(2).click();
    cy.get('[role="option"]').contains(/Enquiry|Consideration|Purchase/).first().click({ force: true });

    cy.get('input[placeholder="Enter customer name"]').type('John Doe');
    cy.get('textarea[placeholder="Emphasize on investment potential"]').type('Focus on ROI and family-friendly amenities');

    cy.contains('button', 'Generate Personalized Pitch').click();

    cy.wait('@generatePitch');

    cy.contains('[role="dialog"]', 'Personalized Sales Pitch', { timeout: 12000 }).should('exist');
    cy.get('[role="dialog"]').within(() => {
      cy.contains('.chat-markdown', 'This is a generated pitch.', { timeout: 12000 }).should('exist');
      cy.get('button[aria-label="Edit"]:not([disabled])', { timeout: 30000 }).should('be.visible').click();
      cy.get('[role="textbox"][aria-label="Edit pitch"]').should('be.visible').type('{selectall}This is my edited pitch.');
      cy.contains('button', 'Save').click();
      cy.contains('.chat-markdown', 'This is my edited pitch.').should('exist');
      cy.contains('button', 'Close').click();
    });
  });
});
