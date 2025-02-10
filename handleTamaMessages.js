//
//
//

class TamaSocket {
	constructor(io) {
		this.io = io;
		this.createConnection();
		this.socket;
	}
	createConnection() {
		this.io.on("error", console.error);

		this.io.on("connection", (socket) => {
			console.log("A client connected ");
			this.socket = socket;
			socket.on("messageFromTama", (newMessage) => {
				console.log(newMessage);
			});
		});
	}
	sendMessage(message, chatter) {
		this.io.emit("botMessage", message);
		let answer = returnMessage(message, chatter);
		return answer;
	}
	// returnMessage() {
	// 	this.socket.on("connect", (message) => {
	// 		console.log(message);
	// 		this.io.on("messageFromTama", (newMessage) => {
	// 			console.log(newMessage);
	// 		});
	// 	});
	// }
}

class MessageHandler {
	constructor(socket) {
		this.socket = socket;
	}
	sendMessage(chatter, message) {
		console.log(this.socket);
		this.socket.emit("botMessage", message);
		let answer = returnMessage(message, chatter);
		return answer;
	}
	sendMessageToTama() {
		io.on("messageFromTama", (newMessage) => {
			console.log(newMessage);
			//handleTamaMessages(io, newMessage, "outgoing");
		});
	}
}

class Message {
	constructor() {}
	messageHandler(io, messageType, message) {
		switch (messageType) {
			case "botMessage":
				//this.sendToTama(io, message);
				io.emit("botMessage", message);
				break;
			case "messageFromTama":
				//this.sendToTwitch();
				io.on("messageFromTama", (newMessage) => {
					console.log(newMessage);
					//handleTamaMessages(io, newMessage, "outgoing");
				});
				break;
		}
	}
}

export { TamaSocket, Message, MessageHandler };

function getCommands() {
	return [
		" !feed - Feed Timmy",
		" !bath - Give Timmy a bath",
		" !sleep - Make Timmy take a nap",
		" !play - Play with Timmy",
		" !love - Give Timmy some love",
	];
}

// export async function handleTamaMessages(io, message, chatter, direction) {
// 	if (direction === "incomming") {
// 		let newMessage = new Message();
// 		newMessage.messageHandler(io, "botMessage", message);
// 	} else if (direction === "outgoing") {
// 		let newMessage = new Message();
// 		newMessage.sendToTwitch();
// 	}
// 	let answer = returnMessage(message, chatter);

// 	// let newMessage = new Message();
// 	// newMessage.messageHandler(io, "botMessage", message);

// 	return answer;
// }

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
		case "!timmycommands":
			answer = getCommands();
			break;
	}
	return answer;
}
