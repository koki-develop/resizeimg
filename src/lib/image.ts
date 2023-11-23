import { ImageSize } from "@/types/imageFile";

export const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
};

export const fileToImage = async (file: File): Promise<HTMLImageElement> => {
  const dataUrl = await fileToDataUrl(file);
  return dataUrlToImage(dataUrl);
};

export const dataUrlToImage = (dataUrl: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(image);
    image.src = dataUrl;
  });
};

export const dataUrlToBase64 = (dataUrl: string): string => {
  return dataUrl.split(",")[1];
};

export const dataUrlToBlob = (dataUrl: string): Blob => {
  const base64 = dataUrlToBase64(dataUrl);
  const type = dataUrl.split(";")[0].split(":")[1];
  const byteString = atob(base64);
  const uInt8Array = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) {
    uInt8Array[i] = byteString.charCodeAt(i);
  }
  return new Blob([uInt8Array], { type });
};

export const resizeDataUrl = async (
  dataUrl: string,
  size: ImageSize,
): Promise<string> => {
  const type = dataUrl.split(";")[0].split(":")[1];
  const image = await dataUrlToImage(dataUrl);
  const canvas = document.createElement("canvas");
  canvas.width = size.width;
  canvas.height = size.height;
  const context = canvas.getContext("2d")!;
  context.drawImage(image, 0, 0, size.width, size.height);
  return canvas.toDataURL(type);
};

export const calcFilesizeFromDataUrl = (dataUrl: string): number => {
  const blob = dataUrlToBlob(dataUrl);
  return blob.size;
};
