// View: Update the User's View
let view = {
    displayMessage(message) {
        let messageArea = document.getElementById('messageArea');
        messageArea.textContent = message;
    },

    displayHit(location) {
        let cell = document.getElementById(location);
        cell.setAttribute('class', 'hit');
    },

    displayMiss(location) {
        let cell = document.getElementById(location);
        cell.setAttribute('class', 'miss');
    }
}

// Model: Keep Track of ship location and status
let model = {
    boardsize: 7,
    numShips: 3,
    shipLength: 3,
    shipsSunk: 0,

    ships: [{ locations: ['06', '16', '26'], hits: ['', '', ''] },
        { locations: ['24', '34', '44'], hits: ['', '', ''] },
        { locations: ['10', '11', '12'], hits: ['', '', ''] }],
    
    fire(guess) {
        for (let i = 0; i < this.numShips; i++){
            let ship = this.ships[i];
            if (index >= 0) { // A hit!
                ship.hits[index] = 'hit';
                view.displayHit(guess);
                view.displayMessage('HIT!');
                if (this.isSunk(ship)) {
                    view.displayMessage('You sank my battleship!');
                    this.shipsSunk++;
                }
                return true;
            }
        }
        view.displayMiss (guess);
        view.displayMessage('You missed.');
        return false;
    },

    isSunk(ship) {
        for (let i = 0; i < this.shipLength; i++){
            if (ship.hits[i] !== 'hit') {
                return false;
            }
        }
        return true; // the ship is sunk
    }
};

// Controller: Control player input and game logic
let controller = {
    guesses: 0,
    processGuess(guess) {
        if (model.shipsSunk < model.numShips){
            let location = parseGuess(guess);
            if (location) {
                this.guesses++;
                let hit = model.fire(location);
                if (hit && model.shipsSunk === model.numShips) {
                    view.displayMessage(`You sank all my battleships in ${this.guesses} guesses.`)
                }
            }
        } else {
            view.displayMessage('You already sank all my battleships. Refresh the page to play again.');
        }
    },
};

// Get players guess
function handleFireButton() {
    let guessInput = document.getElementById('guessInput'); 
    let guess = guessInput.value;
    controller.processGuess(guess);
    guessInput.value = ''; // reset guess on screen
}

function handleKeyPress(e) {
    console.log(e); 
    let fireButton = document.getElementById('fireButton');
    if (e.key === 'Enter') {
        fireButton.click();
        return false;
   }

}

// Process players guess
function parseGuess(guess) {
    let alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
    if (guess === null || guess.length !== 2) {
        alert('Oops! Please enter a letter and a number from the board.');
    } else {
        let firstChar = guess.charAt(0).toUpperCase();
        let row = alphabet.indexOf(firstChar);
        let column = guess.charAt(1);

        if (isNaN(row) || isNaN(column)) {
            alert('Oops! That is not on the board.');
        } else if (row < 0 || row >= model.boardsize || column < 0 || column >= model.boardsize) { 
            alert('Oops! That is not on the board.');
        } else {
            return row + column;
        }
    }
    return null;
}

function init() {
    let fireButton = document.getElementById('fireButton');
    fireButton.onclick = handleFireButton;
   // alt method: fireButton.addEventListener('click', handleFireButton);
    let guessInput = document.getElementById('guessInput');
    guessInput.onkeydown = handleKeyPress;
}

window.onload = init;

model.fire('53');