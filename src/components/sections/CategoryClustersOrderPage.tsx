import React, { useState, useEffect } from "react";
import {
  getAllCategoryClusters,
  updateCategoryClusterOrder,
} from "@/services/categoryClusters";
import { CategoryCluster } from "@/types/categoryCluster";
import { useRestaurant } from "@/hooks/useRestaurant";
import { toast } from "react-toastify";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  DroppableProvided,
  DraggableProvided,
  //   DraggableStateSnapshot,
} from "react-beautiful-dnd";
import Button from "../common/Button";

const CategoryClustersOrderPage: React.FC = () => {
  const [categoryClusters, setCategoryClusters] = useState<CategoryCluster[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [reordered, setReordered] = useState<boolean>(false);
  const { restaurant } = useRestaurant();

  const fetchCategoryClusters = async (): Promise<void> => {
    if (!restaurant) return;
    try {
      setLoading(true);
      const data = await getAllCategoryClusters(restaurant.slug);
      setCategoryClusters(data);
    } catch (error) {
      toast.error("Error fetching category clusters");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryClusters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restaurant]);

  const handleOnDragEnd = (result: DropResult): void => {
    if (!result.destination) return;
    const reorderedClusters = Array.from(categoryClusters);
    const [movedCluster] = reorderedClusters.splice(result.source.index, 1);
    reorderedClusters.splice(result.destination.index, 0, movedCluster);
    setCategoryClusters(reorderedClusters);
    setReordered(true);
  };

  const saveOrder = async (): Promise<void> => {
    if (!restaurant || !reordered) return;
    try {
      setLoading(true);
      await updateCategoryClusterOrder(
        restaurant.slug,
        categoryClusters.map((cluster) => cluster.id)
      );
      toast.success("Orden guardado");
      setReordered(false);
    } catch (error) {
      toast.error("Error updating order");
    } finally {
      setLoading(false);
    }
  };

  if (!restaurant) return null;

  return (
    <div className="py-10">
      <div className="mb-10">
        <a
          href="/category-clusters"
          className="bg-purple-800 text-white rounded-full px-4 py-2 mb-5"
        >
          Volver atrás
        </a>
      </div>
      <h1 className="text-xl font-bold mb-4">Manage Category Cluster Order</h1>
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
                {categoryClusters.map((categoryCluster, index) => (
                  <Draggable
                    key={categoryCluster.id}
                    draggableId={categoryCluster.id.toString()}
                    index={index}
                  >
                    {(
                      provided: DraggableProvided
                      //   snapshot: DraggableStateSnapshot
                    ) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm !mb-2"
                        // style={{
                        //   marginBottom: "8px",
                        // }}
                      >
                        {categoryCluster.name}
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

export default CategoryClustersOrderPage;
