import React from "react";
import { Product } from "@/types/products";
import { useRestaurant } from "@/hooks/useRestaurant"; // Adjust the path as needed
import { deleteProduct } from "@/services/products";

type DeleteProductCardProps = {
  product: Product;
  onSuccess: () => void;
};

const DeleteProductCard = ({ product, onSuccess }: DeleteProductCardProps) => {
  const { restaurant } = useRestaurant();

  if (!restaurant) return;

  const handleDelete = async () => {
    if (window.confirm(`Seguro que quieres borrar ${product.name}?`)) {
      try {
        await deleteProduct(product.id, restaurant?.slug);
        alert("Producto borrado!");
        // Optionally, you can add additional logic here, like updating the UI or redirecting.
        onSuccess();
      } catch (error) {
        alert("Failed to delete product. Please try again.");
      }
    }
  };

  return (
    <div className="bg-red-100 rounded-md p-4 mt-20">
      <p className="text-lg font-bold">Danger Zone</p>
      {/* <p className="text-gray-700">{product.description}</p> */}
      <button
        onClick={handleDelete}
        className="mt-2 px-4 py-2 bg-red-500 text-white rounded-md"
      >
        Borrar
      </button>
    </div>
  );
};

export default DeleteProductCard;
