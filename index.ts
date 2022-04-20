import dotenv from "dotenv";
dotenv.config();
import { getKataInRange, sendKata } from "./src/kata-api";

(async () => {
  const kata = await getKataInRange({ start: 4, end: 7 });
  await sendKata(kata);
})();
