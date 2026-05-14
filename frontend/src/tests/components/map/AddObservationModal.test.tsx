import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AddObservationModal } from "../../../components/map/AddObservationModal";
import { ObservationProvider } from "../../../context/ObservationContext";
import { observationsService } from "../../../services/observationsService";

vi.mock("../../../services/observationsService", () => ({
  observationsService: {
    createObservation: vi.fn(),
  },
}));

function createProps() {
  return {
    isOpen: true,
    onClose: vi.fn(),
    onSubmit: vi.fn(),
  };
}

function renderWithProvider(component: React.ReactNode) {
  return render(
    <ObservationProvider>
      {component}
    </ObservationProvider>,
  );
}

describe("AddObservationModal", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("does not render when closed", () => {
    const props = createProps();

    renderWithProvider(<AddObservationModal {...props} isOpen={false} />);

    expect(screen.queryByText("Dodaj obserwację")).not.toBeInTheDocument();
  });

  it("submits form with draft data and closes modal", async () => {
    const user = userEvent.setup();
    const props = createProps();

    vi.mocked(observationsService.createObservation).mockResolvedValue({
      data: {
        id: "o-1",
        title: "Sowa w parku",
        description: "Zaobserwowana po zmroku",
        userId: "u-1",
        speciesId: 1,
        latitude: 50.0614,
        longitude: 19.9366,
      },
    });

    renderWithProvider(<AddObservationModal {...props} />);

    await user.type(screen.getByLabelText("Tytuł"), "Sowa w parku");
    await user.type(screen.getByLabelText("Opis"), "Zaobserwowana po zmroku");
    await user.type(screen.getByLabelText("Lokalizacja"), "50.0614, 19.9366");

    const fileInput = screen.getByLabelText("Zdjęcie") as HTMLInputElement;
    const file = new File(["photo"], "sowa.jpg", { type: "image/jpeg" });
    await user.upload(fileInput, file);

    const submitButton = screen.getByRole("button", { name: "Zapisz obserwację" });
    const form = submitButton.closest("form");

    expect(form).not.toBeNull();

    fireEvent.submit(form as HTMLFormElement);

    expect(observationsService.createObservation).toHaveBeenCalled();
    expect(props.onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when close button is clicked", async () => {
    const user = userEvent.setup();
    const props = createProps();

    renderWithProvider(<AddObservationModal {...props} />);

    await user.click(screen.getByRole("button", { name: "Zamknij" }));

    expect(props.onClose).toHaveBeenCalledTimes(1);
  });
});
