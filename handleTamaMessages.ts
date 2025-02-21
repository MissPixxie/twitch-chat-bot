//
//
//
import { sendChatMessage } from "./chatBot";
import { Server } from "socket.io";

class TamaSocket {
	io: Server;
	OAuthToken: string | null;

	constructor(io: Server) {
		this.io = io;
		this.createConnection();
		this.OAuthToken = null;
	}
	createConnection() {
		this.io.on("error", console.error);

		this.io.on("connection", (socket) => {
			console.log("A client connected ");
			socket.on("messageFromTama", (newMessage) => {
				console.log(newMessage);
				this.updateHealth(newMessage);
			});
		});
	}

	updateHealth(newHealth: object) {
		let timmysHealth = "";
		for (let [key, value] of Object.entries(newHealth)) {
			timmysHealth += ` ${key}: ${value}`;
		}
		if (this.OAuthToken !== null) {
			sendChatMessage(
				`Timmy's health is ${timmysHealth} 🔋`,
				this.OAuthToken
			);
		}
	}

	sendMessage(message: string, chatter: string, OAuthToken: string) {
		this.OAuthToken = OAuthToken;
		this.io.emit("botMessage", message);
		if (message !== "!health") {
			return this.returnMessage(message, chatter);
		}
	}

	returnMessage(message: string, chatter: string): string | string[] | null {
		let answer: string | string[] | null = null;

		switch (message) {
			case "!feed":
				answer = `@${chatter} fed Timmy 🍔`;
				break;
			case "!bath":
				answer = `Timmy was stinky so @${chatter} made him take a bath 🛁`;
				break;
			case "!sleep":
				answer = `@${chatter} told a story about their life and Timmy fell asleep 💤`;
				break;
			case "!play":
				answer = `@${chatter} played a game with Timmy 🎮`;
				break;
			case "!love":
				answer = `@${chatter} gave Timmy a hug ❤️`;
				break;
			case "!timmycommands":
				answer = this.getCommands();
				break;
		}
		return answer;
	}
	getCommands() {
		return [
			" !feed - Feed Timmy 🍔",
			" !bath - Give Timmy a bath 🛁",
			" !sleep - Make Timmy take a nap 💤",
			" !play - Play with Timmy ⚽",
			" !love - Give Timmy some love ❤️",
			" !health - Get Timmy's current health 🔋",
		];
	}
}

// class Message {
// 	constructor() {}
// 	messageHandler(io, messageType, message) {
// 		switch (messageType) {
// 			case "botMessage":
// 				io.emit("botMessage", message);
// 				break;
// 			case "messageFromTama":
// 				io.on("messageFromTama", (newMessage) => {
// 					console.log(newMessage);
// 				});
// 				break;
// 		}
// 	}
// }

export { TamaSocket };
