import React, { useState, useEffect } from "react";
import { Restaurant } from "@/types/restaurant";
import LogoImageUploadField from "./LogoImageUploadField";

interface GeneralSectionProps {
  formData: Partial<Restaurant>;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onLogoImageChange: (file: File) => void;
}

const GeneralSection: React.FC<GeneralSectionProps> = ({
  formData,
  onChange,
  onLogoImageChange,
}) => {
  const [logoPreview, setLogoPreview] = useState<string | null>(
    formData.logo_image || null
  );

  useEffect(() => {
    setLogoPreview(formData.logo_image || null);
  }, [formData.logo_image]);

  const handleLogoImageChange = (file: File | null) => {
    if (file) {
      onLogoImageChange(file);

      const fileReader = new FileReader();
      fileReader.onloadend = () => {
        setLogoPreview(fileReader.result as string);
      };
      fileReader.readAsDataURL(file);
    }
  };

  const handleCrop = (croppedImage: File) => {
    onLogoImageChange(croppedImage);
    const fileReader = new FileReader();
    fileReader.onloadend = () => {
      setLogoPreview(fileReader.result as string);
    };
    fileReader.readAsDataURL(croppedImage);
  };

  return (
    <section className="bg-white rounded-lg border border-gray-300 p-3">
      <h3 className="font-bold mb-3">General</h3>
      <label className="block mb-2">
        <p className="text-sm mb-1">Nombre</p>
        <input
          type="text"
          name="name"
          value={formData.name || ""}
          onChange={onChange}
          className="bg-gray-100 p-1 rounded border border-gray-300"
        />
      </label>
      <br />
      <label className="block mb-2">
        <p className="text-sm mb-1">Slogan</p>
        <input
          type="text"
          name="slogan"
          value={formData.slogan || ""}
          onChange={onChange}
          className="bg-gray-100 p-1 rounded border border-gray-300"
        />
      </label>
      <br />
      <label className="block mb-2">
        <p className="text-sm mb-1">Descripción</p>
        <textarea
          name="description"
          value={formData.description || ""}
          onChange={onChange}
          className="bg-gray-100 p-1 rounded border border-gray-300 w-[25rem] h-[10rem]"
        />
      </label>
      <br />
      <label className="block mb-2">
        <p className="text-sm mb-1">Dirección</p>
        <input
          type="text"
          name="address"
          value={formData.address || ""}
          onChange={onChange}
          className="bg-gray-100 p-1 rounded border border-gray-300"
        />
      </label>
      <br />
      <label className="block mb-2">
        <p className="text-sm mb-1">Link embed google maps</p>
        <input
          type="text"
          name="address_url"
          value={formData.address_url || ""}
          onChange={onChange}
          className="bg-gray-100 p-1 rounded border border-gray-300"
        />
      </label>
      <br />
      <div className="mb-4">
        <p className="text-sm mb-1">Logo</p>
        <LogoImageUploadField
          image={logoPreview ? new File([logoPreview], "logo.jpg") : null}
          onImageChange={(file) => handleLogoImageChange(file)}
          onCrop={handleCrop}
        />
      </div>
    </section>
  );
};

export default GeneralSection;
