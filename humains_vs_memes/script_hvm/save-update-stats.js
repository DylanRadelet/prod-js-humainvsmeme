function loadStats() {
    totalMonstersKilled = parseInt(localStorage.getItem('totalMonstersKilled'), 10) || 0;
    totalPaperBalls = parseInt(localStorage.getItem('totalPaperBalls'), 10) || 0;
    previousDistance = parseInt(localStorage.getItem('distanceMax'), 10) || 0;
    lifeCost = parseInt(localStorage.getItem('lifeCost'), 10) || 10;
    strengthCost = parseInt(localStorage.getItem('strengthCost'), 10) || 20;
    multiplierCost = parseInt(localStorage.getItem('multiplierCost'), 10) || 30;
    projectileForce = parseInt(localStorage.getItem('projectileForce'), 10) || 1;
    multiplicateurPaperBalls = parseInt(localStorage.getItem('multiplicateurPaperBalls'), 10) || 1;
    achatDeLaVie = parseInt(localStorage.getItem('achatDeLaVie'), 10) || 1;
    score = parseFloat(localStorage.getItem('score')) || 0; 
    updateStats();
}

// Fonction pour charger les statistiques depuis le stockage local
function updateStats() {
    document.getElementById('distance-max').textContent = previousDistance;
    document.getElementById('meme-kill').textContent = totalMonstersKilled; 
    document.getElementById('boulette-papier').textContent = totalPaperBalls;
    saveAll();
}

// Fonction pour sauvegarder les statistiques dans le stockage local
function saveAll() {
    localStorage.setItem('totalMonstersKilled', totalMonstersKilled);
    localStorage.setItem('totalPaperBalls', totalPaperBalls);
    localStorage.setItem('distanceMax', previousDistance);
    localStorage.setItem('score', score);
    localStorage.setItem('lifeCost', lifeCost);
    localStorage.setItem('strengthCost', strengthCost);
    localStorage.setItem('multiplierCost', multiplierCost);
    localStorage.setItem('projectileForce', projectileForce);
    localStorage.setItem('multiplicateurPaperBalls', multiplicateurPaperBalls);
    localStorage.setItem('achatDeLaVie', achatDeLaVie);
}

// Charger les statistiques au chargement de la page
window.addEventListener('load', loadStats);
