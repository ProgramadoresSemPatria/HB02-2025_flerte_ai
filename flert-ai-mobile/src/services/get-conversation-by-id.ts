import { apiInstance } from "../lib/axios";

type GetConversationById  = {
  id: string;
  title: string;
  createdAt: string;
}[];

const getConversationById = async (id:number) => {
  const res = await apiInstance.get<GetConversationById>(`/conversations/${id}/messages`);
  return res.data;
};

export default getConversationById;