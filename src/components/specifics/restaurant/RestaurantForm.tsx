import React, { useState, useEffect, FormEvent } from "react";
import client from "@/api";
import { useRestaurant } from "@/hooks/useRestaurant";
import { Restaurant } from "@/types/restaurant";
import BannerImageUpload from "./BannerImageUpload";
import GeneralSection from "./GeneralSection";
import MoreInfoSection from "./MoreInfoSection";
import SocialMediaSection from "./SocialMediaSection";
import { toast } from "react-toastify";
import Button from "@/components/common/Button";
import { extractIframeSrc } from "@/utils/extractIframeSrc";
import StyleSection from "./StyleSection";

function RestaurantForm() {
  const [formData, setFormData] = useState<Partial<Restaurant>>({});
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("general");
  const [logoImage, setLogoImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { restaurant, updateRestaurant } = useRestaurant();

  useEffect(() => {
    if (restaurant) {
      setFormData({
        name: restaurant.name,
        slogan: restaurant.slogan,
        description: restaurant.description,
        address: restaurant.address,
        address_url: restaurant.address_url,
        whatsapp: restaurant.whatsapp,
        facebook: restaurant.facebook,
        instagram: restaurant.instagram,
        tiktok: restaurant.tiktok,
        open_hours: restaurant.open_hours,
        payment_methods: restaurant.payment_methods,
        parking: restaurant.parking,
        alcohol_patents: restaurant.alcohol_patents,
        website: restaurant.website,
        logo_image: restaurant.logo_image,
      });
    }
  }, [restaurant]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogoImageChange = (file: File) => {
    setLogoImage(file);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!restaurant) return;

    try {
      setIsLoading(true);
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formDataToSend.append(key, value.toString());
        }
      });

      if (formDataToSend.has("address_url")) {
        if (formDataToSend.get("address_url")?.toString().includes("iframe")) {
          const mapsIframeCode = formDataToSend.get("address_url");
          const src = extractIframeSrc(mapsIframeCode as string);

          formDataToSend.delete("address_url");
          formDataToSend.append("address_url", src as string);
        } else {
          formDataToSend.delete("address_url");
        }
      }

      console.log("formData", formData);

      console.log("logoImage", logoImage);

      if (formDataToSend.has("logo_image")) formDataToSend.delete("logo_image");

      if (logoImage && typeof logoImage !== "string")
        formDataToSend.append("logo_image", logoImage);

      const response = await client.patch(
        `/restaurants/${restaurant.slug}/`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        updateRestaurant(response.data);
        toast.success("Cambios guardados");
      } else {
        setError("Failed to update restaurant details. Please try again.");
      }
    } catch (error) {
      console.error("Error updating restaurant details:", error);
      setError("An error occurred while updating the restaurant details.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!restaurant) {
    return <div>Loading...</div>;
  }

  return (
    <div className="py-10">
      {error && <div style={{ color: "red" }}>{error}</div>}
      <nav className="mb-5">
        <ul className="flex space-x-4">
          <li>
            <button
              onClick={() => setActiveTab("general")}
              className={`py-2 px-4 ${activeTab === "general" ? "bg-gray-300" : "bg-gray-100"}`}
            >
              General
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab("social")}
              className={`py-2 px-4 ${activeTab === "social" ? "bg-gray-300" : "bg-gray-100"}`}
            >
              Redes sociales
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab("info")}
              className={`py-2 px-4 ${activeTab === "info" ? "bg-gray-300" : "bg-gray-100"}`}
            >
              Más información
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab("banners")}
              className={`py-2 px-4 ${activeTab === "banners" ? "bg-gray-300" : "bg-gray-100"}`}
            >
              Banners
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab("styles")}
              className={`py-2 px-4 ${activeTab === "styles" ? "bg-gray-300" : "bg-gray-100"}`}
            >
              Estilos
            </button>
          </li>
        </ul>
      </nav>

      <form onSubmit={handleSubmit} className="mb-10">
        {activeTab === "general" && (
          <GeneralSection
            formData={formData}
            onChange={handleChange}
            onLogoImageChange={handleLogoImageChange}
          />
        )}
        {activeTab === "social" && (
          <SocialMediaSection formData={formData} onChange={handleChange} />
        )}
        {activeTab === "info" && (
          <MoreInfoSection formData={formData} onChange={handleChange} />
        )}

        {activeTab !== "banners" && activeTab !== "styles" && (
          <Button
            text="Guardar"
            className="bg-green-700 text-white rounded p-3 mt-10 w-fit px-4 hover:bg-green-800"
            isLoading={isLoading}
          />
        )}
      </form>
      {activeTab === "banners" && (
        <BannerImageUpload restaurantSlug={restaurant?.slug} />
      )}
      {activeTab === "styles" && <StyleSection />}
    </div>
  );
}

export default RestaurantForm;
