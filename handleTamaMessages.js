//
//
//

function getCommands() {
	return [
		" !feed - Feed Timmy :Kappa:",
		" !bath - Give Timmy a bath",
		" !sleep - Make Timmy take a nap",
		" !play - Play with Timmy",
		" !love - Give Timmy some love",
	];
}

export function handleTamaMessages(io, message, chatter) {
	let answer = returnMessage(message, chatter);
	return answer;
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
