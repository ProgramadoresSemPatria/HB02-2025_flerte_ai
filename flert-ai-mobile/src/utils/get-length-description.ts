import { UserPreferences } from "../screens/chat-screen";

export const getLengthDescription = (length: UserPreferences["responseLength"]) => {
    switch (length) {
      case "Curta":
        return "Respostas concisas e diretas ao ponto";
      case "Média":
        return "Equilíbrio ideal entre detalhes e objetividade";
      case "Longa":
        return "Explicações detalhadas e completas";
      default:
        return "Equilíbrio ideal entre detalhes e objetividade";
    }
  };

export const getLengthFromDescription = (description: string): UserPreferences["responseLength"] => {
    switch (description) {
        case "Respostas concisas e diretas ao ponto":
            return "Curta";
        case "Explicações detalhadas e completas":
            return "Longa";
        case "Equilíbrio ideal entre detalhes e objetividade":
        default:
            return "Média";
    }
};