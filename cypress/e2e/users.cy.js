describe("Login and Navigation to Users Page", () => {
  it("should redirect to login page when accessing /users without authentication", () => {
    // Visit the users page without authentication
    cy.visit("/users");

    // Verify the URL is the login page
    cy.url().should("eq", "http://localhost:3000/login");
  });
  it("logs in with valid credentials and lands on the users page", () => {
    // Visit the login page
    cy.visit("/login");

    // Fill in the login form
    cy.get("input[name='email']").type("test@test.test"); // Email field
    cy.get("input[name='password']").type("test123"); // Password field

    // Submit the form
    cy.get("button[type='submit']").click();

    // Verify the URL is the users page
    cy.url().should("eq", "http://localhost:3000/users");

    // Check that the page contains an h1 with the text 'Users'
    cy.get("h1").should("contain.text", "Users");
  });
});
