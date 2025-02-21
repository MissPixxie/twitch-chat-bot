// Validate token
export async function validateToken(token: string) {
	try {
		const response = await fetch("https://id.twitch.tv/oauth2/validate", {
			method: "GET",
			headers: {
				Authorization: "Bearer " + token,
			},
		});

		if (!response.ok) {
			const text = await response.text();
			throw new Error(`Failed validating: ${response.status} - ${text}`);
		}
		return await response.json();
	} catch (error) {
		console.error("Failed fetch:", error);
	}
}
