import { Stack } from 'expo-router';

export default function ChatsLayout() {
    return (
        <Stack >
            <Stack.Screen 
                name="chat-history" 
                options={{ 
                    title: "Chats",
                    headerShown: false 
                }} 
            />
            <Stack.Screen 
                name="[id]/chat" 
                options={{ 
                    title: "Chat",
                    headerShown: false 
                }} 
            />
        </Stack>
    );
}