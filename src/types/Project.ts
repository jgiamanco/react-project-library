
export interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  timeEstimate: string;
  githubUrl: string;
  demoUrl: string;
  readme: string;
}
