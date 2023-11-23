import { dataUrlToBase64 } from "@/lib/image";
import { ImageFile } from "@/types/imageFile";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import React, { memo, useCallback, useEffect, useMemo, useState } from "react";

export type ZipButtonProps = {
  imageFiles: ImageFile[];
};

const ZipButton = memo(({ imageFiles }: ZipButtonProps) => {
  const [zipBlob, setZipBlob] = useState<Blob | null>(null);

  useEffect(() => {
    let unmounted = false;

    const zip = new JSZip();
    for (const imageFile of imageFiles) {
      const base64 = dataUrlToBase64(imageFile.dataUrl);
      zip.file(imageFile.name, base64, { base64: true });
    }
    zip.generateAsync({ type: "blob" }).then((blob) => {
      if (!unmounted) {
        setZipBlob(blob);
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
    <button onClick={handleClickDownload}>
      Zip 形式でまとめてダウンロード
    </button>
  );
});

ZipButton.displayName = "ZipButton";

export default ZipButton;
