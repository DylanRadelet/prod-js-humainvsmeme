let gameStarted = false;
let countdown = 3; 
let gameLoopId;
let distance = 0;
let previousDistance = 0;
let currentMode = 'menu'; // Initialiser le mode actuel à 'menu'

function gameLoop() {
    context.clearRect(0, 0, canvas.width, canvas.height);  // Efface le canvas

    if (currentMode === 'play') {
        if (!gameStarted) {
            drawCountdown();
        } else {
            drawPlayContent();
        }
    } else if (currentMode === 'character') {
        drawCharacterContent();
    } else if (currentMode === 'inventory') {
        drawInventoryContent();
    }

    if (currentMode !== 'menu') {
        drawBackButton();  
    }
    drawDamageText();
    gameLoopId = requestAnimationFrame(gameLoop);  // Appelle gameLoop de manière récursive pour créer une boucle
}

// Fonction pour arrêter la boucle de jeu
function stopGameLoop() {
    if (gameLoopId) {
        cancelAnimationFrame(gameLoopId);
        gameLoopId = null;
    }
}

// Fonction pour dessiner le compte à rebours
function drawCountdown() {
    context.fillStyle = '#000000';
    context.font = 'bold 50px Arial';
    context.fillText(countdown, canvas.width / 2 - 15, canvas.height / 2);
}

// Démarrer le jeu après le compte à rebours
function startGameAfterCountdown() {
    const countdownInterval = setInterval(() => {
        if (countdown > 1) {
            countdown--;
        } else {
            clearInterval(countdownInterval);
            gameStarted = true;
        }
    }, 1000);
}

function updateMenuStats() {
    document.getElementById('distance-max').textContent = previousDistance;
    document.getElementById('meme-kill').textContent = totalMonstersKilled;
    document.getElementById('boulette-papier').textContent = totalPaperBalls;
}

playButton.addEventListener('click', () => {
    //console.log("Play button clicked");
    showCanvas();
    resetGame();
    currentMode = 'play';
    startGameAfterCountdown();
    gameLoop();
});

characterButton.addEventListener('click', () => {
    //console.log("Character button clicked");
    showCanvas();
    currentMode = 'character';
    gameLoop();
});

inventoryButton.addEventListener('click', () => {
    //console.log("Inventory button clicked");
    showCanvas();
    currentMode = 'inventory'; 
    gameLoop();
});

