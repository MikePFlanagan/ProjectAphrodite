export type ChatContext = {
  user: {
    id: string;
    name: string;
    email?: string | null;
    role: 'USER' | 'CREATOR' | 'ADMIN';
  };

  character: {
    id: string;
    name: string;
    tagline: string;
    description: string;
    personalityPrompt: string;
  };

  conversation: {
    id: string;
  };
};
