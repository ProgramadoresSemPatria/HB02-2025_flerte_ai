import { apiInstance } from "../lib/axios";
import { User } from "../types/user";

type CreateConversationResponse = {
    id: number;
    title: string;
    createdAt: string;
    userId: number;
    user: User | null;
    messages: string[] | null
};

const createConversation = async (title: string) => {
  const res = await apiInstance.post<CreateConversationResponse>(
    "/conversations",
    { title }
  );
  return res.data;
};

export default createConversation;
