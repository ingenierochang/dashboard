import React from "react";
import { Route, Routes } from "react-router-dom";

import Home from "./components/Home";
import NotFound from "./components/NotFound";
import Layout from "./components/Layout";
import ProductsSection from "./components/sections/ProductsSection";
import CategoryClustersPage from "./components/sections/CategoryClustersPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CategoriesPage from "./pages/CategoriesPage";
import RestaurantPage from "./pages/RestaurantPage";
import CategoryClustersOrderPage from "./components/sections/CategoryClustersOrderPage";
import CategoriesOrderPage from "./components/sections/CategoriesOrderPage";
import OrderCategoryProducts from "./components/sections/OrderCategoryProductsPage";
import ProductsBulkUploadPage from "./pages/ProductsBulkUploadPage";

const AppRoutes: React.FC = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="/restaurant" element={<RestaurantPage />} />

      <Route path="/products" element={<ProductsSection />} />
      <Route
        path="/products/bulk-upload"
        element={<ProductsBulkUploadPage />}
      />

      <Route path="/categories" element={<CategoriesPage />} />
      <Route path="/categories/order" element={<CategoriesOrderPage />} />
      <Route
        path="/categories/:category/order-category-products"
        element={<OrderCategoryProducts />}
      />

      <Route path="/category-clusters" element={<CategoryClustersPage />} />
      <Route
        path="/category-clusters/order"
        element={<CategoryClustersOrderPage />}
      />

      <Route path="*" element={<NotFound />} />
    </Route>
  </Routes>
);

export default AppRoutes;
