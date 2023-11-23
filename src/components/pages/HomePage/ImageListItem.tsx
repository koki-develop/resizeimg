"use client";

import { ImageFile, ImageSize } from "@/types/imageFile";
import {
  calcFilesizeFromDataUrl,
  dataUrlToBlob,
  dataUrlToImage,
  fileToDataUrl,
  resizeDataUrl,
} from "@/lib/image";
import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import ImagePreview from "./ImagePreview";
import { saveAs } from "file-saver";

export type ImageListItemProps = {
  id: string;
  file: File;

  onStartResize: () => void;
  onEndResize: () => void;
  onResize: (imageFile: ImageFile, id: string) => void;
  onRemove: (id: string) => void;
};

const ImageListItem = memo<ImageListItemProps>(
  ({ id, file, onStartResize, onEndResize, onResize, onRemove }) => {
    const [rendered, setRendered] = useState<boolean>(false);
    const [resizing, setResizing] = useState<boolean>(false);

    const [originalImage, setOriginalImage] = useState<ImageFile | null>(null);
    const [originalImageSize, setOriginalImageSize] = useState<ImageSize>({
      width: 0,
      height: 0,
    });
    const [previewImage, setPreviewImage] = useState<ImageFile | null>(null);
    const [previewImageSize, setPreviewImageSize] = useState<ImageSize>({
      width: 0,
      height: 0,
    });

    const originalImageAspectRatio = useMemo(() => {
      return originalImageSize.width / originalImageSize.height;
    }, [originalImageSize]);

    const handleChangePreviewImageSize = useCallback((size: ImageSize) => {
      setPreviewImageSize(size);
    }, []);

    const handleClickDownload = useCallback(() => {
      if (!previewImage) return;
      const blob = dataUrlToBlob(previewImage.dataUrl);
      saveAs(blob, previewImage.name);
    }, [previewImage]);

    const handleClickRemove = useCallback(() => {
      if (!confirm(`画像を削除しますか？(${file.name})`)) return;
      onRemove(id);
    }, [file, onRemove, id]);

    useEffect(() => {
      if (!rendered) {
        setRendered(true);
        return;
      }

      if (!originalImage) {
        fileToDataUrl(file).then(async (dataUrl) => {
          const filesize = calcFilesizeFromDataUrl(dataUrl);
          const image = await dataUrlToImage(dataUrl);

          const imageFile: ImageFile = {
            name: file.name,
            dataUrl,
            filesize,
          };
          const imageSize = { width: image.width, height: image.height };

          setOriginalImage(imageFile);
          setOriginalImageSize(imageSize);

          setPreviewImageSize(imageSize);
        });
      }
    }, [file, originalImage, rendered]);

    useEffect(() => {
      if (!originalImage) return;

      const timeoutId = setTimeout(() => {
        onStartResize();
        setResizing(true);
        resizeDataUrl(originalImage.dataUrl, previewImageSize)
          .then((dataUrl) => {
            const filesize = calcFilesizeFromDataUrl(dataUrl);
            const imageFile: ImageFile = {
              name: originalImage.name,
              dataUrl,
              filesize,
            };
            setPreviewImage(imageFile);
            onResize(imageFile, id);
          })
          .finally(() => {
            setResizing(false);
            onEndResize();
          });
      }, 500);

      return () => {
        clearTimeout(timeoutId);
      };
    }, [
      originalImage,
      previewImageSize,
      id,
      onResize,
      onEndResize,
      onStartResize,
    ]);

    return (
      <div className="flex items-center justify-center gap-4">
        {/* original image */}
        <div>
          <ImagePreview
            loading={!originalImage}
            imageFile={originalImage}
            imageSize={originalImageSize}
          />
        </div>

        {/* arrow */}
        <div className="flex items-center justify-center">→</div>

        {/* preview image */}
        <div>
          <ImagePreview
            aspectRatio={originalImageAspectRatio}
            imageFile={previewImage}
            imageSize={previewImageSize}
            loading={resizing}
            onChangeSize={handleChangePreviewImageSize}
          />
        </div>

        {/* actions */}
        <div className="flex flex-col gap-2">
          <button
            className="bg-blue-400 p-2 text-white"
            onClick={handleClickDownload}
          >
            ダウンロード
          </button>
          <button
            className="bg-red-500 text-white p-2"
            onClick={handleClickRemove}
          >
            削除
          </button>
        </div>
      </div>
    );
  },
);

ImageListItem.displayName = "ImageListItem";

export default ImageListItem;
