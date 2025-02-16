import WebSocket, { WebSocketServer } from "ws";
import dotenv from "dotenv";
import { TamaSocket } from "./handleTamaMessages.js";

dotenv.config();

const BOT_USER_ID = process.env.BOT_USER_ID; // This is the User ID of the chat bot
const CLIENT_ID = process.env.TWITCH_CLIENT_ID;
const CHAT_CHANNEL_USER_ID = process.env.CHAT_CHANNEL_USER_ID; // This is the User ID of the channel that the bot will join and listen to chat messages of
const EVENTSUB_WEBSOCKET_URL = "wss://eventsub.wss.twitch.tv/ws";

var websocketSessionID;

// Start executing the bot from here
export const startBot = async (io) => {
	// Get OAuth token
	if (!process.env.USER_ACCESS_TOKEN) {
		console.log("you need an access token");
		return;
	} else {
		// Start WebSocket client and register handlers
		const websocketClient = startWebSocketClient(
			process.env.USER_ACCESS_TOKEN,
			io
		);
		return true;
	}
};

export function startWebSocketClient(OAuthToken, io) {
	let websocketClient = new WebSocket(EVENTSUB_WEBSOCKET_URL);

	websocketClient.on("error", console.error);

	websocketClient.on("open", () => {
		console.log("WebSocket connection opened to " + EVENTSUB_WEBSOCKET_URL);
	});

	websocketClient.on("message", (data) => {
		handleWebSocketMessage(JSON.parse(data.toString()), OAuthToken, io);
	});

	return websocketClient;
}

let tamaSocket;

export async function startTamaSocket(io) {
	tamaSocket = new TamaSocket(io);
}

async function handleWebSocketMessage(data, OAuthToken, io) {
	switch (data.metadata.message_type) {
		case "session_welcome": // First message you get from the WebSocket server when connecting
			websocketSessionID = data.payload.session.id; // Register the Session ID it gives us
			// Listen to EventSub, which joins the chatroom from your bot's account
			registerEventSubListeners(OAuthToken);
			break;
		case "notification": // An EventSub notification has occurred, such as channel.chat.message
			switch (data.metadata.subscription_type) {
				case "channel.chat.message":
					console.log(
						`#${data.payload.event.broadcaster_user_login} <${data.payload.event.chatter_user_login}> ${data.payload.event.message.text}`
					);
					const commands = [
						"!love",
						"!feed",
						"!play",
						"!bath",
						"!sleep",
						"!health",
					];

					const findCommand = commands.indexOf(
						data.payload.event.message.text
					);
					if (findCommand !== -1) {
						let newMessage = tamaSocket.sendMessage(
							data.payload.event.message.text,
							data.payload.event.chatter_user_login,
							OAuthToken
						);
						if (newMessage) {
							sendChatMessage(newMessage.toString(), OAuthToken);
						}
					}
			}
			break;
	}
}

// Sends messages back to chat
export async function sendChatMessage(chatMessage, OAuthToken) {
	let response = await fetch("https://api.twitch.tv/helix/chat/messages", {
		method: "POST",
		headers: {
			Authorization: "Bearer " + OAuthToken,
			"Client-Id": CLIENT_ID,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			broadcaster_id: CHAT_CHANNEL_USER_ID,
			sender_id: BOT_USER_ID,
			message: chatMessage,
		}),
	});
	if (response.status != 200) {
		let data = await response.json();
		console.error("Failed to send chat message");
		console.error(data);
	} else {
		console.log("Sent chat message: " + chatMessage);
	}
}

async function registerEventSubListeners(OAuthToken) {
	// Register channel.chat.message
	let response = await fetch(
		"https://api.twitch.tv/helix/eventsub/subscriptions",
		{
			method: "POST",
			headers: {
				Authorization: "Bearer " + OAuthToken,
				"Client-Id": CLIENT_ID,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				type: "channel.chat.message",
				version: "1",
				condition: {
					broadcaster_user_id: CHAT_CHANNEL_USER_ID,
					user_id: BOT_USER_ID,
				},
				transport: {
					method: "websocket",
					session_id: websocketSessionID,
				},
			}),
		}
	);
	if (response.status != 202) {
		let data = await response.json();
		console.error(
			"Failed to subscribe to channel.chat.message. API call returned status code " +
				response.status
		);
		console.error(data);
		//process.exit(1);
	} else {
		const data = await response.json();
		console.log(`Subscribed to channel.chat.message [${data.data[0].id}]`);
	}
}
