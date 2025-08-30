import React, { useState } from "react";
import { useRestaurant } from "@/hooks/useRestaurant";
import GenericSkeleton from "./common/GenericSkeleton";
import QRCodeGenerator from "./common/QRCodeGenerator";
import { MENU_DOMAIN } from "@/constants/project";

const Home = () => {
  const { restaurant } = useRestaurant();
  const [includeCategories, setIncludeCategories] = useState(false);

  if (!restaurant) return <GenericSkeleton className="w-40 h-10" />;

  const websiteUrl = MENU_DOMAIN + "/" + restaurant.slug;
  const urlWithCategories = `${websiteUrl}/clusters`;

  // Determine the current URL based on the switch state
  const currentUrl = includeCategories ? urlWithCategories : websiteUrl;

  return (
    <section>
      <div className="p-5 mb-4 flex items-center gap-3">
        <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
          Link normal
        </span>
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            value=""
            className="sr-only peer"
            checked={includeCategories}
            onChange={() => setIncludeCategories(!includeCategories)}
          />
          <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
            Link a categorías
          </span>
        </label>
      </div>

      <div className="p-5 flex gap-3">
        <div className="border w-fit p-3 bg-white border-gray-300 rounded">
          <p className="text-sm">QR a tu menú</p>
          <QRCodeGenerator url={currentUrl} />
        </div>

        <section>
          <div className="bg-white p-3 text-sm border border-gray-300 rounded h-fit">
            <p>Link</p>
            <a href={currentUrl} className="text-blue-600 cursor-pointer">
              <span>{currentUrl}</span>
            </a>
          </div>
        </section>
      </div>
    </section>
  );
};

export default Home;
