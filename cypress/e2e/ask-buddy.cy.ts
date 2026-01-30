describe('Ask Buddy', () => {
  beforeEach(() => {
    cy.loginByNextAuth();
    cy.intercept('GET', '**/api/buddy/**/chats**', {
      statusCode: 200,
      body: [],
    }).as('listChats');

    cy.intercept('POST', '**/api/buddy/**/chats', (req) => {
      req.reply({
        statusCode: 200,
        body: { _id: 'test-chat' },
      });
    }).as('createChat');

    cy.intercept('POST', '**/api/run_user_query/query', (req) => {
      const bodyAny = req.body as any;
      const raw =
        typeof bodyAny === 'string'
          ? bodyAny
          : (bodyAny && typeof bodyAny.toString === 'function' ? bodyAny.toString() : '');
      const parsed = new URLSearchParams(raw);

      const chatId = parsed.get('chat_id') || bodyAny?.chat_id;
      const query = parsed.get('query') || bodyAny?.query;

      expect(chatId).to.eq('test-chat');
      expect(query).to.be.a('string').and.not.be.empty;
      req.reply({
        statusCode: 200,
        body: { result: 'Hello, this is a test response' },
      });
    }).as('runQuery');

    cy.visit('/ask-buddy', {
      onBeforeLoad(win) {
        win.localStorage.setItem('access_token', 'test');
        win.localStorage.setItem('refresh_token', 'test');
      },
    });
  });

  it('sends a message and shows assistant reply', () => {
    cy.get('input[placeholder*="Ask anything"], input[placeholder*="unit availability"]').as('input');
    cy.get('@input').type('Hello there');
    cy.get('button[aria-label="Send message"]').click();

    cy.wait('@createChat');
    cy.contains('div', 'Hello there', { timeout: 4000 }).should('exist');

    cy.wait('@runQuery');
    cy.contains('.chat-markdown', 'Hello, this is a test response', { timeout: 6000 }).should('exist');
  });

  it('supports Enter to send', () => {
    cy.get('input[placeholder*="Ask anything"], input[placeholder*="unit availability"]').type('Second message{enter}');
    cy.wait('@createChat');
    cy.contains('div', 'Second message', { timeout: 4000 }).should('exist');
    cy.wait('@runQuery');
    cy.contains('.chat-markdown', 'Hello, this is a test response', { timeout: 6000 }).should('exist');
  });
});
