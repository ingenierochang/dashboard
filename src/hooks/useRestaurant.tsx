import { RestaurantContext, RestaurantContextType } from '@/context/RestaurantContext';
import { useContext } from 'react';

// Custom hook to use the RestaurantContext
export const useRestaurant = (): RestaurantContextType => {
  const context = useContext(RestaurantContext);
  if (context === undefined) {
    throw new Error('useRestaurant must be used within a RestaurantProvider');
  }
  return context;
};
