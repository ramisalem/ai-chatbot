import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from 'ai';
import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';
import { google } from '@ai-sdk/google';
import { xai } from '@ai-sdk/xai';
import { isTestEnvironment } from '../constants';
import { chatModels, type ModelProvider } from './models';

const getModelByProvider = (provider: ModelProvider, modelId: string) => {
  switch (provider) {
    case 'openai':
      return openai(modelId);
    case 'google':
      return google(modelId);
    case 'anthropic':
      return anthropic(modelId);
    case 'xai':
      return xai(modelId);
    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }
};

export const getModelById = (chatModelId: string) => {
  const chatModel = chatModels.find(model => model.id === chatModelId);
  if (!chatModel) {
    throw new Error(`Model not found: ${chatModelId}`);
  }
  
  return getModelByProvider(chatModel.provider, chatModel.modelId);
};

// Legacy support for environment-based provider selection
const getLLMProvider = () => {
  const provider = process.env.LLM_PROVIDER || 'openai';
  
  switch (provider) {
    case 'anthropic':
      return {
        'chat-model': anthropic('claude-3-5-sonnet-20241022'),
        'chat-model-reasoning': wrapLanguageModel({
          model: anthropic('claude-3-5-sonnet-20241022'),
          middleware: extractReasoningMiddleware({ tagName: 'think' }),
        }),
        'title-model': anthropic('claude-3-5-haiku-20241022'),
        'artifact-model': anthropic('claude-3-5-sonnet-20241022'),
      };
    case 'google':
      return {
        'chat-model': google('gemini-1.5-pro-002'),
        'chat-model-reasoning': wrapLanguageModel({
          model: google('gemini-1.5-pro-002'),
          middleware: extractReasoningMiddleware({ tagName: 'think' }),
        }),
        'title-model': google('gemini-1.5-flash-002'),
        'artifact-model': google('gemini-1.5-pro-002'),
      };
    default: // openai
      return {
        'chat-model': openai('gpt-4o'),
        'chat-model-reasoning': wrapLanguageModel({
          model: openai('gpt-4o'),
          middleware: extractReasoningMiddleware({ tagName: 'think' }),
        }),
        'title-model': openai('gpt-4o-mini'),
        'artifact-model': openai('gpt-4o'),
      };
  }
};

// Create a dynamic provider that can handle both legacy and new model selection
const createDynamicProvider = () => {
  const legacyModels = getLLMProvider();
  
  // Add all new chat models to the language models
  const allLanguageModels: Record<string, any> = { ...legacyModels };
  
  for (const chatModel of chatModels) {
    allLanguageModels[chatModel.id] = getModelByProvider(chatModel.provider, chatModel.modelId);
  }
  
  // Add title and artifact models for different providers
  allLanguageModels['title-model-openai'] = openai('gpt-4o-mini');
  allLanguageModels['title-model-google'] = google('gemini-1.5-flash-002');
  allLanguageModels['title-model-anthropic'] = anthropic('claude-3-5-haiku-20241022');
  allLanguageModels['title-model-xai'] = xai('grok-3-mini');
  
  allLanguageModels['artifact-model-openai'] = openai('gpt-4o');
  allLanguageModels['artifact-model-google'] = google('gemini-1.5-pro-002');
  allLanguageModels['artifact-model-anthropic'] = anthropic('claude-3-5-sonnet-20241022');
  allLanguageModels['artifact-model-xai'] = xai('grok-2-vision-1212');
  
  return customProvider({
    languageModels: allLanguageModels,
  });
};

export const myProvider = isTestEnvironment
  ? (() => {
      const {
        artifactModel,
        chatModel,
        reasoningModel,
        titleModel,
      } = require('./models.mock');
      return customProvider({
        languageModels: {
          'chat-model': chatModel,
          'chat-model-reasoning': reasoningModel,
          'title-model': titleModel,
          'artifact-model': artifactModel,
        },
      });
    })()
  : createDynamicProvider();

// Helper function to get title model for a specific provider
export const getTitleModelForProvider = (provider: ModelProvider): string => {
  return `title-model-${provider}`;
};

// Helper function to get artifact model for a specific provider  
export const getArtifactModelForProvider = (provider: ModelProvider): string => {
  return `artifact-model-${provider}`;
};
