import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthProvider, useAuth } from "../../context/AuthContext";

function AuthConsumer() {
  const { isAuthenticated, logIn, logOut } = useAuth();

  return (
    <div>
      <span>{isAuthenticated ? "authenticated" : "guest"}</span>
      <button type="button" onClick={logIn}>
        login
      </button>
      <button type="button" onClick={logOut}>
        logout
      </button>
    </div>
  );
}

describe("AuthContext", () => {
  it("provides initial unauthenticated state", () => {
    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>,
    );

    expect(screen.getByText("guest")).toBeInTheDocument();
  });

  it("updates state on login", async () => {
    const user = userEvent.setup();

    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>,
    );

    await user.click(screen.getByRole("button", { name: "login" }));

    expect(screen.getByText("authenticated")).toBeInTheDocument();
  });

  it("updates state on logout", async () => {
    const user = userEvent.setup();

    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>,
    );

    await user.click(screen.getByRole("button", { name: "login" }));
    await user.click(screen.getByRole("button", { name: "logout" }));

    expect(screen.getByText("guest")).toBeInTheDocument();
  });

  it("throws when hook is used outside provider", () => {
    expect(() => render(<AuthConsumer />)).toThrow(
      "useAuth must be used within AuthProvider",
    );
  });
});
