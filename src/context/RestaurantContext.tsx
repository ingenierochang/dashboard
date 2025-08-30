import React, { createContext, useState, useEffect, ReactNode } from "react";
import client from "@/api";
import { Restaurant } from "@/types/restaurant";

// Define the shape of the context value
export interface RestaurantContextType {
  restaurant: Restaurant | null; // It can be null only during the initial loading
  loading: boolean;
  error: Error | null;
  updateRestaurant: (updatedRestaurant: Partial<Restaurant>) => void; // Function to update restaurant
  fetchRestaurant: () => void;
}

// Create the context
export const RestaurantContext = createContext<
  RestaurantContextType | undefined
>(undefined);

// Define the provider component
export const RestaurantProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null); // Start with null
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchRestaurant = async () => {
    try {
      const response = await client.get<Restaurant>(
        "/restaurants/my-restaurant/"
      );
      setRestaurant(response.data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurant();
  }, []);

  const updateRestaurant = (updatedRestaurant: Partial<Restaurant>) => {
    setRestaurant((prevRestaurant) =>
      prevRestaurant ? { ...prevRestaurant, ...updatedRestaurant } : null
    );
  };

  // Show a loading UI if the data hasn't been fetched yet
  if (loading) {
    return null; // Or a more sophisticated loading screen
  }

  return (
    <RestaurantContext.Provider
      value={{ restaurant, loading, error, updateRestaurant, fetchRestaurant }}
    >
      {children}
    </RestaurantContext.Provider>
  );
};
