"use client";

import { ImageFile, ImageSize } from "@/types/imageFile";
import {
  calcFilesizeFromDataUrl,
  dataUrlToImage,
  fileToDataUrl,
  resizeDataUrl,
} from "@/lib/image";
import React, { memo, useCallback, useEffect, useState } from "react";

export type ImageListItemProps = {
  index: number;
  file: File;

  onStartResize: () => void;
  onEndResize: (imageFile: ImageFile, index: number) => void;
  onRemove: (index: number) => void;
};

const ImageListItem = memo<ImageListItemProps>(
  ({ index, file, onStartResize, onEndResize, onRemove }) => {
    const [rendered, setRendered] = useState<boolean>(false);

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

    const handleChangePreviewImageSizeWidth = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.currentTarget.value;
        const width = Number(value);
        setPreviewImageSize((prev) => ({ ...prev, width }));
      },
      [],
    );

    const handleChangePreviewImageSizeHeight = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.currentTarget.value;
        const height = Number(value);
        setPreviewImageSize((prev) => ({ ...prev, height }));
      },
      [],
    );

    const handleClickRemove = useCallback(() => {
      onRemove(index);
    }, [onRemove, index]);

    useEffect(() => {
      if (!rendered) {
        setRendered(true);
        return;
      }

      if (!originalImage) {
        onStartResize();
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

          setPreviewImage(imageFile);
          setPreviewImageSize(imageSize);
          onEndResize(imageFile, index);
        });
      }
    }, [rendered, file, index, originalImage, onStartResize, onEndResize]);

    useEffect(() => {
      if (!originalImage) return;

      const timeoutId = setTimeout(async () => {
        onStartResize();
        const dataUrl = await resizeDataUrl(
          originalImage.dataUrl,
          previewImageSize,
        );
        const filesize = calcFilesizeFromDataUrl(dataUrl);
        const imageFile: ImageFile = {
          name: originalImage.name,
          dataUrl,
          filesize,
        };
        setPreviewImage(imageFile);
        onEndResize(imageFile, index);
      }, 500);

      return () => {
        clearTimeout(timeoutId);
      };
    }, [originalImage, previewImageSize, onStartResize, onEndResize, index]);

    return (
      <div className="flex items-center justify-center">
        {/* original image */}
        <div>
          {originalImage ? (
            <div className="flex flex-col items-center">
              <img
                className="h-64 w-64 object-contain"
                src={originalImage.dataUrl}
                alt=""
              />
              <div>{originalImage.filesize}</div>

              <table className="w-full">
                <tbody>
                  <tr>
                    <td className="w-1/2" align="right">
                      width
                    </td>
                    <td className="w-1/2" align="right">
                      {originalImageSize.width} px
                    </td>
                  </tr>
                  <tr>
                    <td className="w-1/2" align="right">
                      height
                    </td>
                    <td className="w-1/2" align="right">
                      {originalImageSize.height} px
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <div>loading...</div>
          )}
        </div>

        {/* preview image */}
        <div>
          <div className="flex flex-col items-center">
            {previewImage ? (
              <div>
                <img
                  className="h-64 w-64 object-contain"
                  src={previewImage.dataUrl}
                  alt=""
                />
                <div>{previewImage.filesize}</div>
              </div>
            ) : (
              <div>loading...</div>
            )}

            <table className="w-full">
              <tbody>
                <tr>
                  <td className="w-1/2" align="right">
                    width
                  </td>
                  <td className="w-1/2 flex" align="right">
                    <input
                      className="text-right"
                      type="number"
                      value={previewImageSize.width}
                      onChange={handleChangePreviewImageSizeWidth}
                    />
                    px
                  </td>
                </tr>
                <tr>
                  <td className="w-1/2" align="right">
                    height
                  </td>
                  <td className="w-1/2 flex" align="right">
                    <input
                      className="text-right"
                      type="number"
                      value={previewImageSize.height}
                      onChange={handleChangePreviewImageSizeHeight}
                    />
                    px
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* actions */}
        <div>
          <button onClick={handleClickRemove}>削除</button>
        </div>
      </div>
    );
  },
);

ImageListItem.displayName = "ImageListItem";

export default ImageListItem;
