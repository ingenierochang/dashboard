import Drawer from "@/components/common/Drawer";
import EditProductForm from "./EditProductForm";
import React, { useState } from "react";
import { Product } from "@/types/products";
import ActiveStatusBadge from "./ActiveStatusBadge";
import NoDataBadge from "@/components/common/NoDataBadge";
import Button from "@/components/common/Button";
import { duplicateProduct, updateProduct } from "@/services/products";
import { useRestaurant } from "@/hooks/useRestaurant";
import { toast } from "react-toastify";
import ProductPriceCell from "./ProductPriceCell";

type ProductRowProps = {
  product: Product;
  onUpdate: () => void;
};

const ProductRow = ({ product, onUpdate }: ProductRowProps) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [cloningProduct, setCloningProduct] = useState(false);

  const handleEditProduct = () => setIsDrawerOpen(true);
  const handleCloseDrawer = () => setIsDrawerOpen(false);

  const { restaurant } = useRestaurant();

  const handleDuplicateProduct = async (productId: number) => {
    setCloningProduct(true);

    if (!restaurant) {
      console.log("error: no restaurant");
      return;
    }

    try {
      const newProduct = await duplicateProduct(productId, restaurant.slug);

      console.log("Duplicated product:", newProduct);
      onUpdate();
      toast.success("Producto duplicado");
    } catch (error) {
      console.error("Error duplicating product:", error);
      toast.error("Error inesperado");
    } finally {
      setCloningProduct(false);
    }
  };

  const handleToggleActive = async () => {
    if (!restaurant) {
      console.log("error: no restaurant");
      return;
    }

    const formData = new FormData();
    formData.append("active", (!product.active).toString());

    try {
      await updateProduct(product.id, formData, restaurant.slug);
      onUpdate();
      toast.success(
        product.active ? "Producto desactivado" : "Producto activado"
      );
    } catch (error) {
      console.error("Error updating product status:", error);
      toast.error("Error al actualizar el estado del producto");
    }
  };

  return (
    <>
      <tr
        key={product.id}
        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
      >
        <td className="px-6 py-4">
          <div className="h-10 w-10 aspect-square">
            {product.thumbnail_image && (
              <img
                className="h-full w-full object-cover"
                src={product.thumbnail_image}
                alt=""
              />
            )}
          </div>
        </td>
        <th
          scope="row"
          className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
        >
          {product.name}
        </th>
        <td className="px-6 py-4">
          <div onClick={handleToggleActive} className="cursor-pointer">
            <ActiveStatusBadge active={product.active} />
          </div>
        </td>
        <td className="px-6 py-4">
          {product.category_name ? product.category_name : <NoDataBadge />}
        </td>
        <td className="px-6 py-4">
          <ProductPriceCell product={product} />
        </td>
        <td onClick={handleEditProduct} className="px-6 py-4 ">
          <div>
            <p className="text-blue-600 underline cursor-pointer">Edit</p>
            <Drawer isOpen={isDrawerOpen} onClose={handleCloseDrawer}>
              <EditProductForm
                product={product}
                onSuccess={() => {
                  handleCloseDrawer();
                  onUpdate();
                }}
              />
            </Drawer>
          </div>
        </td>
        <td className="px-6 py-4">
          <div>
            <Button
              onClick={() => handleDuplicateProduct(product.id)}
              text="Duplicar"
              className="bg-blue-400 !w-fit px-3"
              isLoading={cloningProduct}
            />
          </div>
        </td>
      </tr>
    </>
  );
};

export default ProductRow;
