// ─────────────────────────────────────────────────────────────────────────────
// Données réutilisables dans les tests
// ─────────────────────────────────────────────────────────────────────────────

const validUser = {
  lastName: 'Test',
  firstName: 'Jean',
  email: 'jean.test@testmail.com',
  birthDate: '1990-06-15',
  city: 'Nice',
  postalCode: '06000',
}

const mockUsers = [
  { id: 1, firstName: 'Jean', lastName: 'Test', email: 'jean.test@testmail.com' },
]

const mockUserDetails = {
  id: 1,
  firstName: 'Jean',
  lastName: 'Test',
  email: 'jean.test@testmail.com',
  birthDate: '1990-06-15',
  city: 'Nice',
  postalCode: '06000',
}

// Helper : remplit tous les champs du formulaire (onglet Inscription)
function fillForm(user) {
  cy.get('#lastName').type(user.lastName)
  cy.get('#firstName').type(user.firstName)
  cy.get('#email').type(user.email)
  cy.get('#birthDate').type(user.birthDate)
  cy.get('#city').type(user.city)
  cy.get('#postalCode').type(user.postalCode)
}

// Contournement pour les dates hors plage Cypress (ex : 0001-01-01)
function setDateNative(value) {
  cy.get('#birthDate').then(($input) => {
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      'value'
    ).set;
    nativeInputValueSetter.call($input[0], value);
    $input[0].dispatchEvent(new Event('input', { bubbles: true }));
  })
}

// Helper : se connecte en admin depuis l'onglet Connexion
function loginAsAdmin() {
  cy.get('[data-testid="tab-connexion"]').click()
  cy.intercept('POST', /\/login/, { body: { success: true, is_admin: true } }).as('login')
  cy.get('[data-testid="admin-email-input"]').type('loise.fenoll@ynov.com')
  cy.get('[data-testid="admin-password-input"]').type('PvdrTAzTeR247sDnAZBr')
  cy.get('[data-testid="login-btn"]').click()
  cy.get('[data-testid="admin-logged"]').should('exist')
}

// ─────────────────────────────────────────────────────────────────────────────
// Tests Online / Offline (consigne prof)
// ─────────────────────────────────────────────────────────────────────────────

