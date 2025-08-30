export const getDiscountPercentage = (
  originalPrice: number,
  discountedPrice: number
) => {
  if (originalPrice <= 0) {
    return undefined; // To avoid division by zero or negative original price
  }
  const discount = ((originalPrice - discountedPrice) / originalPrice) * 100;
  return Number(discount.toFixed(0)); // Returns the discount percentage with two decimal places
};
