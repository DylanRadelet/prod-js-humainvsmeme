// Prend le character dans le local storage
function loadSelectedCharacter() {
    const savedIndex = localStorage.getItem('selectedCharacterIndex');
    if (savedIndex !== null) {
        selectedImageIndex = parseInt(savedIndex, 10);
        updateMenuIcon();
    }
}

// Enregistre le character selectionné
function saveSelectedCharacter(index) {
    localStorage.setItem('selectedCharacterIndex', index);
}

// Dessine le contenu de la page character
function drawCharacterContent() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#000000';
    context.font = '20px Arial';
    context.fillText('Choix du personnage'.toUpperCase(), 60, 100);

    const squareSize = 120;
    const gap = 20;
    const totalHeight = (squareSize + gap) * images.length - gap;
    const startX = (canvas.width - squareSize) / 2; 
    const startY = (canvas.height - totalHeight) / 2; 
    for (let i = 0; i < images.length; i++) {
        const x = startX;
        const y = startY + i * (squareSize + gap);
        if (images[i]) {
            context.drawImage(images[i], x, y, squareSize, squareSize);
        }
        imageRects[i] = { x, y, width: squareSize, height: squareSize };

        if (i === selectedImageIndex) {
            context.strokeStyle = '#C6FE20';
            context.lineWidth = 5;
            context.strokeRect(x, y, squareSize, squareSize);
        }
    }
}

// Gestion de la selection de l'image du character
canvas.addEventListener('click', (event) => {
    if (currentMode !== 'character') return;
    
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    let hovering = false;
    for (let i = 0; i < imageRects.length; i++) {
        const { x, y, width, height } = imageRects[i];
        if (mouseX >= x && mouseX <= x + width && mouseY >= y && mouseY <= y + height) {
            selectedImageIndex = i;
            saveSelectedCharacter(i);
            updateMenuIcon();
            drawCharacterContent();
            break;
        }
    }
});

// Met à jour l'icon du menu
function updateMenuIcon() {
    const menuIcon = document.getElementById('menuIcon');
    if (images[selectedImageIndex]) {
        menuIcon.src = images[selectedImageIndex].src;
        menuIcon.style.border = '2px solid #000000';
    }
}

window.addEventListener('load', loadSelectedCharacter);