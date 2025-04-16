import { render, screen, fireEvent } from "@testing-library/react";
import { Header2 } from "./Header2"; // Adjust the import path as needed
import { Button } from "../../../stories/Button"; // Adjust the import path as needed

describe("Header2 Component", () => {
  it("renders login and sign-up buttons when user is not logged in", () => {
    render(<Header2 />);

    // Check if login button is present
    expect(screen.getByText("Log in")).toBeInTheDocument();

    // Check if sign-up button is present
    expect(screen.getByText("Sign up")).toBeInTheDocument();
  });

  it("renders welcome message and log out button when user is logged in", async () => {
    const user = { name: "John Doe" };
    render(<Header2 user={user} onLogout={jest.fn()} />);

    // Check if the span with class 'welcome' contains the text "Welcome,"
    const welcomeSpan = await screen.findByText(/Welcome,/i);
    expect(welcomeSpan).toBeInTheDocument();

    // Check if the bold (b) element contains the user's name
    const userName = await screen.findByText(user.name);
    expect(userName).toBeInTheDocument();

    // Check if the log out button is present
    expect(screen.getByText("Log out")).toBeInTheDocument();
  });

  it("calls onLogin when the login button is clicked", () => {
    const onLoginMock = jest.fn();
    render(<Header2 onLogin={onLoginMock} />);

    // Simulate button click
    fireEvent.click(screen.getByText("Log in"));

    // Check if onLogin is called
    expect(onLoginMock).toHaveBeenCalledTimes(1);
  });

  it("calls onLogout when the log out button is clicked", () => {
    const onLogoutMock = jest.fn();
    const user = { name: "John Doe" };
    render(<Header2 user={user} onLogout={onLogoutMock} />);

    // Simulate button click
    fireEvent.click(screen.getByText("Log out"));

    // Check if onLogout is called
    expect(onLogoutMock).toHaveBeenCalledTimes(1);
  });

  it("calls onCreateAccount when the sign-up button is clicked", () => {
    const onCreateAccountMock = jest.fn();
    render(<Header2 onCreateAccount={onCreateAccountMock} />);

    // Simulate button click
    fireEvent.click(screen.getByText("Sign up"));

    // Check if onCreateAccount is called
    expect(onCreateAccountMock).toHaveBeenCalledTimes(1);
  });
});
