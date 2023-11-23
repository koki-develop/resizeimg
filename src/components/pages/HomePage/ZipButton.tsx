import { dataUrlToBase64 } from "@/lib/image";
import { ImageFile } from "@/types/imageFile";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import prettyBytes from "pretty-bytes";
import React, { memo, useCallback, useEffect, useMemo, useState } from "react";

export type ZipButtonProps = {
  imageFiles: ImageFile[];
  disabled: boolean;
};

const ZipButton = memo(({ imageFiles, disabled }: ZipButtonProps) => {
  const [zipBlob, setZipBlob] = useState<Blob | null>(null);
  const [zipping, setZipping] = useState<boolean>(false);

  const buttonDisabled = useMemo(() => {
    return imageFiles.length === 0 || disabled || zipping;
  }, [disabled, imageFiles.length, zipping]);

  const zipBlobSize = useMemo(() => {
    if (imageFiles.length === 0) return 0;
    if (!zipBlob) return 0;
    return zipBlob.size;
  }, [zipBlob, imageFiles.length]);

  useEffect(() => {
    let unmounted = false;

    setZipping(true);

    const zip = new JSZip();
    for (const imageFile of imageFiles) {
      const base64 = dataUrlToBase64(imageFile.dataUrl);
      zip.file(imageFile.name, base64, { base64: true });
    }
    zip.generateAsync({ type: "blob" }).then((blob) => {
      if (!unmounted) {
        setZipBlob(blob);
        setZipping(false);
      }
    });

    return () => {
      unmounted = true;
    };
  }, [imageFiles]);

  const handleClickDownload = useCallback(() => {
    if (!zipBlob) return;

    saveAs(zipBlob, "images.zip");
  }, [zipBlob]);

  return (
    <button
      className="flex items-center flex-col bg-blue-400 text-white p-2 disabled:bg-gray-400"
      onClick={handleClickDownload}
      disabled={buttonDisabled}
    >
      <span>Zip 形式でまとめてダウンロード</span>
      <span className="text-sm">
        {zipping ? "ファイルサイズを計算中" : prettyBytes(zipBlobSize)}
      </span>
    </button>
  );
});

ZipButton.displayName = "ZipButton";

export default ZipButton;
