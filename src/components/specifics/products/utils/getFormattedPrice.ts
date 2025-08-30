import { CURRENCY } from "@/constants/global";

export const getFormattedPrice = (price: number) => {
  return price
    ? Number(price).toLocaleString("es-CL", {
        style: "currency",
        currency: CURRENCY,
      })
    : null;
};
