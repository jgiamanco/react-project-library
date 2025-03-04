
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { projects } from "@/data/projects";
import { TodoApp } from "@/projects";
import CodeViewer from "./CodeViewer";
import todoAppCode from "@/projects/todo-app/code";

const ProjectDemo = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  
  const projectId = parseInt(id || "0");
  const project = projects.find(p => p.id === projectId);
  const isCodeView = location.pathname.endsWith('/code');
  
  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <h1 className="text-3xl font-bold mb-4">Project Not Found</h1>
        <p className="text-muted-foreground mb-8">
          The project you're looking for doesn't exist or has been removed.
        </p>
        <Button onClick={() => navigate("/dashboard")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>
    );
  }

  // Get code files based on project ID
  const getProjectCode = () => {
    switch (projectId) {
      case 1:
        return todoAppCode;
      // Add more cases as more projects are implemented
      default:
        return [
          {
            name: "Example.tsx",
            content: "// This project's code is not available yet",
            language: "typescript"
          }
        ];
    }
  };

  if (isCodeView) {
    return (
      <CodeViewer 
        files={getProjectCode()} 
        onBack={() => navigate(`/projects/${project.id}`)}
        title={project.title}
      />
    );
  }

  const renderProjectDemo = () => {
    switch (projectId) {
      case 1:
        return <TodoApp />;
      // Add more cases as we implement more projects
      default:
        return (
          <div className="flex flex-col items-center justify-center p-10">
            <h2 className="text-2xl font-bold mb-4">{project.title} Demo</h2>
            <p className="text-muted-foreground mb-6">This project demo is coming soon!</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen">
      <div className="bg-background py-4 px-6 fixed top-0 w-full z-10 shadow-sm">
        <Button 
          variant="ghost" 
          className="mb-2"
          onClick={() => navigate(`/projects/${project.id}`)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to project details
        </Button>
        <h1 className="text-xl font-bold">{project.title} - Live Demo</h1>
      </div>
      
      <div className="pt-20 pb-10">
        {renderProjectDemo()}
      </div>
    </div>
  );
};

export default ProjectDemo;
