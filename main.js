const prompt = require('prompt-sync')({sigint: true});

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

class Field {
  constructor(arr) {
    this._field = arr;
    this._pos = [0,0]; // y down, x right
    this._gameOver = false;
  }
  get gameOver() {
    return this._gameOver;
  }

  _verify() {
    if (this._pos[0] < 0 || this._pos[0] >= this._field.length || this._pos[1] < 0 || this._pos[1] >= this._field[this._pos[0]].length) {
      console.log("You wandered out of bounds!");
      this._gameOver = true;
    }
    else if (this._field[this._pos[0]][this._pos[1]] === hole) {
      console.log("You fell in a hole!");
      this._gameOver = true
    }
    else if (this._field[this._pos[0]][this._pos[1]] === hat) {
      console.log("You have found your hat! Congratulations!");
      this._gameOver = true;  // Even though this is victory, it works all the same.
    }
    else {
      this._updateField();
    }
  }

  _updateField() {
    this._field[this._pos[0]][this._pos[1]] = pathCharacter;
  }

  move(input) {
    input = input.toLowerCase();
    switch(input) { // WASD movement convention used
      case "w":
        this._pos[0] -= 1;
        break;
      case "s":
        this._pos[0] += 1;
        break;
      case "a":
        this._pos[1] -= 1;
        break;
      case "d":
        this._pos[1] += 1;
        break;
      default:
        console.log("Invalid instructions!");
        break;
    }
    this._verify();
  }

  print() {
    const lines = this._field.map(line => line.join(""));
    console.log(lines.join('\n'));
  }

  static generateField(height, width, percent = 0.3) {
    let field = new Array(height);
    // Generate raw field
    for (let i =  0; i < height; i++) {
      field[i] = [];
      for (let j = 0; j < width; j++) {
        if (Math.random() < percent) {
          field[i].push(hole);
        }
        else {
          field[i].push(fieldCharacter);
        }
      }
    }
    // Generate starting position
    field[0][0] = pathCharacter;
    // Generate hat position
    let hatPos = [0, 0];
    while (hatPos[0] === 0 && hatPos[1] === 0) {
      hatPos[0] = Math.floor(Math.random() * height);
      hatPos[1] = Math.floor(Math.random() * width);
    }
    field[hatPos[0]][hatPos[1]] = hat;
    // Return final field
    return field;
  }
}

const gameField = new Field([
  ['*', '░', 'O'],
  ['░', 'O', '░'],
  ['░', '^', '░'],
]);

const Game = () => {
  const field = Field.generateField(7, 7, 0.3);
  const game = new Field(field);
  console.log("Welcome to \"Find Your Hat\"!");
  console.log("The game uses WASD movement convention, so:\nW - up\nA - left\nS - down\nD - right");
  console.log("Have fun, and try not to fall in any holes!");
  while (!game.gameOver) {
    game.print();
    game.move(prompt("Which way? "));
  }
}

Game();
