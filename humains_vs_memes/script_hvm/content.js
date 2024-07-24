imageSrcs.forEach((src, index) => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
        images[index] = img;
        imagesLoaded++;
        if (imagesLoaded === imageSrcs.length) {
            drawCharacterContent();  
        }
    };
    img.onerror = () => {
        console.error(`Error loading image at ${src}`);
    };
});

function drawInventoryContent() {
    context.clearRect(0, 0, canvas.width, canvas.height); 
    context.fillStyle = '#000000';
    context.font = '30px Arial';
    context.fillText('Shop', 150, 100);

    drawInventoryButtons();
    drawBackButton();
    drawShowBoulettes();
}

function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
    if (typeof stroke === 'undefined') {
        stroke = true;
    }
    if (typeof radius === 'undefined') {
        radius = 5;
    }
    if (typeof radius === 'number') {
        radius = {tl: radius, tr: radius, br: radius, bl: radius};
    } else {
        var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
        for (var side in defaultRadius) {
            radius[side] = radius[side] || defaultRadius[side];
        }
    }
    ctx.beginPath();
    ctx.moveTo(x + radius.tl, y);
    ctx.lineTo(x + width - radius.tr, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    ctx.lineTo(x + width, y + height - radius.br);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
    ctx.lineTo(x + radius.bl, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    ctx.lineTo(x, y + radius.tl);
    ctx.quadraticCurveTo(x, y, x + radius.tl, y);
    ctx.closePath();
    if (fill) {
        ctx.fill();
    }
    if (stroke) {
        ctx.stroke();
    }
}

function drawShowBoulettes(){
    context.font = 'bold 16px Arial';
    context.fillText(`Vous avez ${totalPaperBalls} boulettes de papier`, 35, 600);
}

function drawInventoryButtons() {
    const buttonWidth = 200;
    const buttonHeight = 50;
    const buttonPadding = 20;
    const startX = (canvas.width - buttonWidth) / 2;
    const startY = 150;

    // Définir le rayon des coins arrondis
    const borderRadius = 10;

    // (Acheter de la vie)
    context.fillStyle = ColorBackBTN;
    roundRect(context, startX, startY, buttonWidth, buttonHeight, borderRadius, true, false);
    context.fillStyle = ColorTXT;
    context.font = '16px Arial';
    context.fillText(`Vie: ${lifeCost} bls`, startX + 10, startY + 30);

    // (Acheter de la force)
    context.fillStyle = ColorBackBTN;
    roundRect(context, startX, startY + buttonHeight + buttonPadding, buttonWidth, buttonHeight, borderRadius, true, false);
    context.fillStyle = ColorTXT;
    context.fillText(`Force: ${strengthCost} bls`, startX + 10, startY + buttonHeight + buttonPadding + 30);

    // (Acheter un multiplicateur boulette)
    context.fillStyle = ColorBackBTN;
    roundRect(context, startX, startY + (buttonHeight + buttonPadding) * 2, buttonWidth, buttonHeight, borderRadius, true, false);
    context.fillStyle = ColorTXT;
    context.fillText(`Multiplicateur: ${multiplierCost} bls`, startX + 10, startY + (buttonHeight + buttonPadding) * 2 + 30);
}

// Gestion des clics sur les boutons de l'inventaire
canvas.addEventListener('click', (event) => {
    if (currentMode !== 'inventory') return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const buttonWidth = 150;
    const buttonHeight = 50;
    const buttonPadding = 20;
    const startX = (canvas.width - buttonWidth) / 2;
    const startY = 150;

    if (mouseX >= startX && mouseX <= startX + buttonWidth && mouseY >= startY && mouseY <= startY + buttonHeight) {
        if (totalPaperBalls >= lifeCost) {
            totalPaperBalls -= lifeCost;
            achatDeLaVie += 1;
            lifeCost = Math.floor(lifeCost * 5.5);
            updateStats();
            drawInventoryContent();
            saveAll();
        }
    }

    if (mouseX >= startX && mouseX <= startX + buttonWidth && mouseY >= startY + buttonHeight + buttonPadding && mouseY <= startY + buttonHeight + buttonPadding + buttonHeight) {
        if (totalPaperBalls >= strengthCost) {
            totalPaperBalls -= strengthCost;
            projectileForce += 1;
            strengthCost = Math.floor(strengthCost * 10.5);
            updateStats();
            drawInventoryContent();
            saveAll();
        }
    }

    if (mouseX >= startX && mouseX <= startX + buttonWidth && mouseY >= startY + (buttonHeight + buttonPadding) * 2 && mouseY <= startY + (buttonHeight + buttonPadding) * 2 + buttonHeight) {
        if (totalPaperBalls >= multiplierCost) {
            totalPaperBalls -= multiplierCost;
            multiplicateurPaperBalls += 1;
            multiplierCost = Math.floor(multiplierCost * 15.5);
            updateStats();
            drawInventoryContent();
            saveAll(); 
        }
    }
});

function getScoreMultiplier(distance) {
    return 1 + Math.floor(distance / 10) * 0.1;
}

