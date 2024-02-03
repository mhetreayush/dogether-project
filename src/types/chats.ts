export type ChatMessage = {
  from: {
    name: string;
    uid: string;
  };
  text: string;
  time: number;
  type: "text" | "image";
};
