function showMenu() {
    //console.log("Show menu");
    stopGameLoop();
    updateStats();
    menu.style.display = 'flex';
    canvas.style.display = 'none';
    currentMode = 'menu';
}

// Fonction pour afficher le canvas
function showCanvas() {
    //console.log("Show canvas");
    menu.style.display = 'none';
    canvas.style.display = 'block';
    resizeCanvas();
}

// Fonction pour gérer les déplacements du joueur
function movePlayer(event) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    player.x = mouseX - player.width / 2;
    player.x = Math.max(0, Math.min(player.x, canvas.width - player.width));
}

// Fonction pour gérer les déplacements tactiles du joueur
function movePlayerTouch(event) {
    const rect = canvas.getBoundingClientRect();
    const touchX = event.touches[0].clientX - rect.left - 50;

    if (touchX > 0 && touchX < canvas.width - player.width) {
        player.x = touchX;
    }
}

canvas.addEventListener('mousemove', (event) => {
    if (currentMode !== 'inventory') return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const buttonWidth = 150;
    const buttonHeight = 50;
    const buttonPadding = 20;
    const startX = (canvas.width - buttonWidth) / 2;
    const startY = 150;

    let hovering = false;

    if (mouseX >= startX && mouseX <= startX + buttonWidth && mouseY >= startY && mouseY <= startY + buttonHeight) {
        hovering = true;
    }

    if (mouseX >= startX && mouseX <= startX + buttonWidth && mouseY >= startY + buttonHeight + buttonPadding && mouseY <= startY + buttonHeight + buttonPadding + buttonHeight) {
        hovering = true;
    }

    if (mouseX >= startX && mouseX <= startX + buttonWidth && mouseY >= startY + (buttonHeight + buttonPadding) * 2 && mouseY <= startY + (buttonHeight + buttonPadding) * 2 + buttonHeight) {
        hovering = true;
    }

    if (hovering) {
        canvas.style.cursor = 'pointer';
    } else {
        canvas.style.cursor = 'default';
    }
});

// Gestion du survol et du clic pour sélectionner une image
canvas.addEventListener('mousemove', handleCharacterMouseMove);
canvas.addEventListener('click', handleCharacterClick);
canvas.addEventListener('touchstart', handleCharacterTouchStart, { passive: false });
canvas.addEventListener('mousemove', movePlayer);
canvas.addEventListener('click', shootProjectile);

function handleCharacterMouseMove(event) {
    if (currentMode !== 'character') return; // Ne rien faire si on n'est pas en mode 'character'
    
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    let hovering = false;
    for (let i = 0; i < imageRects.length; i++) {
        const { x, y, width, height } = imageRects[i];
        if (mouseX >= x && mouseX <= x + width && mouseY >= y && mouseY <= y + height) {
            canvas.style.cursor = 'pointer';
            hovering = true;
            break;
        }
    }

    if (!hovering) {
        canvas.style.cursor = 'default';
    }
}

// Ajoutez des écouteurs d'événements pour les touches tactiles
canvas.addEventListener('touchmove', (event) => {
    if (!gameOver) {
        event.preventDefault();
        movePlayerTouch(event);
    }
}, { passive: false });

canvas.addEventListener('touchstart', (event) => {
    if (!gameOver) {
        event.preventDefault();
        movePlayerTouch(event); // Déplacer le joueur
        startShooting();
    }
}, { passive: false });

canvas.addEventListener('touchend', (event) => {
    if (!gameOver) {
        event.preventDefault();
        stopShooting();
    }
}, { passive: false });

function handleGameOverKey(event) {
    if (event.code === 'Space') {
        document.removeEventListener('keydown', handleGameOverKey);
        showMenu();
        resetGame();
    }
}

function handleGameOverClick(event) {
    canvas.removeEventListener('click', handleGameOverClick);
    canvas.removeEventListener('touchstart', handleGameOverClick, { passive: false });

    showMenu();
    resetGame();
}

// Écouteurs pour les boutons du menu
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

canvas.addEventListener('mousemove', (event) => {
    if (!gameOver) {
        movePlayer(event);
    }
});
canvas.addEventListener('click', (event) => {
    if (!gameOver) {
        shootProjectile(event);
    }
});

// Ajoutez des écouteurs d'événements pour les touches tactiles
canvas.addEventListener('touchmove', (event) => {
    if (!gameOver) {
        event.preventDefault();
        movePlayerTouch(event);
    }
}, { passive: false });

