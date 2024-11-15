// Sound effects (optional, you can remove if you don't need them)
const moveSound = new Audio('move.mp3');
const winSound = new Audio('win.wav');
const resetSound = new Audio('reset.mp3');

// Emoji-based symbols
const symbols = ['❤️', '🐵', '🦄', '🐱'];
let playerIcon = '';
let computerIcon = '';

// Game state
const board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let isGameActive = true;

// UI elements
const gameBoard = document.getElementById('game-board');
const message = document.getElementById('message');
const resetButton = document.getElementById('reset-btn');
const iconSelectionScreen = document.getElementById('icon-selection');
const gameScreen = document.getElementById('game-screen');
const iconElements = document.querySelectorAll('.icon');

// Add this function to handle the loading and transition from welcome screen to icon selection screen
function showWelcomeScreen() {
    setTimeout(() => {
        document.getElementById('welcome-screen').style.display = 'none';
        document.getElementById('icon-selection').style.display = 'block';
    }, 4000); // Delay of 4 seconds for the full animation to finish
}

// Call this function when the page loads
window.onload = showWelcomeScreen;

// Function to play a sound
function playSound(sound) {
    sound.currentTime = 0;
    sound.play();
}

// Function to start the game
function startGame() {
    iconSelectionScreen.style.display = 'none';
    gameScreen.style.display = 'block';
    message.textContent = `${playerIcon} Your Turn!`;

    // Randomly assign computer's icon
    const remainingIcons = symbols.filter(icon => icon !== playerIcon);
    computerIcon = remainingIcons[Math.floor(Math.random() * remainingIcons.length)];
    console.log(`Computer's icon: ${computerIcon}`);
}

// Function to handle cell clicks
function handleCellClick(event) {
    const cellIndex = event.target.dataset.index;

    // Ignore if the cell is already taken or if the game is not active
    if (board[cellIndex] !== '' || !isGameActive || currentPlayer === 'O') return;

    // Update board and UI
    board[cellIndex] = currentPlayer;
    event.target.textContent = currentPlayer === 'X' ? playerIcon : computerIcon;
    event.target.classList.add('taken');

    // Check for winner or switch turns
    if (!checkWinner()) {
        // Switch to the other player's turn
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        if (currentPlayer === 'X') {
            message.textContent = `${playerIcon} Your Turn!`;
        } else {
            message.textContent = `${computerIcon} Computer's Turn!`;
            setTimeout(computerMove, 500); // AI move
        }
    }
}

// Function to check for a winner with animation
function checkWinner() {
    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    for (const condition of winningConditions) {
        const [a, b, c] = condition;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            isGameActive = false;
            message.textContent = `${board[a]} wins! 🎉`;
            playSound(winSound);

            // Highlight the winning cells
            condition.forEach(index => {
                const cell = document.querySelector(`[data-index="${index}"]`);
                cell.classList.add('winning');
            });

            return true;
        }
    }

    if (!board.includes('')) {
        isGameActive = false;
        message.textContent = "It's a draw! 😞";

        // Animate all cells for a draw
        document.querySelectorAll('.cell').forEach(cell => {
            cell.classList.add('draw');
        });

        return true;
    }

    return false;
}


// Function for the computer's move (simple AI)
function computerMove() {
    if (!isGameActive) return;

    // Simple AI: Choose the first available cell
    for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
            board[i] = computerIcon;
            const cell = document.querySelector(`[data-index="${i}"]`);
            cell.textContent = computerIcon;
            cell.classList.add('taken');
            
            break;
        }
    }

    if (!checkWinner()) {
        currentPlayer = 'X';
        message.textContent = `${playerIcon} Your Turn!`;
    }
}

function resetGame() {
    board.fill('');
    currentPlayer = 'X';
    isGameActive = true;
    message.textContent = `${playerIcon} Your Turn!`;

    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('taken', 'winning', 'draw');
    });
    
}
// Reset button listener with enhanced animation and smooth board reset
resetButton.addEventListener('click', () => {
    resetButton.classList.add('clicked'); // Add the animation class for explosion effect
    playSound(resetSound); // Play reset sound
    
    // Apply board reset animation and delay the reset of the game
    const cells = document.querySelectorAll('.cell');
    
    // Animate the cells (fade out and shrink)
    cells.forEach(cell => {
        cell.classList.add('resetting');
    });

    // After the board reset animation is complete, reset the game state
    setTimeout(() => {
        resetButton.classList.remove('clicked'); // Remove the explosion animation class
        resetGame(); // Call the resetGame function

        // After reset, remove the resetting class from all cells and reset them
        cells.forEach(cell => {
            cell.classList.remove('resetting');
            cell.textContent = ''; // Clear the text
            cell.classList.remove('taken', 'winning', 'draw'); // Remove all applied classes
        });
    }, 2300); // Matches the animation duration (3 seconds)
});

// Initialize the game board
function createBoard() {
    gameBoard.innerHTML = '';
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.index = i;
        cell.addEventListener('click', handleCellClick);
        gameBoard.appendChild(cell);
    }
}

// Event listeners for the icon selection screen
iconElements.forEach(icon => {
    icon.addEventListener('click', (event) => {
        playerIcon = event.target.dataset.icon;
        startGame();
    });
});

// Reset button listener
resetButton.addEventListener('click', resetGame);

// Initialize the game
createBoard();
