import dotenv from "dotenv";

dotenv.config();

// Get OAuth token for the bot 'bottenbirgit

const TOKEN_URL = "https://id.twitch.tv/oauth2/token";
const REQUEST_BODY = `client_id=${process.env.TWITCH_CLIENT_ID}&client_secret=${process.env.TWITCH_CLIENT_SECRET}&code=${process.env.USER_ACCESS_TOKEN}&grant_type=authorization_code&redirect_uri=http://localhost:3000/`;

export const getUserToken = async () => {
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
		console.log("Åtkomsttoken erhållet:", data);
		console.log(data.access_token);
		const oAuthToken = data.access_token;
		// Validate OAuth Token to get the bot user id
		const validatedToken = await validateToken(data.access_token);

		return oAuthToken;
	} catch (error) {
		console.error("Fel vid fetch-begäran:", error);
	}
};

// Validate token
const validateToken = async (token) => {
	try {
		const response = await fetch("https://id.twitch.tv/oauth2/validate", {
			method: "GET",
			headers: {
				Authorization: "Bearer " + token,
			},
		});

		if (!response.ok) {
			const text = await response.text();
			throw new Error(
				`Fel vid valideringen: ${response.status} - ${text}`
			);
		}
		const data = await response.json();
		console.log(data);
		return data;
	} catch (error) {
		console.error("Fel vid fetch-begäran:", error);
	}
};
