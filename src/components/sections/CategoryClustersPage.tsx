import React, { useState, useEffect } from "react";
import {
  getAllCategoryClusters,
  addCategoryCluster,
} from "@/services/categoryClusters";
import { CategoryCluster } from "@/types/categoryCluster";
import Drawer from "../common/Drawer";
import EditCategoryClusterForm from "../specifics/categoryClusters/EditCategoryClusterForm";
import { useRestaurant } from "@/hooks/useRestaurant";
import { toast } from "react-toastify";
import Button from "../common/Button";

const CategoryClustersPage = () => {
  const [categoryClusters, setCategoryClusters] = useState<CategoryCluster[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [newCategoryClusterName, setNewCategoryClusterName] =
    useState<string>("");
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [selectedCategoryCluster, setSelectedCategoryCluster] =
    useState<CategoryCluster | null>(null);

  const { restaurant } = useRestaurant();

  const fetchCategoryClusters = async () => {
    if (!restaurant) {
      toast.error("No restaurant found");
      return;
    }

    try {
      setLoading(true);
      const data = await getAllCategoryClusters(restaurant.slug);
      if (data) {
        setCategoryClusters(data as CategoryCluster[]);
      }
    } catch (err) {
      toast.error("Error fetching category clusters");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryClusters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restaurant]);

  if (!restaurant) return null;

  const handleEditClick = (categoryCluster: CategoryCluster) => {
    setSelectedCategoryCluster(categoryCluster);
    setIsDrawerOpen(true);
  };

  const handleAddCategoryCluster = async () => {
    if (newCategoryClusterName.trim() && restaurant) {
      setLoading(true);
      try {
        await addCategoryCluster({
          name: newCategoryClusterName,
          restaurantSlug: restaurant.slug,
        });
        setNewCategoryClusterName("");
        const updatedCategoryClusters = await getAllCategoryClusters(
          restaurant.slug
        );
        setCategoryClusters(updatedCategoryClusters as CategoryCluster[]);
      } catch (err) {
        toast.error("Error adding category cluster");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedCategoryCluster(null);
  };

  return (
    <>
      <div className="py-10">
        <div className="bg-white rounded-full border border-gray-200 p-2 px-4 w-full mb-4">
          <div className="flex justify-between items-center">
            <section className="flex gap-3">
              <input
                type="text"
                value={newCategoryClusterName}
                onChange={(e) => setNewCategoryClusterName(e.target.value)}
                placeholder="Category Cluster name"
                className="bg-gray-200 rounded-full p-2"
              />

              <Button
                text="Añadir Nuevo"
                className="bg-green-700 text-white rounded-full px-4 !w-fit"
                onClick={handleAddCategoryCluster}
                isLoading={loading}
              />
            </section>

            <div>
              <a
                href="/category-clusters/order"
                className="bg-purple-800 text-white rounded-full px-4 py-2 "
              >
                Cambiar orden
              </a>
            </div>
          </div>
        </div>

        <p className="font-bold mb-4">Category Clusters:</p>
        <ul className="grid grid-cols-3 gap-3">
          {categoryClusters.length > 0 ? (
            categoryClusters.map((categoryCluster) => (
              <li key={categoryCluster.id}>
                <div
                  onClick={() => handleEditClick(categoryCluster)}
                  className="bg-white p-3 rounded-xl border border-transparent hover:border-gray-400 cursor-pointer h-[10rem]"
                >
                  {categoryCluster.image && (
                    <img
                      src={categoryCluster.image || "/placeholder-image.jpg"}
                      alt={categoryCluster.name}
                      className="w-full h-20 object-cover rounded-md mb-2"
                    />
                  )}
                  {categoryCluster.name}
                </div>
              </li>
            ))
          ) : (
            <p>No category clusters found</p>
          )}
        </ul>
      </div>

      <Drawer isOpen={isDrawerOpen} onClose={handleCloseDrawer}>
        {selectedCategoryCluster && (
          <EditCategoryClusterForm
            categoryCluster={selectedCategoryCluster}
            onSuccess={() => {
              handleCloseDrawer();
              fetchCategoryClusters();
            }}
          />
        )}
      </Drawer>
    </>
  );
};

export default CategoryClustersPage;
