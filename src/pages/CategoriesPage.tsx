import React, { useState } from "react";
import { getAllCategories, addCategory } from "@/services/categories";
import { Category } from "@/types/category";
import { useRestaurant } from "@/hooks/useRestaurant";
import Drawer from "../components/common/Drawer";
import EditCategoryForm from "../components/specifics/categories/EditCategoryForm";
import { useCategories } from "@/hooks/useCategories";
import Button from "../components/common/Button";
import clsx from "clsx";

const CategoriesPage = () => {
  const [error, setError] = useState<string | null>(null);
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [newCategoryName, setNewCategoryName] = useState<string>("");
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const { restaurant } = useRestaurant();
  const { categories, fetchCategories } = useCategories();

  const handleEditClick = (category: Category) => {
    setEditCategory(category);
    setIsDrawerOpen(true);
  };

  if (!restaurant) return;

  const handleAddCategory = async () => {
    setIsSubmitting(true);
    if (newCategoryName.trim()) {
      try {
        await addCategory({
          name: newCategoryName,
          restaurantSlug: restaurant.slug,
        });
        setNewCategoryName("");
        await getAllCategories(restaurant.slug);
        fetchCategories();
      } catch (err) {
        setError("Error adding category");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddCategory();
    }
  };

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="py-10">
      <div className="bg-white rounded-full flex border px-4 py-2 mb-5">
        <section className="flex justify-between items-center w-full">
          <div className="flex gap-3 h-full">
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Category name"
              className="bg-gray-200 h-full rounded-full px-3"
            />

            <Button
              text="Añadir categoría"
              className="bg-green-700 text-white p-2 rounded-full"
              onClick={handleAddCategory}
              isLoading={isSubmitting}
            />
          </div>

          <div>
            <a
              href="/categories/order"
              className="bg-purple-800 text-white rounded-full px-4 py-2 "
            >
              Cambiar orden
            </a>
          </div>
        </section>
      </div>

      <p className="mb-4">Categorías:</p>
      <ul className="grid gap-3 grid-cols-4">
        {categories.length > 0 ? (
          categories.map((category) => (
            <li key={category.id}>
              <div
                className={clsx(
                  "flex bg-white p-3 px-4 w-full rounded-xl justify-between items-center gap-4",
                  "border border-transparent",
                  "hover:border-gray-400",
                  "transition-all duration-300 ease-in-out cursor-pointer"
                )}
                onClick={() => handleEditClick(category)}
              >
                <span>{category.name}</span>
              </div>
            </li>
          ))
        ) : (
          <p>No categories found</p>
        )}
      </ul>

      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
        {editCategory && (
          <EditCategoryForm
            category={editCategory}
            onClose={() => setIsDrawerOpen(false)}
            onSuccess={fetchCategories}
          />
        )}
      </Drawer>
    </div>
  );
};

export default CategoriesPage;
