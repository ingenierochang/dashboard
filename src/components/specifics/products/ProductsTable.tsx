import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProductRow from "./ProductRow";
import { toast } from "react-toastify";
import { getProductsCategories } from "@/services/products";
import { Product } from "@/types/products";
import { useRestaurant } from "@/hooks/useRestaurant";
import slugify from "slugify";

function ProductsSection() {
  const [productsCategories, setProductsCategories] = useState<{
    [key: string]: Product[];
  }>({});
  const { restaurant } = useRestaurant();

  const fetchProductsCategories = async () => {
    if (restaurant?.slug) {
      try {
        const response = await getProductsCategories(restaurant.slug);
        setProductsCategories(response);
      } catch (err) {
        toast.error("Failed to load products. Please try again later.");
      }
    }
  };

  useEffect(() => {
    fetchProductsCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restaurant]);

  return (
    <main>
      <div className="relative overflow-x-auto">
        {Object.entries(productsCategories).map(([category, products]) => (
          <table
            key={category}
            className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 mb-8"
          >
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th colSpan={7} className="px-6 py-4 bg-stone-200 border">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">{category}</h2>
                    <Link
                      to={`/categories/${slugify(category, { lower: true })}/order-category-products`}
                      className="bg-purple-800 text-white rounded-full px-4 py-2"
                    >
                      Ordenar
                    </Link>
                  </div>
                </th>
              </tr>
              <tr>
                <th scope="col" className="px-6 py-3">
                  Imagen
                </th>
                <th scope="col" className="px-6 py-3">
                  Nombre
                </th>
                <th scope="col" className="px-6 py-3">
                  Status
                </th>
                <th scope="col" className="px-6 py-3">
                  Categoría
                </th>
                <th scope="col" className="px-6 py-3">
                  Precio
                </th>
                <th scope="col" className="px-6 py-3">
                  Editar
                </th>
                <th scope="col" className="px-6 py-3">
                  Duplicar
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <ProductRow
                  key={product.id}
                  product={product}
                  onUpdate={fetchProductsCategories}
                />
              ))}
            </tbody>
          </table>
        ))}
      </div>
    </main>
  );
}

export default ProductsSection;
