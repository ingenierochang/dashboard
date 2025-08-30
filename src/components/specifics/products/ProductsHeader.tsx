import clsx from "clsx";
import { Link } from "react-router-dom";

type ProductsHeaderProps = {
  handleOpenDrawer: () => void;
};

const ProductsHeader = ({ handleOpenDrawer }: ProductsHeaderProps) => {
  return (
    <div className="w-full">
      <div className="p-2 px-3 border rounded-full my-3 flex bg-white justify-between items-center">
        <div
          className={clsx(
            "p-2 px-4 rounded-full border text-white cursor-pointer",
            "bg-emerald-600 hover:bg-emerald-500 hover:border-emerald-600"
          )}
          onClick={handleOpenDrawer}
        >
          Añadir producto
        </div>
        <Link
          to="/products/bulk-upload"
          className={clsx(
            "p-2 px-4 rounded-full border text-white",
            "bg-blue-600 hover:bg-blue-500 hover:border-blue-600"
          )}
        >
          Carga masiva
        </Link>
      </div>
    </div>
  );
};

export default ProductsHeader;
