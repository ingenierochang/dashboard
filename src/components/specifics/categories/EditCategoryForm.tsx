import React, { useState, useEffect } from "react";
import { updateCategory, deleteCategory } from "@/services/categories";
import { useRestaurant } from "@/hooks/useRestaurant";
import { Category } from "@/types/category";
import { toast } from "react-toastify";

interface EditCategoryFormProps {
  category: Category;
  onClose: () => void;
  onSuccess: () => void;
}

const EditCategoryForm: React.FC<EditCategoryFormProps> = ({
  category,
  onClose,
  onSuccess,
}) => {
  const [name, setName] = useState<string>(category.name);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { restaurant } = useRestaurant();

  useEffect(() => {
    setName(category.name);
  }, [category]);

  const handleSave = async () => {
    if (!restaurant) {
      toast.error("No restaurant");
      return;
    }

    setLoading(true);
    try {
      await updateCategory(category.id, { name }, restaurant.slug);
      onSuccess(); // Notify parent component about successful edit
      onClose(); // Close the drawer after successful edit
    } catch (err) {
      setError("Error updating category");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!restaurant) {
      toast.error("No restaurant");
      return;
    }

    setLoading(true);
    try {
      await deleteCategory(category.id, restaurant?.slug);
      onSuccess(); // Notify parent component about successful delete
      onClose(); // Close the drawer after successful delete
    } catch (err) {
      setError("Error deleting category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Edit Category</h2>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="mb-4">
        <label
          htmlFor="category-name"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Nombre
        </label>
        <input
          id="category-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border border-gray-300 rounded-md p-2 w-full"
        />
      </div>

      <div className="flex gap-4 mb-4 flex justify-end">
        <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-md">
          Cancel
        </button>

        <button
          onClick={handleSave}
          disabled={loading}
          className={`px-4 py-2 text-white rounded-md ${loading ? "bg-gray-500" : "bg-blue-600"}`}
        >
          {loading ? "Guardando..." : "Guardar"}
        </button>
      </div>

      <div className="w-full bg-red-100 p-3 rounded mt-10">
        <p className="text-red-800 font-bold mb-4">Danger Zone</p>

        <button
          onClick={handleDelete}
          disabled={loading}
          className={`px-4 py-2 text-white rounded-md ${loading ? "bg-gray-500" : "bg-red-600"}`}
        >
          {loading ? "Borrando..." : "Borrar"}
        </button>
      </div>
    </div>
  );
};

export default EditCategoryForm;
