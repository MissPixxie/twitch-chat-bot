import dotenv from "dotenv";
import { refreshAccessToken } from "./refreshToken.js";

dotenv.config();

// Get OAuth token for the bot 'bottenbirgit'

const TOKEN_URL = "https://id.twitch.tv/oauth2/token";

type SearchParams = {
	client_id: string;
	client_secret: string;
	code: string;
	grant_type: string;
	redirect_url: string;
};
export const getUserToken = async () => {
	if (!process.env.USER_ACCESS_TOKEN) {
		console.log("No access token, visit http://localhost/auth");
		return;
	}
	try {
		const response = await fetch(TOKEN_URL, {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: new URLSearchParams({
				client_id: process.env.TWITCH_CLIENT_ID!,
				client_secret: process.env.TWITCH_CLIENT_SECRET!,
				code: process.env.USER_ACCESS_TOKEN,
				grant_type: "authorization_code",
				redirect_uri: "http://localhost:3000/callback/",
			}),
		});

		if (!response.ok) {
			const text = await response.text();
			throw new Error(
				`Failed getting token: ${response.status} - ${text}`
			);
		}
		const tokenResponse = await refreshAccessToken();
		return tokenResponse.access_token;
	} catch (error) {
		console.error("Token refresh failed:", error);
		return null;
	}
};
