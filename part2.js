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

// One two-unit ship
// Two three-unit ships
// One four-unit ship
// One five-unit ship
const ships = {
  scout: [],
  destroyer: [],
  submarine: [],
  battleship: [],
  carrier: [],
};

// create grid
const createEmpty2DArray = (size) => {
  let arr = [];
  for (let i = 0; i < size; i++) {
    arr[i] = [];
    for (let j = 0; j < size; j++) {
      arr[i][j] = '.';
    }
  }
  return arr;
};

// get users guess
const getGuess = () => {
  while (true) {
    const guess = rs.question("Enter a location to strike ie 'A2': ");
    if (!/^[a-jA-J]([1-9]|10)$/.test(guess)) {
      console.log('enter a valid location.');
    } else {
      return guess;
    }
  }
};

// check for hit
const checkHit = (guess) => {
  const row = indexer[guess[0].toLowerCase()];
  const column = parseInt(guess.substring(1)) - 1;

  if (grid[row][column] === 'O' || grid[row][column] === 'X') {
    console.log('You have already picked this location. Miss!');
    return false;
  } else if (spaceTaken(row, column)) {
    grid[row][column] = 'X';
    console.log('Hit!');
    shipsSunk(row, column);
    return true;
  } else {
    grid[row][column] = 'O';
    console.log('You have missed');
  }
};

// find which ship was hit and remove its location from the ships object
const shipsSunk = (row, column) => {
  for (let i in ships) {
    for (let j in ships[i]) {
      if (
        Array.isArray(ships[i][j]) &&
        ships[i][j][0] === row &&
        ships[i][j][1] === column
      ) {
        ships[i].splice(j, 1);
        if (ships[i].length === 0) {
          shipsRemaining -= 1;
          console.log(`You sunk the ${i}`);
          console.log(`${shipsRemaining} ships remaining.`);
        }
      }
    }
  }
};

// check if a ship is already occupying a space in the array
const spaceTaken = (leftValue, rightValue) => {
  for (let i in ships) {
    for (let j in ships[i]) {
      if (
        Array.isArray(ships[i][j]) &&
        ships[i][j][0] === leftValue &&
        ships[i][j][1] === rightValue
      ) {
        return true;
      }
    }
  }
  return false;
};

//generate all ship locations
function generateShipLocation(shipName, shipLength) {
  const getRandomCoordinate = () => Math.floor(Math.random() * 10);

  const tryPlaceShip = (startRow, startColumn, isVertical) => {
    const shipCoordinates = [];

    for (let i = 0; i < shipLength; i++) {
      const row = isVertical ? startRow + i : startRow;
      const column = isVertical ? startColumn : startColumn + i;

      if (
        row >= 0 &&
        row < 10 &&
        column >= 0 &&
        column < 10 &&
        !spaceTaken(row, column)
      ) {
        shipCoordinates.push([row, column]);
      } else {
        return [];
      }
    }

    return shipCoordinates;
  };

  while (ships[shipName].length < shipLength) {
    const randomRow = getRandomCoordinate();
    const randomColumn = getRandomCoordinate();
    const isVertical = Math.random() >= 0.5;

    const newShip = tryPlaceShip(randomRow, randomColumn, isVertical);

    if (newShip.length > 0) {
      ships[shipName] = newShip;
    }
  }
}

// reset game to its initial state
const resetGame = () => {
  grid = createEmpty2DArray(10);
  callAllShips();
  shipsRemaining = 5;
};

// concise way to get all ship location
const callAllShips = () => {
  generateShipLocation('scout', 2);
  generateShipLocation('destroyer', 3);
  generateShipLocation('submarine', 3);
  generateShipLocation('battleship', 4);
  generateShipLocation('carrier', 5);
};

// game loop
const startGame = () => {
  rs.keyIn('Press any key to start the game. ');
  while (true) {
    while (shipsRemaining > 0) {
      const guess = getGuess();
      checkHit(guess);
    }
    if (
      rs.keyInYN(
        'You have destroyed all battleships. Would you like to play again?'
      )
    ) {
      resetGame();
    } else {
      break;
    }
  }
};

// initial game setup
let grid = createEmpty2DArray(10);
callAllShips();
console.log(ships);
let shipsRemaining = 5;
startGame();
