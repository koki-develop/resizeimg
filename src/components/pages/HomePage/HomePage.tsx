"use client";

import { ImageFile } from "@/types/imageFile";
import React, { useCallback, useMemo, useState } from "react";
import ImageListItem from "./ImageListItem";
import ZipButton from "./ZipButton";

export type FileWithId = { file: File; id: string };

const HomePage = () => {
  const [inputFileKey, setInputFileKey] = useState<number>(0);
  const [files, setFiles] = useState<FileWithId[]>([]);
  const [resizingCount, setResizingCount] = useState<number>(0);
  const [previewImageFiles, setPreviewImageFiles] = useState<ImageFile[]>([]);
  const resizing = useMemo(() => resizingCount > 0, [resizingCount]);

  const handleChangeFile = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { files } = e.target;
      if (!files) return;
      if (files.length === 0) return;
      setFiles((prev) => [
        ...prev,
        ...Array.from(files).map((file) => ({
          file,
          id: Math.random().toString(32),
        })),
      ]);
      setInputFileKey((prev) => prev + 1);
    },
    [],
  );

  const handleStartResize = useCallback(() => {
    setResizingCount((prev) => prev + 1);
  }, []);

  const handleEndResize = useCallback((imageFile: ImageFile, index: number) => {
    setResizingCount((prev) => prev - 1);
    setPreviewImageFiles((prev) => {
      const newPreviewImageFiles = [...prev];
      newPreviewImageFiles[index] = imageFile;
      return newPreviewImageFiles;
    });
  }, []);

  const handleRemoveImage = useCallback((index: number) => {
    setFiles((prev) => {
      const newFiles = [...prev];
      newFiles.splice(index, 1);
      return newFiles;
    });
    setPreviewImageFiles((prev) => {
      const newPreviewImageFiles = [...prev];
      newPreviewImageFiles.splice(index, 1);
      return newPreviewImageFiles;
    });
  }, []);

  return (
    <div>
      <input
        key={inputFileKey}
        type="file"
        multiple
        onChange={handleChangeFile}
      />

      {files.map((file, i) => (
        <ImageListItem
          key={file.id}
          file={file.file}
          index={i}
          onStartResize={handleStartResize}
          onEndResize={handleEndResize}
          onRemove={handleRemoveImage}
        />
      ))}

      <ZipButton imageFiles={previewImageFiles} disabled={resizing} />
    </div>
  );
};

export default HomePage;
