import React, { useState } from "react";
import { SketchPicker, ColorResult } from "react-color";
import { useRestaurant } from "@/hooks/useRestaurant";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS
import client from "@/api";

// Define types for the restaurant object and color
interface Restaurant {
  slug: string;
  main_color: string; // Assuming main_color exists in the restaurant object
}

interface UseRestaurantReturn {
  restaurant: Restaurant | null;
}

function StyleSection() {
  const { restaurant } = useRestaurant() as UseRestaurantReturn; // Ensure proper typing for useRestaurant

  // Initialize state with restaurant's main color
  const [mainColor, setMainColor] = useState<string>(
    restaurant?.main_color || "#ffffff"
  ); // Default color if none is provided

  // Handle color change
  const handleColorChange = (color: ColorResult) => {
    setMainColor(color.hex);
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (restaurant?.slug) {
      try {
        await client.patch(
          `/restaurants/${restaurant.slug}/update-main-color/`,
          {
            new_color_hex: mainColor,
          }
        );
        toast.success("Color cambiado"); // Success message
      } catch (error) {
        console.error("Error updating color", error);
        toast.error("Hubo un error desconocido"); // Error message
      }
    }
  };

  return (
    <section className="bg-white rounded-lg border border-gray-300 p-3">
      <h3 className="font-bold mb-3">General</h3>

      <label className="block mb-2">
        <p className="text-sm mb-1">Main Color</p>
        <div className="flex items-center">
          <SketchPicker
            color={mainColor}
            onChangeComplete={handleColorChange}
            className="w-48" // Adjust size as needed
          />
        </div>
      </label>

      <button
        onClick={handleSubmit}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Save Color
      </button>
    </section>
  );
}

export default StyleSection;
