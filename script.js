// View: Update the User's View
let view = {
    displayMessage(msg) {
        let messageArea = document.getElementById('messageArea');
        messageArea.textContent = msg;
    },

    displayHit(loc) {
        let cell = document.getElementById(loc);
        cell.setAttribute('class', 'hit');
    },

    displayMiss(loc) {
        let cell = document.getElementById(loc);
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
            let index = ship.locations.indexOf(guess);
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
        view.displayHit(guess);
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