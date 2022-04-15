import { generateMessageCard } from "../../generate-message-card";
import axios from "jest-mock-axios";
import { getKata, getKataInRange, sendKata, sendKataCoders } from "../../kata-api";

afterEach(() => {
  // cleaning up the mess left behind the previous test
  axios.reset();
});

const MOCKED_7_KYU = "7 kyu";
const MOCKED_8_KYU = "8 kyu";
const MOCKED_KATA = {
  status: 200,
  statusText: "OK",
  data: {
    name: "Kata of the day",
    description: "description",
    rankName: MOCKED_7_KYU,
    href: "/href/100"
  }
};

describe("getKata", () => {
  test("should return a proper kata", async () => {
    axios.get.mockResolvedValueOnce(MOCKED_KATA);
    const kata = await getKata();
    expect(kata.name).toBeDefined();
    expect(kata.description).toBeDefined();
    expect(kata.rankName).toBeDefined();
    expect(kata.href).toBeDefined();
  });
});

describe("getKataInRange", () => {
  test("should return a get between 5 and 7 kyu", async () => {
    axios.get.mockResolvedValueOnce(MOCKED_KATA);
    const kata = await getKataInRange({ start: 5, end: 7 });
    const rank = +kata.rankName.split(" ")[0];
    expect(rank).toBeGreaterThanOrEqual(5);
    expect(rank).toBeLessThanOrEqual(7);
  });
  test("should return anything after 5 calls", async () => {
    const mock = {
      ...MOCKED_KATA,
      data: { ...MOCKED_KATA.data, rankName: MOCKED_8_KYU }
    };
    axios.get.mockResolvedValueOnce(mock);
    axios.get.mockResolvedValueOnce(mock);
    axios.get.mockResolvedValueOnce(mock);
    axios.get.mockResolvedValueOnce(mock);
    axios.get.mockResolvedValueOnce(mock);
    axios.get.mockResolvedValueOnce(mock);
    axios.get.mockResolvedValueOnce(mock);
    axios.get.mockResolvedValueOnce(mock);
    axios.get.mockResolvedValueOnce(mock);
    axios.get.mockResolvedValueOnce(mock);
    const kata = await getKataInRange({ start: 5, end: 7 });
    const rank = +kata.rankName.split(" ")[0];
    expect(rank).toBe(8);
    expect(axios.get).toBeCalledTimes(10);
  });
});
describe("sendKata", () => {
  const data = {
    name: "Kata of the day",
    description: "description",
    rankName: MOCKED_7_KYU,
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
  process.env.CODERS = "Test1,Test2,Test3";
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
