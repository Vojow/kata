import { Kata } from "./interfaces/Kata";

export const generateMessageCard = (data: Kata) => {
  return {
    activityTitle: data.name + " - " + data.rankName,
    text:
      "https://www.codewars.com" +
      data.href +
      "/train/typescript" +
      "\n" +
      data.description
  };
};
