import dotenv from "dotenv";
import fs from "fs/promises";
import path from "path";
import { getUserToken } from "./getUserToken.js";
import { validateToken } from "./validateToken.js";

dotenv.config();

const TOKEN_URL = "https://id.twitch.tv/oauth2/token";

export async function refreshAccessToken() {
	const params = new URLSearchParams({
		client_id: process.env.TWITCH_CLIENT_ID,
		client_secret: process.env.TWITCH_CLIENT_SECRET,
		grant_type: "refresh_token",
		refresh_token: process.env.REFRESH_TOKEN,
	});

	const response = await fetch(TOKEN_URL, {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		body: params.toString(),
	});

	const data = await response.json();

	if (!response.ok) {
		if (
			response.status === 400 &&
			data.message === "Invalid refresh token"
		) {
			await clearRefreshToken();
			return getUserToken();
		}
		throw new Error(`Token refresh failed: ${JSON.stringify(data)}`);
	}

	// Update refresh token if a new one is provided
	if (data.refresh_token) {
		await updateRefreshToken(data.refresh_token);
	}

	// Validate the new access token
	await validateToken(data.access_token);

	return data;
}

export async function updateRefreshToken(newRefreshToken) {
	try {
		const envPath = path.resolve(process.cwd(), ".env");
		let envContent = await fs.readFile(envPath, "utf-8");

		// Update or add REFRESH_TOKEN
		if (envContent.includes("REFRESH_TOKEN=")) {
			envContent = envContent.replace(
				/REFRESH_TOKEN=.*/,
				`REFRESH_TOKEN=${newRefreshToken}`
			);
		} else {
			envContent += `\nREFRESH_TOKEN=${newRefreshToken}`;
		}

		await fs.writeFile(envPath, envContent);
		dotenv.config(); // Reload environment variables
	} catch (error) {
		console.error("Error updating .env file:", error);
	}
}

export async function clearRefreshToken() {
	await updateRefreshToken("");
}
