// src/pages/chatbot/service.ts
import { OpenAIChatProvider, XRequest } from '@ant-design/x-sdk';

const getChatApiUrl = () => {
  if (!process.env.CHAT_API_URL) {
    throw new Error('CHAT_API_URL must be configured before enabling chatbot.');
  }
  return process.env.CHAT_API_URL;
};

/**
 * Factory — call once per component mount (wrap in useMemo).
 * OpenAIChatProvider handles SSE parsing and history accumulation internally.
 */
export const createChatProvider = () =>
  new OpenAIChatProvider({
    request: XRequest(getChatApiUrl(), {
      manual: true,
      params: { model: 'glm-4.5-flash', stream: true },
    }),
  });
