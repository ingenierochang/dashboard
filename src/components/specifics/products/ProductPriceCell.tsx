import NoDataBadge from "@/components/common/NoDataBadge";
import { Product } from "@/types/products";
import React from "react";
import { getFormattedPrice } from "./utils/getFormattedPrice";

type ProductPriceCellProps = {
  product: Product;
};

const ProductPriceCell = ({ product }: ProductPriceCellProps) => {
  const getDiscountPercentage = (
    originalPrice: number,
    discountedPrice: number
  ) => {
    if (originalPrice <= 0) {
      return undefined;
    }
    const discount = ((originalPrice - discountedPrice) / originalPrice) * 100;
    return Number(discount.toFixed(0));
  };

  if (!product.price) return <NoDataBadge />;

  if (product.discounted_price)
    return (
      <div className="flex gap-1 justify-start items-center">
        <p className="font-bold">
          {getFormattedPrice(product.discounted_price)}
        </p>
        <p className="line-through text-sm text-gray-400">
          {getFormattedPrice(product.price)}
        </p>
        <p className="text-sm font-bold bg-orange-400 text-white px-1 rounded">
          {getDiscountPercentage(product.price, product.discounted_price)} %
        </p>
      </div>
    );

  return (
    <div>
      {product.price && !product.discounted_price && (
        <p className="font-bold">{getFormattedPrice(product.price)}</p>
      )}
    </div>
  );
};

export default ProductPriceCell;
