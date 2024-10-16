const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Adjust canvas size to fit the window
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Game variables
let trainPosition = 0;
let trainSpeed = 2; // Adjust for faster or slower train movement
let teddyBearPositions = [];
let score = 0;
let trainLength = 5000; // Total length of the train in pixels
let trainHeight = 150; // Height of the train
let trainTop = canvas.height * 3 / 5; // Top position of the train

// Create random teddy bears on the train
function createTeddyBears() {
    const numTeddyBears = 20; // Number of teddy bears
    for (let i = 0; i < numTeddyBears; i++) {
        teddyBearPositions.push({
            x: Math.random() * trainLength, // Random position along the train length
            y: Math.random() * trainHeight + trainTop, // Random position on the vertical axis
        });
    }
}
createTeddyBears();

const teddyBearImage = new Image();
teddyBearImage.src = 'asset/bear.png'; // Replace with the actual path to your teddy bear image
// Draw the train and teddy bears
function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the moving train (as a simple rectangle for now)
    ctx.fillStyle = 'brown';
    ctx.fillRect(-trainPosition, trainTop, trainLength, trainHeight);

    // Draw teddy bears on the train
    teddyBearPositions.forEach((teddy) => {
        const teddyX = teddy.x - trainPosition;
        if (teddyX > 0 && teddyX < canvas.width) {
            // Draw teddy bear if it's in the visible part of the train
            ctx.drawImage(teddyBearImage, teddyX - 15, teddy.y - 15, 30, 30);
        }
    });

    // Draw the score
    ctx.fillStyle = 'black';
    ctx.font = '24px Arial';
    ctx.fillText(`Score: ${score}`, 20, 40);
}

// Update game state
function updateGame() {
    trainPosition += trainSpeed;

    // End the game when the train has fully moved out of view
    if (trainPosition > trainLength) {
        alert(`Game over! Your score: ${score}`);
        resetGame();
    }

    drawGame();
    requestAnimationFrame(updateGame);
}

// Reset the game
function resetGame() {
    trainPosition = 0;
    score = 0;
    teddyBearPositions = [];
    createTeddyBears();
}

// Handle click/touch events to collect teddy bears
canvas.addEventListener('click', handleTouchOrClick);
canvas.addEventListener('touchstart', handleTouchOrClick);

function handleTouchOrClick(event) {
    const clickX = event.touches ? event.touches[0].clientX : event.clientX;
    const clickY = event.touches ? event.touches[0].clientY : event.clientY;

    teddyBearPositions.forEach((teddy, index) => {
        const teddyX = teddy.x - trainPosition;
        if (
            clickX >= teddyX - 15 && clickX <= teddyX + 15 &&
            clickY >= teddy.y - 15 && clickY <= teddy.y + 15
        ) {
            score += 1;
            teddyBearPositions.splice(index, 1); // Remove the clicked teddy bear
        }
    });
}

// Start the game loop
updateGame();
