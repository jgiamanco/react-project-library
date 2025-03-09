
import { RecipeType } from "../types";

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
  },
  {
    id: "3",
    title: "Avocado Toast with Poached Egg",
    description: "Simple yet delicious breakfast topped with perfectly poached eggs.",
    ingredients: [
      "2 slices of whole grain bread",
      "1 ripe avocado",
      "2 eggs",
      "1 tablespoon white vinegar",
      "Salt and pepper to taste",
      "Red pepper flakes (optional)",
      "1 tablespoon fresh lemon juice",
      "Fresh herbs (such as cilantro or chives) for garnish"
    ],
    instructions: [
      "Toast the bread until golden and firm.",
      "While the bread is toasting, halve the avocado, remove the pit, and scoop into a bowl.",
      "Add lemon juice, salt, and pepper to the avocado and mash with a fork.",
      "For the poached eggs, bring a pot of water to a gentle simmer and add vinegar.",
      "Crack each egg into a small bowl, then gently slide into the simmering water.",
      "Cook for 3-4 minutes until the whites are set but yolks are still runny.",
      "Spread the mashed avocado on the toast.",
      "Remove eggs with a slotted spoon, drain, and place on top of the avocado toast.",
      "Season with salt, pepper, and red pepper flakes if desired. Garnish with fresh herbs."
    ],
    cookTime: 10,
    prepTime: 5,
    servings: 2,
    tags: ["breakfast", "vegetarian", "healthy", "quick"],
    nutritionalInfo: {
      calories: 320,
      protein: 12,
      carbs: 25,
      fat: 18
    }
  },
  {
    id: "4",
    title: "Chicken and Vegetable Soup",
    description: "Hearty and comforting chicken soup packed with vegetables.",
    ingredients: [
      "1 whole chicken (about 4 pounds), cut into pieces",
      "2 onions, chopped",
      "3 carrots, chopped",
      "3 celery stalks, chopped",
      "3 cloves garlic, minced",
      "2 bay leaves",
      "1 teaspoon dried thyme",
      "8 cups chicken broth",
      "2 cups water",
      "Salt and pepper to taste",
      "Fresh parsley, chopped",
      "1 cup pasta (optional)"
    ],
    instructions: [
      "In a large pot, add chicken pieces and cover with broth and water.",
      "Bring to a boil, then reduce heat and simmer for 30 minutes, skimming foam as needed.",
      "Remove chicken pieces and set aside to cool.",
      "Add onions, carrots, celery, garlic, bay leaves, and thyme to the broth.",
      "Simmer for 20 minutes until vegetables are tender.",
      "Meanwhile, remove chicken meat from bones and shred.",
      "Return shredded chicken to the pot and simmer for 10 more minutes.",
      "If using pasta, add it and cook until al dente.",
      "Season with salt and pepper, and garnish with fresh parsley before serving."
    ],
    cookTime: 60,
    prepTime: 15,
    servings: 6,
    tags: ["soup", "dinner", "comfort food", "healthy"],
    nutritionalInfo: {
      calories: 280,
      protein: 32,
      carbs: 15,
      fat: 10
    }
  }
];
