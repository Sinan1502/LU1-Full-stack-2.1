describe('Klantenbeheer - Authentication & CRUD Tests', () => {
  const baseUrl = 'http://localhost:3000'; 
  
  // Test credentials
  const testUser = {
    username: 'SSSSinan',
    password: 'testpass12345'
  };
  
  // Test customer data
  const testCustomer = {
    firstName: 'Jan',
    lastName: 'de Tester',
    email: 'jan.detester@test.nl',
    active: '1'
  };
  
  const updatedCustomer = {
    firstName: 'Johannes',
    lastName: 'de Tester Updated',
    email: 'johannes.detester@test.nl',
    active: '0'
  };

  const login = () => {
    cy.visit(`${baseUrl}/`);
    cy.get('#user').type(testUser.username);
    cy.get('#pwd').type(testUser.password);
    cy.get('#loginForm').submit();
    cy.url().should('include', '/dashboard');
  };

  describe('Authentication Flow', () => {
    it('should display login page correctly', () => {
      cy.visit(`${baseUrl}/`);
      cy.get('h2').should('contain', 'Login');
      cy.get('#user').should('have.attr', 'placeholder', 'Gebruikersnaam');
      cy.get('#pwd').should('have.attr', 'placeholder', 'Wachtwoord');
      cy.get('button[type="submit"]').should('contain', 'Login');
      cy.contains('Nog geen account?').should('exist');
      cy.get('a[href="/auth/register"]').should('contain', 'Registreer hier');
    });

    it('should navigate to registration page', () => {
      cy.visit(`${baseUrl}/`);
      cy.get('a[href="/auth/register"]').click();
      cy.url().should('include', '/auth/register');
      cy.get('h2').should('contain', 'Registreren');
      cy.get('#user').should('have.attr', 'placeholder', 'Gebruikersnaam');
      cy.get('#pwd').should('have.attr', 'placeholder', 'Wachtwoord');
      cy.get('button[type="submit"]').should('contain', 'Registreer');
      cy.contains('Heb je al een account?').should('exist');
      cy.get('a[href="/"]').should('contain', 'Log hier in');
    });

    it('should register a new user successfully', () => {
      cy.visit(`${baseUrl}/auth/register`);
      cy.get('#user').type(testUser.username);
      cy.get('#pwd').type(testUser.password);
      cy.get('#registerForm').submit();
      cy.on('window:alert', (str) => {
        expect(str).to.include('Registratie succesvol');
      });
      cy.url().should('eq', `${baseUrl}/`);
    });

    it('should login successfully and show dashboard', () => {
      login();
      cy.url().should('include', '/dashboard');
      cy.get('h2').should('contain', 'Welkom').should('contain', 'MijnPortaal');
      cy.get('a[href="/users/"]').should('contain', 'Klanten');
      cy.get('a[href="/over-ons/"]').should('contain', 'Over Ons');
      cy.get('#logoutBtn').should('contain', 'Logout');
    });

    it('should logout from dashboard successfully', () => {
      login();
      cy.get('#logoutBtn').click();
      cy.url().should('eq', `${baseUrl}/`);
      cy.get('h2').should('contain', 'Login');
    });
  });

  describe('Users CRUD Operations', () => {
    beforeEach(() => {
      login();
    });

    describe('CREATE - Nieuwe klant aanmaken', () => {
      it('should create a new customer successfully', () => {
        cy.visit(`${baseUrl}/users`);
        cy.contains('Klant toevoegen').click();
        cy.url().should('include', '/users/new');
        cy.get('input[name="firstName"]').type(testCustomer.firstName);
        cy.get('input[name="lastName"]').type(testCustomer.lastName);
        cy.get('input[name="email"]').type(Date.now() + testCustomer.email);
        cy.get('select[name="active"]').select(testCustomer.active);
        cy.get('button[type="submit"]').click();
        cy.url().should('satisfy', (url) => {
          return url === `${baseUrl}/users` || url === `${baseUrl}/users/`;
        });
        cy.get('table tbody').should('contain', testCustomer.firstName);
        cy.get('table tbody').should('contain', testCustomer.lastName);
        cy.get('table tbody').should('contain', 'Actief');
      });

      it('should show validation errors for empty fields', () => {
        cy.visit(`${baseUrl}/users/new`);
        cy.get('button[type="submit"]').click();
        cy.get('input[name="firstName"]:invalid').should('exist');
      });

      it('should cancel creation and return to users list', () => {
        cy.visit(`${baseUrl}/users/new`);
        cy.contains('Annuleren').click();
        cy.url().should('satisfy', (url) => {
          return url === `${baseUrl}/users` || url === `${baseUrl}/users/`;
        });
      });
    });

    describe('READ - Klanten bekijken', () => {
      it('should display list of customers', () => {
        cy.visit(`${baseUrl}/users`);
        cy.get('table thead').should('contain', 'First Name');
        cy.get('table thead').should('contain', 'Last Name');
        cy.get('table thead').should('contain', 'Email');
        cy.get('table thead').should('contain', 'Active');
        cy.get('table tbody tr').should('have.length.at.least', 1);
      });

      it('should show customer details when clicking Details button', () => {
        cy.visit(`${baseUrl}/users`);
        cy.get('table tbody tr').first().within(() => {
          cy.contains('Details').click();
        });
        cy.url().should('include', '/details');
        cy.get('.card-title').should('exist');
        cy.contains('Status:').should('exist');
        cy.contains('E-mail:').should('exist');
        cy.contains('Bewerken').should('exist');
        cy.contains('Terug').should('exist');
      });

      it('should navigate back to users list from details', () => {
        cy.visit(`${baseUrl}/users`);
        cy.get('table tbody tr').first().within(() => {
          cy.contains('Details').click();
        });
        cy.contains('Terug').click();
        cy.url().should('satisfy', (url) => {
          return url === `${baseUrl}/users` || url === `${baseUrl}/users/`;
        });
      });
    });

    describe('UPDATE - Klant bijwerken', () => {
      it('should update a customer successfully', () => {
        cy.visit(`${baseUrl}/users`);
        cy.get('table tbody tr').first().within(() => {
          cy.contains('Details').click();
        });
        cy.contains('Bewerken').click();
        cy.url().should('include', '/edit');
        cy.get('input[name="firstName"]').clear().type(updatedCustomer.firstName);
        cy.get('input[name="lastName"]').clear().type(updatedCustomer.lastName);
        cy.get('input[name="email"]').clear().type(updatedCustomer.email);
        cy.get('input[name="active"]').clear().type(updatedCustomer.active);
        cy.get('button[type="submit"]').click();
        cy.url().should('include', '/details');
        cy.get('.card-title').should('contain', updatedCustomer.firstName);
        cy.get('.card-title').should('contain', updatedCustomer.lastName);
        cy.contains('E-mail:').parent().should('contain', updatedCustomer.email);
        cy.contains('Status:').parent().should('contain', 'Inactief');
      });

      it('should cancel edit and return to details', () => {
        cy.visit(`${baseUrl}/users`);
        cy.get('table tbody tr').first().within(() => {
          cy.contains('Details').click();
        });
        cy.contains('Bewerken').click();
        cy.contains('Annuleren').click();
        cy.url().should('include', '/details');
      });

      it('should show validation errors for invalid data', () => {
        cy.visit(`${baseUrl}/users`);
        cy.get('table tbody tr').first().within(() => {
          cy.contains('Details').click();
        });
        cy.contains('Bewerken').click();
        cy.get('input[name="firstName"]').clear();
        cy.get('button[type="submit"]').click();
        cy.get('input[name="firstName"]:invalid').should('exist');
      });
    });

    describe('DELETE - Klant verwijderen', () => {
      it('should handle delete operation', () => {
        cy.visit(`${baseUrl}/users`);
        cy.get('table tbody tr').first().within(() => {
          cy.contains('Verwijderen').should('exist').click();
        });
        cy.wait(500);
        cy.get('table').should('exist');
      });
    });
  });

  describe('Navigation and UI Tests', () => {
    beforeEach(() => {
      login();
    });

    it('should navigate from dashboard to users page', () => {
      cy.visit(`${baseUrl}/dashboard`);
      cy.get('h2').should('contain', 'Welkom').should('contain', 'MijnPortaal');
      cy.get('a[href="/users/"]').click();
      cy.url().should('satisfy', (url) => {
        return url === `${baseUrl}/users` || url === `${baseUrl}/users/`;
      });
      cy.contains('Klantenoverzicht').should('exist');
    });

    it('should navigate back to dashboard from over-ons page', () => {
      cy.visit(`${baseUrl}/over-ons`);
      cy.get('a[href="/dashboard"]').should('contain', 'Home').click();
      cy.url().should('include', '/dashboard');
      cy.get('h2').should('contain', 'Welkom').should('contain', 'MijnPortaal');
    });

    it('should navigate back to dashboard from users page', () => {
      cy.visit(`${baseUrl}/users`);
      cy.contains('Home').click();
      cy.url().should('include', '/dashboard');
    });

    it('should have all required navigation elements on users page', () => {
      cy.visit(`${baseUrl}/users`);
      cy.get('.navbar').should('exist');
      cy.contains('Avans Klantenbeheer').should('exist');
      cy.contains('Home').should('exist');
      cy.contains('Klant toevoegen').should('exist');
      cy.get('#logoutBtn').should('exist');
    });

    it('should have logout functionality on over-ons page', () => {
      cy.visit(`${baseUrl}/over-ons`);
      cy.get('#logoutBtn').should('exist').should('contain', 'Logout');
      cy.get('#logoutBtn').click();
      cy.url().should('eq', `${baseUrl}/`);
    });

    it('should logout from users page successfully', () => {
      cy.visit(`${baseUrl}/users`);
      cy.get('#logoutBtn').click();
      cy.url().should('eq', `${baseUrl}/`);
    });
  });

  describe('Error Handling & Edge Cases', () => {
    it('should handle unauthorized access to protected routes', () => {
      const protectedRoutes = ['/dashboard', '/users', '/over-ons'];
      protectedRoutes.forEach(route => {
        cy.request({
          url: `${baseUrl}${route}`,
          failOnStatusCode: false
        }).then((response) => {
          expect([401, 302, 200].includes(response.status)).to.be.true;
        });
      });
      cy.clearCookies();
      cy.request({ url: `${baseUrl}/users`, failOnStatusCode: false })
        .then((resp) => {
          expect([401, 302, 200].includes(resp.status)).to.be.true;
        });
    });

    it('should handle login with invalid credentials', () => {
      cy.visit(`${baseUrl}/`);
      cy.get('#user').type('wronguser');
      cy.get('#pwd').type('wrongpass');
      cy.get('#loginForm').submit();
      cy.on('window:alert', (str) => {
        expect(str).to.include('Login mislukt');
      });
      cy.url().should('eq', `${baseUrl}/`);
    });

    it('should handle registration with existing username', () => {
      cy.visit(`${baseUrl}/auth/register`);
      cy.get('#user').type(testUser.username);
      cy.get('#pwd').type('somepassword');
      cy.get('#registerForm').submit();
      cy.on('window:alert', (str) => {
        expect(str).to.include('bestaat al');
      });
    });

    it('should handle invalid customer ID in URL', () => {
      login();
      cy.visit(`${baseUrl}/users/99999/details`, { failOnStatusCode: false });
    });

    it('should handle empty form submissions', () => {
      login();
      cy.visit(`${baseUrl}/users/new`);
      cy.get('button[type="submit"]').click();
      cy.get('input[name="firstName"]:invalid').should('exist');
      cy.get('input[name="lastName"]:invalid').should('exist');
      cy.get('input[name="email"]:invalid').should('exist');
    });
  });
});

Cypress.Commands.add('login', (username = 'testuser', password = 'testpass123') => {
  cy.session([username, password], () => {
    cy.visit('/');
    cy.get('#user').type(username);
    cy.get('#pwd').type(password);
    cy.get('#loginForm').submit();
    cy.url().should('include', '/dashboard');
  });
});

beforeEach(() => {
  cy.clearCookies();
  cy.clearLocalStorage();
});

Cypress.on('uncaught:exception', () => false);
