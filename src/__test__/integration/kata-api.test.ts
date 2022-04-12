import { generateMessageCard } from "../../generate-message-card";
import axios from "jest-mock-axios";
import { getKata, sendKata, sendKataCoders } from "../../kata-api";

afterEach(() => {
  // cleaning up the mess left behind the previous test
  axios.reset();
});

describe("getKata", () => {
  test("should return a proper kata", async () => {
    axios.get.mockResolvedValueOnce({
      status: 200,
      statusText: "OK",
      data: {
        name: "Kata of the day",
        description: "description",
        rankName: "kyu 7",
        href: "/href/100"
      }
    });
    const kata = await getKata();
    expect(kata.data.name).toBeDefined();
    expect(kata.data.description).toBeDefined();
    expect(kata.data.rankName).toBeDefined();
    expect(kata.data.href).toBeDefined();
  });
});
describe("sendKata", () => {
  const data = {
    name: "Kata of the day",
    description: "description",
    rankName: "kyu 7",
    href: "/href/100"
  };
  test("should send a proper data", async () => {
    axios.post.mockResolvedValueOnce({ status: 200, statusText: "OK" });
    const card = {
      "@type": "MessageCard",
      "@context": "http://schema.org/extensions",
      themeColor: "0072C6",
      summary: "Kata of the day",
      sections: [generateMessageCard(data)]
    };
    const parameters = {
      headers: {
        "content-type": "application/vnd.microsoft.teams.card.o365connector"
      }
    };

    const response = await sendKata(data);
    expect(axios.post).toBeCalledTimes(1);
    expect(axios.post).toBeCalledWith(process.env.WEBHOOK_URL, card, parameters);
    expect(response).toBe("200 - OK");
  });
  test("should throw error", async () => {
    axios.post.mockRejectedValueOnce({ status: 400, statusText: "Bad request" });
    const response = await sendKata(data);
    expect(axios.post).toBeCalledTimes(1);
    expect(response).toMatchObject({ status: 400, statusText: "Bad request" });
  });
});

describe("sendKataCoders", () => {
  test("should send a proper data", async () => {
    axios.post.mockResolvedValueOnce({ status: 200, statusText: "OK" });
    const response = await sendKataCoders();
    expect(axios.post).toBeCalledTimes(1);
    expect(response).toBe("200 - OK");
  });
  test("should throw error", async () => {
    axios.post.mockRejectedValueOnce({ status: 400, statusText: "Bad request" });
    const response = await sendKataCoders();
    expect(axios.post).toBeCalledTimes(1);
    expect(response).toMatchObject({ status: 400, statusText: "Bad request" });
  });
});
