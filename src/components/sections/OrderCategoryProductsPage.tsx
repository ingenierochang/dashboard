// ORDER THE PRODUCTS IN A CATEGORY

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import {
  getProductsCategories,
  updateProductsOrder,
} from "@/services/products";
import { useRestaurant } from "@/hooks/useRestaurant";
import { toast } from "react-toastify";
import slugify from "slugify";

interface Product {
  id: number;
  name: string;
  // Add other product properties as needed
}

interface CategoryProducts {
  [key: string]: Product[];
}

const OrderCategoryProducts: React.FC = () => {
  const { category: categorySlug } = useParams<{ category: string }>();
  const { restaurant } = useRestaurant();
  const [products, setProducts] = useState<Product[]>([]);
  //   const [originalOrder, setOriginalOrder] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      if (restaurant?.slug && categorySlug) {
        try {
          const categories: CategoryProducts = await getProductsCategories(
            restaurant.slug
          );
          const categoryName = Object.keys(categories).find(
            (cat) => slugify(cat, { lower: true }) === categorySlug
          );
          if (categoryName) {
            setProducts(categories[categoryName]);
            // setOriginalOrder(categories[categoryName]);
          }
        } catch (err) {
          toast.error("Failed to load products. Please try again later.");
        }
      }
    };

    fetchProducts();
  }, [restaurant, categorySlug]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(products);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setProducts(items);
  };

  const handleSaveOrder = async () => {
    if (!restaurant?.slug || !categorySlug) return;

    try {
      await updateProductsOrder(
        restaurant.slug,
        categorySlug,
        products.map((item) => item.id)
      );
      toast.success("Orden guardado");
      //   setOriginalOrder(products);
    } catch (err) {
      toast.error("Failed to update product order. Please try again.");
    }
  };

  //   const handleResetOrder = () => {
  //     setProducts(originalOrder);
  //   };

  return (
    <div className="py-10">
      <div className="mb-10">
        <a
          href="/products"
          className="bg-purple-800 text-white rounded-full px-4 py-2 "
        >
          Volver
        </a>
      </div>
      <div>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="products">
            {(provided) => (
              <ul {...provided.droppableProps} ref={provided.innerRef}>
                {products.map((product, index) => (
                  <Draggable
                    key={product.id}
                    draggableId={product.id.toString()}
                    index={index}
                  >
                    {(provided) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="bg-white p-4 mb-2 rounded shadow"
                      >
                        {product.name}
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
        <div className="mt-4 space-x-4">
          <button
            onClick={handleSaveOrder}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Guardar
          </button>
          {/* <button
            onClick={handleResetOrder}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            Reset Order
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default OrderCategoryProducts;
