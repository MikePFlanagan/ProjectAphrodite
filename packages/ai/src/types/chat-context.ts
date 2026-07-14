export type ChatMemory = {
  id: string;
  key: string;
  value: string;
  importance: number;
};

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

  memories: ChatMemory[];
};
