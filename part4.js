var rs = require('readline-sync');

//translate letters to array indices
const indexer = {
  a: 0,
  b: 1,
  c: 2,
  d: 3,
  e: 4,
  f: 5,
  g: 6,
  h: 7,
  i: 8,
  j: 9,
};

// object of ships and their length
const shipDetails = {
  scout: 2,
  destroyer: 3,
  submarine: 3,
  battleship: 4,
  carrier: 5,
};

// create a player object containing a unique board and ship placement for each player
class Player {
  constructor(name) {
    this.scout = [];
    this.destroyer = [];
    this.submarine = [];
    this.battleship = [];
    this.carrier = [];
    this.board = this.createEmpty2DArray();
    this.shipsRemaining = 5;
    this.playerName = name;

    // automatically generates ship locations on call
    this.generateShipLocation(Object.keys(shipDetails)[0]);
    this.generateShipLocation(Object.keys(shipDetails)[1]);
    this.generateShipLocation(Object.keys(shipDetails)[2]);
    this.generateShipLocation(Object.keys(shipDetails)[3]);
    this.generateShipLocation(Object.keys(shipDetails)[4]);
  }

  // logic for each players turn
  turn(opponent) {
    console.log(`${this.playerName}'s turn.`);

    opponent.displayBoard();
    const guess = this.getGuess();
    opponent.checkHit(guess);
  }

  // get users guess
  getGuess() {
    while (true) {
      const guess = rs.question("Enter a location to strike ie 'A2': ");
      if (!/^[a-jA-J]([1-9]|10)$/.test(guess)) {
        console.log('enter a valid location.');
      } else {
        return guess;
      }
    }
  }

  //create grid
  createEmpty2DArray(size = 10) {
    let arr = [];
    for (let i = 0; i < size; i++) {
      arr[i] = [];
      for (let j = 0; j < size; j++) {
        arr[i][j] = '.';
      }
    }
    return arr;
  }

  // display game board
  displayBoard() {
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    const columns = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

    // display column labels
    console.log('  ' + columns.join(' '));

    // display rows with labels and board values
    for (let i = 0; i < this.board.length; i++) {
      console.log(rows[i] + ' ' + this.board[i].join(' '));
    }
  }

  // return true if ships get places at the same location
  spaceTaken(row, column) {
    for (let i in shipDetails) {
      for (let j in this[i]) {
        if (this[i][j][0] === row && this[i][j][1] === column) {
          return true;
        }
      }
    }
    return false;
  }

  // logic for when ship gets hit
  gotHit(row, column) {
    for (let i in shipDetails) {
      for (let j in this[i]) {
        if (this[i][j][0] === row && this[i][j][1] === column) {
          this[i].splice(j, 1);
          if (this[i].length === 0) {
            this.shipsRemaining -= 1;
            console.log(`You sunk ${this.playerName}'s ${i}`);
            console.log(`${this.playerName} has ${this.shipsRemaining} ships remaining.`);
          }
        }
      }
    }
  }

  // check if player guess hits a ship
  checkHit(guess) {
    const row = indexer[guess[0].toLowerCase()];
    const column = parseInt(guess.substring(1)) - 1;

    if (this.board[row][column] === 'O' || this.board[row][column] === 'X') {
      console.log('You have already picked this location. Miss!');
      return false;
    } else if (this.spaceTaken(row, column)) {
      this.board[row][column] = 'X';
      console.log('Hit!');
      this.gotHit(row, column);
      return true;
    } else {
      this.board[row][column] = 'O';
      console.log('You have missed');
    }
  }

  //generate all ship locations
  generateShipLocation(shipName) {
    const getRandomCoordinate = () => Math.floor(Math.random() * 10);

    const tryPlaceShip = (startRow, startColumn, isVertical) => {
      const shipCoordinates = [];

      for (let i = 0; i < shipDetails[shipName]; i++) {
        const row = isVertical ? startRow + i : startRow;
        const column = isVertical ? startColumn : startColumn + i;

        if (row >= 0 && row < 10 && column >= 0 && column < 10 && !this.spaceTaken(row, column)) {
          shipCoordinates.push([row, column]);
        } else {
          return [];
        }
      }

      return shipCoordinates;
    };

    while (this[shipName].length < shipDetails[shipName]) {
      const randomRow = getRandomCoordinate();
      const randomColumn = getRandomCoordinate();
      const isVertical = Math.random() >= 0.5;

      const newShip = tryPlaceShip(randomRow, randomColumn, isVertical);

      if (newShip.length > 0) {
        this[shipName] = newShip;
      }
    }
  }
}

// function to initialize a player
const newPlayer = (name) => new Player(name);

// function to start game
const startGame = (playerOneName, playerTwoName) => {
  rs.keyIn('Press any key to start the game. ');

  // initialize the players
  let player1 = newPlayer(playerOneName);
  let player2 = newPlayer(playerTwoName);

  // game loop
  while (true) {
    while (player1.shipsRemaining > 0 && player2.shipsRemaining > 0) {
      player1.turn(player2);
      if (player2.shipsRemaining > 0) {
        player2.turn(player1);
      }
    }

    // determine the winner
    if (player1.shipsRemaining === 0) {
      console.log(`${player2.playerName} wins!`);
    } else {
      console.log(`${player1.playerName} wins!`);
    }

    // play again?
    if (rs.keyInYN('Would you like to play again?')) {
      player1 = newPlayer(playerOneName);
      player2 = newPlayer(playerTwoName);
    } else {
      break;
    }
  }
};

// start game with selected players and their names
const playerOneName = 'player1';
const playerTwoName = 'player2';
startGame(playerOneName, playerTwoName);
