// // SANS HASH

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
    document.getElementById('distance-max').textContent = Math.floor(previousDistance);
    document.getElementById('meme-kill').textContent = totalMonstersKilled; 
    document.getElementById('boulette-papier').textContent = totalPaperBalls;
    saveAll();
}

// Fonction pour sauvegarder les statistiques dans le stockage local
function saveAll() {
    localStorage.setItem('totalMonstersKilled', totalMonstersKilled);
    localStorage.setItem('totalPaperBalls', totalPaperBalls);
    localStorage.setItem('distanceMax', Math.floor(previousDistance));
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

// AVEC HASH

// const encryptionKey = "Je_Parle_A_Un_Cannard"; 

// function encryptValue(value, key) {
//     return CryptoJS.AES.encrypt(value.toString(), key).toString();
// }

// function decryptValue(encrypted, key) {
//     if (!encrypted) return 0; 

//     const bytes = CryptoJS.AES.decrypt(encrypted, key);
//     const decryptedValue = bytes.toString(CryptoJS.enc.Utf8);
//     return parseFloat(decryptedValue);
// }

// async function loadStats() {
//     totalMonstersKilled = decryptValue(localStorage.getItem('totalMonstersKilled'), encryptionKey) || 0;
//     totalPaperBalls = decryptValue(localStorage.getItem('totalPaperBalls'), encryptionKey) || 0;
//     previousDistance = decryptValue(localStorage.getItem('distanceMax'), encryptionKey) || 0;
//     lifeCost = decryptValue(localStorage.getItem('lifeCost'), encryptionKey) || 10;
//     strengthCost = decryptValue(localStorage.getItem('strengthCost'), encryptionKey) || 20;
//     multiplierCost = decryptValue(localStorage.getItem('multiplierCost'), encryptionKey) || 30;
//     projectileForce = decryptValue(localStorage.getItem('projectileForce'), encryptionKey) || 1;
//     multiplicateurPaperBalls = decryptValue(localStorage.getItem('multiplicateurPaperBalls'), encryptionKey) || 1;
//     achatDeLaVie = decryptValue(localStorage.getItem('achatDeLaVie'), encryptionKey) || 1;
//     score = decryptValue(localStorage.getItem('score'), encryptionKey) || 0;

//     updateStats();
// }

// // Fonction pour charger les statistiques depuis le stockage local
// async function updateStats() {
//     document.getElementById('distance-max').textContent = Math.floor(previousDistance);
//     document.getElementById('meme-kill').textContent = totalMonstersKilled;
//     document.getElementById('boulette-papier').textContent = totalPaperBalls;
//     saveAll();
// }

// // Fonction pour sauvegarder les statistiques dans le stockage local
// function saveAll() {
//     localStorage.setItem('totalMonstersKilled', encryptValue(totalMonstersKilled, encryptionKey));
//     localStorage.setItem('totalPaperBalls', encryptValue(totalPaperBalls, encryptionKey));
//     localStorage.setItem('distanceMax', encryptValue(Math.floor(previousDistance), encryptionKey));
//     localStorage.setItem('score', encryptValue(score, encryptionKey));
//     localStorage.setItem('lifeCost', encryptValue(lifeCost, encryptionKey));
//     localStorage.setItem('strengthCost', encryptValue(strengthCost, encryptionKey));
//     localStorage.setItem('multiplierCost', encryptValue(multiplierCost, encryptionKey));
//     localStorage.setItem('projectileForce', encryptValue(projectileForce, encryptionKey));
//     localStorage.setItem('multiplicateurPaperBalls', encryptValue(multiplicateurPaperBalls, encryptionKey));
//     localStorage.setItem('achatDeLaVie', encryptValue(achatDeLaVie, encryptionKey));
// }

// // Charger les statistiques au chargement de la page
// window.addEventListener('load', loadStats);
