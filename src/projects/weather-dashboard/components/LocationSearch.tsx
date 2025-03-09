
import React from 'react';
import { Search, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
} from "@/components/ui/command";
import { LocationSuggestion } from "../types";

interface LocationSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  suggestions: LocationSuggestion[];
  isSearchOpen: boolean;
  setIsSearchOpen: (isOpen: boolean) => void;
  handleLocationSelect: (location: LocationSuggestion) => void;
  loading: boolean;
}

const LocationSearch: React.FC<LocationSearchProps> = ({
  searchQuery,
  setSearchQuery,
  suggestions,
  isSearchOpen,
  setIsSearchOpen,
  handleLocationSelect,
  loading
}) => {
  return (
    <div className="flex space-x-2 mb-6">
      <Popover open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <PopoverTrigger asChild>
          <div className="flex-1">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by city name or zip code (e.g., London, 10001, Paris, FR)..."
              className="w-full"
            />
          </div>
        </PopoverTrigger>
        <PopoverContent className="p-0" align="start">
          <Command>
            <CommandList>
              {suggestions.map((suggestion) => (
                <CommandItem
                  key={`${suggestion.lat}-${suggestion.lon}`}
                  onSelect={() => handleLocationSelect(suggestion)}
                  className="flex items-center gap-2 p-2 cursor-pointer"
                >
                  <MapPin className="h-4 w-4" />
                  <span>
                    {suggestion.name}
                    {suggestion.state && `, ${suggestion.state}`}
                    {suggestion.country && `, ${suggestion.country}`}
                  </span>
                </CommandItem>
              ))}
              {suggestions.length === 0 && searchQuery.trim() !== "" && (
                <div className="p-2 text-sm text-muted-foreground">
                  No locations found
                </div>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <Button
        onClick={() => handleLocationSelect(suggestions[0])}
        disabled={loading || suggestions.length === 0}
      >
        <Search className="h-4 w-4 mr-2" />
        Search
      </Button>
    </div>
  );
};

export default LocationSearch;
