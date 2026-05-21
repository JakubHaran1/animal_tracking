import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthModal } from "../../../components/auth/AuthModal";
import { AuthProvider } from "../../../context/AuthContext";
import { authService } from "../../../services/authService";

vi.mock("../../../services/authService", () => ({
  authService: {
    loginUser: vi.fn(),
    registerUser: vi.fn(),
    getUser: vi.fn(),
  },
}));

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

function renderWithProvider(component: React.ReactNode) {
  return render(<AuthProvider>{component}</AuthProvider>);
}

describe("AuthModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(authService.loginUser).mockResolvedValue({
      tokens: { access: "access-token", refresh: "refresh-token" },
    });
    vi.mocked(authService.getUser).mockResolvedValue({
      id: "1",
      username: "user",
      email: "user@example.com",
      city: "Krakow",
      joinedAt: "2024-01-01",
      publications: [],
    });
  });

  it("does not render when closed", () => {
    renderWithProvider(<AuthModal {...createProps({ isOpen: false })} />);

    expect(screen.queryByText("Logowanie")).not.toBeInTheDocument();
  });

  it("renders login view and submits login", async () => {
    const user = userEvent.setup();
    const props = createProps({ view: "login" });

    renderWithProvider(<AuthModal {...props} />);

    await user.type(screen.getByLabelText("Nazwa użytkownika"), "user@example.com");
    await user.type(screen.getByLabelText("Hasło"), "password");
    await user.click(screen.getByRole("button", { name: "Zaloguj" }));

    expect(authService.loginUser).toHaveBeenCalledTimes(1);
    expect(authService.getUser).toHaveBeenCalledTimes(1);
    expect(props.onLoginSuccess).toHaveBeenCalledTimes(1);
  });

  it("calls switch to register callback", async () => {
    const user = userEvent.setup();
    const props = createProps({ view: "login" });

    renderWithProvider(<AuthModal {...props} />);

    await user.click(screen.getByRole("button", { name: "zarejestruj" }));

    expect(props.onSwitchToRegister).toHaveBeenCalledTimes(1);
  });

  it("renders register view and calls switch to login", async () => {
    const user = userEvent.setup();
    const props = createProps({ view: "register" });

    renderWithProvider(<AuthModal {...props} />);

    expect(screen.getByText("Rejestracja")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "zaloguj" }));

    expect(props.onSwitchToLogin).toHaveBeenCalledTimes(1);
  });

  it("submits registration and switches to login", async () => {
    const user = userEvent.setup();
    const props = createProps({ view: "register" });
    vi.mocked(authService.registerUser).mockResolvedValue();

    renderWithProvider(<AuthModal {...props} />);

    await user.type(screen.getByLabelText("Nazwa użytkownika"), "new-user");
    await user.type(screen.getByLabelText("Email"), "new@example.com");
    await user.type(screen.getByLabelText("Hasło"), "pass1234");
    await user.type(screen.getByLabelText("Potwierdź hasło"), "pass1234");
    await user.click(screen.getByRole("button", { name: "Załóż konto" }));

    expect(authService.registerUser).toHaveBeenCalledWith({
      username: "new-user",
      email: "new@example.com",
      password: "pass1234",
      confirm_password: "pass1234",
    });
    expect(props.onSwitchToLogin).toHaveBeenCalledTimes(1);
  });

  it("shows error when passwords do not match", async () => {
    const user = userEvent.setup();
    const props = createProps({ view: "register" });

    renderWithProvider(<AuthModal {...props} />);

    await user.type(screen.getByLabelText("Nazwa użytkownika"), "new-user");
    await user.type(screen.getByLabelText("Email"), "new@example.com");
    await user.type(screen.getByLabelText("Hasło"), "pass1234");
    await user.type(screen.getByLabelText("Potwierdź hasło"), "pass123");
    await user.click(screen.getByRole("button", { name: "Załóż konto" }));

    expect(authService.registerUser).not.toHaveBeenCalled();
    expect(screen.getByText("Hasła muszą być takie same.")).toBeInTheDocument();
  });
});
