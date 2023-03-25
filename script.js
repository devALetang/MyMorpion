const gameBoard = document.querySelector('.game-board');
const cells = document.querySelectorAll('[data-cell]');
const playerTurn = document.querySelector('.player-turn');
const gameResult = document.querySelector('.game-result');
const resetButton = document.querySelector('.reset-button');
const modeButtons = document.querySelectorAll('.mode-button');

let humanPlayer = 'X';
let aiPlayer = 'O';
let currentPlayer = humanPlayer;
let gameMode = '';

const xChoice = document.getElementById('x-choice');
const oChoice = document.getElementById('o-choice');

const player1ScoreElem = document.querySelector('.player1-score');
const player2ScoreElem = document.querySelector('.player2-score');

let player1Score = 0;
let player2Score = 0;


function switchSymbol() {
  if (xChoice.checked) {
    humanPlayer = 'X';
    aiPlayer = 'O';
  } else {
    humanPlayer = 'O';
    aiPlayer = 'X';
  }
  resetGame();
}

xChoice.addEventListener('click', switchSymbol);
oChoice.addEventListener('click', switchSymbol);


const winningPatterns = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

startGame();

function startGame() {
  resetButton.style.display = 'none';
  gameResult.textContent = '';
  playerTurn.textContent = `Tour du joueur ${currentPlayer}`;

  cells.forEach(cell => {
    cell.classList.remove('player-X');
    cell.classList.remove('player-O');
    cell.removeEventListener('click', handleClick);
    cell.addEventListener('click', handleClick, { once: true });
  });

  if (gameMode === 'robot' && currentPlayer === aiPlayer) {
    setTimeout(() => {
      robotPlay();
    }, 500);
  }
}

function handleClick(e) {
  const cell = e.target;
  cell.textContent = currentPlayer;
  cell.classList.add(`player-${currentPlayer}`);

  if (checkWin(currentPlayer)) {
    endGame(`Le joueur ${currentPlayer} a gagné !`);
  } else if (checkDraw()) {
    endGame(`Egalité !`);
  } else {
    currentPlayer = currentPlayer === humanPlayer ? aiPlayer : humanPlayer;
    playerTurn.textContent = `Tour du joueur ${currentPlayer}`;

    if (gameMode === 'robot' && currentPlayer === aiPlayer) {
      setTimeout(() => {
        robotPlay();
      }, 500);
    }
  }
}

function robotPlay() {
  const emptyCells = getEmptyCells();
  if (emptyCells.length === 0) {
    return;
  }
  const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  randomCell.click();
}


function getEmptyCells() {
  return Array.from(cells).filter(cell => cell.textContent === '');
}

function checkWin(player) {
  return winningPatterns.some(pattern => {
    return pattern.every(index => {
      return cells[index].textContent === player;
    });
  });
}

function checkDraw() {
  return [...cells].every(cell => {
    return cell.textContent !== '';
  });
}

function endGame(message) {
  cells.forEach(cell => {
    cell.removeEventListener('click', handleClick);
  });

  if (message.includes(currentPlayer)) {
    if (currentPlayer === humanPlayer) {
      player1Score++;
    } else {
      player2Score++;
    }
  }

  gameResult.textContent = message;
  player1ScoreElem.textContent = player1Score;
  player2ScoreElem.textContent = player2Score;
  resetButton.style.display = 'block';
}

function resetGame() {
  currentPlayer = humanPlayer;
  startGame();
}

function switchMode() {
  modeButtons.forEach(button => {
    button.classList.toggle('active');
  });

  gameMode = gameMode === 'human' ? 'robot' : 'human';
  if (gameMode === 'human') {
    player1Score = 0;
    player2Score = 0;
  }
  resetButton.click();
}

resetButton.addEventListener('click', () => {
  cells.forEach(cell => {
    cell.textContent = '';
  });
  resetGame();
});

modeButtons.forEach(button => {
  button.addEventListener('click', switchMode);
});
