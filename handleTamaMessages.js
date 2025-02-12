//
//
//

let health;

class TamaSocket {
	constructor(io) {
		this.io = io;
		this.createConnection();
	}
	createConnection() {
		this.io.on("error", console.error);

		this.io.on("connection", (socket) => {
			console.log("A client connected ");
			this.socket = socket;
			socket.on("messageFromTama", (newMessage) => {
				health = newMessage;
				currentHealth();
			});
		});
	}
	sendMessage(message, chatter) {
		this.io.emit("botMessage", message);
		let answer = returnMessage(message, chatter);
		return answer;
	}
}

function currentHealth() {
	for (let [key, value] of Object.entries(health)) {
		console.log(key, value);
	}
	//return health;
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

function getCommands() {
	return [
		" !feed - Feed Timmy",
		" !bath - Give Timmy a bath",
		" !sleep - Make Timmy take a nap",
		" !play - Play with Timmy",
		" !love - Give Timmy some love",
		" !health - Get Timmy's current health",
	];
}

function returnMessage(message, chatter) {
	let answer;

	switch (message) {
		case "!feed":
			answer = `@${chatter} fed Timmy`;
			break;
		case "!bath":
			answer = `Timmy was stinky so @${chatter} made him take a bath`;
			break;
		case "!sleep":
			answer = `@${chatter} told a story about their life and Timmy fell asleep`;
			break;
		case "!play":
			answer = `@${chatter} played a game with Timmy`;
			break;
		case "!love":
			answer = `@${chatter} gave Timmy a hug`;
			break;
		case "!health":
			answer = health;
			break;
		case "!timmycommands":
			answer = getCommands();
			break;
	}
	return answer;
}