describe('Tests en mode Offline', () => {

  it('devrait afficher la liste des inscrits en ligne', function () {
    if (Cypress.env('offline')) {
      this.skip()
    }

    cy.intercept('GET', /\/users$/, { body: { utilisateurs: mockUsers } }).as('getUsers')
    cy.visit('/')
    cy.wait('@getUsers')
    cy.get('[data-testid="registeredUsers-list"]').children().should('have.length', 1)
  })

  it("devrait afficher un message d'erreur quand le réseau est coupé", function () {
    if (!Cypress.env('offline')) {
      this.skip()
    }

    cy.log('Mode offline activé !')

    cy.intercept('GET', /\/users$/, { body: { utilisateurs: [] } })
    cy.visit('/')

    cy.intercept('POST', /\/users/, { forceNetworkError: true }).as('createUser')

    fillForm(validUser)
    cy.get('[data-testid="submit-btn"]').click()
    cy.wait('@createUser')

    cy.get('[data-testid="toaster"]').should('contain', 'Erreur')
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// Validation du formulaire (onglet Inscription — onglet par défaut)
// ─────────────────────────────────────────────────────────────────────────────

describe('Formulaire - validation', () => {

  beforeEach(() => {
    cy.intercept('GET', /\/users$/, { body: { utilisateurs: [] } })
    cy.visit('/')
  })

  it('le bouton est désactivé si tous les champs sont vides', () => {
    cy.get('[data-testid="submit-btn"]').should('be.disabled')
  })

  it("le bouton est désactivé si l'email est invalide", () => {
    fillForm({ ...validUser, email: 'emailinvalide' })
    cy.get('[data-testid="submit-btn"]').should('be.disabled')
    cy.get('[data-testid="error-email"]').should('exist')
  })

  it('le bouton est désactivé si le code postal est invalide', () => {
    fillForm({ ...validUser, postalCode: '123' })
    cy.get('[data-testid="submit-btn"]').should('be.disabled')
    cy.get('[data-testid="error-postalCode"]').should('exist')
  })

  it("le bouton est désactivé si l'utilisateur est mineur", () => {
    fillForm({ ...validUser, birthDate: '2015-01-01' })
    cy.get('[data-testid="submit-btn"]').should('be.disabled')
    cy.get('[data-testid="error-birthDate"]').should('exist')
  })

  it('le bouton est désactivé si le nom contient des chiffres', () => {
    fillForm({ ...validUser, lastName: 'Test123' })
    cy.get('[data-testid="submit-btn"]').should('be.disabled')
    cy.get('[data-testid="error-lastName"]').should('exist')
  })

  it('le bouton est désactivé si la date est avant 1900', () => {
    cy.get('#lastName').type(validUser.lastName)
    cy.get('#firstName').type(validUser.firstName)
    cy.get('#email').type(validUser.email)
    cy.get('#city').type(validUser.city)
    cy.get('#postalCode').type(validUser.postalCode)
    setDateNative('0001-01-01')
    cy.get('[data-testid="submit-btn"]').should('be.disabled')
    cy.get('[data-testid="error-birthDate"]').should('exist')
  })

  it('le bouton est actif si tous les champs sont valides', () => {
    fillForm(validUser)
    cy.get('[data-testid="submit-btn"]').should('not.be.disabled')
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// Inscription
// ─────────────────────────────────────────────────────────────────────────────

describe('Inscription', () => {

  beforeEach(() => {
    cy.intercept('GET', /\/users$/, { body: { utilisateurs: [] } })
    cy.visit('/')
  })

  it('inscription valide → toaster succès + user dans la liste', () => {
    cy.intercept('POST', /\/users/, {
      statusCode: 201,
      body: { message: 'Utilisateur créé' },
    }).as('createUser')

    cy.intercept('GET', /\/users$/, { body: { utilisateurs: mockUsers } }).as('getUsersAfter')

    fillForm(validUser)
    cy.get('[data-testid="submit-btn"]').click()
    cy.wait('@createUser')

    cy.get('[data-testid="toaster"]').should('contain', 'Inscription réussie')
    cy.get('[data-testid="registeredUsers-list"]').children().should('have.length', 1)
    cy.get('[data-testid="registeredUser-0"]').should('contain', 'Jean Test')
  })

  it('email déjà utilisé → toaster erreur', () => {
    cy.intercept('POST', /\/users/, {
      statusCode: 409,
      body: { detail: 'Email déjà utilisé' },
    }).as('createUser')

    fillForm(validUser)
    cy.get('[data-testid="submit-btn"]').click()
    cy.wait('@createUser')

    cy.get('[data-testid="toaster"]').should('contain', 'déjà utilisé')
  })

  it('les champs sont vidés après une inscription réussie', () => {
    cy.intercept('POST', /\/users/, { statusCode: 201, body: {} }).as('createUser')
    cy.intercept('GET', /\/users$/, { body: { utilisateurs: mockUsers } })

    fillForm(validUser)
    cy.get('[data-testid="submit-btn"]').click()
    cy.wait('@createUser')

    cy.get('#lastName').should('have.value', '')
    cy.get('#firstName').should('have.value', '')
    cy.get('#email').should('have.value', '')
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// Espace admin (onglet Connexion)
// ─────────────────────────────────────────────────────────────────────────────

describe('Espace admin', () => {

  beforeEach(() => {
    cy.intercept('GET', /\/users$/, { body: { utilisateurs: mockUsers } })
    cy.visit('/')
  })

  it("login avec mauvais identifiants → message d'erreur", () => {
    cy.get('[data-testid="tab-connexion"]').click()
    cy.intercept('POST', /\/login/, { body: { success: false } }).as('login')

    cy.get('[data-testid="admin-email-input"]').type('wrong@email.com')
    cy.get('[data-testid="admin-password-input"]').type('wrongpassword')
    cy.get('[data-testid="login-btn"]').click()

    cy.get('[data-testid="login-error"]').should('exist')
    cy.get('[data-testid="admin-logged"]').should('not.exist')
  })

  it('login avec bons identifiants → accès admin accordé', () => {
    loginAsAdmin()
    cy.get('[data-testid="btn-delete-0"]').should('exist')
    cy.get('[data-testid="btn-details-0"]').should('exist')
  })

  it("admin peut voir les détails d'un utilisateur", () => {
    cy.intercept('GET', /\/users\/\d+/, { body: mockUserDetails }).as('getUser')

    loginAsAdmin()
    cy.get('[data-testid="btn-details-0"]').click()
    cy.wait('@getUser')

    cy.get('[data-testid="user-details"]').should('contain', 'Nice')
    cy.get('[data-testid="user-details"]').should('contain', '06000')
    cy.get('[data-testid="user-details"]').should('contain', '1990-06-15')
  })

  it('admin peut supprimer un utilisateur → il disparaît de la liste', () => {
    cy.intercept('DELETE', /\/users\/\d+/, { body: { message: 'Utilisateur supprimé' } }).as('deleteUser')

    loginAsAdmin()

    cy.intercept('GET', /\/users$/, { body: { utilisateurs: [] } }).as('getUsersAfterDelete')

    cy.get('[data-testid="btn-delete-0"]').click()
    cy.wait('@deleteUser')

    cy.get('[data-testid="registeredUsers-list"]').children().should('have.length', 0)
    cy.get('[data-testid="toaster"]').should('contain', 'supprimé')
  })

  it('les boutons admin ne sont pas visibles sans connexion', () => {
    cy.get('[data-testid="btn-delete-0"]').should('not.exist')
    cy.get('[data-testid="btn-details-0"]').should('not.exist')
  })

  it('le bouton Déconnexion ramène aux onglets Inscription/Connexion', () => {
    loginAsAdmin()
    cy.get('[data-testid="logout-btn"]').should('exist')
    cy.get('[data-testid="tab-inscription"]').should('not.exist')
    cy.get('[data-testid="logout-btn"]').click()
    cy.get('[data-testid="tab-inscription"]').should('exist')
    cy.get('[data-testid="tab-connexion"]').should('exist')
    cy.get('[data-testid="admin-logged"]').should('not.exist')
  })
})
