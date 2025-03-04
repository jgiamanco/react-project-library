
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { projects } from "@/data/projects";
import ProjectGrid from "@/components/projects/ProjectGrid";
import { toast } from "sonner";

const Dashboard = () => {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem("authenticated") === "true";
  const [loading, setLoading] = useState(true);

  // Redirect to sign in if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please sign in to access the dashboard");
      navigate("/signin");
    } else {
      // Simulate loading data
      const timer = setTimeout(() => {
        setLoading(false);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-primary rounded-full animate-spin mb-4"></div>
          <p className="text-muted-foreground">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold mb-2">Project Dashboard</h1>
        <p className="text-muted-foreground">
          Browse our collection of 25 React TypeScript projects. Each project includes complete source code and documentation.
        </p>
      </div>

      <ProjectGrid projects={projects} />
    </div>
  );
};

export default Dashboard;
