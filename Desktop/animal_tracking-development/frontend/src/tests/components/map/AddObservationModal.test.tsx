import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AddObservationModal } from "../../../components/map/AddObservationModal";
import { observationsService } from "../../../services";

const mockUseObservationContext = vi.hoisted(() => vi.fn());
const mockGetCroppedData = vi.hoisted(() => vi.fn());

vi.mock("../../../context/ObservationContext", () => ({
  useObservationContext: () => mockUseObservationContext(),
}));

vi.mock("../../../components/form/ImageCroppper", () => ({
  __esModule: true,
  default: React.forwardRef((_props, ref) => {
    React.useImperativeHandle(ref, () => ({
      getCroppedData: mockGetCroppedData,
    }));
    return <div data-testid="image-cropper" />;
  }),
}));

vi.mock("../../../services", () => ({
  observationsService: {
    createObservation: vi.fn(),
  },
}));

describe("AddObservationModal", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("does not render when closed", () => {
    mockUseObservationContext.mockReturnValue({
      isAddObservationOpen: false,
      onCloseModal: vi.fn(),
      onOpenModal: vi.fn(),
      handleMapClick: vi.fn(),
      activeObservationCoords: null,
      activeMarker: { current: null },
    });

    render(<AddObservationModal />);

    expect(screen.queryByText("Dodaj obserwację")).not.toBeInTheDocument();
  });

  it("submits form with draft data and closes modal", async () => {
    const user = userEvent.setup();
    const onCloseModal = vi.fn();
    mockUseObservationContext.mockReturnValue({
      isAddObservationOpen: true,
      onCloseModal,
      onOpenModal: vi.fn(),
      handleMapClick: vi.fn(),
      activeObservationCoords: { latitude: 50.0614, longitude: 19.9366 },
      activeMarker: { current: null },
    });

    const mockFile = new File(["photo"], "sowa.jpg", { type: "image/jpeg" });
    mockGetCroppedData.mockResolvedValue(mockFile);

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

    render(<AddObservationModal />);

    await user.type(screen.getByLabelText("Tytuł"), "Sowa w parku");
    await user.type(screen.getByLabelText("Opis"), "Zaobserwowana po zmroku");

    await user.click(
      screen.getByRole("button", { name: "Zapisz obserwację" }),
    );

    await waitFor(() => {
      expect(observationsService.createObservation).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Sowa w parku",
          description: "Zaobserwowana po zmroku",
          latitude: 50.0614,
          longitude: 19.9366,
          img: expect.any(File),
        }),
      );
    });
    expect(onCloseModal).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when close button is clicked", async () => {
    const user = userEvent.setup();
    const onCloseModal = vi.fn();
    mockUseObservationContext.mockReturnValue({
      isAddObservationOpen: true,
      onCloseModal,
      onOpenModal: vi.fn(),
      handleMapClick: vi.fn(),
      activeObservationCoords: { latitude: 50.0614, longitude: 19.9366 },
      activeMarker: { current: null },
    });

    render(<AddObservationModal />);

    await user.click(screen.getByRole("button", { name: "Zamknij" }));

    expect(onCloseModal).toHaveBeenCalledTimes(1);
  });
});
