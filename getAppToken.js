import dotenv from "dotenv";
import { startBot } from "./chatBot.js";

dotenv.config();

// Hämtar token för applicationen som är upplagd på twitch developer console

const TOKEN_URL = "https://id.twitch.tv/oauth2/token";
const REQUEST_BODY = `client_id=${process.env.TWITCH_CLIENT_ID}&client_secret=${process.env.TWITCH_CLIENT_SECRET}&grant_type=client_credentials`;
const REQUEST_USER_TOKEN_URL = `client_id=${process.env.TWITCH_CLIENT_ID}&client_secret=${process.env.TWITCH_CLIENT_SECRET}&code=${process.env.USER_ACCESS_TOKEN}&grant_type=authorization_code&redirect_uri=http://localhost:3000/`;
const USER_ID_TOKEN_URL = "https://id.twitch.tv/oauth2/authorize";
const BOT_USER_ID = "bottenbirgit"; // This is the User ID of the chat bot

export const getAppToken = async () => {
	try {
		const response = await fetch(TOKEN_URL, {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: REQUEST_BODY,
		});

		if (!response.ok) {
			const text = await response.text();
			throw new Error(`Fel vid begäran: ${response.status} - ${text}`);
		}

		const data = await response.json();
		console.log(data);
	} catch (error) {
		console.error("Fel vid fetch-begäran:", error);
	}
};
