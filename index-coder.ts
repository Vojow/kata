import dotenv from "dotenv";
import { sendKataCoders } from "./src/kata-api";
dotenv.config();

(async () => {
  await sendKataCoders();
})();
