describe('Home Page', function() {
    it('loads', function() {
        cy.visit('http://localhost:8080/')

        cy.contains('MANUAL')
    })
})
describe('Recent Post Bar', function() {
    it('has four posts', function() {
        cy.get('.card').should('have.length', 4)
    })
    it('clicking a card redirects to that post', function() {
        cy.get('.card').first().click()
    })
})
describe('Post Show Page', function() {
    it('shows post information', function() {
        cy.get('h2')
        cy.get('h5')
        cy.get('p')
    })
    it('has comments', function() {
        cy.contains('Comments')
    })
})
describe('All Posts Page', function() {
    it('has posts', function() {
        cy.contains('Posts').first().click()

        cy.get('.card')
    })
    it('trying to write a new post without logging in prompts login modal', function() {
        cy.contains('write a new one').first().click()

        cy.contains('Or create a new profile')

        cy.get('.close').first().click()
    })
    it('clicking a post card redirects to that post page', function() {
        cy.get('.card').first().click()

        cy.contains('Comments')
    })
})
describe('All Users Page', function() {
    it('has users', function() {
        cy.get('.all_users.nav-link').click()

        cy.get('.card')
    })
    it('clicking a user card redirects to that user page', function() {
        cy.get('.card').first().click()

        cy.get('.card-title')
    })
})
describe('Create User Modal', function() {
    it('creates a user', function() {
        cy.contains('Login').first().click()

        cy.contains('create a new profile').click()

        cy.get('#create_username').click()
            .type('test')
            .should('have.value', 'test')

        cy.get('#create_password').click()
            .type('test')
            .should('have.value', 'test')

        cy.get('#create_first_name').click()
            .type('test')
            .should('have.value', 'test')

        cy.get('#create_last_name').click()
            .type('test')
            .should('have.value', 'test')

        cy.get('#create_age').click()
            .type('3')
            .should('have.value', '3')

        cy.get('#create_bio').click()
            .type('test')
            .should('have.value', 'test')

        cy.contains('Submit').click()
    })
})
describe('Login Modal', function() {
    it('user can log in', function() {
        cy.contains('Login').first().click()

        cy.get('#username_input').click()
            .type('test')
            .should('have.value', 'test')

        cy.get('#password_input')
            .type('test')
            .should('have.value', 'test')

        cy.get('.login-button').click()

        cy.contains('test test')
    })
})
describe('Profile Page', function() {
    it('shows user information', function() {
        cy.contains('test test').click()

        cy.contains('0 posts')
    })
})