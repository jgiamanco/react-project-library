// This is a mock AI service. In a real application, this would interact with an LLM API.

interface MockAIResponse {
  text: string;
  delay: number; // milliseconds
}

const mockResponses: Record<string, MockAIResponse> = {
  "hello": { text: "Hello there! How can I help you today?", delay: 800 },
  "how are you": { text: "I am a language model, I don't have feelings, but I'm ready to assist!", delay: 1000 },
  "what is react": { text: "React is a JavaScript library for building user interfaces.", delay: 1200 },
  "tell me a joke": { text: "Why don't scientists trust atoms? Because they make up everything!", delay: 1500 },
};

export const generateResponse = async (message: string): Promise<string> => {
  console.log("Mock AI Service: Received message:", message);
  const lowerCaseMessage = message.toLowerCase().trim();

  // Find a matching mock response or provide a default
  const response = mockResponses[lowerCaseMessage] || {
    text: `I received your message: "${message}". I'm a simple mock AI for this demo. Try asking "hello" or "what is react".`,
    delay: 1500,
  };

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, response.delay));

  console.log("Mock AI Service: Sending response:", response.text);
  return response.text;
};