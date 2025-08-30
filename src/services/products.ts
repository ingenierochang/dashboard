import client from "@/api";

export async function getAllProducts(
  restaurantSlug: string,
  ascending: boolean = true
) {
  try {
    const response = await client.get(
      `/restaurants/${restaurantSlug}/products/`,
      {
        params: {
          ordering: ascending ? "id" : "-id",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}

export async function updateProduct(
  productId: number,
  updates: FormData,
  restaurantSlug: string
) {
  try {
    const response = await client.patch(
      `/restaurants/${restaurantSlug}/products/${productId}/`,
      updates,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
}

export async function addProduct(newProduct: FormData, restaurantSlug: string) {
  try {
    const response = await client.post(
      `/restaurants/${restaurantSlug}/products/`,
      newProduct,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding product:", error);
    throw error;
  }
}

export async function deleteProduct(productId: number, restaurantSlug: string) {
  try {
    const response = await client.delete(
      `/restaurants/${restaurantSlug}/products/${productId}/`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
}

export async function getProductDetails(
  productId: number,
  restaurantSlug: string
) {
  try {
    const response = await client.get(
      `/restaurants/${restaurantSlug}/products/${productId}/`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching product details:", error);
    throw error;
  }
}

export const getProductsCategories = async (restaurantSlug: string) => {
  const response = await client.get(
    `/restaurants/${restaurantSlug}/products/products-categories/`
  );
  return response.data;
};

export const updateProductsOrder = async (
  restaurantSlug: string,
  categorySlug: string,
  order: number[]
) => {
  const response = await client.put(
    `/restaurants/${restaurantSlug}/categories/${categorySlug}/update-products-order/`,
    { order }
  );
  return response.data;
};

export async function duplicateProduct(
  productId: number,
  restaurantSlug: string
) {
  try {
    const response = await client.post(
      `/restaurants/${restaurantSlug}/products/${productId}/duplicate-product/`
    );
    return response.data;
  } catch (error) {
    console.error("Error duplicating product:", error);
    throw error;
  }
}
