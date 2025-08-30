import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import client from "@/api";
import { useRestaurant } from "@/hooks/useRestaurant";
import { BannerImageBackend } from "@/types/restaurant";
import { toast } from "react-toastify";
import Cropper from "react-easy-crop";
import Modal from "react-modal";
import { Area } from "react-easy-crop";

type BannerImageType = File | null;

interface BannerImageUploadProps {
  restaurantSlug: string;
}

const BannerImageUpload: React.FC<BannerImageUploadProps> = ({
  restaurantSlug,
}) => {
  const [bannerImages, setBannerImages] = useState<BannerImageType[]>([
    null,
    null,
    null,
    null,
  ]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([
    "",
    "",
    "",
    "",
  ]);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const { restaurant, fetchRestaurant } = useRestaurant();

  // Cropper state
  const [cropperOpen, setCropperOpen] = useState(false);
  const [activeCropIndex, setActiveCropIndex] = useState<number | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  useEffect(() => {
    if (restaurant && restaurant.banner_images) {
      const initialImages = restaurant.banner_images.map(
        (img: BannerImageBackend) => img.image
      );
      setImagePreviews(initialImages);
    }
  }, [restaurant]);

  const handleBannerImageChange =
    (index: number) => (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        const fileReader = new FileReader();
        fileReader.onloadend = () => {
          setActiveCropIndex(index);
          setCropperOpen(true);
          setImagePreviews((prev) => {
            const newPreviews = [...prev];
            newPreviews[index] = fileReader.result as string;
            return newPreviews;
          });
        };
        fileReader.readAsDataURL(file);
      }
    };

  const handleCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };
  const handleCropConfirm = async () => {
    if (activeCropIndex === null || !croppedAreaPixels) return;

    const croppedImage = await getCroppedImg(
      imagePreviews[activeCropIndex],
      croppedAreaPixels
    );

    setImagePreviews((prev) => {
      const newPreviews = [...prev];
      newPreviews[activeCropIndex] = croppedImage;
      return newPreviews;
    });

    // Convert base64 to file
    const file = await fetch(croppedImage).then((res) => res.blob());
    setBannerImages((prev) => {
      const newImages = [...prev];
      newImages[activeCropIndex] = new File([file], "cropped_image.jpg", {
        type: "image/jpeg",
      });
      return newImages;
    });

    setCropperOpen(false);
    setActiveCropIndex(null);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setUploading(true);

    const formData = new FormData();
    bannerImages.forEach((image, index) => {
      if (image) {
        formData.append(`images_${index}`, image);
      }
    });

    try {
      await client.post(
        `/restaurants/${restaurantSlug}/upload-banner-images/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      await fetchRestaurant();
      setBannerImages([null, null, null, null]);
      setImagePreviews(["", "", "", ""]);
    } catch (error) {
      console.error("Error uploading banner images:", error);
      setError("An error occurred while uploading the banner images.");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (imageId: number) => {
    try {
      await client.post(`/restaurants/${restaurantSlug}/delete-banner-image/`, {
        image_id: imageId,
      });

      await fetchRestaurant();
    } catch (error) {
      console.error("Error deleting banner image:", error);
      setError("An error occurred while deleting the banner image.");
    }
  };

  return (
    <div>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4 mb-4">
          {[0, 1, 2, 3].map((index) => (
            <div
              key={index}
              className="relative flex items-center justify-center"
            >
              <label
                htmlFor={`dropzone-file-${index}`}
                className={`flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 dark:border-gray-600 ${
                  imagePreviews[index]
                    ? "bg-cover bg-center"
                    : "bg-gray-100 dark:bg-gray-600"
                }`}
                style={{
                  backgroundImage: imagePreviews[index]
                    ? `url(${imagePreviews[index]})`
                    : undefined,
                }}
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {!imagePreviews[index] && (
                    <>
                      <svg
                        className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 16"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                        />
                      </svg>
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">Click to upload</span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        SVG, PNG, JPG or GIF (MAX. 800x400px)
                      </p>
                    </>
                  )}
                </div>
                <input
                  id={`dropzone-file-${index}`}
                  type="file"
                  accept="image/*"
                  onChange={handleBannerImageChange(index)}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
              {imagePreviews[index] && (
                <button
                  type="button"
                  onClick={() => {
                    if (restaurant && restaurant.banner_images)
                      handleDeleteImage(restaurant.banner_images[index]?.id);
                    else
                      toast.error(
                        "@handleDeleteImage !restaurant || !restaurant.banner_images"
                      );
                  }}
                  className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                >
                  X
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="submit"
          className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 disabled:bg-gray-400"
          disabled={uploading}
        >
          {uploading ? "Subiendo..." : "Subir banners"}
        </button>
      </form>

      <Modal
        isOpen={cropperOpen}
        onRequestClose={() => setCropperOpen(false)}
        contentLabel="Image Cropper"
        className="modal"
        overlayClassName="modal-overlay"
      >
        {activeCropIndex !== null && (
          <div className="cropper-wrapper">
            <p>(Zoom con scroll)</p>

            <div className="cropper-container">
              <Cropper
                image={imagePreviews[activeCropIndex]}
                crop={crop}
                zoom={zoom}
                aspect={3 / 1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={handleCropComplete}
              />
            </div>
            <div className="cropper-controls">
              <button onClick={handleCropConfirm}>Confirm</button>
              <button onClick={() => setCropperOpen(false)}>Cancel</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BannerImageUpload;

// Helper function to get cropped image
const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.src = url;
  });

const getCroppedImg = async (
  imageSrc: string,
  pixelCrop: { width: number; height: number; x: number; y: number }
): Promise<string> => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return "";
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

  return canvas.toDataURL("image/jpeg");
};
