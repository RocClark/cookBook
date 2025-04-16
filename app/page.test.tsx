/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent } from "@testing-library/react";
import Page from "./page";

it("App Router: Works with Server Components", () => {
  // Mock the alert function
  window.alert = jest.fn();

  render(<Page />);

  // Check for the heading content specifically for "App Router"
  const headings = screen.getAllByRole("heading");
  expect(headings[1]).toHaveTextContent("App Router"); // Select the second <h1>

  // Find the button and click it
  const button = screen.getByText(/Trigger Debugger/i);
  fireEvent.click(button);

  // Check if alert was called (i.e., client-side code ran)
  expect(window.alert).toHaveBeenCalledWith(
    "Client-side debugging in progress!"
  );
});
