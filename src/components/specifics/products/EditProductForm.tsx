import React, { ChangeEvent, useEffect, useState } from "react";
import { Product } from "@/types/products";
import { useRestaurant } from "@/hooks/useRestaurant";
import { useCategories } from "@/hooks/useCategories";
import Select from "react-select";
import { Category } from "@/types/category";
import clsx from "clsx";
import Button from "@/components/common/Button";
import { addProduct, updateProduct } from "@/services/products";
import { toast } from "react-toastify";
import ImageUploadField from "./ImageUploadField";
import DeleteProductCard from "./DeleteProductCard";
import { getDiscountPercentage } from "./utils/getDiscountedPercentage";

const formatCategories = (categories: Category[]) =>
  categories.map((category: Category) => ({
    value: category.id,
    label: category.name,
  }));

type EditProductFormProps = {
  product?: Product;
  onSuccess?: () => void;
};

const EditProductForm: React.FC<EditProductFormProps> = ({
  product,
  onSuccess,
}) => {
  const [name, setName] = useState(product?.name || "");
  const [price, setPrice] = useState(product?.price || undefined);
  const [discountedPrice, setDiscountedPrice] = useState<number | null>(
    product?.discounted_price !== null
      ? Number(product?.discounted_price)
      : null
  );
  const [active, setActive] = useState<boolean>(false);

  useEffect(() => {
    if (product) {
      setActive(product.active);
    }
  }, [product]);

  const [selectedCategoryId, setSelectedCategoryId] = useState<
    number | undefined
  >(product?.category.id || undefined);
  const [description, setDescription] = useState(product?.description || "");
  const [croppedImage, setCroppedImage] = useState<File | null>(null);
  const [resetImageUploadField, setResetImageUploadField] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [categoryError, setCategoryError] = useState<string | null>(null);
  const [deleteImage, setDeleteImage] = useState(false);

  const { restaurant } = useRestaurant();
  const { categories } = useCategories();

  const categoryOptions = formatCategories(categories);

  const handleCrop = (croppedImage: File) => {
    setCroppedImage(croppedImage);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!restaurant || !restaurant.slug) {
      alert("Restaurant data is not available.");
      return;
    }

    if (!name || !selectedCategoryId) {
      if (!selectedCategoryId) {
        setCategoryError("La categoría es obligatoria");
      }
      setIsLoading(false);
      return;
    }

    const formData = new FormData();

    formData.append("name", name);
    if (price) formData.append("price", price.toString());
    if (discountedPrice !== null && discountedPrice >= 0) {
      formData.append("discounted_price", discountedPrice.toString());
    } else {
      formData.append("discounted_price", "");
    }
    if (description) formData.append("description", description);
    formData.append("active", active.toString());
    if (selectedCategoryId)
      formData.append("category", selectedCategoryId.toString());
    formData.append("restaurant", String(restaurant.id));
    if (croppedImage) formData.append("image", croppedImage);

    // Only append delete_image if it's true
    if (deleteImage) {
      formData.append("delete_image", "true");
    }

    try {
      if (product) {
        await updateProduct(product.id, formData, restaurant.slug);
        toast.success("Producto editado");
      } else {
        await addProduct(formData, restaurant.slug);
        toast.success("Producto creado");
        resetForm();
      }

      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setName("");
    setPrice(undefined);
    setDiscountedPrice(null);
    setDiscountPercentage(undefined);
    setActive(true);
    setSelectedCategoryId(undefined);
    setDescription("");
    setCroppedImage(null);
    setResetImageUploadField(true);
  };

  const handleCategoryChange = (
    selectedOption: { value: number; label: string } | null
  ) => {
    setSelectedCategoryId(selectedOption?.value || undefined);
    setCategoryError(null);
  };

  const handlePriceChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    const intValue = value === "" ? 0 : parseInt(value, 10);
    setPrice(intValue);
  };

  const handleDiscountedPriceChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    if (value === "") {
      setDiscountedPrice(null);
    } else {
      const floatValue = parseFloat(value);
      setDiscountedPrice(floatValue >= 0 ? floatValue : null);
    }
  };

  const handleImageChange = () => {
    setCroppedImage(null);
  };

  // display real-time discount when changing
  const [discountPercentage, setDiscountPercentage] = useState<
    number | undefined
  >(undefined);
  useEffect(() => {
    if (price && discountedPrice) {
      const result = getDiscountPercentage(price, discountedPrice);
      setDiscountPercentage(result);
    }
  }, [discountedPrice, price]);

  console.log("active", active);

  return (
    <div className="relative text-gray-800 pb-10">
      <h2 className="text-lg font-semibold">
        {product ? "Editar Producto" : "Añadir Producto"}
      </h2>
      <form onSubmit={handleSubmit} className="grid gap-3">
        <label className="block mt-4">
          Nombre:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="block w-full border shadow-sm bg-gray-100 text-lg h-10 px-2"
            placeholder="Enter product name"
          />
        </label>
        <label className="block mt-4">
          Precio:
          <input
            type="number"
            value={price || ""}
            onChange={handlePriceChange}
            className="block w-full border shadow-sm bg-gray-100 text-lg h-10 px-2"
            placeholder="Enter product price"
          />
        </label>
        <label className="block mt-4">
          <div className="flex justify-between items-center mb-2">
            <p>Precio con descuento:</p>

            {discountPercentage && (
              <div className="bg-orange-400 text-white px-1 rounded">
                <p>{discountPercentage}%</p>
              </div>
            )}
          </div>
          <input
            type="number"
            value={discountedPrice !== null ? discountedPrice : ""}
            onChange={handleDiscountedPriceChange}
            min="0"
            step="0.01"
            className="block w-full border shadow-sm bg-gray-100 text-lg h-10 px-2"
            placeholder="Enter discounted price"
          />
          <p className="text-sm text-gray-500 mt-1">
            (Solo si tu producto tiene descuento)
          </p>
        </label>

        <label className="block mt-4">
          Categoría:
          <Select
            value={
              categoryOptions.find(
                (option) => option.value === selectedCategoryId
              ) || null
            }
            onChange={handleCategoryChange}
            options={categoryOptions}
            placeholder="Select a category"
            className="mt-1"
          />
          {categoryError && (
            <p className="text-red-500 text-sm mt-1">{categoryError}</p>
          )}
        </label>
        <label className="block mt-4">
          Activo:
          <input
            type="checkbox"
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
            className="ml-2"
          />
        </label>

        <ImageUploadField
          onImageChange={handleImageChange}
          onCrop={handleCrop}
          resetImageUploadField={resetImageUploadField}
        />

        {product && product.detail_image && !deleteImage && (
          <div className="mt-4 relative" style={{ width: "fit-content" }}>
            <img
              src={product.detail_image}
              alt={product.name}
              className="w-48 h-48 object-cover"
            />
            <button
              type="button"
              onClick={() => setDeleteImage(true)}
              className="absolute top-2 right-2 bg-red-200 p-1 rounded-full w-6 h-6 flex items-center justify-center"
              style={{ transform: "translate(50%, -50%)" }}
            >
              <span className="text-red-800 font-bold text-sm">X</span>
            </button>
          </div>
        )}

        <label className="block mb-2">
          <p className="text-sm mb-1">Descripción</p>
          <textarea
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="bg-gray-100 p-1 rounded border border-gray-300 w-[25rem] h-[10rem]"
          />
        </label>

        <div className="flex justify-end">
          <Button
            isLoading={isLoading}
            isDisabled={!restaurant}
            className={clsx(
              "mt-4 px-4 py-2 rounded-md w-fit",
              !restaurant
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            )}
            text={product ? "Guardar" : "Crear"}
          />
        </div>
      </form>
      {product && onSuccess && (
        <DeleteProductCard product={product} onSuccess={onSuccess} />
      )}
      {!restaurant && (
        <p className="mt-4 text-red-500">Restaurant data is not available.</p>
      )}
    </div>
  );
};

export default EditProductForm;
