export type ImageCropperHandle = {
  getCroppedData: () => Promise<File | undefined>;
};
