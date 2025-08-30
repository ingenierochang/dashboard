import React, { useState, useCallback, useEffect } from "react";
import Cropper from "react-easy-crop";
import { toast } from "react-toastify";
import { Area, MediaSize } from "react-easy-crop";

interface ImageUploadFieldProps {
  onImageChange: (image: File | null) => void;
  onCrop: (croppedImage: File) => void;
  resetImageUploadField: boolean;
  disabled?: boolean;
}

const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  onImageChange,
  onCrop,
  resetImageUploadField,
  disabled,
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [croppedImageUrl, setCroppedImageUrl] = useState<string | null>(null);

  const onImageLoaded = useCallback((mediaSize: MediaSize) => {
    console.log("mediaSize", mediaSize);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      onImageChange(e.target.files[0]);
      setImageUrl(URL.createObjectURL(e.target.files[0]));
      setShowCropper(true);
    }
  };

  const handleCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleCropConfirm = async () => {
    if (imageUrl && croppedAreaPixels) {
      const croppedImage = await getCroppedImg(imageUrl, croppedAreaPixels);
      setCroppedImageUrl(URL.createObjectURL(croppedImage));
      onCrop(croppedImage);
      setShowCropper(false);
    } else {
      toast.error("Please select an image and crop it.");
    }
  };

  const getCroppedImg = async (
    imageSrc: string,
    pixelCrop: Area
  ): Promise<File> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      return new File([], "cropped_image.jpeg");
    }

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(
            new File([blob], "cropped_image.jpeg", { type: "image/jpeg" })
          );
        } else {
          reject(new Error("Failed to convert canvas to blob."));
        }
      }, "image/jpeg");
    });
  };

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (error) => reject(error));
      image.src = url;
    });

  useEffect(() => {
    if (resetImageUploadField) {
      // Reset the image-related states
      setImageUrl(null);
      setCroppedAreaPixels(null);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setShowCropper(false);
      setCroppedImageUrl(null);

      // Notify parent component that image has been cleared
      onImageChange(null);
    }
  }, [resetImageUploadField, onImageChange]);

  return (
    <div className="block border-t border-b py-2 border-gray-400">
      <p className="mb-3">Imagen:</p>
      <p>(Zoom con scroll)</p>
      <input
        type="file"
        onChange={handleFileChange}
        className="block w-full mb-5"
        accept="image/*"
        disabled={disabled}
      />
      {showCropper && imageUrl && (
        <div>
          <div className="cropper-container">
            <Cropper
              image={imageUrl}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={handleCropComplete}
              onMediaLoaded={onImageLoaded}
            />
          </div>

          <div className="cropper-controls">
            <div
              className={`bg-blue-800 text-white p-1 rounded ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
              onClick={disabled ? undefined : handleCropConfirm}
            >
              Confirm
            </div>
            <div
              className={`bg-red-800 text-white p-1 rounded ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
              onClick={disabled ? undefined : () => setShowCropper(false)}
            >
              Cancel
            </div>
          </div>
        </div>
      )}
      {croppedImageUrl && (
        <div className="cropped-image-preview">
          <h4>Cropped Image:</h4>
          <img src={croppedImageUrl} alt="Cropped" />
        </div>
      )}
    </div>
  );
};

export default ImageUploadField;
