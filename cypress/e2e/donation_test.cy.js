describe("Donation Process", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("Should successfully complete the donation process", () => {
    // Enter a donation fund
    cy.get('[data-cy="designations_input_amount"]').type("50");

    cy.get('[data-cy="is_recurring_select"]').should("contain", "One time");

    // Select an option from dropdown
    cy.get('[data-cy="is_recurring_select"]').select("Regularly");

    // Wait for the "Frequency" dropdown to be visible and interactable
    cy.get('[data-cy="frequency_select"]')
      .should("be.visible")
      .select("monthly");

    // Assert that the selected option is "Weekly"
    cy.get('[data-cy="frequency_select"]').should("have.value", "monthly");

    cy.get(":nth-child(3) > .select").should("contain", "1st");

    cy.get("#next_donation")
      .should("be.visible")
      .then(($input) => {
        // Get the current date
        const currentDate = new Date();
        // Calculate the date of the following month
        const nextMonthDate = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() + 1,
          1
        );
        // Format the date as YYYY-MM-DD
        const formattedDate = nextMonthDate.toISOString().split("T")[0];

        // Set the calculated date as the value of the input field
        cy.wrap($input).type(formattedDate);
      });

    cy.get('[data-cy="new_person_form_email"]').type("example@email.com");
    cy.get('[data-cy="new_person_form_email"]').should(
      "have.value",
      "example@email.com"
    );

    cy.get('[data-cy="new_person_form_first_name"]').type("Alena");
    cy.get('[data-cy="new_person_form_last_name"]').type("Volakhava");

    cy.contains("Continue").click();

    cy.get(".__PrivateStripeElement > iframe").click(); //
    cy.wait(2000);
    cy.get("iframe").then(($iframe) => {
      const doc = $iframe.contents();
      let input = doc.find("input")[0];
      cy.wrap(input).type("4242").type("4242").type("4242").type("4242");
      input = doc.find("input")[1];
      cy.wrap(input).clear().type("12").type("29");
      input = doc.find("input")[2];
      cy.wrap(input).type("123");

      // Select Country from dropdown and type in zip code

      cy.wrap(doc).find('select[name="country"]').select("CA");
      cy.wrap(doc).find('input[name="postalCode"]').type("M1R 3H3");

      cy.get(".ladda-label").should("exist");
      cy.get(".ladda-label").click({ force: true });

      cy.get("h1.pl-1").should("contain", "Thank you");

      // Get back to initial page
      cy.contains(".Navigation__link", "Give").click();
      cy.get(".prepend-label").should("be.visible");
    });
  });
});
