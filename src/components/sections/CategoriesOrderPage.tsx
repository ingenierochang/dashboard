import React, { useState, useEffect } from "react";
import { getAllCategories, updateCategoryOrder } from "@/services/categories";
import { Category } from "@/types/category";
import { useRestaurant } from "@/hooks/useRestaurant";
import { toast } from "react-toastify";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  DroppableProvided,
  DraggableProvided,
  // DraggableStateSnapshot,
} from "react-beautiful-dnd";
import Button from "../common/Button";

const CategoriesOrderPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [reordered, setReordered] = useState<boolean>(false);
  const { restaurant } = useRestaurant();

  const fetchCategories = async (): Promise<void> => {
    if (!restaurant) return;
    try {
      setLoading(true);
      const data = await getAllCategories(restaurant.slug);
      setCategories(data);
    } catch (error) {
      toast.error("Error fetching categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restaurant]);

  const handleOnDragEnd = (result: DropResult): void => {
    if (!result.destination) return;
    const reorderedCategories = Array.from(categories);
    const [movedCategory] = reorderedCategories.splice(result.source.index, 1);
    reorderedCategories.splice(result.destination.index, 0, movedCategory);
    setCategories(reorderedCategories);
    setReordered(true);
  };

  const saveOrder = async (): Promise<void> => {
    if (!restaurant || !reordered) return;
    try {
      setLoading(true);
      await updateCategoryOrder(
        restaurant.slug,
        categories.map((category) => category.id)
      );
      toast.success("Orden guardado");
      setReordered(false);
    } catch (error) {
      toast.error("Error updating category order");
    } finally {
      setLoading(false);
    }
  };

  if (!restaurant) return null;

  return (
    <div className="py-10">
      <div className="mb-10">
        <a
          href="/categories"
          className="bg-purple-800 text-white rounded-full px-4 py-2 "
        >
          Volver
        </a>
      </div>
      <h1 className="text-xl font-bold mb-4">Manage Category Order</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="droppable">
            {(provided: DroppableProvided) => (
              <ul
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="space-y-4"
              >
                {categories.map((category, index) => (
                  <Draggable
                    key={category.id}
                    draggableId={category.id.toString()}
                    index={index}
                  >
                    {(
                      provided: DraggableProvided
                      // snapshot: DraggableStateSnapshot
                    ) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
                      >
                        {category.name}
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      )}
      <Button
        text="Guardar"
        className="mt-4 bg-green-700 text-white rounded-full px-4"
        onClick={saveOrder}
        isLoading={loading}
        isDisabled={!reordered}
      />
    </div>
  );
};

export default CategoriesOrderPage;
