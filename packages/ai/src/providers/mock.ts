export type DevelopmentResponseInput = {
  characterName: string;
  characterTagline: string;
  userName: string;
  userMessage: string;
};

/**
 * Deterministic, zero-cost response used only when AI_PROVIDER=mock.
 * The copy labels itself so it cannot be mistaken for a model response.
 */
export function createDevelopmentResponse({
  characterName,
  characterTagline,
  userName,
  userMessage,
}: DevelopmentResponseInput) {
  const normalized = userMessage.trim().toLowerCase();

  if (normalized === 'hi' || normalized.startsWith('hi ') || normalized.includes('hello')) {
    return `[Development response] Hello, ${userName}. I'm ${characterName}.`;
  }

  if (normalized.includes('who are you')) {
    return `[Development response] I'm ${characterName}. ${characterTagline}`;
  }

  return `[Development response] ${characterName} received your message: “${userMessage}”`;
}
