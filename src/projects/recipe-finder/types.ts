
export interface RecipeType {
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
}
