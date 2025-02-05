//
//
//

// class TamaSocket {
// 	constructor() {
// 		this.socket = null;
// 	}
// 	frontendConnection(io) {
// 		io.on("connection", (socket) => {
// 			console.log("A user connected");
// 			this.socket = socket;
// 		});
// 	}

// 	sendMessage(typeOfMessage, messageToSend) {
// 		let message = new Message(typeOfMessage, messageToSend);
// 	}
// }

// class Message {
// 	constructor(typeOfMessage, message) {
// 		this.typeOfMessage = null;
// 		this.message = null;
// 	}
// 	sendMessage(io, message) {
// 		io.emit("botMessage", message);
// 	}
// }

// export { TamaSocket, Message };

function getCommands() {
	return [
		" !feed - Feed Timmy",
		" !bath - Give Timmy a bath",
		" !sleep - Make Timmy take a nap",
		" !play - Play with Timmy",
		" !love - Give Timmy some love",
	];
}

export async function handleTamaMessages(io, message, chatter) {
	let answer = returnMessage(message, chatter);

	sendMessageToTama(io, message);

	return answer;
}

function sendMessageToTama(io, message) {
	io.emit("botMessage", message);
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
			answer = `@${chatter} told a story and Timmy fell asleep`;
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
