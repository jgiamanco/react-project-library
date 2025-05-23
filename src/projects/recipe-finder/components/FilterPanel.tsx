
import { useState } from "react";
import { FilterOptions } from "../types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { X, Filter } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface FilterPanelProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
}

const FilterPanel = ({ filters, onFilterChange }: FilterPanelProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<FilterOptions>(filters);

  const dietOptions = ["vegetarian", "vegan", "gluten-free", "dairy-free", "keto", "low-carb"];
  const mealTypeOptions = ["breakfast", "lunch", "dinner", "snack", "dessert"];

  const handleDietToggle = (diet: string) => {
    const newDiet = localFilters.diet.includes(diet)
      ? localFilters.diet.filter((d) => d !== diet)
      : [...localFilters.diet, diet];
    setLocalFilters({ ...localFilters, diet: newDiet });
  };

  const handleMealTypeToggle = (mealType: string) => {
    const newMealType = localFilters.mealType.includes(mealType)
      ? localFilters.mealType.filter((m) => m !== mealType)
      : [...localFilters.mealType, mealType];
    setLocalFilters({ ...localFilters, mealType: newMealType });
  };

  const handleCookTimeChange = (value: number[]) => {
    setLocalFilters({ ...localFilters, cookTime: value[0] });
  };

  const applyFilters = () => {
    onFilterChange(localFilters);
    setIsOpen(false);
  };

  const clearFilters = () => {
    const resetFilters = {
      diet: [],
      mealType: [],
      cookTime: null,
      ingredients: []
    };
    setLocalFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  const hasActiveFilters = 
    filters.diet.length > 0 || 
    filters.mealType.length > 0 || 
    filters.cookTime !== null;

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center">
        <div className="flex gap-2 flex-wrap">
          {filters.diet.map((diet) => (
            <Badge key={diet} variant="outline" className="px-3 py-1">
              {diet}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-2"
                onClick={() => {
                  const newDiet = filters.diet.filter((d) => d !== diet);
                  onFilterChange({ ...filters, diet: newDiet });
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
          {filters.mealType.map((mealType) => (
            <Badge key={mealType} variant="outline" className="px-3 py-1">
              {mealType}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-2"
                onClick={() => {
                  const newMealType = filters.mealType.filter((m) => m !== mealType);
                  onFilterChange({ ...filters, mealType: newMealType });
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
          {filters.cookTime && (
            <Badge variant="outline" className="px-3 py-1">
              Under {filters.cookTime} min
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-2"
                onClick={() => onFilterChange({ ...filters, cookTime: null })}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
        </div>

        <div className="flex gap-2">
          {hasActiveFilters && (
            <Button variant="outline" size="sm" onClick={clearFilters}>
              Clear All
            </Button>
          )}
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Diet</h4>
                  <div className="flex flex-wrap gap-2">
                    {dietOptions.map((diet) => (
                      <Badge
                        key={diet}
                        variant={localFilters.diet.includes(diet) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => handleDietToggle(diet)}
                      >
                        {diet}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Meal Type</h4>
                  <div className="flex flex-wrap gap-2">
                    {mealTypeOptions.map((mealType) => (
                      <Badge
                        key={mealType}
                        variant={localFilters.mealType.includes(mealType) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => handleMealTypeToggle(mealType)}
                      >
                        {mealType}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">
                    Cook Time: {localFilters.cookTime ? `Under ${localFilters.cookTime} min` : "Any"}
                  </h4>
                  <Slider
                    defaultValue={[localFilters.cookTime || 60]}
                    max={60}
                    min={10}
                    step={5}
                    onValueChange={handleCookTimeChange}
                  />
                </div>

                <div className="flex justify-between pt-2">
                  <Button variant="outline" size="sm" onClick={() => setIsOpen(false)}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={applyFilters}>
                    Apply Filters
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
