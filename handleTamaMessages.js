//
//
//
import { sendChatMessage } from "./chatBot.js";

let health;

class TamaSocket {
	constructor(io) {
		this.io = io;
		this.createConnection();
		this.latestHealth = {
			love: 0,
			hunger: 0,
			fun: 0,
			bath: 0,
			sleep: 0,
		};
		this.OAuthToken = null;
	}
	createConnection() {
		this.io.on("error", console.error);

		this.io.on("connection", (socket) => {
			console.log("A client connected ");
			this.socket = socket;
			socket.on("messageFromTama", (newMessage) => {
				this.updateHealth(newMessage);
			});
		});
	}

	updateHealth(newHealth) {
		for (let [key, value] of Object.entries(newHealth)) {
			if (this.latestHealth.hasOwnProperty(key)) {
				this.latestHealth[key] = value;
			}
		}
		console.log(this.latestHealth);
		let timmysHealth = "";
		for (let [key, value] of Object.entries(this.latestHealth)) {
			timmysHealth += ` ${key}: ${value}`;
		}
		sendChatMessage(`Timmy's health is ${timmysHealth}`, this.OAuthToken);
	}

	availableCommands(command) {
		console.log("available commands function" + command);
		const commands = [
			"!love",
			"!feed",
			"!play",
			"!bath",
			"!sleep",
			"!health",
		];

		const findCommand = commands.indexOf(command);
		if (findCommand !== -1) {
			return true;
		} else {
			return false;
		}
	}

	sendMessage(message, chatter, OAuthToken) {
		this.OAuthToken = OAuthToken;
		if (message === "!health") {
			this.io.emit("botMessage", message);
		} else {
			this.io.emit("botMessage", message);
			let answer = this.returnMessage(message, chatter);
			return answer;
		}
	}

	returnMessage(message, chatter) {
		let answer;

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
			case "!health":
				answer = `Timmy's health is....${this.latestHealth} `;
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
	// sendMessage(message, chatter) {
	// 	if (message === "!health") {
	// 		this.io.emit("botMessage", message, (response) => {
	// 			health = response;
	// 			console.log(response);
	// 		});
	// 	} else {
	// 		this.io.emit("botMessage", message);
	// 		console.log(message);
	// 	}
	// 	let answer = returnMessage(message, chatter);
	// 	return answer;
	// }
	// checkHealth(socket) {
	// 	socket.on("messageFromTama", (newMessage) => {
	// 		health = newMessage;
	// 		console.log(health);
	// 		//currentHealth();
	// 	});
	// }
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

// function getCommands() {
// 	return [
// 		" !feed - Feed Timmy 🍔",
// 		" !bath - Give Timmy a bath 🛁",
// 		" !sleep - Make Timmy take a nap 💤",
// 		" !play - Play with Timmy ⚽",
// 		" !love - Give Timmy some love ❤️",
// 		" !health - Get Timmy's current health 🔋",
// 	];
// }

// function returnMessage(message, chatter) {
// 	let answer;

// 	switch (message) {
// 		case "!feed":
// 			answer = `@${chatter} fed Timmy 🍔`;
// 			break;
// 		case "!bath":
// 			answer = `Timmy was stinky so @${chatter} made him take a bath 🛁`;
// 			break;
// 		case "!sleep":
// 			answer = `@${chatter} told a story about their life and Timmy fell asleep 💤`;
// 			break;
// 		case "!play":
// 			answer = `@${chatter} played a game with Timmy ⚽`;
// 			break;
// 		case "!love":
// 			answer = `@${chatter} gave Timmy a hug ❤️`;
// 			break;
// 		case "!health":
// 			answer = `Timmy's health is....${health} `;
// 			break;
// 		case "!timmycommands":
// 			answer = getCommands();
// 			break;
// 	}
// 	return answer;
// }
