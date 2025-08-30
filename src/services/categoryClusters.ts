import client from "@/api";
import { CategoryCluster } from "@/types/categoryCluster";

// Fetch all categoryClusters for a specific restaurant, optionally ordering by ID
export async function getAllCategoryClusters(
  restaurantSlug: string,
  ascending: boolean = true
) {
  try {
    const response = await client.get(
      `/restaurants/${restaurantSlug}/category_clusters/`,
      {
        params: {
          ordering: ascending ? "id" : "-id",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching category clusters:", error);
    throw error;
  }
}

export async function updateCategoryCluster(
  categoryClusterId: number,
  updates: FormData,
  restaurantSlug: string
) {
  try {
    const response = await client.patch(
      `/restaurants/${restaurantSlug}/category_clusters/${categoryClusterId}/`,
      updates
    );
    return response.data;
  } catch (error) {
    console.error("Error updating category cluster:", error);
    throw error;
  }
}

// Add a new category cluster to the restaurant
export async function addCategoryCluster(newCategoryCluster: {
  name: string;
  restaurantSlug: string;
}) {
  try {
    const response = await client.post(
      `/restaurants/${newCategoryCluster.restaurantSlug}/category_clusters/`,
      newCategoryCluster
    );
    return response.data;
  } catch (error) {
    console.error("Error adding category cluster:", error);
    throw error;
  }
}

// Delete a category cluster by ID
export async function deleteCategoryCluster(
  categoryClusterId: number,
  restaurantSlug: string
) {
  try {
    const response = await client.delete(
      `/restaurants/${restaurantSlug}/category_clusters/${categoryClusterId}/`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting category cluster:", error);
    throw error;
  }
}

export async function updateCategoryClusterWithCategories(
  categoryClusterId: number,
  categoryClusterUpdates: Partial<CategoryCluster>,
  categoryIds: number[],
  restaurantSlug: string
) {
  try {
    const response = await client.patch(
      `/restaurants/${restaurantSlug}/category_clusters/${categoryClusterId}/`,
      {
        ...categoryClusterUpdates,
        category_ids: categoryIds,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating category cluster with categories:", error);
    throw error;
  }
}

export const updateCategoryClusterOrder = async (
  restaurantSlug: string,
  orderData: number[]
) => {
  try {
    // Use client.get to fetch data with query parameters
    const response = await client.put(
      `/restaurants/${restaurantSlug}/category_clusters/order/`,
      {
        order: orderData, // Send orderData as a query parameter
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating category cluster order:", error);
    throw error;
  }
};
