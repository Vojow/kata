import axios from "axios";
import { Kata } from "./interfaces/Kata";
import { generateMessageCard } from "./generate-message-card";

export async function getKata() {
  return await axios.get(
    "https://www.codewars.com/trainer/peek/typescript/random?dequeue=true",
    {
      headers: {
        Cookie: process.env.CODEWARS_COOKIE,
        Authorization: process.env.CODEWARS_AUTH_TOKEN
      }
    }
  );
}

export async function sendKata(data: Kata) {
  const card = {
    "@type": "MessageCard",
    "@context": "http://schema.org/extensions",
    themeColor: "0072C6",
    summary: "Kata of the day",
    sections: [generateMessageCard(data)]
  };
  try {
    const response = await axios.post(process.env.WEBHOOK_URL, card, {
      headers: {
        "content-type": "application/vnd.microsoft.teams.card.o365connector"
      }
    });
    return `${response.status} - ${response.statusText}`;
  } catch (error) {
    return error;
  }
}
