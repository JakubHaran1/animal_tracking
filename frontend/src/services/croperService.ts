import { convertToPixelCrop, Crop } from "react-image-crop";

interface CanvasProviderTypes {
  image: HTMLImageElement;
  imageTitle: string;
  canvas: HTMLCanvasElement;
  crop: Crop;
}

export const croperService = {
  async setCanvasPreview({
    image,
    imageTitle,
    canvas,
    crop,
  }: CanvasProviderTypes) {
    // pobranie contextu
    const context = canvas.getContext("2d");
    if (!context) throw new Error("No 2d context");
    const pixelCrop = convertToPixelCrop(crop, image.width, image.height);
    // określenie zagęszczenia pixeli na urządzeniu usera
    // np. logicznie pixeli jest 100 a fizycznie 200 - obrazy retina
    const pixelRatio = window.devicePixelRatio;

    // określenie skali w jakiej jest wyświetlane zdjęcie na urządzeniu usera
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    // tworzenie matrycy - mentalne odzworowanie małęgo wycinak na duzy
    canvas.width = Math.floor(pixelCrop.width * scaleX * pixelRatio);
    canvas.height = Math.floor(pixelCrop.height * scaleY * pixelRatio);

    // dopasowanie contentu do matrycy
    context.scale(pixelRatio, pixelRatio);
    context.imageSmoothingQuality = "high";
    context.save();

    // określenie nowych współrzednych
    const cropX = pixelCrop.x * scaleX;
    const cropY = pixelCrop.y * scaleY;

    // przesuwanie matryca
    context.translate(-cropX, -cropY);

    // Rysuje obraz pod matryca
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
    const data = canvas.toDataURL();
    const file = await this.Base64URLString(data, imageTitle);
    return file;
  },

  // Konwersja z base64 na bloba poprzez feature przeflądarki - nomalnie base64 -> string binarny ->bajty -> tablica ->blob
  async Base64URLString(base64: string, filename: string) {
    const blob = await fetch(base64).then((resp) => resp.blob());
    const file = new File([blob], filename);
    return file;
  },
};
