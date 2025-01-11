const tamagotchi = { love: 0, hunger: 0, fun: 0, bath: 0, tired: 0 };

// Funktionen check kollar så att värdena som dom olika känslo funktionerna försöker lägga till inte överstiger 10 eller
// understiger 0 eftersom det är max och minimum
function check(val, inc) {
	var newval = val + inc;
	if (newval > 10) {
		newval = 10;
	}
	if (newval < 0) {
		newval = 0;
	}
	return newval;
}

function sleep(ms) {
	return new Promise((r) => setTimeout(r, ms));
}

// Stoppar rörelsen och bilderna och visar tamahappy och startar sedan rörelsen igen
async function appreciation() {
	stop();
	var tama = document.getElementsByClassName("tamagotchi");
	for (var i = 0; i < tama.length; i++) {
		tama[i].style.display = "none";
	}
	tama[2].style.display = "block";
	await sleep(1000);
	tama[0].style.display = "block";
	tama[2].style.display = "none";
	stop();
	start();
}

// Funktionen goSleep  tar bort bilderna på snigeln och ändrar ljuset när man klickar på knappen sova eller när tröttheten automatiskt blir 0
// snigeln sover då en timme
async function goSleep(ms) {
	stop();
	var tama = document.getElementsByClassName("tamagotchi");
	for (var i = 0; i < tama.length; i++) {
		tama[i].style.display = "none";
	}
	document.getElementById("gamecontainer").style.filter = "brightness(35%)";
	document.getElementById("gamecontainer").style.backgroundColor = "#92a8d1";
	await sleep(ms);
	document.getElementById("gamecontainer").style.filter = "brightness(100%)";
	document.getElementById("gamecontainer").style.backgroundColor = "#e6f9ff";
	tama[0].style.display = "block";
	stop();
	start();
}

// Funktionerna love, hunger, fun, bath och tired lägger till och tar bort värde ifrån objektet tamagotchi
//och kontaktar sedan getValues funktionen för att den ska uppdatera mätaren samtidigt som man klickar på någon av knapparna
function love() {
	tamagotchi.love = check(tamagotchi.love, 5);
	getValues();
	appreciation();
}

function hunger(food) {
	tamagotchi.hunger = check(tamagotchi.hunger, food);
	tamagotchi.tired = check(tamagotchi.tired, -1);

	getValues();
	appreciation();
	closeOnFoodClick();
}

function fun() {
	tamagotchi.fun = check(tamagotchi.fun, 5);
	tamagotchi.love = check(tamagotchi.love, 1);
	tamagotchi.hunger = check(tamagotchi.hunger, -2);
	tamagotchi.bath = check(tamagotchi.bath, -1);
	tamagotchi.tired = check(tamagotchi.tired, -2);

	getValues();
	appreciation();
}

function bath() {
	tamagotchi.bath = check(tamagotchi.bath, 10);

	getValues();
	appreciation();
}

function tired() {
	goSleep(5000);
	tamagotchi.tired = check(tamagotchi.tired, 10);
	tamagotchi.hunger = check(tamagotchi.hunger, -5);

	getValues();
}

// Funktionen time tar bort värde ifrån objektet per timme
function time() {
	tamagotchi.love = check(tamagotchi.love, -2);
	tamagotchi.hunger = check(tamagotchi.hunger, -1);
	tamagotchi.fun = check(tamagotchi.fun, -2);
	tamagotchi.bath = check(tamagotchi.bath, -1);
	tamagotchi.tired = check(tamagotchi.tired, -1);
	if (tamagotchi.tired == 0) {
		goSleep(36000);
		tamagotchi.tired = 10;
	}
	getValues();
}
setInterval(time, 36000);

// getValues funktionen är kopplad till känslofunktionerna , den summerar känslorna och uppdaterar mätaren när man klickar på knapparna

