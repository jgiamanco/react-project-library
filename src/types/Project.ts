export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  tags: string[];
  readme: string;
  resources: {
    title: string;
    url: string;
    internal?: boolean;
  }[];
}
