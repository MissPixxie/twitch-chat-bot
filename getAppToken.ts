import dotenv from "dotenv";

dotenv.config();

const TOKEN_URL = "https://id.twitch.tv/oauth2/token";
const REQUEST_BODY = `client_id=${process.env.TWITCH_CLIENT_ID}&client_secret=${process.env.TWITCH_CLIENT_SECRET}&grant_type=client_credentials`;

export const getAppToken = async (): Promise<void> => {
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
	} catch (error) {
		console.error("Fel vid fetch-begäran:", error);
	}
};
