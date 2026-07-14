export type MockResponseInput = {
  characterName: string;
  userMessage: string;
};

export function createMockResponse({
  characterName,
  userMessage,
}: MockResponseInput): string {
  const normalizedMessage = userMessage.trim().toLowerCase();

  if (
    normalizedMessage.includes('hello') ||
    normalizedMessage.includes('hi ')
  ) {
    return `Hello. I'm ${characterName}. I'm currently responding through Project Aphrodite's development mode, but our conversation flow, streaming interface, and message persistence are fully active.`;
  }

  if (normalizedMessage.includes('who are you')) {
    return `I'm ${characterName}, an AI companion inside Project Aphrodite. This response is being generated locally by the mock provider, so no paid API request was required.`;
  }

  if (normalizedMessage.includes('how are you')) {
    return `I'm doing well and ready to talk. Development mode is active, which lets us test this conversation experience without consuming API credits.`;
  }

  return `I received your message: "${userMessage}". This is a simulated response from ${characterName}. The important part is that streaming, interface behavior, and database persistence can now be tested without a real API key.`;
}
