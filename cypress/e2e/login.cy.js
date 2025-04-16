describe("Login Page", () => {
  it("should display the login form with email and password fields", () => {
    // Visit the login page
    cy.visit("/login");

    // Assert that the email field exists
    cy.get("input#email").should("exist");

    // Assert that the password field exists
    cy.get("input#password").should("exist");

    // Assert that the login button exists
    cy.get("button[type='submit']").should("contain.text", "Login");
  });

  it("should display a link to create an account", () => {
    // Visit the login page
    cy.visit("/login");

    // Assert that the "Create Account" link exists and navigates correctly
    cy.contains("a", "Create Account")
      .should("have.attr", "href", "/users/create")
      .and("exist");
  });
});
