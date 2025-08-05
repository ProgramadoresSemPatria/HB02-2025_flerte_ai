import { AuthProvider } from "@/src/context/auth-context";
import useAuth from "@/src/hooks/auth/use-auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, router } from "expo-router";
import { useEffect } from "react";
import { StatusBar } from "react-native";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <StatusBar
          barStyle="dark-content"
          translucent
          backgroundColor="transparent"
        />
        <AuthHandler />
        <Stack screenOptions={{ headerShown: false }} />
      </AuthProvider>
    </QueryClientProvider>
  );
}

const AuthHandler = () => {
  const { isLogged } = useAuth();

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isLogged === undefined) return;
      if (isLogged) {
        router.replace('/(main)/home');
      } else {
        router.replace('/');
      }
    }, 100); 

    return () => clearTimeout(timeout);
  }, [isLogged]);

  return null;
};
