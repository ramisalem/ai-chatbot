export const DEFAULT_CHAT_MODEL: string = 'openai-gpt-4o-mini';

export interface ChatModel {
  id: string;
  name: string;
  description: string;
  provider: 'openai' | 'anthropic' | 'google' | 'xai';
}

export const chatModels: Array<ChatModel> = [
  {
    id: 'chat-model',
    name: 'Grok Vision',
    description: 'Advanced multimodal model with vision and text capabilities',
    provider: 'xai',
  },
  {
    id: 'chat-model-reasoning',
    name: 'Grok Reasoning',
    description:
      'Uses advanced chain-of-thought reasoning for complex problems',
    provider: 'xai',
  },
  {
    id: 'openai-gpt-4o',
    name: 'GPT-4o',
    description: 'Most capable GPT model with multimodal capabilities',
    provider: 'openai',
  },
  {
    id: 'openai-gpt-4o-mini',
    name: 'GPT-4o Mini',
    description: 'Faster and more affordable GPT-4 model',
    provider: 'openai',
  },
  {
    id: 'anthropic-claude-3.5-sonnet',
    name: 'Claude 3.5 Sonnet',
    description: "Anthropic's most capable model for complex reasoning",
    provider: 'anthropic',
  },
  {
    id: 'anthropic-claude-3.5-haiku',
    name: 'Claude 3.5 Haiku',
    description: 'Fast and efficient Claude model',
    provider: 'anthropic',
  },
  {
    id: 'google-gemini-1.5-pro',
    name: 'Gemini 1.5 Pro',
    description: "Google's most capable model with 2M token context",
    provider: 'google',
  },
  {
    id: 'google-gemini-1.5-flash',
    name: 'Gemini 1.5 Flash',
    description: 'Fast and efficient model for everyday tasks',
    provider: 'google',
  },
];

/**
 * Get the provider for a given model ID
 * @param modelId - The model ID to look up
 * @returns The provider name or 'openai' as fallback
 */
export function getProviderForModel(
  modelId: string,
): 'openai' | 'anthropic' | 'google' | 'xai' {
  const model = chatModels.find((model) => model.id === modelId);
  return model?.provider || 'openai'; // Default to OpenAI if model not found
}

/**
 * Get the current LLM provider based on the selected model
 * @param selectedModelId - The currently selected model ID
 * @returns The provider name to use for LLM_PROVIDER
 */
export function getLLMProviderForModel(
  selectedModelId: string = DEFAULT_CHAT_MODEL,
): string {
  const provider = getProviderForModel(selectedModelId);

  // Map internal provider names to environment variable values if needed
  const providerMap: Record<string, string> = {
    xai: 'xai',
    openai: 'openai',
    anthropic: 'anthropic',
    google: 'google',
  };

  return providerMap[provider] || 'openai';
}
