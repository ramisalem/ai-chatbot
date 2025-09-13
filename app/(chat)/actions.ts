'use server';

import { generateText, type UIMessage } from 'ai';
import { cookies } from 'next/headers';
import {
  deleteMessagesByChatIdAfterTimestamp,
  getMessageById,
  updateChatVisiblityById,
} from '@/lib/db/queries';
import type { VisibilityType } from '@/components/visibility-selector';
import { myProvider, getTitleModelForProvider } from '@/lib/ai/providers';
import { chatModels } from '@/lib/ai/models';

export async function saveChatModelAsCookie(model: string) {
  const cookieStore = await cookies();
  cookieStore.set('chat-model', model);
}

export async function generateTitleFromUserMessage({
  message,
  selectedChatModel,
}: {
  message: UIMessage;
  selectedChatModel?: string;
}) {
  // If we have a selected chat model, use its provider for the title model
  let titleModelId = 'title-model'; // default fallback
  
  if (selectedChatModel) {
    const chatModel = chatModels.find(model => model.id === selectedChatModel);
    if (chatModel) {
      titleModelId = getTitleModelForProvider(chatModel.provider);
    }
  }
  
  const { text: title } = await generateText({
    model: myProvider.languageModel(titleModelId),
    system: `\n
    - you will generate a short title based on the first message a user begins a conversation with
    - ensure it is not more than 80 characters long
    - the title should be a summary of the user's message
    - do not use quotes or colons`,
    prompt: JSON.stringify(message),
  });

  return title;
}

export async function deleteTrailingMessages({ id }: { id: string }) {
  const [message] = await getMessageById({ id });

  await deleteMessagesByChatIdAfterTimestamp({
    chatId: message.chatId,
    timestamp: message.createdAt,
  });
}

export async function updateChatVisibility({
  chatId,
  visibility,
}: {
  chatId: string;
  visibility: VisibilityType;
}) {
  await updateChatVisiblityById({ chatId, visibility });
}
