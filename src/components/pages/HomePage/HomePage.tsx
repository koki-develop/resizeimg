"use client";

import { ImageFile } from "@/types/imageFile";
import React, { useCallback, useMemo, useState } from "react";
import ImageListItem from "./ImageListItem";
import ZipButton from "./ZipButton";
import { useDropzone } from "react-dropzone";
import clsx from "clsx";

type FileWithId = { file: File; id: string };
type ImageFileWithId = { imageFile: ImageFile; id: string };

const HomePage = () => {
  const [files, setFiles] = useState<FileWithId[]>([]);
  const [resizingCount, setResizingCount] = useState<number>(0);
  const [previewImageFiles, setPreviewImageFiles] = useState<ImageFileWithId[]>(
    [],
  );
  const resizing = useMemo(() => resizingCount > 0, [resizingCount]);

  const handleChangeFile = useCallback((files: File[]) => {
    if (files.length === 0) return;
    setFiles((prev) => [
      ...prev,
      ...Array.from(files).map((file) => ({
        file,
        id: Math.random().toString(32),
      })),
    ]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleChangeFile,
  });

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
      <h1 className="text-center font-bold text-3xl">Resize Image</h1>

      <div>
        <div className="flex justify-center">
          <div
            className={clsx(
              "inline-block",
              "border border-dashed border-gray-400",
              "rounded",
              "cursor-pointer",
              "py-20 px-8 mb-4",
              {
                "bg-gray-100": !isDragActive,
                "bg-gray-300": isDragActive,
              },
            )}
            {...getRootProps()}
          >
            <input {...getInputProps()} />
            <span className="text-gray-500">
              ファイルをドロップするか、クリックしてファイルを選択してください
            </span>
          </div>
        </div>
        <p className="text-center text-gray-500">
          変換処理はすべてオフラインで実行されます
        </p>
      </div>

      <div className="flex flex-col gap-8">
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

      {files.length > 0 && (
        <div className="flex items-center gap-4 flex-col">
          <ZipButton
            imageFiles={previewImageFiles.map(
              (previewImageFile) => previewImageFile.imageFile,
            )}
            disabled={resizing}
          />

          <button
            className="bg-red-500 p-2 text-sm text-white disabled:bg-gray-400"
            onClick={handleRemoveAllImages}
          >
            すべて削除
          </button>
        </div>
      )}
    </div>
  );
};

export default HomePage;
