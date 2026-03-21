import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "../../router/ProtectedRoute";

const mockUseAuth = vi.fn();

vi.mock("../../context/AuthContext", () => ({
  useAuth: () => mockUseAuth(),
}));

function renderWithRouter() {
  return render(
    <MemoryRouter initialEntries={["/friends"]}>
      <Routes>
        <Route path="/" element={<div>Home</div>} />
        <Route
          path="/friends"
          element={
            <ProtectedRoute>
              <div>Friends</div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </MemoryRouter>,
  );
}

describe("ProtectedRoute", () => {
  afterEach(() => {
    mockUseAuth.mockReset();
  });

  it("renders children when user is authenticated", () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: true });

    renderWithRouter();

    expect(screen.getByText("Friends")).toBeInTheDocument();
  });

  it("redirects to home when user is not authenticated", () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: false });

    renderWithRouter();

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.queryByText("Friends")).not.toBeInTheDocument();
  });
});
