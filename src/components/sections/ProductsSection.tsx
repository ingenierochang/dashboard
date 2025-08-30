import React, { useState, useCallback } from "react";
import ProductsTable from "../specifics/products/ProductsTable";
import Drawer from "../common/Drawer";
import EditProductForm from "../specifics/products/EditProductForm";
import ProductsHeader from "../specifics/products/ProductsHeader";

function ProductsSection() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [refreshProducts, setRefreshProducts] = useState(false);

  const handleOpenDrawer = () => setIsDrawerOpen(true);
  const handleCloseDrawer = () => setIsDrawerOpen(false);

  const handleRefreshProducts = useCallback(() => {
    setRefreshProducts((prev) => !prev);
  }, []);

  console.log("refreshProducts: ", refreshProducts);

  return (
    <>
      <main>
        <ProductsHeader handleOpenDrawer={handleOpenDrawer} />
        <ProductsTable key={refreshProducts ? "refresh" : "normal"} />
      </main>

      {/* right drawer to edit/delete product */}
      <Drawer isOpen={isDrawerOpen} onClose={handleCloseDrawer}>
        <EditProductForm
          onSuccess={() => {
            handleCloseDrawer();
            handleRefreshProducts(); // Refresh products list after create or edit
          }}
        />
      </Drawer>
    </>
  );
}

export default ProductsSection;
