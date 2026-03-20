import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthModal } from "../../../components/auth/AuthModal";

function createProps(overrides?: Partial<React.ComponentProps<typeof AuthModal>>) {
  return {
    isOpen: true,
    view: "login" as const,
    onClose: vi.fn(),
    onSwitchToRegister: vi.fn(),
    onSwitchToLogin: vi.fn(),
    onLoginSuccess: vi.fn(),
    ...overrides,
  };
}

describe("AuthModal", () => {
  it("does not render when closed", () => {
    render(<AuthModal {...createProps({ isOpen: false })} />);

    expect(screen.queryByText("Logowanie")).not.toBeInTheDocument();
  });

  it("renders login view and submits login", async () => {
    const user = userEvent.setup();
    const props = createProps({ view: "login" });

    render(<AuthModal {...props} />);

    await user.type(screen.getByLabelText("Email"), "user@example.com");
    await user.type(screen.getByLabelText("Hasło"), "password");
    await user.click(screen.getByRole("button", { name: "Zaloguj" }));

    expect(props.onLoginSuccess).toHaveBeenCalledTimes(1);
  });

  it("calls switch to register callback", async () => {
    const user = userEvent.setup();
    const props = createProps({ view: "login" });

    render(<AuthModal {...props} />);

    await user.click(screen.getByRole("button", { name: "zarejestruj" }));

    expect(props.onSwitchToRegister).toHaveBeenCalledTimes(1);
  });

  it("renders register view and calls switch to login", async () => {
    const user = userEvent.setup();
    const props = createProps({ view: "register" });

    render(<AuthModal {...props} />);

    expect(screen.getByText("Rejestracja")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "zaloguj" }));

    expect(props.onSwitchToLogin).toHaveBeenCalledTimes(1);
  });
});
