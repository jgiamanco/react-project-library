
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RecipeType } from "../types";
import { Clock, Users, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

interface RecipeDetailsProps {
  recipe: RecipeType;
}

const RecipeDetails = ({ recipe }: RecipeDetailsProps) => {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <Card className="sticky top-6">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle>{recipe.title}</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsFavorite(!isFavorite)}
            className="h-8 w-8"
          >
            <Heart
              className={`h-5 w-5 ${isFavorite ? "fill-red-500 text-red-500" : ""}`}
            />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">{recipe.description}</p>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            <div>
              <p className="text-xs text-muted-foreground">Cook Time</p>
              <p className="font-medium">{recipe.cookTime} min</p>
            </div>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            <div>
              <p className="text-xs text-muted-foreground">Prep Time</p>
              <p className="font-medium">{recipe.prepTime} min</p>
            </div>
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-2" />
            <div>
              <p className="text-xs text-muted-foreground">Servings</p>
              <p className="font-medium">{recipe.servings}</p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1 mb-6">
          {recipe.tags.map((tag) => (
            <Badge key={tag} variant="outline">{tag}</Badge>
          ))}
        </div>
        
        <Separator className="my-4" />
        
        <h3 className="font-medium text-lg mb-2">Ingredients</h3>
        <ul className="space-y-1 mb-6">
          {recipe.ingredients.map((ingredient, idx) => (
            <li key={idx} className="text-sm">{ingredient}</li>
          ))}
        </ul>
        
        <h3 className="font-medium text-lg mb-2">Instructions</h3>
        <ol className="space-y-2">
          {recipe.instructions.map((step, idx) => (
            <li key={idx} className="text-sm">
              <span className="font-medium mr-2">{idx + 1}.</span> {step}
            </li>
          ))}
        </ol>
        
        <Separator className="my-4" />
        
        <h3 className="font-medium text-lg mb-2">Nutrition Facts</h3>
        <div className="grid grid-cols-4 gap-2">
          <div className="text-center p-2 bg-muted rounded-md">
            <p className="text-xs text-muted-foreground">Calories</p>
            <p className="font-medium">{recipe.nutritionalInfo.calories}</p>
          </div>
          <div className="text-center p-2 bg-muted rounded-md">
            <p className="text-xs text-muted-foreground">Protein</p>
            <p className="font-medium">{recipe.nutritionalInfo.protein}g</p>
          </div>
          <div className="text-center p-2 bg-muted rounded-md">
            <p className="text-xs text-muted-foreground">Carbs</p>
            <p className="font-medium">{recipe.nutritionalInfo.carbs}g</p>
          </div>
          <div className="text-center p-2 bg-muted rounded-md">
            <p className="text-xs text-muted-foreground">Fat</p>
            <p className="font-medium">{recipe.nutritionalInfo.fat}g</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecipeDetails;
