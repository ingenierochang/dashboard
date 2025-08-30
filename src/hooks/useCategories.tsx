import { CategoriesContext, CategoriesContextType } from "@/context/CategoriesContext";
import { useContext } from "react";



export const useCategories = (): CategoriesContextType => {
    const context = useContext(CategoriesContext);
    if (context === undefined) {
      throw new Error('useCategories must be used within a CategoriesProvider');
    }
    return context;
  };
  