
function resizeCanvas() {
    const container = document.getElementById('gameContainer');
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    canvas.width = containerWidth;
    canvas.height = containerHeight;

    player.x = canvas.width / 2 - player.width / 2;
    player.y = canvas.height - player.height - 10;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Fonction pour tirer des projectiles
function shootProjectile(event) {
    projectiles.push({ x: player.x + player.width / 2 - 2.5, y: player.y, width: 5, height: 10 });
}

// Fonction pour tirer des projectiles avec un toucher
function shootProjectileTouch(event) {
    projectiles.push({ x: player.x + player.width / 2 - 2.5, y: player.y, width: 5, height: 10 });
}

// Ajoutez des écouteurs d'événements pour les mouvements de la souris et les clics




// Fonction pour dessiner la croix de retour sur le canvas
function drawBackButton() {
    const { x, y, size } = backButton;
    context.strokeStyle = '#FF0000';
    context.lineWidth = 4;

    // Dessiner la croix
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(x + size, y + size);
    context.moveTo(x + size, y);
    context.lineTo(x, y + size);
    context.stroke();
}

// Gestion du clic sur la croix de retour
canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const { x, y, size } = backButton;

    if (mouseX >= x && mouseX <= x + size && mouseY >= y && mouseY <= y + size) {
        pauseGame();
        showModal();
    }
});

canvas.addEventListener('touchstart', (event) => {
    const rect = canvas.getBoundingClientRect();
    const touchX = event.touches[0].clientX - rect.left;
    const touchY = event.touches[0].clientY - rect.top;

    const { x, y, size } = backButton;

    if (touchX >= x && touchX <= x + size && touchY >= y && touchY <= y + size) {
        event.preventDefault(); // Empêche les autres actions par défaut sur mobile
        pauseGame();
        showModal();
    }
}, { passive: false });

let gameOver = false;

function showGameOver() {
    gameOver = true;
    context.clearRect(0, 0, canvas.width, canvas.height); 

    const imgWidth = 340; 
    const imgHeight = 100; 
    context.drawImage(imgGameOver, (canvas.width - imgWidth) / 2, (canvas.height - imgHeight) / 2 - 70, imgWidth, imgHeight);

    document.addEventListener('keydown', handleGameOverKey);

    canvas.addEventListener('click', handleGameOverClick);
    canvas.addEventListener('touchstart', handleGameOverClick, { passive: false });
}

function pauseGame() {
    stopGameLoop();
}

function resumeGame() {
    if (!gameOver) {
        gameLoop(); // Redémarre la boucle de jeu si le jeu n'est pas terminé
    }
}

function showModal() {
    stopGameLoop();
    confirmModal.style.display = 'flex';
}

function hideModal() {
    confirmModal.style.display = 'none';
}

confirmYes.addEventListener('click', () => {
    hideModal();
    showMenu();
    resetGame();
});

confirmNo.addEventListener('click', () => {
    hideModal();
    resumeGame();
});

function drawCountdown() {
    context.fillStyle = '#000000';
    context.font = 'bold 50px Arial';
    context.fillText(countdown, canvas.width / 2 - 15, canvas.height / 2);
}

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

function resetGame(distance = 0) {
    gameOver = false;
    gameStarted = false;
    bossActive = false;
    countdown = 3;
    player.lives = 4 + achatDeLaVie;
    player.x = canvas.width / 2 - player.width / 2;
    player.y = canvas.height - player.height - 10;
    projectiles = [];
    enemies = [];
    score = 0;
    paperBalls = 0;
    totalDistance = distance;  
    gameDuration = distance * 3 / 0.5;  
    enemySpeed = 0.5; 
    spawnProbability = 0.01;
}

function updateDistanceOptions() {
    distanceOptions.innerHTML = '';
    for (let i = 0; i+2 <= previousDistance; i += 1000) {
        if (i > 0) {
            const option = document.createElement('button');
            option.textContent = `${i} mètres`;
            option.addEventListener('click', () => {
                selectedDistance = Math.floor((i / 6));  
                updateSelectedOption(option);
            });
            distanceOptions.appendChild(option);
        }
    }
}

function updateSelectedOption(selectedOption) {
    Array.from(distanceOptions.children).forEach(option => {
        option.style.backgroundColor = '';
    });
    selectedOption.style.backgroundColor = 'lightgray';
}

function startGameAtSelectedDistance() {
    showCanvas();
    resetGame(selectedDistance);
    currentMode = 'play';
    startGameAfterCountdown();
    gameLoop();
}

distanceButton.addEventListener('click', () => {
    showDistanceModal();
});





