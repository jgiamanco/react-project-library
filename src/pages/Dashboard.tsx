
import { useEffect, useState, useCallback } from "react";
import { projects } from "@/data/projects";
import ProjectGrid from "@/components/projects/ProjectGrid";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);

  // Optimize loading behavior
  useEffect(() => {
    // Use requestAnimationFrame for better performance over setTimeout
    let rafId: number;
    
    // Check if data is already available (if user navigates back to dashboard)
    if (projects.length > 0) {
      // Immediate loading state update if data is available
      rafId = requestAnimationFrame(() => setLoading(false));
    } else {
      // Simulate loading data with a slight delay
      const startTime = performance.now();
      const minLoadTime = 800; // Minimum load time to prevent flashing
      
      rafId = requestAnimationFrame(() => {
        const elapsedTime = performance.now() - startTime;
        const remainingTime = Math.max(0, minLoadTime - elapsedTime);
        
        setTimeout(() => setLoading(false), remainingTime);
      });
    }
    
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

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

      <ProjectGrid projects={projects} />
    </div>
  );
};

export default Dashboard;
