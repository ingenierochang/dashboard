import React, { useState, useCallback } from "react";
import ReactCrop, { Crop, PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

interface ClusterImageUploadFieldProps {
  image: File | null;
  onImageChange: (image: File | null) => void;
  onCrop: (croppedImage: File) => void;
}

const ClusterImageUploadField: React.FC<ClusterImageUploadFieldProps> = ({
  image,
  onImageChange,
  onCrop,
}) => {
  const [crop, setCrop] = useState<Crop>({
    unit: "px",
    width: 200,
    height: 75,
    x: 0,
    y: 0,
  });
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const onImageLoaded = useCallback(
    (event: React.SyntheticEvent<HTMLImageElement>) => {
      const image = event.currentTarget;
      setImg(image);
    },
    []
  );

  const onCropComplete = (crop: PixelCrop) => {
    if (img && image) {
      getCroppedImg(img, crop, "cropped.jpeg").then((croppedImage) => {
        onCrop(croppedImage);
      });
    }
  };

  const getCroppedImg = async (
    image: HTMLImageElement,
    crop: PixelCrop,
    fileName: string
  ): Promise<File> => {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width * scaleX;
    canvas.height = crop.height * scaleY;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      return new File([], fileName);
    }

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * scaleX,
      crop.height * scaleY
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Canvas is empty"));
          return;
        }
        resolve(new File([blob], fileName, { type: "image/jpeg" }));
      }, "image/jpeg");
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      onImageChange(e.target.files[0]);
      setImageUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  return (
    <div className="block border-t border-b py-2 border-gray-400">
      <p className="mb-3">Imagen:</p>
      <input
        type="file"
        onChange={handleFileChange}
        className="block w-full mb-5"
      />
      {imageUrl && (
        <div className="mt-4 w-full bg-gray-100 relative">
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            onComplete={onCropComplete}
            aspect={400 / 150} // Ensure 1:1 aspect ratio
          >
            <img src={imageUrl} alt="Crop me" onLoad={onImageLoaded} />
          </ReactCrop>
        </div>
      )}
    </div>
  );
};

export default ClusterImageUploadField;
