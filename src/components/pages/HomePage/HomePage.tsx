"use client";

import { ImageFile } from "@/types/imageFile";
import React, { useCallback, useMemo, useState } from "react";
import ImageListItem from "./ImageListItem";
import ZipButton from "./ZipButton";

type FileWithId = { file: File; id: string };
type ImageFileWithId = { imageFile: ImageFile; id: string };

const HomePage = () => {
  const [inputFileKey, setInputFileKey] = useState<number>(0);
  const [files, setFiles] = useState<FileWithId[]>([]);
  const [resizingCount, setResizingCount] = useState<number>(0);
  const [previewImageFiles, setPreviewImageFiles] = useState<ImageFileWithId[]>(
    [],
  );
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

  const handleEndResize = useCallback(() => {
    setResizingCount((prev) => prev - 1);
  }, []);

  const handleResize = useCallback((imageFile: ImageFile, id: string) => {
    setPreviewImageFiles((prev) => {
      const newPreviewImageFiles = [...prev];
      const index = newPreviewImageFiles.findIndex((item) => item.id === id);
      if (index === -1) {
        // added
        newPreviewImageFiles.push({ imageFile, id });
      } else {
        newPreviewImageFiles[index] = { imageFile, id };
      }
      return newPreviewImageFiles;
    });
  }, []);

  const handleRemoveImage = useCallback((id: string) => {
    setFiles((prev) => {
      const newFiles = [...prev];
      const index = newFiles.findIndex((item) => item.id === id);
      if (index === -1) return prev;
      newFiles.splice(index, 1);
      return newFiles;
    });
    setPreviewImageFiles((prev) => {
      const newPreviewImageFiles = [...prev];
      const index = newPreviewImageFiles.findIndex((item) => item.id === id);
      if (index === -1) return prev;
      newPreviewImageFiles.splice(index, 1);
      return newPreviewImageFiles;
    });
  }, []);

  const handleRemoveAllImages = useCallback(() => {
    if (!confirm("プレビュー中のすべての画像を削除しますか？")) return;

    setFiles([]);
    setPreviewImageFiles([]);
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <input
        key={inputFileKey}
        type="file"
        multiple
        onChange={handleChangeFile}
      />

      <div className="flex flex-col gap-2">
        {files.map((file) => (
          <ImageListItem
            key={file.id}
            file={file.file}
            id={file.id}
            onStartResize={handleStartResize}
            onEndResize={handleEndResize}
            onResize={handleResize}
            onRemove={handleRemoveImage}
          />
        ))}
      </div>

      <div className="flex items-center gap-2 flex-col">
        <ZipButton
          imageFiles={previewImageFiles.map(
            (previewImageFile) => previewImageFile.imageFile,
          )}
          disabled={resizing}
        />

        <button
          className="bg-red-500 p-2 text-sm text-white disabled:bg-gray-400"
          onClick={handleRemoveAllImages}
          disabled={files.length === 0}
        >
          すべて削除
        </button>
      </div>
    </div>
  );
};

export default HomePage;
