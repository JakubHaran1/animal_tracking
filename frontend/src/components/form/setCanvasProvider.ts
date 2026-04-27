import { PixelCrop } from "react-image-crop";

interface CanvasProviderTypes {
  image: HTMLImageElement;
  canvas: HTMLCanvasElement;
  crop: PixelCrop;
}

export const setCanvasPreview = ({
  image,
  canvas,
  crop,
}: CanvasProviderTypes) => {
  // pobranie contextu
  const context = canvas.getContext("2d");
  if (!context) throw new Error("No 2d context");

  // określenie zagęszczenia pixeli na urządzeniu usera
  // np. logicznie pixeli jest 100 a fizycznie 200
  const pixelRatio = window.devicePixelRatio;

  // określenie skali w jakiej jest wyświetlane zdjęcie na urządzeniu usera
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  // tworzenie matrycy - mentalne odzworowanie małęgo wycinak na duzy
  canvas.width = Math.floor(crop.width * scaleX * pixelRatio);
  canvas.height = Math.floor(crop.height * scaleY * pixelRatio);

  // dopasowanie contentu do matrycy
  context.scale(pixelRatio, pixelRatio);
  context.imageSmoothingQuality = "high";
  context.save();

  // określenie nowych współrzednych
  const cropX = crop.x * scaleX;
  const cropY = crop.y * scaleY;

  // przesuwanie matryca
  context.translate(-cropX, -cropY);
  context.drawImage(
    image,
    0,
    0,
    image.naturalWidth,
    image.naturalHeight,
    0,
    0,
    image.naturalWidth,
    image.naturalHeight,
  );
};
