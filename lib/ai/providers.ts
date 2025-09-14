import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from 'ai';
import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';
import { google } from '@ai-sdk/google';
import { isTestEnvironment } from '../constants';

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
        'chat-model': openai('gpt-4o-mini'),
        'chat-model-reasoning': wrapLanguageModel({
          model: openai('gpt-4o-mini'),
          middleware: extractReasoningMiddleware({ tagName: 'think' }),
        }),
        'title-model': openai('gpt-4o-mini'),
        'artifact-model': openai('gpt-4o-mini'),
      };
  }
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
          'openai-gpt-4o': openai('gpt-4o'),
          'openai-gpt-4o-mini': openai('gpt-4o-mini'),
          'google-gemini-1.5-pro': google('gemini-1.5-pro-002'),
          'google-gemini-1.5-flash': google('gemini-1.5-flash-002'),
        },
      });
    })()
  : customProvider({
      languageModels: {
        ...getLLMProvider(),
        'openai-gpt-4o': openai('gpt-4o'),
        'openai-gpt-4o-mini': openai('gpt-4o-mini'),
        'google-gemini-1.5-pro': google('gemini-1.5-pro-002'),
        'google-gemini-1.5-flash': google('gemini-1.5-flash-002'),
      },
    });
