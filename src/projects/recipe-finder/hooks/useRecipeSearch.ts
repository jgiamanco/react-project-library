
import { useState, useEffect } from "react";
import { RecipeType, FilterOptions } from "../types";
import { mockRecipes } from "../data/mockRecipes";

export const useRecipeSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterOptions>({
    diet: [],
    mealType: [],
    cookTime: null,
    ingredients: []
  });
  const [recipes, setRecipes] = useState<RecipeType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // In a real app, this would be an API call
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API delay
      const timeoutId = setTimeout(() => {
        const filteredRecipes = mockRecipes.filter(recipe => {
          // Search query filtering
          const matchesSearch = searchQuery === "" || 
            recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            recipe.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            recipe.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
          
          // Diet filtering
          const matchesDiet = filters.diet.length === 0 || 
            filters.diet.some(diet => recipe.tags.includes(diet));
          
          // Meal type filtering
          const matchesMealType = filters.mealType.length === 0 || 
            filters.mealType.some(type => recipe.tags.includes(type));
          
          // Cook time filtering
          const matchesCookTime = !filters.cookTime || 
            recipe.cookTime <= filters.cookTime;
            
          return matchesSearch && matchesDiet && matchesMealType && matchesCookTime;
        });
        
        setRecipes(filteredRecipes);
        setIsLoading(false);
      }, 500);
      
      return () => clearTimeout(timeoutId);
    } catch (err) {
      setError(err as Error);
      setIsLoading(false);
    }
  }, [searchQuery, filters]);

  return {
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    recipes,
    isLoading,
    error
  };
};