function getValues(love, hunger, fun, bath, tired) {
	const testMood = [];
	testMood.push(tamagotchi.love, tamagotchi.hunger);

	console.log(testMood);

	var mood =
		tamagotchi.love +
		tamagotchi.hunger +
		tamagotchi.fun +
		tamagotchi.bath +
		tamagotchi.tired;
	console.log(mood);

	switch (true) {
		case mood <= 10:
			document.getElementById("Moodmeter").style.width = "10%";
			document.getElementById("Moodmeter").style.backgroundImage =
				"linear-gradient(#ff4c4c, #ff5e5e, #ff7676, #ff5e5e, #ff4c4c)";
			break;
		case mood >= 11 && mood <= 20:
			document.getElementById("Moodmeter").style.width = "25%";
			document.getElementById("Moodmeter").style.backgroundImage =
				"linear-gradient(#ce7554, #cc8065, #ca8f79, #cc8065, #ce7554)";
			break;
		case mood >= 21 && mood <= 29:
			document.getElementById("Moodmeter").style.width = "50%";
			document.getElementById("Moodmeter").style.backgroundImage =
				"linear-gradient(#82b562, #8fb676, #a3b896, #8fb676, #82b562)";
			break;
		case mood >= 30 && mood <= 40:
			document.getElementById("Moodmeter").style.width = "75%";
			document.getElementById("Moodmeter").style.backgroundImage =
				"linear-gradient(#30ff6a, #7cffa1, #a2ffbe, #7cffa1, #30ff6a)";
			break;
		case mood >= 41:
			document.getElementById("Moodmeter").style.width = "100%";
			document.getElementById("Moodmeter").style.backgroundImage =
				"linear-gradient(#5aff34, #90ff77, #b8fda8, #90ff77, #5aff34)";
			break;
		default:
			document.getElementById("Moodmeter").style.backgroundColor =
				"#ffffff";
	}
}

/*********  RÖRELSE   ******/

// Funktionen tamaSlide loopar bilderna i tamagotchi klassen men visar bara dom 2 första för att det ska se ut som snigeln rör sig
var slideshow = 0;

function tamaSlide() {
	var mood =
		tamagotchi.love +
		tamagotchi.hunger +
		tamagotchi.fun +
		tamagotchi.bath +
		tamagotchi.tired;
	var tama = document.getElementsByClassName("tamagotchi");
	for (var i = 0; i < tama.length; i++) {
		tama[i].style.display = "none";
	}
	slideshow++;
	if (mood > 20) {
		if (slideshow > 2) {
			slideshow = 1;
		}
		tama[slideshow - 1].style.display = "block";
	} else {
		if (mood >= 11 && mood <= 19) {
			if (slideshow > 5) {
				slideshow = 4;
			}
			tama[slideshow - 1].style.display = "block";
		} else {
			if (slideshow > 7) {
				slideshow = 6;
			}
			tama[slideshow - 1].style.display = "block";
		}
	}
}

// Funktionen flip gör att snigeln rör sig fram och tillbaka och flippar bilden så den går i rätt riktning
var x = 200;
var riktning = "höger";

function flip() {
	element = document.getElementById("tamaDiv");
	element.style.right = x + "px";

	if (riktning == "höger") {
		x = x + 1;
		element.style.transform = "scaleX(1)";
	} else if (riktning == "vänster") {
		x = x - 1;
		document.getElementById("tamaDiv").style.transform = "scaleX(-1)"; // flippar bilden för att snigeln ska gå i rätt riktning
	}
	if (x == 800) {
		riktning = "vänster";
	} else if (x == 200) {
		riktning = "höger";
	}
}

// keybindings
const testDiv = document.getElementById("test");

document.addEventListener("keydown", (e) => {
	if (e.key === "ArrowLeft") {
		let currentPosition = testDiv.offsetLeft;
		testDiv.style.left = currentPosition - 50 + "px";
		console.log("left arrow pressed");
	} else if (e.key === "ArrowRight") {
		let currentPosition = testDiv.offsetLeft;
		testDiv.style.left = currentPosition + 50 + "px";

		console.log("right arrow pressed");
	}
});

// var newPosition = 50;
// // window.addEventListener("keydown", moveTamagotchi);
//  function moveTamagotchi() {
//   testDiv.style.right=newPosition + 'px';
//   if ( riktning === 'höger') {
//     newPosition = newPosition+50;
//   }
//  }

var tamaMove = setInterval(tamaSlide, 900);
var tamaFlip = setInterval(flip, 30);

// Startar och stoppar tamaMove och flip funktionerna

function stop() {
	clearInterval(tamaMove);
	clearInterval(tamaFlip);
}

function start() {
	tamaMove = setInterval(tamaSlide, 900);
	tamaFlip = setInterval(flip, 30);
}

// MODAL //
var modal = document.getElementById("myModal");
var foodButton = document.getElementById("foodButton");
var spanClose = document.getElementsByClassName("close")[0];
var buttonClose = document.getElementsByClassName("close-button")[0];

foodButton.onclick = function () {
	modal.style.display = "block";
};

function closeOnFoodClick() {
	modal.style.display = "none";
}

spanClose.onclick = function () {
	modal.style.display = "none";
};
buttonClose.onclick = function () {
	modal.style.display = "none";
};

window.onclick = function (event) {
	if (event.target == modal) {
		modal.style.display = "none";
	}
};
