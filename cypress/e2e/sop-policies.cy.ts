describe('SOP & Policies page', () => {
  beforeEach(() => {
    cy.loginByNextAuth();
    cy.visit('/sop-policies', {
      onBeforeLoad(win) {
        win.localStorage.setItem('access_token', 'test');
        win.localStorage.setItem('refresh_token', 'test');
      },
    });
  });

  it('renders DocumentSection blocks and shows counts', () => {
    cy.contains('SOP & Policies Management');
    cy.contains('Sales SOPs');
    cy.contains('Customer KYC/Document Upload Guidelines');
    cy.contains('Current documents');
  });

  it('deletes a document from Sales SOPs list', () => {
    cy.contains('Sales SOPs').closest('section').within(() => {
      cy.get('[data-testid="list-row"]').first().within(() => {
        cy.contains('button', 'Delete').click();
      });
    });
    cy.contains('Document deleted');
  });
});
