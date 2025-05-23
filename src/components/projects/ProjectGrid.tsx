
import { useState, useEffect } from "react";
import { Project } from "@/types/Project";
import ProjectCard from "./ProjectCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter } from "lucide-react";

interface ProjectGridProps {
  projects: Project[];
}

const ProjectGrid = ({ projects }: ProjectGridProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("");
  const [selectedTag, setSelectedTag] = useState<string>("");
  const [filteredProjects, setFilteredProjects] = useState<Project[]>(projects);
  const [revealed, setRevealed] = useState(false);

  // Extract all unique tags from projects
  const allTags = Array.from(
    new Set(projects.flatMap((project) => project.tags))
  ).sort();

  // Filter projects based on search query and filters
  useEffect(() => {
    let result = projects;

    // Filter by search query
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      result = result.filter(
        (project) =>
          project.title.toLowerCase().includes(lowerCaseQuery) ||
          project.description.toLowerCase().includes(lowerCaseQuery) ||
          project.tags.some((tag) => tag.toLowerCase().includes(lowerCaseQuery))
      );
    }

    // Filter by difficulty
    if (selectedDifficulty) {
      result = result.filter((project) => project.difficulty === selectedDifficulty);
    }

    // Filter by tag
    if (selectedTag) {
      result = result.filter((project) => project.tags.includes(selectedTag));
    }

    setFilteredProjects(result);
  }, [searchQuery, selectedDifficulty, selectedTag, projects]);

  // Reveal animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setRevealed(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const clearFilters = () => {
    setSelectedDifficulty("");
    setSelectedTag("");
    setSearchQuery("");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <Select
            value={selectedDifficulty}
            onValueChange={setSelectedDifficulty}
          >
            <SelectTrigger className="w-full md:w-[180px]">
              <div className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Difficulty" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Difficulties</SelectItem>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={selectedTag}
            onValueChange={setSelectedTag}
          >
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Tag" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tags</SelectItem>
              {allTags.map((tag) => (
                <SelectItem key={tag} value={tag}>
                  {tag}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {(selectedDifficulty || selectedTag || searchQuery) && (
            <Button
              variant="outline"
              onClick={clearFilters}
            >
              Clear
            </Button>
          )}
        </div>
      </div>

      {filteredProjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-xl font-medium mb-1">No projects found</h3>
          <p className="text-muted-foreground mb-6">
            Try adjusting your search or filter criteria
          </p>
          <Button onClick={clearFilters}>
            Clear all filters
          </Button>
        </div>
      ) : (
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 reveal-animation ${revealed ? 'revealed' : ''}`}>
          {filteredProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectGrid;
