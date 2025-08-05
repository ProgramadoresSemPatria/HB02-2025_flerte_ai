export const generateChatTitle = () => {
  const today = new Date();
  const formattedDate = today.toISOString().split("T")[0].replace(/-/g, "");
  const formattedTime = today.toTimeString().split(" ")[0].replace(/:/g, "");
  return `CHAT__${formattedDate}_${formattedTime}`;
};
