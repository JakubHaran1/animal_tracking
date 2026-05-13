export type ImageCropperHandle = {
  getCroppedData: () => Promise<File | undefined>;
};

export type SearchTypes = {
  title: boolean;
  author: boolean;
  species: boolean;
};
