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
  return {
    'chat-model': google('gemini-1.5-flash-002'),
    'chat-model-reasoning': wrapLanguageModel({
      model: google('gemini-1.5-flash-002'),
      middleware: extractReasoningMiddleware({ tagName: 'think' }),
    }),
    'title-model': google('gemini-1.5-flash-002'),
    'artifact-model': google('gemini-1.5-flash-002'),
  };
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
          'anthropic-claude-3.5-sonnet': anthropic('claude-3-5-sonnet-20241022'),
          'anthropic-claude-3.5-haiku': anthropic('claude-3-5-haiku-20241022'),
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
        'anthropic-claude-3.5-sonnet': anthropic('claude-3-5-sonnet-20241022'),
        'anthropic-claude-3.5-haiku': anthropic('claude-3-5-haiku-20241022'),
        'google-gemini-1.5-pro': google('gemini-1.5-pro-002'),
        'google-gemini-1.5-flash': google('gemini-1.5-flash-002'),
      },
    });
