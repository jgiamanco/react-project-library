
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { projects } from "@/data/projects";
import projectComponents from "@/projects";

const ProjectDemo = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const projectId = id || "";
  const project = projects.find((p) => p.id === projectId);
  const isCodeView = location.pathname.endsWith("/code");

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

  const getProjectComponent = () => {
    switch (projectId) {
      case "todo-app":
        return projectComponents.todoApp;
      case "weather-dashboard":
        return projectComponents.weatherDashboard;
      case "markdown-editor":
        return projectComponents.markdownEditor;
      case "pomodoro-timer":
        return projectComponents.pomodoroTimer;
      case "calculator":
        return projectComponents.calculator;
      case "recipe-finder":
        return projectComponents.recipeFinder;
      default:
        return null;
    }
  };

  const projectComponent = getProjectComponent();

  if (!projectComponent) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <h1 className="text-3xl font-bold mb-4">Project Not Available</h1>
        <p className="text-muted-foreground mb-8">
          This project is not yet available or has been removed.
        </p>
        <Button onClick={() => navigate("/dashboard")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>
    );
  }

  if (isCodeView) {
    const CodeComponent = projectComponent.code;
    return (
      <div className="min-h-screen">
        <div className="bg-background py-4 px-6 border-b shadow-sm mb-6">
          <Button
            variant="ghost"
            className="mb-2"
            onClick={() => navigate(`/projects/${project.id}`)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to project details
          </Button>
          <h1 className="text-xl font-bold">{project.title} - Code</h1>
        </div>
        <div className="px-6 py-4">
          <CodeComponent />
        </div>
      </div>
    );
  }

  const AppComponent = projectComponent.app;
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
        <AppComponent />
      </div>
    </div>
  );
};

export default ProjectDemo;
