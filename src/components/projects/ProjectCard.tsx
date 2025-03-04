
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Project } from "@/types/Project";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, Github } from "lucide-react";

interface ProjectCardProps {
  project: Project;
  index: number;
}

const ProjectCard = ({ project, index }: ProjectCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  
  const difficultyColor = {
    beginner: "bg-emerald-100 text-emerald-800",
    intermediate: "bg-amber-100 text-amber-800",
    advanced: "bg-rose-100 text-rose-800",
  }[project.difficulty];

  const staggerDelay = `${index * 0.1}s`;

  return (
    <div 
      className="group relative overflow-hidden rounded-xl border bg-card text-card-foreground transition-all duration-300 hover-scale hover:shadow-md"
      style={{ animationDelay: staggerDelay }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-video overflow-hidden">
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />
        <img 
          src={project.image} 
          alt={project.title}
          className="h-full w-full object-cover transition-transform duration-500 ease-apple group-hover:scale-105"
        />
        <div className="absolute bottom-3 left-3 z-20 flex flex-wrap gap-1.5">
          <Badge className={difficultyColor + " capitalize"}>
            {project.difficulty}
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1 bg-black/70 text-white">
            <Clock className="h-3 w-3" />
            {project.timeEstimate}
          </Badge>
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-xl font-semibold">{project.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
          {project.description}
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {project.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {project.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{project.tags.length - 3} more
            </Badge>
          )}
        </div>
        <div className="mt-4 flex justify-between gap-2">
          <Button 
            variant="outline" 
            size="sm"
            className="w-1/2"
            onClick={() => window.open(project.githubUrl, "_blank")}
          >
            <Github className="mr-1 h-4 w-4" />
            Code
          </Button>
          <Button 
            size="sm"
            className="w-1/2"
            onClick={() => navigate(`/projects/${project.id}`)}
          >
            Details
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
