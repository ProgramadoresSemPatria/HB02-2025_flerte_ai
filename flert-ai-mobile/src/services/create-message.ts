import { apiInstance } from "../lib/axios";

type CreateMessageResponse = {
  id: number;
  content: string;
  sender: number;
  createdAt: string;
};

const createMessage = async (content: string, conversationId: number) => {
  const res = await apiInstance.post<CreateMessageResponse>(
    `/conversations/${conversationId}/messages`,
    { content }
  );
  return res.data;
};

export default createMessage;
