export interface Personality {
  warmth: number;
  humor: number;
  confidence: number;
  curiosity: number;
  emotionalExpressiveness: number;
  responseLength: 'concise' | 'balanced' | 'expansive';
  conversationStyle: 'supportive' | 'playful' | 'direct' | 'reflective';
  instructions: string;
}

export const defaultPersonality: Personality = {
  warmth: 75,
  humor: 50,
  confidence: 60,
  curiosity: 80,
  emotionalExpressiveness: 70,
  responseLength: 'balanced',
  conversationStyle: 'supportive',
  instructions: '',
};
