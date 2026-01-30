describe('Stakeholder Identification page', () => {
  beforeEach(() => {
    cy.loginByNextAuth();
    cy.visit('/stakeholders', {
      onBeforeLoad(win) {
        win.localStorage.setItem('access_token', 'test');
        win.localStorage.setItem('refresh_token', 'test');
      },
    });
  });

  it('renders and allows saving SharePoint URL', () => {
    cy.contains('Stakeholder Identification');
    cy.contains('SharePoint URL');
    cy.contains('button', 'Save').click();
    cy.contains(/Saved|SharePoint URL saved/);
  });
});
