import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, lazy, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { projects } from "@/data/projects";
import { trackRenderTime } from "@/utils/performance-monitoring";
import projectComponents from "@/projects";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

// Create a loading component for projects
const ProjectLoading = () => (
  <div className="flex items-center justify-center min-h-[calc(100vh-100px)] pt-20">
    <div className="flex flex-col items-center">
      <LoadingSpinner size="lg" color="primary" />
      <p className="text-muted-foreground mt-4">Loading project...</p>
    </div>
  </div>
);

const ProjectDemo = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  // Track component rendering performance
  useEffect(() => {
    const endTracking = trackRenderTime('ProjectDemo');
    return endTracking;
  }, []);

  // Simulate progressive loading with a small delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [id]);

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
    const projectMap = {
      "todo-app": projectComponents.todoApp,
      "weather-dashboard": projectComponents.weatherDashboard,
      "markdown-editor": projectComponents.markdownEditor,
      "pomodoro-timer": projectComponents.pomodoroTimer,
      "calculator": projectComponents.calculator,
      "recipe-finder": projectComponents.recipeFinder,
      "ai-chatbot": projectComponents.aiChatbot,
      "ai-image-generator": projectComponents.aiImageGenerator,      // Added new project
      "ai-content-summarizer": projectComponents.aiContentSummarizer, // Added new project
      // Removed "ecommerce-product" and "job-tracker" as they are not fully functional
    };
    
    return projectMap[projectId as keyof typeof projectMap] || null;
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

  if (isLoading) {
    return <ProjectLoading />;
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
          <Suspense fallback={<ProjectLoading />}>
            <CodeComponent />
          </Suspense>
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
      <div className="pt-24 pb-10">
        <Suspense fallback={<ProjectLoading />}>
          <AppComponent />
        </Suspense>
      </div>
    </div>
  );
};

export default ProjectDemo;