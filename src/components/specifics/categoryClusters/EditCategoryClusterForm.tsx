import React, { useState, useEffect } from "react";
import Select, { MultiValue } from "react-select";
import {
  deleteCategoryCluster,
  updateCategoryCluster,
} from "@/services/categoryClusters";
import { CategoryCluster } from "@/types/categoryCluster";
import { useCategories } from "@/hooks/useCategories";
import { useRestaurant } from "@/hooks/useRestaurant";
import { toast } from "react-toastify";
import Button from "@/components/common/Button";
import ClusterImageUploadField from "@/components/specifics/categoryClusters/ClusterImageUploadField";

interface EditCategoryClusterFormProps {
  categoryCluster: CategoryCluster;
  onSuccess: () => void;
}

interface CategoryOption {
  value: number;
  label: string;
}

const EditCategoryClusterForm: React.FC<EditCategoryClusterFormProps> = ({
  categoryCluster,
  onSuccess,
}) => {
  const [name, setName] = useState(categoryCluster.name);
  const [selectedCategories, setSelectedCategories] = useState<
    CategoryOption[]
  >([]);
  const [image, setImage] = useState<File | null>(null);
  const [croppedImage, setCroppedImage] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { restaurant } = useRestaurant();
  const { categories } = useCategories();

  useEffect(() => {
    const categoryOptions = categories.map((category) => ({
      value: category.id,
      label: category.name,
    }));

    const currentCategories = categoryOptions.filter((option) =>
      categoryCluster.categories.includes(option.value)
    );

    setSelectedCategories(currentCategories);
  }, [categoryCluster, categories]);

  const handleCategoryChange = (newValue: MultiValue<CategoryOption>) => {
    setSelectedCategories(newValue as CategoryOption[]);
  };

  const handleImageChange = (file: File | null) => {
    setImage(file);
  };

  const handleCrop = (croppedImage: File) => {
    setCroppedImage(croppedImage);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!restaurant) {
      toast.error("No restaurant");
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("name", name);
      selectedCategories.forEach((category) => {
        formData.append("categories", String(category.value));
      });
      if (croppedImage) {
        formData.append("image", croppedImage, "cropped.jpeg");
      } else if (image) {
        formData.append("image", image);
      }

      await updateCategoryCluster(
        categoryCluster.id,
        formData,
        restaurant.slug
      );
      onSuccess();
      toast.success("Categoría actualizada");
    } catch (err) {
      setError("Error updating category cluster");
      toast.error("Error editando el CategoryCluster");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (categoryClusterId: number) => {
    if (!restaurant) return;
    try {
      await deleteCategoryCluster(categoryClusterId, restaurant.slug);
      onSuccess();
    } catch (err) {
      setError("Error deleting category cluster");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <h2 className="font-bold">Edit Category Cluster</h2>
      {error && <p>{error}</p>}
      <div>
        <label>
          <p>Name:</p>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-gray-100 border-gray-200 focus:outline-none h-8 text-lg px-3"
          />
        </label>
      </div>
      <div>
        <label>
          Categories:
          <Select
            isMulti
            options={categories.map((category) => ({
              value: category.id,
              label: category.name,
            }))}
            value={selectedCategories}
            onChange={handleCategoryChange}
          />
        </label>
      </div>
      <ClusterImageUploadField
        image={image}
        onImageChange={handleImageChange}
        onCrop={handleCrop}
      />
      <Button
        text="Guardar"
        className="bg-green-800 text-white py-2 px-3 rounded mt-4"
        isLoading={isSubmitting}
      />
      <div className="bg-red-100 p-3 rounded grid gap-3 mt-10">
        <p className="text-red-800">Danger Zone</p>
        <button
          className="bg-red-800 text-white p-1 w-fit rounded px-3"
          onClick={() => handleDelete(categoryCluster.id)}
        >
          Delete
        </button>
      </div>
    </form>
  );
};

export default EditCategoryClusterForm;
