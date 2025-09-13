export const DEFAULT_CHAT_MODEL: string = 'openai-gpt-4o';

export type ModelProvider = 'openai' | 'google' | 'anthropic' | 'xai';

export interface ChatModel {
  id: string;
  name: string;
  description: string;
  provider: ModelProvider;
  modelId: string;
}

export const chatModels: Array<ChatModel> = [
  // OpenAI Models
  {
    id: 'openai-gpt-4o',
    name: 'GPT-4o',
    description: 'Most capable GPT model with multimodal capabilities',
    provider: 'openai',
    modelId: 'gpt-4o',
  },
  {
    id: 'openai-gpt-4o-mini',
    name: 'GPT-4o Mini',
    description: 'Faster and more affordable GPT-4 model',
    provider: 'openai',
    modelId: 'gpt-4o-mini',
  },
  {
    id: 'openai-gpt-4',
    name: 'GPT-4',
    description: 'High-quality reasoning and complex task performance',
    provider: 'openai',
    modelId: 'gpt-4',
  },
  
  // Google Models
  {
    id: 'google-gemini-1.5-pro',
    name: 'Gemini 1.5 Pro',
    description: 'Google\'s most capable model with 2M token context',
    provider: 'google',
    modelId: 'gemini-1.5-pro-002',
  },
  {
    id: 'google-gemini-1.5-flash',
    name: 'Gemini 1.5 Flash',
    description: 'Fast and efficient model for everyday tasks',
    provider: 'google',
    modelId: 'gemini-1.5-flash-002',
  },
  
  // Anthropic Models (existing)
  {
    id: 'anthropic-claude-3.5-sonnet',
    name: 'Claude 3.5 Sonnet',
    description: 'Anthropic\'s most capable model for complex reasoning',
    provider: 'anthropic',
    modelId: 'claude-3-5-sonnet-20241022',
  },
  {
    id: 'anthropic-claude-3.5-haiku',
    name: 'Claude 3.5 Haiku',
    description: 'Fast and efficient Claude model',
    provider: 'anthropic',
    modelId: 'claude-3-5-haiku-20241022',
  },
  
  // xAI Models (existing Grok models)
  {
    id: 'xai-grok-vision',
    name: 'Grok Vision',
    description: 'Advanced multimodal model with vision and text capabilities',
    provider: 'xai',
    modelId: 'grok-2-vision-1212',
  },
  {
    id: 'xai-grok-reasoning',
    name: 'Grok Reasoning',
    description: 'Uses advanced chain-of-thought reasoning for complex problems',
    provider: 'xai',
    modelId: 'grok-3-mini',
  },
];
