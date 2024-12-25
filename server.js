import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { getAppToken } from "./getAppToken.js";
import { getUserToken } from "./getUserToken.js";
import { startBot } from "./chatBot.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "public/index.html"));
});

app.listen(PORT, () => {
	console.log("Server running");
});

const startChatBot = startBot();
console.log(startChatBot);

// const smt = getUserToken();
// console.log(smt);
