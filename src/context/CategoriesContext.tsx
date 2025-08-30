import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { getAllCategories } from '@/services/categories'; // Adjust the path as needed
import { Category } from '@/types/category';
import { useRestaurant } from '@/hooks/useRestaurant';

export interface CategoriesContextType {
  categories: Category[];
  loading: boolean;
  error: string | null;
  fetchCategories: () => void;
}

export const CategoriesContext = createContext<CategoriesContextType | undefined>(undefined);

export const CategoriesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { restaurant } = useRestaurant();

  const fetchCategories = async () => {
    if (restaurant && restaurant.slug) {
      try {
        setLoading(true);
        const data = await getAllCategories(restaurant.slug);
        setCategories(data as Category[]);
      } catch (err) {
        setError("Error fetching categories");
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restaurant]);

  const value = {
    categories,
    loading,
    error,
    fetchCategories
  };

  return (
    <CategoriesContext.Provider value={value}>
      {children}
    </CategoriesContext.Provider>
  );
};

