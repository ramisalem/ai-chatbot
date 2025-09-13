import type { UserType } from '@/app/(auth)/auth';
import type { ChatModel } from './models';

interface Entitlements {
  maxMessagesPerDay: number;
  availableChatModelIds: Array<ChatModel['id']>;
}

export const entitlementsByUserType: Record<UserType, Entitlements> = {
  /*
   * For users without an account
   */
  guest: {
    maxMessagesPerDay: 20,
    availableChatModelIds: [
      'openai-gpt-4o-mini',
      'google-gemini-1.5-flash',
      'anthropic-claude-3.5-haiku',
    ],
  },

  /*
   * For users with an account
   */
  regular: {
    maxMessagesPerDay: 100,
    availableChatModelIds: [
      'openai-gpt-4o',
      'openai-gpt-4o-mini',
      'openai-gpt-4',
      'google-gemini-1.5-pro',
      'google-gemini-1.5-flash',
      'anthropic-claude-3.5-sonnet',
      'anthropic-claude-3.5-haiku',
    ],
  },

  /*
   * For admin users with unlimited access
   */
  admin: {
    maxMessagesPerDay: 999999,
    availableChatModelIds: [
      'openai-gpt-4o',
      'openai-gpt-4o-mini',
      'openai-gpt-4',
      'google-gemini-1.5-pro',
      'google-gemini-1.5-flash',
      'anthropic-claude-3.5-sonnet',
      'anthropic-claude-3.5-haiku',
      'xai-grok-vision',
      'xai-grok-reasoning',
    ],
  },

  /*
   * TODO: For users with an account and a paid membership
   */
};
