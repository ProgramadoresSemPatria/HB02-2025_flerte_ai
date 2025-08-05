import { apiInstance } from "../lib/axios";

type GetConversationResponse = {
  id: string;
  title: string;
  createdAt: string;
}[];

const getConversations = async () => {
  const res = await apiInstance.get<GetConversationResponse>("/conversations");
  return res.data;
};

export default getConversations;