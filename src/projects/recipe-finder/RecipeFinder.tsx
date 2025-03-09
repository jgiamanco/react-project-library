
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRecipeSearch } from "./hooks/useRecipeSearch";
import { RecipeType } from "./types";
import SearchBar from "./components/SearchBar";
import FilterPanel from "./components/FilterPanel";
import RecipeList from "./components/RecipeList";
import RecipeDetails from "./components/RecipeDetails";

const RecipeFinder = () => {
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeType | null>(null);
  const {
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    recipes,
    isLoading,
    error
  } = useRecipeSearch();

  return (
    <div className="container mx-auto py-6 px-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">Recipe Finder</CardTitle>
        </CardHeader>
        <CardContent>
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          <FilterPanel filters={filters} onFilterChange={setFilters} />
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <RecipeList 
            recipes={recipes} 
            isLoading={isLoading} 
            error={error} 
            onRecipeSelect={setSelectedRecipe} 
            selectedRecipeId={selectedRecipe?.id}
          />
        </div>
        <div className="md:col-span-1">
          {selectedRecipe && (
            <RecipeDetails recipe={selectedRecipe} />
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeFinder;
