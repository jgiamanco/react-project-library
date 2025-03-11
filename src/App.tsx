
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
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

// Removed duplicate providers that are already in main.tsx
const App = () => (
  <>
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
  </>
);

export default App;
