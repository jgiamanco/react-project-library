
import CodeViewer from "@/components/CodeViewer";

const RecipeFinderCode = () => {
  const files = {
    "RecipeFinder.tsx": `import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SearchBar from "./components/SearchBar";
import RecipeList from "./components/RecipeList";
import RecipeDetails from "./components/RecipeDetails";
import FilterPanel from "./components/FilterPanel";
import { useRecipeSearch } from "./hooks/useRecipeSearch";
import { RecipeType } from "./types";

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

export default RecipeFinder;`,
    "components/SearchBar.tsx": `import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormEvent } from "react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

const SearchBar = ({ value, onChange }: SearchBarProps) => {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search for recipes..."
        className="pl-10"
      />
      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
    </form>
  );
};

export default SearchBar;`,
    "components/RecipeList.tsx": `import { RecipeType } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface RecipeListProps {
  recipes: RecipeType[];
  isLoading: boolean;
  error: Error | null;
  onRecipeSelect: (recipe: RecipeType) => void;
  selectedRecipeId: string | undefined;
}

const RecipeList = ({ 
  recipes, 
  isLoading, 
  error, 
  onRecipeSelect,
  selectedRecipeId 
}: RecipeListProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map((n) => (
          <Card key={n} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <Skeleton className="h-5 w-2/3" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
              <div className="flex justify-between mt-4">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-6">
          <p className="text-center text-destructive">Error loading recipes. Please try again.</p>
        </CardContent>
      </Card>
    );
  }

  if (recipes.length === 0) {
    return (
      <Card>
        <CardContent className="py-6">
          <p className="text-center text-muted-foreground">No recipes found. Try a different search.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {recipes.map((recipe) => (
        <Card 
          key={recipe.id} 
          className={\`cursor-pointer hover:shadow-md transition-shadow \${
            recipe.id === selectedRecipeId ? 'border-primary' : ''
          }\`}
          onClick={() => onRecipeSelect(recipe)}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{recipe.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground line-clamp-2">{recipe.description}</p>
            <div className="flex justify-between mt-4">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span className="text-sm">{recipe.cookTime} min</span>
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                <span className="text-sm">Serves {recipe.servings}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-1 mt-4">
              {recipe.tags.map((tag) => (
                <Badge key={tag} variant="outline">{tag}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default RecipeList;`,
    "types.ts": `export interface RecipeType {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  cookTime: number;
  prepTime: number;
  servings: number;
  tags: string[];
  nutritionalInfo: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  image?: string;
}

export interface FilterOptions {
  diet: string[];
  mealType: string[];
  cookTime: number | null;
  ingredients: string[];
}`,
    "hooks/useRecipeSearch.ts": `import { useState, useEffect } from "react";
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
};`,
    "data/mockRecipes.ts": `import { RecipeType } from "../types";

export const mockRecipes: RecipeType[] = [
  {
    id: "1",
    title: "Vegetable Stir Fry",
    description: "A quick and healthy vegetable stir fry with a delicious sauce.",
    ingredients: [
      "2 tablespoons olive oil",
      "1 red bell pepper, sliced",
      "1 yellow bell pepper, sliced",
      "1 onion, sliced",
      "2 carrots, julienned",
      "2 cups broccoli florets",
      "2 cloves garlic, minced",
      "1 tablespoon ginger, grated",
      "3 tablespoons soy sauce",
      "1 tablespoon honey",
      "1 teaspoon sesame oil",
      "2 tablespoons water",
      "1 tablespoon cornstarch"
    ],
    instructions: [
      "Heat oil in a large wok or skillet over high heat.",
      "Add onions and stir fry for 1 minute.",
      "Add peppers, carrots, and broccoli. Stir fry for 3-4 minutes until vegetables begin to soften.",
      "Add garlic and ginger, stir fry for 30 seconds until fragrant.",
      "In a small bowl, mix soy sauce, honey, sesame oil, water, and cornstarch.",
      "Pour sauce over vegetables and cook for 1-2 minutes until sauce thickens.",
      "Serve hot over rice or noodles."
    ],
    cookTime: 15,
    prepTime: 10,
    servings: 4,
    tags: ["vegetarian", "healthy", "quick", "dinner", "asian"],
    nutritionalInfo: {
      calories: 180,
      protein: 5,
      carbs: 20,
      fat: 8
    }
  },
  {
    id: "2",
    title: "Classic Spaghetti Carbonara",
    description: "Authentic Italian carbonara with pancetta, eggs, and Parmesan cheese.",
    ingredients: [
      "1 pound spaghetti",
      "8 oz pancetta or guanciale, diced",
      "4 large eggs",
      "1 cup Parmesan cheese, grated",
      "2 cloves garlic, minced",
      "Freshly ground black pepper",
      "Salt to taste",
      "Fresh parsley, chopped (for garnish)"
    ],
    instructions: [
      "Bring a large pot of salted water to a boil. Add spaghetti and cook until al dente.",
      "While pasta cooks, heat a large skillet over medium heat. Add pancetta and cook until crispy.",
      "In a bowl, whisk together eggs, Parmesan, and plenty of black pepper.",
      "Reserve 1 cup of pasta water, then drain pasta.",
      "Working quickly, add hot pasta to the skillet with pancetta. Remove from heat.",
      "Immediately pour egg mixture over pasta, tossing quickly to coat pasta without scrambling eggs.",
      "Add a splash of reserved pasta water to create a silky sauce.",
      "Serve immediately with extra Parmesan and parsley."
    ],
    cookTime: 15,
    prepTime: 10,
    servings: 4,
    tags: ["italian", "pasta", "dinner", "quick"],
    nutritionalInfo: {
      calories: 550,
      protein: 25,
      carbs: 65,
      fat: 22
    }
  }
  // More recipes would be defined here...
];`
  };

  return <CodeViewer files={files} />;
};

export default RecipeFinderCode;
