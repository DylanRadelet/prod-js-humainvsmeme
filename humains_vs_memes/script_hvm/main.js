function gameLoop() {
    context.clearRect(0, 0, canvas.width, canvas.height);  

    if (currentMode === 'play') {
        if (!gameStarted) {
            drawCountdown();
        } else if (!gameOver) {  
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

    if (!gameOver) {  
        gameLoopId = requestAnimationFrame(gameLoop);  
    }
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

playButton.addEventListener('click', () => {
    showCanvas();
    resetGame();
    currentMode = 'play';
    startGameAfterCountdown();
    gameLoop();
});

characterButton.addEventListener('click', () => {
    showCanvas();
    currentMode = 'character';
    gameLoop();
});

inventoryButton.addEventListener('click', () => {
    showCanvas();
    currentMode = 'inventory'; 
    gameLoop();
});