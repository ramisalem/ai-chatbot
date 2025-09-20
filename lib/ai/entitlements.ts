import type { UserType } from '@/app/(auth)/auth';
import type { ChatModel } from './models';

interface Entitlements {
  maxMessagesPerDay: number;
  availableChatModelIds: Array<ChatModel['id']>;
}

export const entitlementsByUserType: Record<UserType, Entitlements> = {
  /*
   * For users with an account
   */
  regular: {
    maxMessagesPerDay: 100,
    availableChatModelIds: [
      'chat-model',
      'chat-model-reasoning',
      'openai-gpt-4o',
      'openai-gpt-4o-mini',
      'anthropic-claude-3.5-sonnet',
      'anthropic-claude-3.5-haiku',
      'google-gemini-1.5-pro',
      'google-gemini-1.5-flash',
    ],
  },

  /*
   * For admin users with unlimited access
   */
  admin: {
    maxMessagesPerDay: 999999,
    availableChatModelIds: [
      'chat-model',
      'chat-model-reasoning',
      'openai-gpt-4o',
      'openai-gpt-4o-mini',
      'anthropic-claude-3.5-sonnet',
      'anthropic-claude-3.5-haiku',
      'google-gemini-1.5-pro',
      'google-gemini-1.5-flash',
    ],
  },

  /*
   * TODO: For users with an account and a paid membership
   */
};
