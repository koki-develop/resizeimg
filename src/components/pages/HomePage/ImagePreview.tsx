import { ImageFile, ImageSize } from "@/types/imageFile";
import prettyBytes from "pretty-bytes";
import React, { memo, useCallback, useState } from "react";

export type ImagePreviewProps = {
  label: string;
  aspectRatio: number;
  imageFile: ImageFile | null;
  imageSize: ImageSize;
  loading: boolean;

  onChangeSize?: (size: ImageSize) => void;
};

const ImagePreview = memo<ImagePreviewProps>(
  ({ label, aspectRatio, imageFile, imageSize, loading, onChangeSize }) => {
    const [keepAspectRatio, setKeepAspectRatio] = useState<boolean>(true);

    const handleChangeKeepAspectRatio = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setKeepAspectRatio(e.target.checked);
      },
      [],
    );

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
        const height = keepAspectRatio ? width / aspectRatio : imageSize.height;
        handleChangeSize({ width, height });
      },
      [handleChangeSize, imageSize, keepAspectRatio, aspectRatio],
    );

    const handleChangeHeight = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const height = Number(value);
        const width = keepAspectRatio ? height * aspectRatio : imageSize.width;
        handleChangeSize({ width, height });
      },
      [handleChangeSize, imageSize, keepAspectRatio, aspectRatio],
    );

    return (
      <div className="flex flex-col items-center gap-2">
        <div className="h-64 w-64 flex items-center justify-center shadow border">
          {imageFile && !loading ? (
            <img
              className="h-full w-full object-contain"
              src={imageFile.dataUrl}
              alt=""
            />
          ) : (
            <div className="h-full w-full flex flex-col gap-2 items-center justify-center">
              <div className="loader" />
              <span className="text-sm text-gray-500">読み込み中...</span>
            </div>
          )}
        </div>

        <div className="text-gray-500 flex flex-col justify-center">
          <div className="text-sm">{label}</div>
          <div className="text-sm">
            (
            {imageFile && !loading
              ? prettyBytes(imageFile.filesize)
              : "ファイルサイズを計算中"}
            )
          </div>
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
                      className="text-right w-full border"
                      type="number"
                      disabled={!imageFile}
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
                      className="text-right w-full border"
                      type="number"
                      disabled={!imageFile}
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

        {onChangeSize && (
          <div className="flex gap-2">
            <span>縦横比を維持する</span>
            <input
              type="checkbox"
              checked={keepAspectRatio}
              onChange={handleChangeKeepAspectRatio}
            />
          </div>
        )}
      </div>
    );
  },
);

ImagePreview.displayName = "ImagePreview";

export default ImagePreview;
