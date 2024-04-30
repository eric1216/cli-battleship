var rs = require('readline-sync');

//translate letters to array indices
const indexer = {
  a: 0,
  b: 1,
  c: 2,
};

//create grid
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

//check for hit
const checkHit = (guess) => {
  const row = indexer[guess[0].toLowerCase()];
  const column = parseInt(guess.substring(1)) - 1;
  const guessLocation = [row, column];

  if (grid[row][column] === 'O' || grid[row][column] === 'X') {
    console.log('You have already picked this location. Miss!');
    return false;
  } else if (
    shipLocations.some((subArray) =>
      subArray.every((value, index) => value === guessLocation[index])
    )
  ) {
    grid[row][column] = 'X';
    console.log('Hit. You have sunk a battleship!');
    return true;
  } else {
    grid[row][column] = 'O';
    console.log('You have missed');
  }
};

// reset game
const resetGame = () => {
  shipsSunk = shipLocations.length;
  shipLocations = generateShipLocations();
  grid = createEmpty2DArray(3);
};

// get player guess
const getGuess = () => {
  while (true) {
    const guess = rs.question("Enter a location to strike ie 'A2': ");
    if (!/^[a-cA-C]([1-3])$/.test(guess)) {
      console.log('enter a valid location.');
    } else {
      return guess;
    }
  }
};

// generate random ship locations
const generateShipLocations = () => {
  const shipLocations = [];

  while (shipLocations.length < 2) {
    const randomRow = Math.floor(Math.random() * 3);
    const randomColumn = Math.floor(Math.random() * 3);
    const location = [randomRow, randomColumn];

    if (
      !shipLocations.some(
        ([row, col]) => row === randomRow && col === randomColumn
      )
    ) {
      shipLocations.push(location);
    }
  }
  return shipLocations;
};

// begin game
let grid = createEmpty2DArray(3);
let shipLocations = generateShipLocations();
rs.keyIn('Press any key to start the game. ');
let shipsSunk = shipLocations.length;

// game loop
while (true) {
  while (shipsSunk != 0) {
    const guess = getGuess();
    if (checkHit(guess) === true) {
      shipsSunk -= 1;
      console.log(`${shipsSunk} ship remaining.`);
    }
  }
  if (
    rs.keyInYN(
      'You have destroyed all battleships. Would you like to play again? Y/N'
    )
  ) {
    resetGame();
  } else {
    break;
  }
}
