describe("Navigation from Home to Login Page", () => {
  it("should navigate to the login page when the login link is clicked", () => {
    // Visit the home page
    cy.visit("/");

    // Assert the link to the login page exists
    cy.contains("a", "Login").should("have.attr", "href", "/login");

    // Click the link
    cy.contains("a", "Login").click();

    // Assert that the URL is now the login page
    cy.url().should("include", "/login");

    // Assert that the login page contains the login form
    cy.get("h2").should("contain.text", "Login");
    cy.get("input#email").should("exist");
    cy.get("input#password").should("exist");
    cy.get("button[type='submit']").should("exist");
  });
});
