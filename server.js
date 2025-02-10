import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { startBot, startTamaSocket } from "./chatBot.js";
import { updateEnvFile } from "./tokenManager.js";
import { createServer } from "http";
import { Server } from "socket.io";
import { TamaSocket } from "./handleTamaMessages.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const server = express();
const httpInstance = createServer(server);
const io = new Server(httpInstance);
const PORT = 3000;

server.use(express.static(path.join(__dirname, "public")));

// Routes
server.get("/", async (req, res) => {
	res.sendFile(path.join(__dirname, "public/index.html"));
});

// Route to authenticate the user
server.get("/auth", (req, res) => {
	const scope = [
		"user:write:chat",
		"user:read:chat",
		"chat:read",
		"chat:edit",
		"channel:moderate",
		"channel:read:subscriptions",
	].join(" ");

	const authUrl = new URL("https://id.twitch.tv/oauth2/authorize");
	authUrl.searchParams.set("response_type", "code");
	authUrl.searchParams.set("client_id", process.env.TWITCH_CLIENT_ID);
	authUrl.searchParams.set("redirect_uri", "http://localhost:3000/callback/");
	authUrl.searchParams.set("scope", scope);
	// Redirects to route "/callback/" to get the authorization code from params
	res.redirect(authUrl.toString());
});

let isBotStarted = false;

server.get("/callback", async (req, res) => {
	const { code } = req.query;

	if (!code) {
		return res.status(400).send("Authorization code missing");
	}

	try {
		const tokenResponse = await exchangeAuthorizationCodeForToken(code);
		// Update .env with new refresh token
		await updateEnvFile("USER_ACCESS_TOKEN", tokenResponse.access_token);
		await updateEnvFile("REFRESH_TOKEN", tokenResponse.refresh_token);

		// Attempt to start bot
		if (!isBotStarted) {
			let botStarted = await startBot();
			res.redirect("/");
		}
	} catch (error) {
		console.error("Authentication error:", error);
		res.status(500).send(`Authentication failed: ${error.message}`);
	}
});

async function exchangeAuthorizationCodeForToken(code) {
	const response = await fetch("https://id.twitch.tv/oauth2/token", {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		body: new URLSearchParams({
			client_id: process.env.TWITCH_CLIENT_ID,
			client_secret: process.env.TWITCH_CLIENT_SECRET,
			code,
			grant_type: "authorization_code",
			redirect_uri: "http://localhost:3000/callback/",
		}),
	});

	const data = await response.json();

	if (!response.ok) {
		throw new Error(`Token request failed: ${JSON.stringify(data)}`);
	}
	return data;
}

httpInstance.listen(PORT, async () => {
	console.log(`Server running on http://localhost:3000`);
	// Attempt initial bot start
	try {
		let botStarted = await startBot(io);
		let tamaSocketStarted = await startTamaSocket(io);
		if (botStarted) {
			console.log("Bot successfully started!");
		} else {
			console.log(
				"Bot waiting for authentication. Visit http://localhost:3000/auth"
			);
		}
	} catch (error) {
		console.error("Failed to start bot:", error);
	}
});
