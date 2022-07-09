// Old Battleship code from early version

var location1 = 3;
var location2 = 4;
var location3 = 5;
var guess = -1;
var hits = 0;
var guesses = 0;
var isSunk = false;


// PROBLEM: You can guess the same HIT number over and over, and it wins.

while (!isSunk) {
  while (guess < 0 || guess > 6) {
    guess = prompt("Ready, aim, fire! (enter a number from 0-6):");
    if (guess < 0 || guess > 6) {
      alert("Please enter a valid cell number!");
    }
  } //end while
  guesses++;

  if (guess == location1 || guess == location2 || guess == location3) {
    alert("HIT!");
    hits++;
 guess = -1; // to stop infinite loop
    if (hits === 3) {
      isSunk = true;
      alert("You sank my battleship!");
    }
  } else {
    alert("MISS");
    guess = -1; // to stop infinite loop
  }
}

var stats = "You took " + guesses + " guesses to sink the battleship, " +
  "which means your shooting accuracy was " + (3 / guesses);
alert(stats);
