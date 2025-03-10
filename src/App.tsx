
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Index from "./pages/Index";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import ProjectDetail from "./pages/ProjectDetail";
import NotFound from "./pages/NotFound";
import ProjectDemo from "./components/projects/ProjectDemo";
import ProfilePage from "./pages/ProfilePage";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Contact from "./pages/Contact";
import { AuthProvider } from "./contexts/AuthContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route
            path="/"
            element={
              <Layout>
                <Index />
              </Layout>
            }
          />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/dashboard"
            element={
              <Layout requireAuth>
                <Dashboard />
              </Layout>
            }
          />
          <Route
            path="/projects/:id"
            element={
              <Layout requireAuth>
                <ProjectDetail />
              </Layout>
            }
          />
          <Route path="/projects/:id/demo" element={<ProjectDemo />} />
          <Route path="/projects/:id/demo/code" element={<ProjectDemo />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route
            path="/terms"
            element={
              <Layout>
                <Terms />
              </Layout>
            }
          />
          <Route
            path="/privacy"
            element={
              <Layout>
                <Privacy />
              </Layout>
            }
          />
          <Route
            path="/contact"
            element={
              <Layout>
                <Contact />
              </Layout>
            }
          />
          <Route
            path="*"
            element={
              <Layout>
                <NotFound />
              </Layout>
            }
          />
        </Routes>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
