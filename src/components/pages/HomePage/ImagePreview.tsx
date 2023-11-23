import { ImageFile, ImageSize } from "@/types/imageFile";
import prettyBytes from "pretty-bytes";
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
        <div className="h-64 w-64">
          {imageFile && !loading ? (
            <img
              className="h-full w-full object-contain"
              src={imageFile.dataUrl}
              alt=""
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center">
              loading...
            </div>
          )}
        </div>

        <div className="text-gray-500 text-sm">
          {imageFile && !loading
            ? prettyBytes(imageFile.filesize)
            : "ファイルサイズを計算中"}
        </div>

        <table className="w-full">
          <tbody>
            <tr>
              <td className="w-1/2" align="right">
                幅
              </td>
              <td className="w-1/2" align="right">
                {onChangeSize ? (
                  <span className="flex">
                    <input
                      className="text-right w-full"
                      type="number"
                      value={imageSize.width}
                      onChange={handleChangeWidth}
                    />
                    px
                  </span>
                ) : (
                  <span>{imageSize.width} px</span>
                )}
              </td>
            </tr>
            <tr>
              <td className="w-1/2" align="right">
                高さ
              </td>
              <td className="w-1/2" align="right">
                {onChangeSize ? (
                  <span className="flex">
                    <input
                      className="text-right w-full"
                      type="number"
                      value={imageSize.height}
                      onChange={handleChangeHeight}
                    />
                    px
                  </span>
                ) : (
                  <span>{imageSize.height} px</span>
                )}
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
