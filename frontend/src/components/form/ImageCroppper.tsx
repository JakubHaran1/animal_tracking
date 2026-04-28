import { useState, useRef } from "react";
import ReactCrop, {
  makeAspectCrop,
  convertToPixelCrop,
  type Crop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

import { setCanvasPreview } from "./setCanvasProvider";

interface ImageCropperProps {
  MIN_WIDTH: number;
  MIN_HEIGHT: number;
  aspectRatioWidth: number;
  aspectRatioHeight: number;
  maxContainerHeight: string;
}
export default function ImageCropper({
  MIN_WIDTH,
  MIN_HEIGHT,
  aspectRatioWidth,
  aspectRatioHeight,
  maxContainerHeight,
}: ImageCropperProps) {
  const [imgSrc, setImgSrc] = useState("");
  const [error, setError] = useState("");
  const [crop, setCrop] = useState<Crop>();
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ASPECT_RATIO = aspectRatioWidth / aspectRatioHeight;
  const onSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.addEventListener("load", () => {
      const imgElement = new Image();
      const imgUrl = reader.result?.toString() || "";
      imgElement.src = imgUrl;

      imgElement.addEventListener("load", () => {
        const { naturalWidth, naturalHeight } = imgElement;
        if (naturalWidth < MIN_WIDTH || naturalHeight < MIN_HEIGHT) {
          setError("Your img must be at least 150x150");
          setImgSrc("");
        }
      });
      setImgSrc(imgUrl);
    });

    reader.readAsDataURL(file);
  };
  const onLoadImg = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    const cropWidthPercent = (MIN_WIDTH / width) * 100;
    const crop = makeAspectCrop(
      { unit: "%", width: cropWidthPercent },
      ASPECT_RATIO,
      width,
      height,
    );

    setCrop(crop);
  };
  return (
    <>
      <label className="block text-sm text-green-900">
        Zdjęcie
        <input
          type="file"
          accept="image/*"
          required
          // gdy value w inpucie change - trigger readera, odczyt zdjęcia - utworzenie el zdjecia,

          onChange={onSelect}
          className="mt-1 w-full rounded-md border border-green-300 bg-white px-3 py-2 text-green-950 file:mr-3 file:rounded-md file:border-0 file:bg-amber-300 file:px-3 file:py-1 file:font-medium file:text-green-950 hover:file:bg-amber-200"
        />
        <p className="color-red">{error}</p>
      </label>
      {imgSrc && (
        <div className="text-center">
          <ReactCrop
            crop={crop}
            // aktualizacja cropa
            onChange={(_, c) => {
              console.log(c);
              // const centeredCrop = centerCrop(c, c.width, c.height);
              setCrop(c);
            }}
            keepSelection
            aspect={ASPECT_RATIO}
            minWidth={MIN_WIDTH}
            style={{ maxHeight: maxContainerHeight }}
          >
            <img
              ref={imgRef}
              src={imgSrc}
              // gdy załaduje sie img z przekazanego src to tworza sie crop value
              onLoad={onLoadImg}
              alt="Upload a photo of your observation"
            />
          </ReactCrop>
          <button
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.preventDefault();
              if (!imgRef.current || !canvasRef.current || !crop) return;
              setCanvasPreview({
                image: imgRef.current,
                canvas: canvasRef.current,
                crop: convertToPixelCrop(
                  crop,
                  imgRef.current.width,
                  imgRef.current.height,
                ),
              });
              const data = canvasRef.current.toDataURL();
              console.log(data);
            }}
            className="w-full rounded-md bg-green-700 px-4 py-2 text-sm font-semibold text-lime-50 transition hover:bg-green-600"
          >
            save img test
          </button>
        </div>
      )}
      {crop && (
        // to matryca z której bierzemy wycinek
        <canvas
          ref={canvasRef}
          style={{
            display: "none",
            border: "2px solid black",
            width: MIN_WIDTH,
            height: MIN_HEIGHT,
            objectFit: "contain",
          }}
        />
      )}
    </>
  );
}
