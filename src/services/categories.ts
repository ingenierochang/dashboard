import client from "@/api";
import { Category } from "@/types/category";

export async function getAllCategories(
  restaurantSlug: string,
  ascending: boolean = true
) {
  try {
    const response = await client.get(
      `/restaurants/${restaurantSlug}/categories/`,
      {
        params: {
          ordering: ascending ? "id" : "-id",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
}

export async function updateCategory(
  categoryId: number,
  updates: Partial<Category>,
  restaurantSlug: string
) {
  try {
    const response = await client.patch(
      `/restaurants/${restaurantSlug}/categories/${categoryId}/`,
      updates
    );
    return response.data;
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
}

export async function addCategory(newCategory: {
  name: string;
  restaurantSlug: string;
}) {
  try {
    const response = await client.post(
      `/restaurants/${newCategory.restaurantSlug}/categories/`,
      {
        name: newCategory.name,
        restaurant_id: newCategory.restaurantSlug,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding category:", error);
    throw error;
  }
}

export async function deleteCategory(
  categoryId: number,
  restaurantSlug: string
) {
  try {
    const response = await client.delete(
      `/restaurants/${restaurantSlug}/categories/${categoryId}/`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
}

export const updateCategoryOrder = async (
  restaurantSlug: string,
  orderData: number[]
) => {
  try {
    const response = await client.put(
      `/restaurants/${restaurantSlug}/categories/order/`,
      {
        order: orderData,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating category order:", error);
    throw error;
  }
};
