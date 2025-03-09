
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
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

export default SearchBar;
