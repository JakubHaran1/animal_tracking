import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import { VerifyEmailPage } from "../../pages/VerifyEmailPage";

const verifyEmailMock = vi.fn();

vi.mock("../../services/authService", () => ({
  authService: {
    verifyEmail: (token: string) => verifyEmailMock(token),
  },
}));

function renderPage(
  initialPath = "/verify-email/sample-token",
  routePath = "/verify-email/:token",
) {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path={routePath} element={<VerifyEmailPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("VerifyEmailPage", () => {
  afterEach(() => {
    verifyEmailMock.mockReset();
  });

  it("calls verify endpoint with token and renders success message", async () => {
    verifyEmailMock.mockResolvedValue({ detail: "Email został zweryfikowany." });

    renderPage();

    expect(screen.getByText("Weryfikacja e-mail")).toBeInTheDocument();
    await waitFor(() => {
      expect(verifyEmailMock).toHaveBeenCalledWith("sample-token");
    });
    expect(
      await screen.findByText("Email został zweryfikowany."),
    ).toBeInTheDocument();
  });

  it("shows an error when token is missing", async () => {
    renderPage("/verify-email", "/verify-email");

    await waitFor(() => {
      expect(
        screen.getByText("Brak tokenu w linku weryfikacyjnym."),
      ).toBeInTheDocument();
    });
    expect(verifyEmailMock).not.toHaveBeenCalled();
  });
});
