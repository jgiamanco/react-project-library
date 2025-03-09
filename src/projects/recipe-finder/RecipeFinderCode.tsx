
import CodeViewer from "@/components/CodeViewer";

const RecipeFinderCode = () => {
  const files = {
    "RecipeFinder.tsx": `import { useState } from "react";
import SearchBar from "./components/SearchBar";
import RecipeList from "./components/RecipeList";
import FilterPanel from "./components/FilterPanel";
import RecipeDetails from "./components/RecipeDetails";
import mockRecipes from "./data/mockRecipes";
import { RecipeType, FilterOptions } from "./types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Heart } from "lucide-react";

export default function RecipeFinder() {
  const [recipes, setRecipes] = useState<RecipeType[]>(mockRecipes);
  const [filteredRecipes, setFilteredRecipes] = useState<RecipeType[]>(mockRecipes);
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeType | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [activeFilters, setActiveFilters] = useState<FilterOptions>({
    diet: [],
    mealType: [],
    cookTime: null,
    ingredients: []
  });

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredRecipes(recipes);
      return;
    }
    
    const searchResults = recipes.filter(recipe => 
      recipe.title.toLowerCase().includes(query.toLowerCase()) ||
      recipe.ingredients.some(ingredient => 
        ingredient.toLowerCase().includes(query.toLowerCase())
      )
    );
    
    setFilteredRecipes(searchResults);
  };

  const handleFilterChange = (filters: FilterOptions) => {
    setActiveFilters(filters);
    
    let results = [...recipes];
    
    // Filter by diet restrictions
    if (filters.diet.length > 0) {
      results = results.filter(recipe => 
        filters.diet.every(diet => recipe.tags.includes(diet))
      );
    }
    
    // Filter by meal type
    if (filters.mealType.length > 0) {
      results = results.filter(recipe => 
        filters.mealType.some(meal => recipe.tags.includes(meal))
      );
    }
    
    // Filter by cook time
    if (filters.cookTime !== null) {
      results = results.filter(recipe => 
        recipe.cookTime <= filters.cookTime
      );
    }
    
    // Filter by ingredients
    if (filters.ingredients.length > 0) {
      results = results.filter(recipe => 
        filters.ingredients.every(ing => 
          recipe.ingredients.some(recipeIng => 
            recipeIng.toLowerCase().includes(ing.toLowerCase())
          )
        )
      );
    }
    
    setFilteredRecipes(results);
  };

  const toggleFavorite = (recipeId: string) => {
    setFavorites(prev => {
      if (prev.includes(recipeId)) {
        return prev.filter(id => id !== recipeId);
      } else {
        return [...prev, recipeId];
      }
    });
  };

  const handleSelectRecipe = (recipe: RecipeType) => {
    setSelectedRecipe(recipe);
  };

  const clearSelection = () => {
    setSelectedRecipe(null);
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-2xl font-bold mb-6 text-center">Recipe Finder</h1>
      
      {selectedRecipe ? (
        <div>
          <Button 
            variant="ghost" 
            onClick={clearSelection}
            className="mb-4"
          >
            ← Back to recipes
          </Button>
          <RecipeDetails 
            recipe={selectedRecipe}
            isFavorite={favorites.includes(selectedRecipe.id)}
            onToggleFavorite={() => toggleFavorite(selectedRecipe.id)}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <div className="sticky top-24">
              <FilterPanel 
                activeFilters={activeFilters}
                onFilterChange={handleFilterChange}
              />
            </div>
          </div>
          
          <div className="md:col-span-3">
            <SearchBar onSearch={handleSearch} />
            
            <Tabs defaultValue="all" className="mt-6">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All Recipes</TabsTrigger>
                <TabsTrigger value="favorites">
                  <Heart className="w-4 h-4 mr-2" />
                  Favorites
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="all">
                <RecipeList 
                  recipes={filteredRecipes}
                  favorites={favorites}
                  onSelectRecipe={handleSelectRecipe}
                  onToggleFavorite={toggleFavorite}
                />
                
                {filteredRecipes.length === 0 && (
                  <Card className="mt-6">
                    <CardContent className="p-6 text-center">
                      <p className="text-muted-foreground">No recipes found matching your criteria.</p>
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={() => handleFilterChange({
                          diet: [],
                          mealType: [],
                          cookTime: null,
                          ingredients: []
                        })}
                      >
                        Clear filters
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="favorites">
                <RecipeList 
                  recipes={recipes.filter(recipe => favorites.includes(recipe.id))}
                  favorites={favorites}
                  onSelectRecipe={handleSelectRecipe}
                  onToggleFavorite={toggleFavorite}
                />
                
                {favorites.length === 0 && (
                  <Card className="mt-6">
                    <CardContent className="p-6 text-center">
                      <p className="text-muted-foreground">You haven't saved any favorite recipes yet.</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}
    </div>
  );
}`,
    "components/SearchBar.tsx": `import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <Input
        type="text"
        placeholder="Search recipes or ingredients..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-10"
      />
      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
      <Button 
        type="submit" 
        className="absolute right-0 top-0 rounded-l-none"
      >
        Search
      </Button>
    </form>
  );
};

export default SearchBar;`,
    "components/RecipeList.tsx": `import { RecipeType } from "../types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

interface RecipeListProps {
  recipes: RecipeType[];
  favorites: string[];
  onSelectRecipe: (recipe: RecipeType) => void;
  onToggleFavorite: (recipeId: string) => void;
}

const RecipeList = ({ 
  recipes, 
  favorites, 
  onSelectRecipe, 
  onToggleFavorite 
}: RecipeListProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {recipes.map((recipe) => (
        <Card key={recipe.id} className="overflow-hidden">
          <div className="aspect-video relative overflow-hidden bg-muted">
            {recipe.image ? (
              <img 
                src={recipe.image} 
                alt={recipe.title} 
                className="w-full h-full object-cover" 
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                No image available
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 bg-background/50 backdrop-blur-sm hover:bg-background/80"
              onClick={() => onToggleFavorite(recipe.id)}
            >
              <Heart 
                className={favorites.includes(recipe.id) ? "fill-red-500 text-red-500" : ""} 
              />
            </Button>
          </div>
          <CardContent className="p-4">
            <div className="mb-2 flex flex-wrap gap-2">
              {recipe.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {recipe.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{recipe.tags.length - 3} more
                </Badge>
              )}
            </div>
            <h3 className="text-lg font-semibold">{recipe.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {recipe.description}
            </p>
            <div className="flex justify-between mt-2 text-sm text-muted-foreground">
              <span>Prep: {recipe.prepTime} min</span>
              <span>Cook: {recipe.cookTime} min</span>
              <span>Serves: {recipe.servings}</span>
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => onSelectRecipe(recipe)}
            >
              View Recipe
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default RecipeList;`,
    "components/FilterPanel.tsx": `import { useState, useEffect } from "react";
import { FilterOptions } from "../types";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FilterPanelProps {
  activeFilters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
}

const dietaryOptions = [
  "Vegetarian",
  "Vegan",
  "Gluten-Free",
  "Dairy-Free",
  "Keto",
  "Paleo",
  "Low-Carb"
];

const mealTypeOptions = [
  "Breakfast",
  "Lunch",
  "Dinner",
  "Dessert",
  "Snack",
  "Appetizer",
  "Soup",
  "Salad"
];

const FilterPanel = ({ activeFilters, onFilterChange }: FilterPanelProps) => {
  const [filters, setFilters] = useState<FilterOptions>(activeFilters);
  const [ingredientInput, setIngredientInput] = useState("");
  const [cookTimeValue, setCookTimeValue] = useState<number>(
    activeFilters.cookTime || 60
  );

  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const updateDietFilter = (diet: string) => {
    setFilters(prev => {
      const newDiet = prev.diet.includes(diet)
        ? prev.diet.filter(d => d !== diet)
        : [...prev.diet, diet];
      
      return { ...prev, diet: newDiet };
    });
  };

  const updateMealTypeFilter = (mealType: string) => {
    setFilters(prev => {
      const newMealType = prev.mealType.includes(mealType)
        ? prev.mealType.filter(m => m !== mealType)
        : [...prev.mealType, mealType];
      
      return { ...prev, mealType: newMealType };
    });
  };

  const updateCookTimeFilter = (value: number[]) => {
    setCookTimeValue(value[0]);
    setFilters(prev => ({
      ...prev,
      cookTime: value[0]
    }));
  };

  const addIngredientFilter = () => {
    if (!ingredientInput.trim()) return;
    
    setFilters(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, ingredientInput.trim()]
    }));
    
    setIngredientInput("");
  };

  const removeIngredientFilter = (ingredient: string) => {
    setFilters(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter(ing => ing !== ingredient)
    }));
  };

  const resetFilters = () => {
    setFilters({
      diet: [],
      mealType: [],
      cookTime: null,
      ingredients: []
    });
    setCookTimeValue(60);
  };

  const anyFiltersActive = () => {
    return (
      filters.diet.length > 0 ||
      filters.mealType.length > 0 ||
      filters.cookTime !== null ||
      filters.ingredients.length > 0
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Filters</h2>
        {anyFiltersActive() && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={resetFilters}
          >
            Reset
          </Button>
        )}
      </div>

      <Accordion type="multiple" defaultValue={["dietary", "mealType", "cookTime", "ingredients"]}>
        <AccordionItem value="dietary">
          <AccordionTrigger>Dietary Restrictions</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {dietaryOptions.map(diet => (
                <div key={diet} className="flex items-center space-x-2">
                  <Checkbox 
                    id={diet} 
                    checked={filters.diet.includes(diet)}
                    onCheckedChange={() => updateDietFilter(diet)}
                  />
                  <label 
                    htmlFor={diet}
                    className="text-sm cursor-pointer"
                  >
                    {diet}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="mealType">
          <AccordionTrigger>Meal Type</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {mealTypeOptions.map(meal => (
                <div key={meal} className="flex items-center space-x-2">
                  <Checkbox 
                    id={meal} 
                    checked={filters.mealType.includes(meal)}
                    onCheckedChange={() => updateMealTypeFilter(meal)}
                  />
                  <label 
                    htmlFor={meal}
                    className="text-sm cursor-pointer"
                  >
                    {meal}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="cookTime">
          <AccordionTrigger>Cook Time</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 px-1">
              <Slider
                value={[cookTimeValue]}
                min={10}
                max={120}
                step={5}
                onValueChange={updateCookTimeFilter}
              />
              <div className="flex justify-between text-sm">
                <span>10 min</span>
                <span>Max: {cookTimeValue} min</span>
                <span>120 min</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="ingredients">
          <AccordionTrigger>Ingredients</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              <div className="flex space-x-2">
                <Input
                  placeholder="Enter ingredient..."
                  value={ingredientInput}
                  onChange={(e) => setIngredientInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addIngredientFilter();
                    }
                  }}
                />
                <Button onClick={addIngredientFilter}>Add</Button>
              </div>
              
              {filters.ingredients.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {filters.ingredients.map(ingredient => (
                    <Badge key={ingredient} variant="secondary">
                      {ingredient}
                      <button
                        className="ml-1"
                        onClick={() => removeIngredientFilter(ingredient)}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default FilterPanel;`,
    "components/RecipeDetails.tsx": `import { RecipeType } from "../types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Users, Heart } from "lucide-react";

interface RecipeDetailsProps {
  recipe: RecipeType;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

const RecipeDetails = ({ 
  recipe, 
  isFavorite, 
  onToggleFavorite 
}: RecipeDetailsProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="aspect-video bg-muted rounded-lg overflow-hidden">
          {recipe.image ? (
            <img 
              src={recipe.image} 
              alt={recipe.title} 
              className="w-full h-full object-cover" 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              No image available
            </div>
          )}
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <h1 className="text-2xl font-bold">{recipe.title}</h1>
            <Button
              variant="outline"
              size="icon"
              onClick={onToggleFavorite}
              className="ml-2"
            >
              <Heart 
                className={isFavorite ? "fill-red-500 text-red-500" : ""} 
              />
            </Button>
          </div>
          
          <p className="text-muted-foreground">{recipe.description}</p>
          
          <div className="flex flex-wrap gap-2">
            {recipe.tags.map(tag => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
          
          <div className="grid grid-cols-3 gap-4 pt-2">
            <Card>
              <CardContent className="p-3 flex flex-col items-center justify-center text-center">
                <Clock className="h-5 w-5 mb-1 text-muted-foreground" />
                <span className="text-sm font-medium">Prep Time</span>
                <span className="text-xl">{recipe.prepTime} min</span>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-3 flex flex-col items-center justify-center text-center">
                <Clock className="h-5 w-5 mb-1 text-muted-foreground" />
                <span className="text-sm font-medium">Cook Time</span>
                <span className="text-xl">{recipe.cookTime} min</span>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-3 flex flex-col items-center justify-center text-center">
                <Users className="h-5 w-5 mb-1 text-muted-foreground" />
                <span className="text-sm font-medium">Servings</span>
                <span className="text-xl">{recipe.servings}</span>
              </CardContent>
            </Card>
          </div>
          
          <div className="bg-muted p-3 rounded-lg">
            <div className="font-medium mb-1">Nutrition per serving</div>
            <div className="grid grid-cols-4 text-sm">
              <div>
                <div className="text-muted-foreground">Calories</div>
                <div>{recipe.nutritionalInfo.calories} kcal</div>
              </div>
              <div>
                <div className="text-muted-foreground">Protein</div>
                <div>{recipe.nutritionalInfo.protein}g</div>
              </div>
              <div>
                <div className="text-muted-foreground">Carbs</div>
                <div>{recipe.nutritionalInfo.carbs}g</div>
              </div>
              <div>
                <div className="text-muted-foreground">Fat</div>
                <div>{recipe.nutritionalInfo.fat}g</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="ingredients">
        <TabsList className="mb-4">
          <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
          <TabsTrigger value="instructions">Instructions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="ingredients">
          <Card>
            <CardContent className="p-6">
              <ul className="space-y-2">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex items-start">
                    <span className="bg-primary/10 text-primary w-6 h-6 rounded-full flex items-center justify-center mr-3 shrink-0">
                      {index + 1}
                    </span>
                    <span>{ingredient}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="instructions">
          <Card>
            <CardContent className="p-6">
              <ol className="space-y-4">
                {recipe.instructions.map((instruction, index) => (
                  <li key={index} className="flex items-start">
                    <span className="bg-primary/10 text-primary w-6 h-6 rounded-full flex items-center justify-center mr-3 shrink-0">
                      {index + 1}
                    </span>
                    <span>{instruction}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RecipeDetails;`,
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
    "data/mockRecipes.ts": `import { RecipeType } from "../types";

const mockRecipes: RecipeType[] = [
  {
    id: "1",
    title: "Avocado & Black Bean Wraps",
    description: "Healthy vegetarian wraps with creamy avocado and spiced black beans.",
    ingredients: [
      "2 large flour tortillas",
      "1 ripe avocado, mashed",
      "1 can black beans, drained and rinsed",
      "1 tomato, diced",
      "1/4 red onion, finely chopped",
      "2 tbsp fresh cilantro, chopped",
      "1 lime, juiced",
      "1 tsp cumin",
      "1/2 tsp chili powder",
      "Salt and pepper to taste"
    ],
    instructions: [
      "In a bowl, mash the avocado with lime juice, salt, and pepper.",
      "In another bowl, mix black beans with cumin and chili powder.",
      "Warm the tortillas in a dry pan or microwave.",
      "Spread the mashed avocado on the tortillas.",
      "Top with seasoned black beans, diced tomato, red onion, and cilantro.",
      "Roll up tightly and cut in half diagonally."
    ],
    cookTime: 10,
    prepTime: 15,
    servings: 2,
    tags: ["Vegetarian", "Vegan", "Lunch", "Dinner", "Mexican"],
    nutritionalInfo: {
      calories: 420,
      protein: 15,
      carbs: 52,
      fat: 18
    },
    image: "https://images.unsplash.com/photo-1608830597604-619220679440?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80"
  },
  {
    id: "2",
    title: "Sheet Pan Lemon Herb Chicken",
    description: "Easy one-pan roasted chicken with vegetables and bright lemon flavor.",
    ingredients: [
      "4 chicken thighs, bone-in, skin-on",
      "2 tbsp olive oil",
      "2 lemons, one juiced and one sliced",
      "3 cloves garlic, minced",
      "1 tbsp fresh thyme leaves",
      "1 tbsp fresh rosemary, chopped",
      "1 lb baby potatoes, halved",
      "2 cups cherry tomatoes",
      "1 red onion, cut into wedges",
      "Salt and pepper to taste"
    ],
    instructions: [
      "Preheat oven to 425°F (220°C).",
      "In a bowl, mix olive oil, lemon juice, garlic, thyme, rosemary, salt, and pepper.",
      "Place chicken, potatoes, tomatoes, and onion on a large baking sheet.",
      "Pour the herb mixture over everything and toss to coat. Arrange lemon slices around the pan.",
      "Roast for 35-40 minutes, or until chicken is cooked through and vegetables are tender.",
      "Let rest for 5 minutes before serving."
    ],
    cookTime: 40,
    prepTime: 15,
    servings: 4,
    tags: ["Dinner", "Gluten-Free", "High-Protein"],
    nutritionalInfo: {
      calories: 480,
      protein: 32,
      carbs: 25,
      fat: 28
    },
    image: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80"
  },
  {
    id: "3",
    title: "Creamy Mushroom Risotto",
    description: "Classic Italian creamy risotto with sautéed mushrooms and Parmesan cheese.",
    ingredients: [
      "1 1/2 cups Arborio rice",
      "6 cups vegetable or chicken broth, kept warm",
      "1 lb mixed mushrooms, sliced",
      "1 small onion, finely diced",
      "3 cloves garlic, minced",
      "1/2 cup dry white wine",
      "1/2 cup grated Parmesan cheese",
      "2 tbsp butter",
      "2 tbsp olive oil",
      "2 tbsp fresh parsley, chopped",
      "Salt and pepper to taste"
    ],
    instructions: [
      "In a large pan, heat 1 tbsp olive oil and sauté mushrooms until golden. Remove and set aside.",
      "In the same pan, heat 1 tbsp olive oil and butter. Add onion and cook until translucent.",
      "Add garlic and Arborio rice, stirring to coat the rice with oil for 2 minutes.",
      "Pour in the wine and stir until absorbed.",
      "Begin adding warm broth, one ladle at a time, stirring continuously and waiting until liquid is absorbed before adding more.",
      "After about 18-20 minutes, when rice is creamy but still al dente, stir in the sautéed mushrooms, Parmesan cheese, and parsley.",
      "Season with salt and pepper, and serve immediately."
    ],
    cookTime: 30,
    prepTime: 15,
    servings: 4,
    tags: ["Vegetarian", "Dinner", "Italian"],
    nutritionalInfo: {
      calories: 410,
      protein: 12,
      carbs: 54,
      fat: 15
    },
    image: "https://images.unsplash.com/photo-1626844131082-256466a016b6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80"
  },
  {
    id: "4",
    title: "Quinoa Breakfast Bowl",
    description: "Nutritious breakfast bowl with quinoa, fresh fruits, and honey.",
    ingredients: [
      "1 cup quinoa, rinsed",
      "2 cups milk (any type)",
      "1 tsp vanilla extract",
      "2 tbsp honey or maple syrup",
      "1/2 tsp cinnamon",
      "Pinch of salt",
      "2 cups mixed berries (strawberries, blueberries, raspberries)",
      "1/4 cup sliced almonds",
      "2 tbsp chia seeds",
      "Additional milk and honey for serving"
    ],
    instructions: [
      "In a medium saucepan, combine quinoa, milk, vanilla, honey, cinnamon, and salt.",
      "Bring to a boil, then reduce heat and simmer, covered, for 15 minutes or until liquid is absorbed.",
      "Remove from heat and let stand, covered, for 5 minutes.",
      "Fluff with a fork and divide into bowls.",
      "Top with mixed berries, sliced almonds, and chia seeds.",
      "Serve with additional milk and honey if desired."
    ],
    cookTime: 20,
    prepTime: 10,
    servings: 4,
    tags: ["Breakfast", "Vegetarian", "Gluten-Free"],
    nutritionalInfo: {
      calories: 320,
      protein: 12,
      carbs: 45,
      fat: 11
    },
    image: "https://images.unsplash.com/photo-1557844352-761f2565b576?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80"
  },
  {
    id: "5",
    title: "Spicy Tofu Stir-Fry",
    description: "Flavorful vegan stir-fry with crispy tofu and colorful vegetables.",
    ingredients: [
      "1 block (14 oz) extra-firm tofu, pressed and cubed",
      "2 tbsp cornstarch",
      "3 tbsp vegetable oil",
      "1 red bell pepper, sliced",
      "1 yellow bell pepper, sliced",
      "2 carrots, julienned",
      "1 cup snow peas",
      "3 cloves garlic, minced",
      "1 tbsp ginger, grated",
      "3 tbsp soy sauce",
      "1 tbsp rice vinegar",
      "2 tsp sriracha or chili paste",
      "1 tsp sesame oil",
      "Green onions and sesame seeds for garnish"
    ],
    instructions: [
      "Toss tofu cubes in cornstarch to coat lightly.",
      "Heat 2 tbsp oil in a large wok or skillet over medium-high heat.",
      "Add tofu and cook until crispy on all sides, about 5-7 minutes. Remove and set aside.",
      "Add remaining oil to the pan. Add garlic and ginger, stirring for 30 seconds until fragrant.",
      "Add bell peppers, carrots, and snow peas. Stir-fry for 3-4 minutes until vegetables are crisp-tender.",
      "In a small bowl, mix soy sauce, rice vinegar, sriracha, and sesame oil.",
      "Return tofu to the pan, pour sauce over everything, and toss to coat.",
      "Cook for another minute until heated through.",
      "Garnish with green onions and sesame seeds before serving."
    ],
    cookTime: 15,
    prepTime: 20,
    servings: 4,
    tags: ["Vegan", "Dinner", "Asian", "Gluten-Free"],
    nutritionalInfo: {
      calories: 290,
      protein: 15,
      carbs: 23,
      fat: 17
    },
    image: "https://images.unsplash.com/photo-1574484284002-952d92456975?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80"
  },
  {
    id: "6",
    title: "Greek Yogurt Parfait",
    description: "Quick and healthy breakfast parfait with layers of yogurt, granola, and fruits.",
    ingredients: [
      "2 cups Greek yogurt (plain or vanilla)",
      "1 cup granola",
      "2 cups mixed berries (strawberries, blueberries, raspberries)",
      "2 tbsp honey",
      "1 tbsp lemon zest",
      "1/4 tsp cinnamon",
      "Mint leaves for garnish (optional)"
    ],
    instructions: [
      "In a small bowl, mix Greek yogurt with cinnamon and lemon zest.",
      "In serving glasses, create alternating layers of yogurt, granola, and berries.",
      "Drizzle honey over the top layer.",
      "Garnish with mint leaves if desired.",
      "Serve immediately or refrigerate for up to 4 hours (add granola just before serving to keep it crunchy)."
    ],
    cookTime: 0,
    prepTime: 10,
    servings: 2,
    tags: ["Breakfast", "Vegetarian", "Snack", "Quick"],
    nutritionalInfo: {
      calories: 280,
      protein: 18,
      carbs: 38,
      fat: 7
    },
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80"
  },
  {
    id: "7",
    title: "Salmon with Lemon-Dill Sauce",
    description: "Perfectly seared salmon fillets with a creamy lemon-dill sauce.",
    ingredients: [
      "4 salmon fillets (6 oz each)",
      "Salt and pepper to taste",
      "2 tbsp olive oil",
      "2 tbsp butter",
      "3 cloves garlic, minced",
      "1/4 cup chicken broth",
      "1/4 cup heavy cream",
      "2 tbsp fresh lemon juice",
      "2 tbsp fresh dill, chopped",
      "1 tsp lemon zest",
      "Lemon slices for garnish"
    ],
    instructions: [
      "Season salmon fillets with salt and pepper on both sides.",
      "Heat olive oil in a large skillet over medium-high heat.",
      "Place salmon in the skillet, skin-side down if applicable, and cook for 4-5 minutes.",
      "Flip and cook for another 3-4 minutes until salmon is cooked through. Remove and set aside.",
      "In the same skillet, add butter and garlic, cooking for 1 minute until fragrant.",
      "Add chicken broth, scraping up any bits from the pan, and simmer for 2 minutes.",
      "Reduce heat and stir in heavy cream, lemon juice, dill, and lemon zest.",
      "Simmer for 2-3 minutes until sauce thickens slightly.",
      "Return salmon to the skillet, spooning sauce over the fillets.",
      "Garnish with lemon slices and additional dill before serving."
    ],
    cookTime: 15,
    prepTime: 10,
    servings: 4,
    tags: ["Dinner", "High-Protein", "Gluten-Free", "Seafood"],
    nutritionalInfo: {
      calories: 390,
      protein: 34,
      carbs: 3,
      fat: 28
    },
    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80"
  },
  {
    id: "8",
    title: "Roasted Vegetable Pasta",
    description: "Pasta tossed with caramelized roasted vegetables and fresh herbs.",
    ingredients: [
      "12 oz pasta (penne or rotini)",
      "1 zucchini, diced",
      "1 yellow squash, diced",
      "1 red bell pepper, diced",
      "1 red onion, diced",
      "2 cups cherry tomatoes, halved",
      "4 cloves garlic, minced",
      "3 tbsp olive oil",
      "2 tsp Italian herbs",
      "Salt and pepper to taste",
      "1/4 cup fresh basil, chopped",
      "1/3 cup grated Parmesan cheese",
      "2 tbsp balsamic glaze"
    ],
    instructions: [
      "Preheat oven to 425°F (220°C).",
      "On a large baking sheet, toss zucchini, yellow squash, bell pepper, onion, cherry tomatoes, and garlic with olive oil, Italian herbs, salt, and pepper.",
      "Roast for 20-25 minutes, stirring halfway through, until vegetables are tender and caramelized.",
      "Meanwhile, cook pasta according to package directions. Reserve 1/2 cup pasta water before draining.",
      "Toss hot pasta with roasted vegetables, adding a bit of reserved pasta water if needed for moisture.",
      "Stir in fresh basil and Parmesan cheese.",
      "Drizzle with balsamic glaze before serving."
    ],
    cookTime: 25,
    prepTime: 15,
    servings: 4,
    tags: ["Vegetarian", "Dinner", "Italian"],
    nutritionalInfo: {
      calories: 410,
      protein: 12,
      carbs: 65,
      fat: 12
    },
    image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80"
  }
];

export default mockRecipes;`,
    "hooks/useRecipeSearch.ts": `import { useState, useEffect } from "react";
import { RecipeType, FilterOptions } from "../types";
import mockRecipes from "../data/mockRecipes";

interface UseRecipeSearchProps {
  initialRecipes?: RecipeType[];
}

export const useRecipeSearch = ({ initialRecipes = mockRecipes }: UseRecipeSearchProps = {}) => {
  const [recipes, setRecipes] = useState<RecipeType[]>(initialRecipes);
  const [filteredRecipes, setFilteredRecipes] = useState<RecipeType[]>(initialRecipes);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterOptions>({
    diet: [],
    mealType: [],
    cookTime: null,
    ingredients: []
  });
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem("recipeFinderFavorites");
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  useEffect(() => {
    // Save favorites to localStorage
    localStorage.setItem("recipeFinderFavorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    let results = [...recipes];
    
    // Apply search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(recipe => 
        recipe.title.toLowerCase().includes(query) ||
        recipe.ingredients.some(ingredient => 
          ingredient.toLowerCase().includes(query)
        ) ||
        recipe.tags.some(tag => 
          tag.toLowerCase().includes(query)
        )
      );
    }
    
    // Apply dietary filters
    if (filters.diet.length > 0) {
      results = results.filter(recipe => 
        filters.diet.every(diet => recipe.tags.includes(diet))
      );
    }
    
    // Apply meal type filters
    if (filters.mealType.length > 0) {
      results = results.filter(recipe => 
        filters.mealType.some(meal => recipe.tags.includes(meal))
      );
    }
    
    // Apply cook time filter
    if (filters.cookTime !== null) {
      results = results.filter(recipe => 
        recipe.cookTime <= filters.cookTime
      );
    }
    
    // Apply ingredients filter
    if (filters.ingredients.length > 0) {
      results = results.filter(recipe => 
        filters.ingredients.every(ing => 
          recipe.ingredients.some(recipeIng => 
            recipeIng.toLowerCase().includes(ing.toLowerCase())
          )
        )
      );
    }
    
    setFilteredRecipes(results);
  }, [recipes, searchQuery, filters]);

  const search = (query: string) => {
    setSearchQuery(query);
  };

  const applyFilters = (newFilters: Partial<FilterOptions>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFilters({
      diet: [],
      mealType: [],
      cookTime: null,
      ingredients: []
    });
    setSearchQuery("");
  };

  const toggleFavorite = (recipeId: string) => {
    setFavorites(prev => {
      if (prev.includes(recipeId)) {
        return prev.filter(id => id !== recipeId);
      } else {
        return [...prev, recipeId];
      }
    });
  };

  const getFavoriteRecipes = () => {
    return recipes.filter(recipe => favorites.includes(recipe.id));
  };

  return {
    recipes,
    filteredRecipes,
    search,
    searchQuery,
    filters,
    applyFilters,
    resetFilters,
    favorites,
    toggleFavorite,
    getFavoriteRecipes
  };
};`,
  };

  return <CodeViewer files={files} />;
};

export default RecipeFinderCode;
