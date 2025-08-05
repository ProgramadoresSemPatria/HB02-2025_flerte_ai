import { UserPreferences } from "../screens/chat-screen";

export const getStyleDescription = (style: UserPreferences["personalityStyle"]) => {
    switch (style) {
      case "Sensual":
        return "Tom mais provocante e sedutor, com dicas ousadas";
      case "Ameno":
        return "Abordagem suave e delicada, com calma e sutileza";
      case "Direto":
        return "Comunicação objetiva e direta, sem rodeios";
      default:
        return "Abordagem suave e delicada, com calma e sutileza";
    }
  };

export const getStyleFromDescription = (description: string): UserPreferences["personalityStyle"] => {
    switch (description) {
        case "Tom mais provocante e sedutor, com dicas ousadas":
            return "Sensual";
        case "Comunicação objetiva e direta, sem rodeios":
            return "Direto";
        case "Abordagem suave e delicada, com calma e sutileza":
        default:
            return "Ameno";
    }
};