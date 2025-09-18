describe('Login pagina', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000') })

  it('Laadt de loginpagina correct', () => {
    cy.contains('Login')
    cy.get('#loginForm').should('exist')
    cy.get('#user').should('have.attr', 'placeholder', 'Gebruikersnaam')
    cy.get('#pwd').should('have.attr', 'placeholder', 'Wachtwoord')
    cy.contains('Nog geen account?')
  })

  it('Gebruiker kan velden invullen en submitten', () => {
    cy.get('#user').type('Sinan1')
    cy.get('#pwd').type('Sagir')
    cy.get('#loginForm').submit()
    cy.url().should('include', '/dashboard')
  })

  it('Link naar registratie werkt', () => {
    cy.contains('Registreer hier').click()
    cy.url().should('include', '/auth/register')
  })
})
