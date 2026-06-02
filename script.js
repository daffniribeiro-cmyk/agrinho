// Estado do Jogo
let score = 0;
let money = 100;
let envHealth = 100;

let clickPower = 1;
let autoProduction = 0;

// Custos dos Upgrades
let costDrone = 50;
let costBio = 150;
let costEco = 80;

// Elementos do DOM
const scoreEl = document.getElementById('score');
const moneyEl = document.getElementById('money');
const envBarEl = document.getElementById('env-bar');
const envStatusEl = document.getElementById('env-status');
const messageEl = document.getElementById('message-box');

const btnHarvest = document.getElementById('harvest-btn');
const btnDrone = document.getElementById('up-drone');
const btnBio = document.getElementById('up-bio');
const btnEco = document.getElementById('up-eco');

// Atualiza a Interface
function updateUI() {
  scoreEl.innerText = Math.floor(score);
  moneyEl.innerText = Math.floor(money);
  
  // Atualiza barra ambiental
  envBarEl.style.width = envHealth + '%';
  envStatusEl.innerText = Math.floor(envHealth) + '%';
  
  if (envHealth > 60) {
    envBarEl.style.backgroundColor = '#4caf50';
  } else if (envHealth > 30) {
    envBarEl.style.backgroundColor = '#ff9800';
  } else {
    envBarEl.style.backgroundColor = '#d32f2f';
  }

  // Ativa/Desativa botões baseado no dinheiro
  btnDrone.disabled = money < costDrone;
  btnBio.disabled = money < costBio;
  btnEco.disabled = money < costEco || envHealth >= 100;
}

// Mostrar Mensagens Temporárias
function showMessage(text, type) {
  messageEl.innerText = text;
  messageEl.className = type === 'danger' ? 'danger-text' : 'success-text';
  setTimeout(() => { messageEl.innerText = ''; }, 3000);
}

// Ação de Colheita Manual
btnHarvest.addEventListener('click', () => {
  if (envHealth <= 0) {
    showMessage("O ecossistema colapsou! Plante árvores primeiro!", "danger");
    return;
  }
  
  score += clickPower;
  money += clickPower * 5; // Cada tonelada rende $5
  
  // A colheita manual gasta um pouquinho de recursos ambientais
  envHealth = Math.max(0, envHealth - 0.5);
  
  updateUI();
});

// Comprar Drone (Melhora o Clique)
btnDrone.addEventListener('click', () => {
  if (money >= costDrone) {
    money -= costDrone;
    clickPower += 1;
    costDrone = Math.floor(costDrone * 1.5);
    btnDrone.innerText = `Comprar ($${costDrone})`;
    showMessage("🛰️ Drones integrados! Colheita mais eficiente.", "success");
    updateUI();
  }
});

// Comprar Biofertilizante (Produção Automática)
btnBio.addEventListener('click', () => {
  if (money >= costBio) {
    money -= costBio;
    autoProduction += 2;
    costBio = Math.floor(costBio * 1.6);
    btnBio.innerText = `Comprar ($${costBio})`;
    showMessage("🧬 Biofertilizante ativado! Produção constante ligada.", "success");
    updateUI();
  }
});

// Comprar Reflorestamento (Recupera o Ambiente)
btnEco.addEventListener('click', () => {
  if (money >= costEco && envHealth < 100) {
    money -= costEco;
    envHealth = Math.min(100, envHealth + 20);
    showMessage("🌲 Área reflorestada! O planeta agradece.", "success");
    updateUI();
  }
});

// Loop do Jogo (Roda a cada 1 segundo)
setInterval(() => {
  if (autoProduction > 0 && envHealth > 0) {
    score += autoProduction;
    money += autoProduction * 4;
    
    // A produção automatizada consome o meio ambiente com o tempo
    envHealth = Math.max(0, envHealth - (autoProduction * 0.15));
  }
  
  if (envHealth <= 0) {
    envHealth = 0;
    showMessage("⚠️ Alerta: Produção parada devido ao impacto ambiental extremo!", "danger");
  }
  
  updateUI();
}, 1000);

// Inicialização
updateUI();