import { generateMessageCard } from "src/generate-message-card";

describe("generateMessageCard", () => {
  test("should return a proper message card", () => {
    const kataData = {
      name: "Kata of the day",
      description: "description",
      rankName: "kyu 7",
      href: "/href/100"
    };
    const expected = {
      activityTitle: "Kata of the day - kyu 7",
      text: "https://www.codewars.com/href/100/train/typescript" + "\n" + "description"
    };
    expect(generateMessageCard(kataData)).toMatchObject(expected);
  });
});
