import React from "react";
import SidebarProfileCard from "../specifics/sidebar/SidebarProfileCard";
import { useLocation } from "react-router-dom";
import clsx from "clsx";
import { useRestaurant } from "@/hooks/useRestaurant";

const SIDEBAR_LINKS = [
  {
    title: "Home",
    url: "/",
    icon: <i className="bi bi-house"></i>,
  },
  {
    title: "Productos",
    url: "/products",
    icon: <i className="bi bi-tag"></i>,
  },
  {
    title: "Categorías",
    url: "/categories",
    icon: <i className="bi bi-grid"></i>,
  },
  {
    title: "Restaurant",
    url: "/restaurant",
    icon: <i className="bi bi-building"></i>,
  },

  // advanced
  {
    title: "Grupos de categorías",
    url: "/category-clusters",
    icon: <i className="bi bi-grid-3x3-gap"></i>,
  },
];

const Sidebar = () => {
  const location = useLocation();

  const { restaurant } = useRestaurant();

  if (!restaurant) return null;

  return (
    <div className="w-64 bg-white text-gray-600 flex flex-col">
      <div className="px-6 py-4 font-bold text-2xl cursor-default">
        <p>{restaurant.name}</p>
      </div>
      <nav className="flex-grow p-4 relative">
        <ul className="w-full grid gap-4">
          {SIDEBAR_LINKS.map((link, index) => (
            <li
              className={clsx(
                "justify-start items-center w-full rounded-md",
                "border border-transparent",
                "hover:border-emerald-900",
                "transition-all duration-300 ease-in-out",
                location.pathname === link.url && "bg-emerald-900 text-white"
              )}
              key={index}
            >
              <a href={link.url} className="w-full py-2 flex gap-2 px-4">
                {/* {link.icon} */}
                <p>{link.title}</p>
              </a>
            </li>
          ))}
        </ul>

        <div className="absolute bottom-4 left-0 h-20 w-full p-4">
          <SidebarProfileCard />
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
