const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Load background image
const backgroundImage = new Image();
backgroundImage.src = 'asset/bg.png'; // Replace with the path to your background image
backgroundImage.onload = () => {
    console.log('Background image loaded successfully');
    resizeCanvas(); // Ensure canvas is resized after the image is loaded
    updateGame(); // Start the game loop after the image is loaded
};
backgroundImage.onerror = () => console.error('Error loading background image');

// Adjust canvas size to fit the window
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drawBackground(); // Call drawBackground to render the background image
}

// Draw background image with fixed aspect ratio
function drawBackground() {
    const aspectRatio = backgroundImage.width / backgroundImage.height;
    let drawHeight = canvas.height;
    let drawWidth = canvas.height * aspectRatio;

    const offsetX = (canvas.width - drawWidth) / 2;
    // const offsetY = (canvas.height - drawHeight) / 2;
    ctx.drawImage(backgroundImage, offsetX, 0, drawWidth, drawHeight);
    console.log('draw height:', drawHeight);
    console.log('draw width:', drawWidth);
    console.log('offset x:', offsetX);
    console.log('canvas width:', canvas.width);
    console.log('canvas height:', canvas.height);
}

window.addEventListener('resize', resizeCanvas);

// Game variables
let trainPosition = 0;
let trainSpeed = 2; // Adjust for faster or slower train movement
let teddyBearPositions = [];
let score = 0;
let trainLength = 5000; // Total length of the train in pixels
let trainHeight = 150; // Height of the train
let trainTop = canvas.height*3; // Top position of the train

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
    drawBackground(); // Draw the background image

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
