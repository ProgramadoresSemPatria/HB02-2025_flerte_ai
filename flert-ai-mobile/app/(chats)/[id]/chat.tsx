import ChatByIdScreen from "@/src/screens/chat-by-id-screen";
import { useLocalSearchParams } from "expo-router";

const ChatById = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <ChatByIdScreen id={id} />;
};

export default ChatById;