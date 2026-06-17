describe('Home page spec', () => {
  it('ajout sans erreur : 0 user → inscription valide → 1 user inscrit', () => {
    cy.clearLocalStorage()
    cy.visit('/')

    // Aucun utilisateur inscrit
    cy.get('[data-testid="registeredUsers-list"]').children().should('have.length', 0)

    // Remplir le formulaire sans erreur
    cy.get('#lastName').type('Test')
    cy.get('#firstName').type('Jean')
    cy.get('#email').type('jean.test@testmail.com')
    cy.get('#birthDate').type('1990-06-15')
    cy.get('#city').type('Nice')
    cy.get('#postalCode').type('06000')

    cy.get('[data-testid="submit-btn"]').should('not.be.disabled').click()

    // 1 utilisateur inscrit
    cy.get('[data-testid="registeredUsers-list"]').children().should('have.length', 1)
    cy.get('[data-testid="registeredUser-0"]').should('contain', 'Jean Test')
  })

  it('ajout avec erreur : 1 user → inscription invalide → toujours 1 user inscrit', () => {
    // Pré-remplir le localStorage avec 1 user
    const existingUser = [{
      lastName: 'Test',
      firstName: 'Alice',
      email: 'alice.test@testmail.com',
      birthDate: '1985-03-20',
      city: 'Mougins',
      postalCode: '06250',
    }]
    cy.clearLocalStorage()
    cy.window().then((win) => {
      win.localStorage.setItem('registeredUsers', JSON.stringify(existingUser))
    })

    cy.visit('/')

    // 1 utilisateur inscrit
    cy.get('[data-testid="registeredUsers-list"]').children().should('have.length', 1)

    // Remplir avec une erreur (ici : mail invalide)
    cy.get('#lastName').type('Test')
    cy.get('#firstName').type('Paul')
    cy.get('#email').type('mauvaisemail.com')
    cy.get('#birthDate').type('1995-01-10')
    cy.get('#city').type('Marseille')
    cy.get('#postalCode').type('13000')

    // Bouton désactivé car email invalide
    cy.get('[data-testid="submit-btn"]').should('be.disabled')

    // Toujours 1 utilisateur inscrit
    cy.get('[data-testid="registeredUsers-list"]').children().should('have.length', 1)
  })
})
