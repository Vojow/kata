import dotenv from "dotenv";
dotenv.config();
import { getKata, sendKata } from "./src/kata-api";

(async () => {
  const kata = await getKata();
  await sendKata(kata.data);
})();
