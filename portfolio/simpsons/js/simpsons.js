window.onload = shuffleCards;

//Parallel arrays to associate id and card
var cards = [
    'url(img/grandpa.png)',
    'url(img/bart.jpg)',
    'url(img/homer.jpg)',
    'url(img/lisa.jpg)',
    'url(img/maggie.jpg)',
    'url(img/marge.png)',
    'url(img/grandpa.png)',
    'url(img/bart.jpg)',
    'url(img/homer.jpg)',
    'url(img/lisa.jpg)',
    'url(img/maggie.jpg)',
    'url(img/marge.png)'
];

var ids = [
	'card1','card2','card3','card4','card5','card6','card7','card8','card9','card10','card11','card12'
];

//For game management
var previousCard;
var currentCard;
var counter;
var score;
var pairCards;
var interval;
var time;
var reverse = 'url(img/reverse.jpeg)';

//Load cards and values at the start
function shuffleCards() {
	pairCards = 0;
	score = 50;
	counter = 0;
	previousCard = null;
	currentCard = null;
	interval = null;

	//Shuffle array of cards
	cards.sort(function() { return Math.random() - 0.5;});

	//Get back div of cards
	var elements = $(".card");

	//Assignment initial values and events
	for (var i = 0; i < elements.length; i++) {
		elements[i].style.transition = "none";
		elements[i].style.backgroundImage = reverse;
		elements[i].addEventListener("click", clickCard, true);
		elements[i].style.visibility = "visible";
		//console.log("Event asociated to " + elements[i].id);
	}

	//Enable delay's trainsition effect to avoid show the cards
	setTimeout(enableTransition, 500);

	//Show the initial score
	showScore();
	document.getElementById("clock").innerHTML = "1:00:0";
}

//Enable transition efect on cards
function enableTransition() {
	//Get back card's div 
	var elements = $(".card");

	//Assign transition effect to each one
	for (var i=0; i<elements.length; i++) {
		elements[i].style.transition = "background 0.3s ease-in-out";
	}
}

//Show score on label
function showScore() {
	document.getElementById("score").innerHTML = "SCORE: " + score;

	//Check if score is 0
	if (score === 0) {
		showGameOver();
	}
}

//Set timing on game
function setTime() {
time = new Date();
time.setTime(time.getTime() + 60000);
interval = setInterval(cronos, 10);
}

function cronos() {
	var milis = time - new Date();
	var milisIni = milis;
	var min = "0";
	var seg = "00";
	if (milis >= 60000) {
		min = Math.floor(milis / 60000);
		milis = milis % 60000;
	}
	if (milis > 1000) {
		seg = Math.floor(milis / 1000);
		if (seg < 10) seg = "0" + seg;
		milis = Math.floor((milis % 1000)/100);
	}
	var show = min + ":" + seg + ":" + milis;
	document.getElementById("clock").innerHTML = show;
	if (seg == "00") {
		showGameOver();
	}
}

//Show Game Over message and button
function showGameOver() {
	document.getElementById("gameOver").style.display = "inline";
	document.getElementById("gameOverBtn").addEventListener("click", restartGame, true);
	var timeLeft = $("#clock").html();
	$("#timer").css("visibility","hidden");
		$("#gameOver .scoreAlert").html("Time: " + timeLeft + "<br>Score: 0");
	endGame();
}

//Show Victory message and button
function showVictory() {
	document.getElementById("victory").style.display = "inline";
	document.getElementById("victoryBtn").addEventListener("click", restartGame, true);
	var timeLeft = $("#clock").html();
	$("#timer").css("visibility","hidden");
	$("#victory .scoreAlert").html("Time: " + timeLeft + "<br>Score: " + score);
	endGame();
}

//End time on game
function endGame() {
	clearInterval(interval);
	interval = null;
	time = null;
}

//Restart game parameters and hide messages
function restartGame(event) {
	$("#timer").css("visibility","visible");
	event.target.removeEventListener("click", restartGame, true);
	shuffleCards();
	document.getElementById("gameOver").style.display = "none";
	document.getElementById("victory").style.display = "none";
}

//When click event pops over a card
function clickCard(event) {
	if (interval === null) {
		setTime();
	}

	//Check there's not more than 2 cards clicked
	if (counter < 2) {
		var element = event.target;

		//Show the card
		element.style.backgroundImage = cards[ids.indexOf(element.id)];

		//Check it's not the same card clicked twice
		if (previousCard !== element.id) {
			//Count a click
			counter++;

			//Check if it's the 2nd card
			if (previousCard !== null) {
				currentCard = element.id;

				//Restart images
				var currentPicture = document.getElementById(currentCard).style.backgroundImage;
				var previousPicture = document.getElementById(previousCard).style.backgroundImage;

				//Check if both images are the same
				if (currentPicture === previousPicture) {
					//Initialices a temporizer to execute correct action
					setTimeout(removeCards, 1000);
				

				//If they're different 
				} else {
					//Substract the score
					score += -5;
					showScore();
					//Initialices a temporizer to execute wrong action
					setTimeout(hideCards, 1000);
				}
			
			} else {
				//If it's the first, store the card for the next click
				previousCard = element.id;
			}
		}
	}
}

function hideCards() {
	//Reverse cards to hide them
	document.getElementById(previousCard).style.backgroundImage = reverse;
	document.getElementById(currentCard).style.backgroundImage = reverse;
	//Initialices new try
	newTry();
}

function removeCards() {
	//Stores a new pair
	pairCards++;

	//Remove from the game all pairs, hide them and removing events
	document.getElementById(previousCard).style.visibility = "hidden";
	document.getElementById(previousCard).removeEventListener("click", clickCard, true);
	document.getElementById(currentCard).style.visibility = "hidden";
	document.getElementById(currentCard).removeEventListener("click", clickCard, true);

	//Check if the game is still on
	if (pairCards < 6) {
		newTry();
	} else {
		//Or it's over
		showVictory();
	}
}

function newTry() {
	previousCard = null;
	currentCard = null;
	counter = 0;
}




