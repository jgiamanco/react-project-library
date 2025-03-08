import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Code, Boxes, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [scrollPosition, setScrollPosition] = useState(0);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Reveal animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setRevealed(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center text-center px-4">
        <div
          className="absolute inset-0 z-0"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.1) 0%, rgba(255, 255, 255, 0) 70%)",
          }}
        />

        <div
          className={`max-w-4xl mx-auto reveal-animation ${
            revealed ? "revealed" : ""
          }`}
          style={{ "--stagger-delay": "0.1s" } as React.CSSProperties}
        >
          <div className="inline-block mb-6">
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              25 React TypeScript Projects
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            Master React & TypeScript with Practical Projects
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Explore a curated collection of 25 hands-on React TypeScript
            projects designed to help you build real-world skills.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {isAuthenticated ? (
              <Button
                size="lg"
                className="h-12 px-6 font-medium text-base"
                onClick={() => navigate("/dashboard")}
              >
                <span>Explore Projects</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <>
                <Button
                  size="lg"
                  className="h-12 px-6 font-medium text-base"
                  onClick={() => navigate("/dashboard")}
                >
                  <span>Explore Projects</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 px-6 font-medium text-base"
                  onClick={() => navigate("/signin")}
                >
                  Sign in
                </Button>
              </>
            )}
          </div>
        </div>

        <div
          className="absolute bottom-8 transform -translate-x-1/2 animate-bounce"
          style={{ opacity: Math.max(0, 1 - scrollPosition / 200) }}
        >
          <div className="w-8 h-12 rounded-full border-2 border-gray-300 flex justify-center items-start p-1">
            <div className="w-1.5 h-3 bg-gray-300 rounded-full animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Why Learn with Our Projects?
            </h2>
            <p className="text-lg text-muted-foreground">
              Each project is carefully designed to teach you specific skills
              and best practices in React and TypeScript development.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm border">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                <Code className="h-6 w-6 text-blue-700" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Learn by Doing</h3>
              <p className="text-muted-foreground">
                Each project comes with clear instructions and a detailed README
                to guide you through the development process.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm border">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                <Boxes className="h-6 w-6 text-blue-700" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Real-World Skills</h3>
              <p className="text-muted-foreground">
                Projects are designed to simulate real-world scenarios and
                challenges you'll face as a developer.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm border">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 text-blue-700" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Beautiful UI</h3>
              <p className="text-muted-foreground">
                Focus on creating polished user interfaces with modern design
                principles and animations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Start Building?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Sign in to access all 25 projects and start your learning journey
              today.
            </p>
            <Button
              size="lg"
              className="h-12 px-6 font-medium text-base"
              onClick={() => navigate("/signin")}
            >
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