canvas.addEventListener('touchstart', (event) => {
    if (!gameOver) {
        event.preventDefault();
        shootProjectileTouch(event);
    }
}, { passive: false });

distanceButton.addEventListener('click', () => {
    showDistanceModal();
});

closeDistanceModal.addEventListener('click', () => {
    hideDistanceModal();
});

confirmDistance.addEventListener('click', () => {
    startGameAtSelectedDistance();
    hideDistanceModal();
});

function showDistanceModal() {
    updateDistanceOptions();
    distanceModal.style.display = 'flex';
}

function hideDistanceModal() {
    distanceModal.style.display = 'none';
}

// Fonction pour commencer à tirer des projectiles en continu
function startShooting() {
    shootProjectile(); // Tir initial
    shootingInterval = setInterval(() => {
        shootProjectile();
    }, shootingIntervalTime);
}

// Fonction pour arrêter le tir continu
function stopShooting() {
    clearInterval(shootingInterval);
}

function handleCharacterClick(event) {
    if (currentMode !== 'character') return; // Ne rien faire si on n'est pas en mode 'character'
    
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    processCharacterSelection(mouseX, mouseY);
}

function handleCharacterTouchStart(event) {
    if (currentMode !== 'character') return; 
    
    event.preventDefault(); // Empêche les autres actions par défaut sur mobile
    const rect = canvas.getBoundingClientRect();
    const touchX = event.touches[0].clientX - rect.left;
    const touchY = event.touches[0].clientY - rect.top;

    processCharacterSelection(touchX, touchY);
}

function processCharacterSelection(x, y) {
    for (let i = 0; i < imageRects.length; i++) {
        const { x: rectX, y: rectY, width, height } = imageRects[i];
        if (x >= rectX && x <= rectX + width && y >= rectY && y <= rectY + height) {
            selectedImageIndex = i;
            saveSelectedCharacter(i); 
            updateMenuIcon();
            drawCharacterContent(); 
            break;
        }
    }
}

// Gestion des clics et touches sur les boutons de l'inventaire
canvas.addEventListener('click', handleInventoryButtonClick);
canvas.addEventListener('touchstart', handleInventoryButtonTouch, { passive: false });

function handleInventoryButtonClick(event) {
    if (currentMode !== 'inventory') return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    processInventoryButtonInteraction(mouseX, mouseY);
}

function handleInventoryButtonTouch(event) {
    if (currentMode !== 'inventory') return;

    event.preventDefault(); 
    const rect = canvas.getBoundingClientRect();
    const touchX = event.touches[0].clientX - rect.left;
    const touchY = event.touches[0].clientY - rect.top;

    processInventoryButtonInteraction(touchX, touchY);
}

function processInventoryButtonInteraction(x, y) {
    const buttonWidth = 150;
    const buttonHeight = 50;
    const buttonPadding = 20;
    const startX = (canvas.width - buttonWidth) / 2;
    const startY = 150;

    if (x >= startX && x <= startX + buttonWidth && y >= startY && y <= startY + buttonHeight) {
        if (totalPaperBalls >= lifeCost) {
            totalPaperBalls -= lifeCost;
            achatDeLaVie += 1;
            lifeCost = Math.floor(lifeCost * 5.5);
            updateStats();
            drawInventoryContent();
            saveAll();
        }
    }

    if (x >= startX && x <= startX + buttonWidth && y >= startY + buttonHeight + buttonPadding && y <= startY + buttonHeight + buttonPadding + buttonHeight) {
        if (totalPaperBalls >= strengthCost) {
            totalPaperBalls -= strengthCost;
            projectileForce += 1;
            strengthCost = Math.floor(strengthCost * 10.5);
            updateStats();
            drawInventoryContent();
            saveAll();
        }
    }

    if (x >= startX && x <= startX + buttonWidth && y >= startY + (buttonHeight + buttonPadding) * 2 && y <= startY + (buttonHeight + buttonPadding) * 2 + buttonHeight) {
        if (totalPaperBalls >= multiplierCost) {
            totalPaperBalls -= multiplierCost;
            multiplicateurPaperBalls += 1;
            multiplierCost = Math.floor(multiplierCost * 15.5);
            updateStats();
            drawInventoryContent();
            saveAll();
        }
    }
}