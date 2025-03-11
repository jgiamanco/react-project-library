
import { useEffect, useState, useCallback, useMemo } from "react";
import { projects } from "@/data/projects";
import ProjectGrid from "@/components/projects/ProjectGrid";
import { trackRenderTime } from "@/utils/performance-monitoring";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  
  // Memoize project data to prevent unnecessary re-renders
  const projectsData = useMemo(() => projects, []);
  
  // Track render performance
  useEffect(() => {
    const endTracking = trackRenderTime('Dashboard');
    return endTracking;
  }, []);

  // Optimize loading behavior with requestIdleCallback
  useEffect(() => {
    // Performance optimization - use requestIdleCallback if available
    const loadProjects = () => {
      // If projects are already available, don't show loading state
      if (projectsData.length > 0) {
        setLoading(false);
        return;
      }
      
      // Set a maximum loading time to prevent indefinite loading
      const timeout = setTimeout(() => setLoading(false), 800);
      return () => clearTimeout(timeout);
    };
    
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      // Use requestIdleCallback to defer non-essential work
      const idleCallbackId = requestIdleCallback(loadProjects, { timeout: 1000 });
      return () => cancelIdleCallback(idleCallbackId);
    } else {
      // Fallback for browsers without requestIdleCallback
      loadProjects();
    }
  }, [projectsData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-120px)]">
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
        <p className="text-muted-foreground mb-2">
          Browse our collection of 25 React TypeScript projects. Each project includes complete source code and documentation.
        </p>
        <p className="text-sm text-muted-foreground">
          All projects include GitHub repositories with full source code and live demos to explore the functionality.
        </p>
      </div>

      <ProjectGrid projects={projectsData} />
    </div>
  );
};

export default Dashboard;
