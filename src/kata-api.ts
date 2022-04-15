import axios from "axios";
import { Kata } from "./interfaces/Kata";
import { generateMessageCard } from "./generate-message-card";
import chooseCoders from "./choose-coders";

export async function getKata(): Promise<Kata> {
  return (
    await axios.get(
      "https://www.codewars.com/trainer/peek/typescript/random?dequeue=true",
      {
        headers: {
          Cookie: process.env.CODEWARS_COOKIE,
          Authorization: process.env.CODEWARS_AUTH_TOKEN
        }
      }
    )
  ).data;
}

export async function getKataInRange({ start, end }): Promise<Kata> {
  let kata: Kata,
    counter = 10;
  do {
    kata = await getKata();
    counter--;
  } while (
    counter > 0 &&
    (kata.rankName?.split(" ")[0] < start || kata.rankName?.split(" ")[0] > end)
  );
  return kata;
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

export async function sendKataCoders() {
  const coders = chooseCoders();
  const card = {
    "@type": "MessageCard",
    "@context": "http://schema.org/extensions",
    themeColor: "0072C6",
    summary: "Kata of the day",
    sections: [
      {
        activityTitle: "Today winner to show code",
        activitySubtitle: "On daily kata",
        facts: [
          {
            name: "Winner",
            value: coders[0]
          },
          {
            name: "2nd place",
            value: coders[1]
          },
          {
            name: "3rd place",
            value: coders[2]
          }
        ],
        markdown: true
      }
    ]
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
