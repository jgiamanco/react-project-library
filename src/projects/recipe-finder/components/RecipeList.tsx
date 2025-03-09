
import { RecipeType } from "../types";
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
          className={`cursor-pointer hover:shadow-md transition-shadow ${
            recipe.id === selectedRecipeId ? 'border-primary' : ''
          }`}
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

export default RecipeList;
