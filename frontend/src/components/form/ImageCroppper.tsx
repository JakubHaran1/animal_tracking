import React, {
  useState,
  useRef,
  useImperativeHandle,
  useMemo,
  useCallback,
  useEffect,
} from "react";
import ReactCrop, { makeAspectCrop, type Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

import { croperService } from "../../services";
import { type ImageCropperHandle } from "../../types/form";

interface ImageCropperProps {
  MIN_WIDTH: number;
  MIN_HEIGHT: number;
  aspectRatioWidth: number;
  aspectRatioHeight: number;
  maxContainerHeight: string;
  ref: React.Ref<ImageCropperHandle>;
  imgReverse: string;
}

export default function ImageCropper({
  MIN_WIDTH,
  MIN_HEIGHT,
  aspectRatioWidth,
  aspectRatioHeight,
  maxContainerHeight,
  ref,
  imgReverse,
}: ImageCropperProps) {
  const [imgData, setImgData] = useState<{
    img: string;
    imgTitile: string;
  }>({ img: "", imgTitile: "" });

  const [error, setError] = useState("");
  const [crop, setCrop] = useState<Crop>();

  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const ASPECT_RATIO = useMemo(() => aspectRatioWidth / aspectRatioHeight, []);

  // exposing child methods to parent
  useImperativeHandle(ref, () => {
    return {
      // obsługa funkcji mapującej
      async getCroppedData() {
        if (!imgRef.current || !canvasRef.current || !crop || !inputRef.current)
          return;
        const file = await croperService.setCanvasPreview({
          image: imgRef.current,
          imageTitle: imgData.imgTitile,
          canvas: canvasRef.current,
          crop: crop,
        });
        setImgData({ img: "", imgTitile: "" });
        inputRef.current.value = "";
        return file;
      },
    };
  }, [crop]);

  // Odczytywanie inputa/załadunek zdjęcia z inputa
  // Wstrzyknięcie daty z readera do <img>
  const onSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      const fileName = file?.name;

      if (!file || !fileName) {
        // clear gdy user wybierze img a następnie znowu wybierajac da anuluj
        setImgData({ img: "", imgTitile: "" });
        return;
      }

      const reader = new FileReader();

      reader.addEventListener("load", () => {
        const imgElement = new Image();
        const readerData = reader.result?.toString() || "";
        imgElement.src = readerData;
        console.log(readerData);
        console.log("reader", readerData);

        imgElement.addEventListener("load", () => {
          const { naturalWidth, naturalHeight } = imgElement;
          if (naturalWidth < MIN_WIDTH || naturalHeight < MIN_HEIGHT) {
            setError("Your img must be at least 300x150");
            if (inputRef.current) {
              inputRef.current.value = "";
              setImgData({ img: "", imgTitile: "" });
            }
          } else {
            setImgData({ img: readerData, imgTitile: fileName });
            setError("");
          }
        });
      });

      reader.readAsDataURL(file);
    },
    [MIN_WIDTH, MIN_HEIGHT],
  );

  const handleCropChange = useCallback((c: Crop) => {
    setCrop(c);
  }, []);

  // Po załadowaniu zdjęcia tworzy crop - miejsce do zaznaczenia wycinka
  const onLoadImg = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    const cropWidthPercent = (MIN_WIDTH / width) * 100;
    const crop = makeAspectCrop(
      { unit: "%", width: cropWidthPercent },
      ASPECT_RATIO,
      width,
      height,
    );

    handleCropChange(crop);
  };

  useEffect(() => {
    if (!imgReverse || !inputRef.current) return;

    setImgData({
      img: imgReverse,
      imgTitile: "reverse",
    });

    setCrop(undefined);
  }, [imgReverse]);

  return (
    <>
      <label className="block text-sm text-green-900">
        Zdjęcie
        <input
          type="file"
          accept="image/jpeg,image/png"
          ref={inputRef}
          // gdy value w inpucie change - trigger readera, odczyt zdjęcia - utworzenie el zdjecia,
          required
          onChange={onSelect}
          className="mt-1 w-full rounded-md border border-green-300 bg-white px-3 py-2 text-green-950 file:mr-3 file:rounded-md file:border-0 file:bg-amber-300 file:px-3 file:py-1 file:font-medium file:text-green-950 hover:file:bg-amber-200"
        />
        <p className="color-red">{error}</p>
      </label>
      {imgData.img && (
        <div className="text-center">
          <ReactCrop
            crop={crop}
            // aktualizacja cropa
            onChange={handleCropChange}
            keepSelection
            aspect={ASPECT_RATIO}
            minWidth={MIN_WIDTH}
            style={{ maxHeight: maxContainerHeight }}
          >
            <img
              ref={imgRef}
              src={imgData.img}
              // gdy załaduje sie img z przekazanego src to tworza sie crop value
              onLoad={onLoadImg}
              alt="Upload a photo of your observation"
            />
          </ReactCrop>
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
