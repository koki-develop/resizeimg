import { ImageFile, ImageSize } from "@/types/imageFile";
import React, { memo, useCallback } from "react";

export type ImagePreviewProps = {
  imageFile: ImageFile | null;
  imageSize: ImageSize;
  loading: boolean;

  onChangeSize?: (size: ImageSize) => void;
};

const ImagePreview = memo<ImagePreviewProps>(
  ({ imageFile, imageSize, loading, onChangeSize }) => {
    const handleChangeSize = useCallback(
      (size: ImageSize) => {
        if (!onChangeSize) return;
        onChangeSize(size);
      },
      [onChangeSize],
    );

    const handleChangeWidth = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const width = Number(value);
        handleChangeSize({ ...imageSize, width });
      },
      [handleChangeSize, imageSize],
    );

    const handleChangeHeight = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const height = Number(value);
        handleChangeSize({ ...imageSize, height });
      },
      [handleChangeSize, imageSize],
    );

    return (
      <div className="flex flex-col items-center">
        {imageFile && !loading ? (
          <div>
            <img
              className="h-64 w-64 object-contain"
              src={imageFile.dataUrl}
              alt=""
            />
            <div>{imageFile.filesize}</div>
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
                {onChangeSize ? (
                  <input
                    className="text-right"
                    type="number"
                    value={imageSize.width}
                    onChange={handleChangeWidth}
                  />
                ) : (
                  imageSize.width
                )}
                px
              </td>
            </tr>
            <tr>
              <td className="w-1/2" align="right">
                height
              </td>
              <td className="w-1/2 flex" align="right">
                {onChangeSize ? (
                  <input
                    className="text-right"
                    type="number"
                    value={imageSize.height}
                    onChange={handleChangeHeight}
                  />
                ) : (
                  imageSize.height
                )}
                px
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  },
);

ImagePreview.displayName = "ImagePreview";

export default ImagePreview;
