import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AddObservationModal } from "../../../components";

function createProps() {
  return {
    isOpen: true,
    onClose: vi.fn(),
    onSubmit: vi.fn(),
  };
}

describe("AddObservationModal", () => {
  it("does not render when closed", () => {
    const props = createProps();

    render(<AddObservationModal {...props} isOpen={false} />);

    expect(screen.queryByText("Dodaj obserwację")).not.toBeInTheDocument();
  });

  it("submits form with draft data and closes modal", async () => {
    const user = userEvent.setup();
    const props = createProps();

    render(<AddObservationModal {...props} />);

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

    expect(props.onSubmit).toHaveBeenCalledWith({
      title: "Sowa w parku",
      description: "Zaobserwowana po zmroku",
      location: "50.0614, 19.9366",
      imageName: "sowa.jpg",
    });
    expect(props.onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when close button is clicked", async () => {
    const user = userEvent.setup();
    const props = createProps();

    render(<AddObservationModal {...props} />);

    await user.click(screen.getByRole("button", { name: "Zamknij" }));

    expect(props.onClose).toHaveBeenCalledTimes(1);
  });
});
