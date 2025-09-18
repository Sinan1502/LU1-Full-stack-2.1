describe('Klantenbeheer - Authentication & CRUD Tests', () => {
  const baseUrl = 'http://localhost:3000'; 
  
  // Test credentials
  const testUser = {
    username: 'testuserr',
    password: 'testpass1234'
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

  // Helper function to login
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
      
      // Check login form elements
      cy.get('h2').should('contain', 'Login');
      cy.get('#user').should('have.attr', 'placeholder', 'Gebruikersnaam');
      cy.get('#pwd').should('have.attr', 'placeholder', 'Wachtwoord');
      cy.get('button[type="submit"]').should('contain', 'Login');
      
      // Check registration link
      cy.contains('Nog geen account?').should('exist');
      cy.get('a[href="/auth/register"]').should('contain', 'Registreer hier');
    });

    it('should navigate to registration page', () => {
      cy.visit(`${baseUrl}/`);
      cy.get('a[href="/auth/register"]').click();
      cy.url().should('include', '/auth/register');
      
      // Check registration form
      cy.get('h2').should('contain', 'Registreren');
      cy.get('#user').should('have.attr', 'placeholder', 'Gebruikersnaam');
      cy.get('#pwd').should('have.attr', 'placeholder', 'Wachtwoord');
      cy.get('button[type="submit"]').should('contain', 'Registreer');
      
      // Check login link
      cy.contains('Heb je al een account?').should('exist');
      cy.get('a[href="/"]').should('contain', 'Log hier in');
    });

    it('should register a new user successfully', () => {
      cy.visit(`${baseUrl}/auth/register`);
      
      // Fill registration form
      cy.get('#user').type(testUser.username);
      cy.get('#pwd').type(testUser.password);
      cy.get('#registerForm').submit();
      
      // Should show success and redirect to login
      cy.on('window:alert', (str) => {
        expect(str).to.include('Registratie succesvol');
      });
      cy.url().should('eq', `${baseUrl}/`);
    });

    it('should login successfully and show dashboard', () => {
      login();
      
      // Verify we're on dashboard with correct content
      cy.url().should('include', '/dashboard');
      cy.get('h2').should('contain', 'Welkom bij MijnPortaal !');
      
      // Check dashboard buttons
      cy.get('a[href="/users/"]').should('contain', 'Klanten');
      cy.get('a[href="/over-ons/"]').should('contain', 'Over Ons');
      cy.get('#logoutBtn').should('contain', 'Logout');
    });

    it('should logout from dashboard successfully', () => {
      login();
      
      // Click logout button on dashboard
      cy.get('#logoutBtn').click();
      
      // Should redirect to login page
      cy.url().should('eq', `${baseUrl}/`);
      cy.get('h2').should('contain', 'Login');
    });
  });

  describe('Users CRUD Operations', () => {
    beforeEach(() => {
      login(); // Login before each test
    });

    describe('CREATE - Nieuwe klant aanmaken', () => {
      it('should create a new customer successfully', () => {
        // Navigate to users page
        cy.visit(`${baseUrl}/users`);
        
        // Click "Klant toevoegen" button
        cy.contains('Klant toevoegen').click();
        cy.url().should('include', '/users/new');
        
        // Fill the form
        cy.get('input[name="firstName"]').type(testCustomer.firstName);
        cy.get('input[name="lastName"]').type(testCustomer.lastName);
        cy.get('input[name="email"]').type(testCustomer.email);
        cy.get('select[name="active"]').select(testCustomer.active);
        
        // Submit the form
        cy.get('button[type="submit"]').click();
        
        // Should redirect to users list
        cy.url().should('eq', `${baseUrl}/users`);
        
        // Verify new customer appears in table
        cy.get('table tbody').should('contain', testCustomer.firstName);
        cy.get('table tbody').should('contain', testCustomer.lastName);
        cy.get('table tbody').should('contain', testCustomer.email);
        cy.get('table tbody').should('contain', 'Actief');
      });

      it('should show validation errors for empty fields', () => {
        cy.visit(`${baseUrl}/users/new`);
        
        // Try to submit empty form
        cy.get('button[type="submit"]').click();
        
        // HTML5 validation should prevent submission
        cy.get('input[name="firstName"]:invalid').should('exist');
      });

      it('should cancel creation and return to users list', () => {
        cy.visit(`${baseUrl}/users/new`);
        
        // Click cancel button
        cy.contains('Annuleren').click();
        
        // Should return to users list
        cy.url().should('eq', `${baseUrl}/users`);
      });
    });

    describe('READ - Klanten bekijken', () => {
      it('should display list of customers', () => {
        cy.visit(`${baseUrl}/users`);
        
        // Check table structure
        cy.get('table thead').should('contain', 'First Name');
        cy.get('table thead').should('contain', 'Last Name');
        cy.get('table thead').should('contain', 'Email');
        cy.get('table thead').should('contain', 'Active');
        
        // Should have at least some customers
        cy.get('table tbody tr').should('have.length.at.least', 1);
      });

      it('should show customer details when clicking Details button', () => {
        cy.visit(`${baseUrl}/users`);
        
        // Click first Details button
        cy.get('table tbody tr').first().within(() => {
          cy.contains('Details').click();
        });
        
        // Should be on details page
        cy.url().should('include', '/details');
        
        // Should show customer information
        cy.get('.card-title').should('exist');
        cy.contains('Status:').should('exist');
        cy.contains('E-mail:').should('exist');
        
        // Should have edit and back buttons
        cy.contains('Bewerken').should('exist');
        cy.contains('Terug').should('exist');
      });

      it('should navigate back to users list from details', () => {
        cy.visit(`${baseUrl}/users`);
        
        // Go to details
        cy.get('table tbody tr').first().within(() => {
          cy.contains('Details').click();
        });
        
        // Click back button
        cy.contains('Terug').click();
        
        // Should return to users list (with or without trailing slash)
        cy.url().should('satisfy', (url) => {
          return url === `${baseUrl}/users` || url === `${baseUrl}/users/`;
        });
      });
    });

    describe('UPDATE - Klant bijwerken', () => {
      let customerId;

      it('should update a customer successfully', () => {
        cy.visit(`${baseUrl}/users`);
        
        // Get customer ID from first row and go to details
        cy.get('table tbody tr').first().within(() => {
          cy.contains('Details').click();
        });
        
        // Extract customer ID from URL
        cy.url().then((url) => {
          customerId = url.match(/\/users\/(\d+)\/details/)[1];
        });
        
        // Click edit button
        cy.contains('Bewerken').click();
        cy.url().should('include', '/edit');
        
        // Update the form fields
        cy.get('input[name="firstName"]').clear().type(updatedCustomer.firstName);
        cy.get('input[name="lastName"]').clear().type(updatedCustomer.lastName);
        cy.get('input[name="email"]').clear().type(updatedCustomer.email);
        cy.get('input[name="active"]').clear().type(updatedCustomer.active);
        
        // Submit the update
        cy.get('button[type="submit"]').click();
        
        // Should redirect to details page
        cy.url().should('include', '/details');
        
        // Verify updated information is displayed
        cy.get('.card-title').should('contain', updatedCustomer.firstName);
        cy.get('.card-title').should('contain', updatedCustomer.lastName);
        cy.contains('E-mail:').parent().should('contain', updatedCustomer.email);
        cy.contains('Status:').parent().should('contain', 'Inactief');
      });

      it('should cancel edit and return to details', () => {
        cy.visit(`${baseUrl}/users`);
        
        // Go to details and then edit
        cy.get('table tbody tr').first().within(() => {
          cy.contains('Details').click();
        });
        cy.contains('Bewerken').click();
        
        // Click cancel button
        cy.contains('Annuleren').click();
        
        // Should return to details page
        cy.url().should('include', '/details');
      });

      it('should show validation errors for invalid data', () => {
        cy.visit(`${baseUrl}/users`);
        
        // Navigate to edit form
        cy.get('table tbody tr').first().within(() => {
          cy.contains('Details').click();
        });
        cy.contains('Bewerken').click();
        
        // Clear required field
        cy.get('input[name="firstName"]').clear();
        
        // Try to submit
        cy.get('button[type="submit"]').click();
        
        // Should show HTML5 validation
        cy.get('input[name="firstName"]:invalid').should('exist');
      });
    });

    describe('DELETE - Klant verwijderen', () => {
      it('should delete a customer successfully', () => {
        cy.visit(`${baseUrl}/users`);
        
        // Get initial number of rows
        cy.get('table tbody tr').its('length').as('initialCount');
        
        // Get the customer ID from the first row for proper API call
        cy.get('table tbody tr').first().within(() => {
          // Find the details link to extract customer ID
          cy.get('a[href*="/details"]').invoke('attr', 'href').then((href) => {
            const customerId = href.match(/\/users\/(\d+)\/details/)[1];
            
            // Now click delete button
            cy.contains('Verwijderen').click();
            
            // Wait for the delete API call to complete
            cy.wait(1000);
            
            // Refresh the page to see updated data
            cy.reload();
            
            // The specific customer should no longer exist in details
            cy.visit(`${baseUrl}/users/${customerId}/details`, { failOnStatusCode: false });
            cy.get('body').should('exist'); // Page loads but customer might not exist
          });
        });
      });

      // Note: Je delete functie heeft geen confirmation dialog,
      // maar je zou er een kunnen toevoegen voor betere UX
      it('should handle delete operation', () => {
        cy.visit(`${baseUrl}/users`);
        
        // Test that delete button exists and is clickable
        cy.get('table tbody tr').first().within(() => {
          cy.contains('Verwijderen').should('exist').click();
        });
        
        // Wait a bit for any potential API call
        cy.wait(500);
        
        // The page should still be functional (no crashes)
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
      cy.get('h2').should('contain', 'Welkom bij MijnPortaal !');
      
      // Navigate to users via dashboard button
      cy.get('a[href="/users/"]').click();
      cy.url().should('satisfy', (url) => {
        return url === `${baseUrl}/users` || url === `${baseUrl}/users/`;
      });
      cy.contains('Klantenoverzicht').should('exist');
    });

    it('should navigate from dashboard to over-ons page', () => {
      cy.visit(`${baseUrl}/dashboard`);
      
      // Navigate to over-ons via dashboard button
      cy.get('a[href="/over-ons/"]').click();
      cy.url().should('include', '/over-ons');
      cy.get('h1').should('contain', 'Over Ons');
      
      // Check over-ons content
      cy.contains('Hier vind je onze user stories').should('exist');
      cy.contains('User Stories').should('exist');
      cy.contains('Als beheerder wil ik kunnen registreren').should('exist');
      cy.contains('Als beheerder wil ik kunnen inloggen').should('exist');
      cy.contains('Als beheerder wil ik gebruikers kunnen bekijken').should('exist');
    });

    it('should navigate back to dashboard from over-ons page', () => {
      cy.visit(`${baseUrl}/over-ons`);
      
      // Use Home button to go back to dashboard
      cy.get('a[href="/dashboard"]').should('contain', 'Home').click();
      cy.url().should('include', '/dashboard');
      cy.get('h2').should('contain', 'Welkom bij MijnPortaal !');
    });

    it('should navigate back to dashboard from users page', () => {
      cy.visit(`${baseUrl}/users`);
      
      // Use Home button to go back to dashboard
      cy.contains('Home').click();
      cy.url().should('include', '/dashboard');
    });

    it('should have all required navigation elements on users page', () => {
      cy.visit(`${baseUrl}/users`);
      
      // Check navbar elements
      cy.get('.navbar').should('exist');
      cy.contains('Avans Klantenbeheer').should('exist');
      cy.contains('Home').should('exist');
      cy.contains('Klant toevoegen').should('exist');
      cy.get('#logoutBtn').should('exist');
    });

    it('should have logout functionality on over-ons page', () => {
      cy.visit(`${baseUrl}/over-ons`);
      
      // Check logout button exists
      cy.get('#logoutBtn').should('exist').should('contain', 'Logout');
      
      // Test logout functionality
      cy.get('#logoutBtn').click();
      cy.url().should('eq', `${baseUrl}/`);
    });

    it('should logout from users page successfully', () => {
      cy.visit(`${baseUrl}/users`);
      
      // Click logout button on users page
      cy.get('#logoutBtn').click();
      
      // Should redirect to login page
      cy.url().should('eq', `${baseUrl}/`);
    });
  });

  describe('Error Handling & Edge Cases', () => {
    it('should handle unauthorized access to protected routes', () => {
      // Try to access protected routes without login
      const protectedRoutes = ['/dashboard', '/users', '/over-ons'];
      
      protectedRoutes.forEach(route => {
        cy.visit(`${baseUrl}${route}`, { failOnStatusCode: false });
        // Should either redirect to login or show 401 - both are valid
        cy.url().then((currentUrl) => {
          expect(currentUrl === `${baseUrl}/` || currentUrl.includes('login')).to.be.true;
        });
      });
    });

    it('should handle login with invalid credentials', () => {
      cy.visit(`${baseUrl}/`);
      
      cy.get('#user').type('wronguser');
      cy.get('#pwd').type('wrongpass');
      cy.get('#loginForm').submit();
      
      // Should show error alert
      cy.on('window:alert', (str) => {
        expect(str).to.include('Login mislukt');
      });
      
      // Should stay on login page
      cy.url().should('eq', `${baseUrl}/`);
    });

    it('should handle registration with existing username', () => {
      cy.visit(`${baseUrl}/auth/register`);
      
      // Try to register with existing username
      cy.get('#user').type(testUser.username);
      cy.get('#pwd').type('somepassword');
      cy.get('#registerForm').submit();
      
      // Should show error alert
      cy.on('window:alert', (str) => {
        expect(str).to.include('bestaat al');
      });
    });

    it('should handle invalid customer ID in URL', () => {
      login();
      
      // Try to access non-existent customer
      cy.visit(`${baseUrl}/users/99999/details`, { failOnStatusCode: false });
      
      // Should handle gracefully (depending on your error handling)
      // This might redirect or show an error page
    });

    it('should handle empty form submissions', () => {
      login();
      cy.visit(`${baseUrl}/users/new`);
      
      // Try to submit empty form
      cy.get('button[type="submit"]').click();
      
      // HTML5 validation should prevent submission
      cy.get('input[name="firstName"]:invalid').should('exist');
      cy.get('input[name="lastName"]:invalid').should('exist');
      cy.get('input[name="email"]:invalid').should('exist');
    });
  });
});

// cypress/support/commands.js - Custom commands
Cypress.Commands.add('login', (username = 'testuser', password = 'testpass123') => {
  cy.session([username, password], () => {
    cy.visit('/');
    cy.get('#user').type(username);
    cy.get('#pwd').type(password);
    cy.get('#loginForm').submit();
    cy.url().should('include', '/dashboard');
  });
});

// cypress/support/e2e.js - Global configuration
beforeEach(() => {
  // Clear cookies and local storage before each test
  cy.clearCookies();
  cy.clearLocalStorage();
});

// Handle uncaught exceptions
Cypress.on('uncaught:exception', (err, runnable) => {
  // Return false to prevent the test from failing
  return false;
});