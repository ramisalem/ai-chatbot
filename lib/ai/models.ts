export const DEFAULT_CHAT_MODEL: string = 'openai-gpt-4o-mini';

export interface ChatModel {
  id: string;
  name: string;
  description: string;
}

export const chatModels: Array<ChatModel> = [
  {
    id: 'chat-model',
    name: 'Grok Vision',
    description: 'Advanced multimodal model with vision and text capabilities',
  },
  {
    id: 'chat-model-reasoning',
    name: 'Grok Reasoning',
    description:
      'Uses advanced chain-of-thought reasoning for complex problems',
  },
  {
    id: 'openai-gpt-4o',
    name: 'GPT-4o',
    description: 'Most capable GPT model with multimodal capabilities',
  },
  {
    id: 'openai-gpt-4o-mini',
    name: 'GPT-4o Mini',
    description: 'Faster and more affordable GPT-4 model',
  },
  {
    id: 'anthropic-claude-3.5-sonnet',
    name: 'Claude 3.5 Sonnet',
    description: 'Anthropic\'s most capable model for complex reasoning',
  },
  {
    id: 'anthropic-claude-3.5-haiku',
    name: 'Claude 3.5 Haiku',
    description: 'Fast and efficient Claude model',
  },
  {
    id: 'google-gemini-1.5-pro',
    name: 'Gemini 1.5 Pro',
    description: 'Google\'s most capable model with 2M token context',
  },
  {
    id: 'google-gemini-1.5-flash',
    name: 'Gemini 1.5 Flash',
    description: 'Fast and efficient model for everyday tasks',
  },
];
