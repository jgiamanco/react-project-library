import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { projects } from "@/data/projects";
import { Project } from "@/types/Project";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Code, Play } from "lucide-react";
import ReactMarkdown from "react-markdown";
// Removed import for PreBlock

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Find the project by ID
    const projectId = id || "";
    const foundProject = projects.find((p) => p.id === projectId);

    if (foundProject) {
      setProject(foundProject);
    }

    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-primary rounded-full animate-spin mb-4"></div>
          <p className="text-muted-foreground">Loading project...</p>
        </div>
      </div>
    );
  }

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

  const difficultyColor = {
    beginner: "bg-emerald-100 text-emerald-800",
    intermediate: "bg-amber-100 text-amber-800",
    advanced: "bg-rose-100 text-rose-800",
  }[project.difficulty];

  return (
    <div className="pt-24 pb-16 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to projects
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          <div className="lg:col-span-2">
            <div className="relative aspect-video overflow-hidden rounded-xl border mb-6">
              <img
                src={project.image}
                alt={project.title}
                className="h-full w-full object-cover"
              />
            </div>
            <h1 className="text-3xl font-bold mb-4">{project.title}</h1>
            <p className="text-lg text-muted-foreground mb-6">
              {project.description}
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
              {project.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="flex flex-wrap gap-4 mb-10">
              <Button
                className="flex items-center"
                onClick={() => navigate(`/projects/${project.id}/demo/code`)}
              >
                <Code className="mr-2 h-4 w-4" />
                View Code
              </Button>
              <Button
                variant="secondary"
                className="flex items-center"
                onClick={() => navigate(`/projects/${project.id}/demo`)}
              >
                <Play className="mr-2 h-4 w-4" />
                View Demo
              </Button>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-xl p-6 border mb-6">
              <h2 className="text-xl font-semibold mb-4">Project Details</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Difficulty
                  </p>
                  <Badge className={`${difficultyColor} capitalize`}>
                    {project.difficulty}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Skills</p>
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="readme" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="readme">README</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          <TabsContent value="readme" className="prose prose-blue max-w-none">
            <div className="bg-white rounded-xl p-6 border"> {/* Removed markdown-body class */}
              <ReactMarkdown> {/* Removed components prop */}
                {project.readme}
              </ReactMarkdown>
            </div>
          </TabsContent>
          <TabsContent value="preview">
            <div className="bg-white rounded-xl p-6 border min-h-[400px] flex flex-col items-center justify-center">
              <div className="mb-6 text-center">
                <h2 className="text-xl font-semibold mb-2">
                  Live Project Demo
                </h2>
                <p className="text-muted-foreground text-center mb-6">
                  Experience the project in action with our interactive demo.
                </p>
              </div>
              <div className="flex space-x-4">
                <Button
                  onClick={() => navigate(`/projects/${project.id}/demo`)}
                  className="flex items-center"
                >
                  <Play className="mr-2 h-4 w-4" />
                  View Demo
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate(`/projects/${project.id}/demo/code`)}
                  className="flex items-center"
                >
                  <Code className="mr-2 h-4 w-4" />
                  View Code
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProjectDetail;