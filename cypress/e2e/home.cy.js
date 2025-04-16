describe("Home Page", () => {
  it("should display an h1 tag with text 'App'", () => {
    // Visit the home page
    cy.visit("/");

    // Assert that the h1 tag contains the text "App"
    cy.get("h1").should("contain.text", "App");
  });

  it("should display a link with text 'Go to Users Page'", () => {
    // Visit the home page
    cy.visit("/");

    // Assert that a link with the text 'Go to Users Page' exists
    cy.contains("a", "Go to Users Page").should("exist");
  });
});
