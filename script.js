/* TODO: 
* 1. DONE: don't allow an entered box to be entered again? (but in real battleship, you can) ... 
* 2. DONE: enable ships array to grow with numShips variable above
* 3. DONE: make table td clickable with mouse
* 4. add sounds
*/


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
    numShips: 3, /* learning note: as written, if you update numShips, 
    you also have to manually add a ship object to the ships array below...
    and you cannot use a for loop to populate the ships array with ship objects
    because objects are passed by reference and all ships end up as exact copies 
    So, use a factory function to create the number of ships needed */
    shipLength: 4,
    shipsSunk: 0,

 // let's create locations with code now
    ships : [],
    
    buildShip() {
        let ship = { locations: ['0'], hits: [''] };
        return ship;
    },

    generateShipArray() {
        this.ships = Array(this.numShips).fill(0).map(e => this.buildShip());
    },

    generateShipLocations() {      
        let locations;
        for (let i = 0; i < this.numShips; i++){
            do { //do-while keeps trying until a ship is made without a collision
                locations = this.generateShip();
            } while (this.collision(locations));
            this.ships[i].locations = locations;
        } 
    },

    generateShip() {
        let direction = Math.floor(Math.random() * 2);
        let row;
        let col;
        if (direction === 1) { //starting block and width for horizontal ship 
            row = Math.floor(Math.random() * this.boardsize);
            col = Math.floor(Math.random() * (this.boardsize - (this.shipLength + 1)));
        } else { // starting block and height for vertical ship
            row = Math.floor(Math.random() * (this.boardsize - (this.shipLength + 1)));
            col = Math.floor(Math.random() * this.boardsize);     
        }

        let newShipLocations = [];
        for (let i = 0; i < this.shipLength; i++){
            if (direction === 1) {
                newShipLocations.push(row + '' + (col + i));
            } else {
                newShipLocations.push((row + i) + '' + col);
            }
        }
        return newShipLocations;
    },

    collision(locations) {
        for (let i = 0; i < this.numShips; i++){
            let ship = this.ships[i];
            for (let j = 0; j < locations.length; j++){
                if (ship.locations.indexOf(locations[j]) >= 0) {
                    return true;
                }
            }
        }
        return false; // no collision, so good location
    },
       
    fire(guess) {
        for (let i = 0; i < this.numShips; i++){
            let ship = this.ships[i];
            let index = ship.locations.indexOf(guess);
            if (ship.hits[index] === "hit") {
                view.displayMessage("Oops, you already hit that location!");
                return true;
            } else if (index >= 0) { // A hit!
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
        if (model.shipsSunk < model.numShips) {
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
    let fireButton = document.getElementById('fireButton');
    if (e.key === 'Enter') {
        fireButton.click();
        return false;
   }

}

// Get player guess via mouseclick
function handleMouseClick(e) {
    let box = e.target.closest('td');
    if (!box) { return; } // Quit, not clicked on a box
    let guess = box.id;
    controller.processGuess(guess);
}

// Process players guess
function parseGuess(guess) {
    let alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
    if (guess === null || guess.length !== 2) {
        alert('Oops! Please enter a letter and a number from the board.');
    } else if (alphabet.indexOf(guess.charAt(0)) > -1) { // convert keyboard to proper td id
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
    } else { // mouse click already uses proper td id
        return guess;
    }
    return null;
}

function init() {
    let fireButton = document.getElementById('fireButton');
    fireButton.onclick = handleFireButton;
   // alt method: fireButton.addEventListener('click', handleFireButton);
    let guessInput = document.getElementById('guessInput');
    guessInput.onkeydown = handleKeyPress;
    let guessInputMouse = document.getElementById('board');
    guessInputMouse.onclick = handleMouseClick;
    model.generateShipArray();
    model.generateShipLocations();
}

window.onload = init;