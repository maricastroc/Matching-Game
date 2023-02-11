//Mapeando variáveis
const clickContainer = document.querySelector(
    ".click-counter"
);
const cards = document.querySelectorAll(".memory-card");
const backFaces = document.querySelectorAll(".back-face");
const frontFaces = document.querySelectorAll(".front-face");

const warningBoxFinish = document.getElementById(
    "warning-box-finish"
);
const timeText = document.getElementById("time-text");
const clickCounter =
    document.getElementById("click-counter");
const countText = document.getElementById("count-text");
const warningBoxStart = document.getElementById(
    "warning-box-start"
);
const tryAgainBtn = document.getElementById("try-again");
let disabled = [];
let root = document.querySelector(":root");

warningBoxFinish.classList.add("hide");

//-----------------------//

//Interface - Início de Jogo
const btnStart = document.getElementById("btn-start");
btnStart.addEventListener("click", () => {
    warningBoxStart.classList.add("hide");
});

//Interface - Fim de Jogo
const btnFinish = document.getElementById("btn-finish");
btnFinish.addEventListener("click", () => {
    warningBoxFinish.classList.add("hide");
});

//-----------------------//

//Cronômetro
const btnWatchStart = document.getElementById(
    "btn-watch-start"
);

let hours = 0;
let minutes = 0;
let seconds = 0;

let time = 1000; // === 1 segundo
let cronometer;
let hasClicked = false;
let lockBoard = true;
let firstTimePlaying = true;

//inicia o temporizador
function start() {
    if (hasClicked) return;
    cronometer = setInterval(() => {
        //setInterval() chama uma mesma função em intervalos específicos (em milissegundos).
        timer();
    }, time); //inicia com o time.value
}

btnWatchStart.addEventListener("click", () => {
    lockBoard = false;
    start();
    hasClicked = true; //impede que a pessoa clique novamente no cronômetro após iniciar o jogo
    btnWatchStart.innerText = "Time's running!";
    root.style.setProperty("--secondary-color", "#ffffff");
    btnWatchStart.style.cursor = "default";
});

//faz a contagem do tempo e exibição
function timer() {
    seconds++; //incrementa +1 na variável seconds

    if (seconds == 60) {
        //verifica se deu 59 segundos
        seconds = 0; //volta os segundos para 0
        minutes++; //adiciona +1 na variável minutes

        if (minutes == 60) {
            //verifica se deu 59 minutos
            minutes = 0; //Volta os minutos para 0
            hours++; //adiciona +1 na variável hora
        }
    }

    //cria uma variável com o valor tratado HH:minutes:seconds
    let format =
        (hours < 10 ? "0" + hours : hours) +
        ":" +
        (minutes < 10 ? "0" + minutes : minutes) +
        ":" +
        (seconds < 10 ? "0" + seconds : seconds);

    //insere o valor tratado no elemento counter
    document.getElementById("counter").innerText = format;

    //retorna o valor tratado
    return format;
}

//pausa o temporizador e limpa as variáveis
function clear() {
    clearInterval(cronometer);
    hours = 0;
    minutes = 0;
    seconds = 0;

    document.getElementById("counter").innerText =
        "00:00:00";
}

//-----------------------//

//verificando o número de cliques
let counterNumber = 0;
clickCounter.innerText = `${counterNumber} clicks until now.`;

//-----------------------//

//Jogo
cards.forEach((card) => {
    card.classList.add("cursor-pointer");
});

//verificando se o jogador clicou na carta pela 1a ou 2a vez
let hasFlippedCard = false;
let firstCard, secondCard;

function flipCard() {
    if (lockBoard) {
        return;
    } //para de executar a função

    this.classList.add("flip");
    this.classList.remove("cursor-pointer");

    //número de cliques
    let count = counterNumber + 1;
    count === 1
        ? (clickCounter.innerText = `${count} click until now.`)
        : (clickCounter.innerText = `${count} clicks until now.`);

    //primeiro clique do jogador (hasFlippedCard = false)
    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    }
    //abaixo: tudo dentro do 'else'
    secondCard = this;
    counterNumber++;

    //as cartas coincidem?
    checkForMatch();

    if (disabled.length > 15) {
        firstTimePlaying = false;
        clearInterval(cronometer);
        let finalTime =
            document.getElementById("counter").innerText;

        const previousTime =
            sessionStorage.getItem("previous-time");

        if (!previousTime) {
            timeText.innerText = `Your final time is: 
            ${finalTime}`;
        } else {
            timeText.innerText = `Your final time is: 
            ${finalTime}

            Your previous time was: ${previousTime}`;
        }

        countText.innerText = `You've clicked ${count} times.`;

        warningBoxStart.classList.add("hide");
        warningBoxFinish.classList.remove("hide");
        clickContainer.style.setProperty("display", "none");

        sessionStorage.setItem(
            "previous-time",
            document.getElementById("counter").innerText
        );
    }
}

function checkForMatch() {
    let isMatch =
        firstCard.dataset.framework ===
        secondCard.dataset.framework;

    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    //it's a match!
    firstCard.removeEventListener("click", flipCard);
    secondCard.removeEventListener("click", flipCard);

    firstCard.classList.add("cursor-default");
    secondCard.classList.add("cursor-default");

    disabled.push(firstCard.dataset.framework);
    disabled.push(secondCard.dataset.framework);

    reseatBoard();
}

function unflipCards() {
    lockBoard = true;
    //not a match
    setTimeout(() => {
        firstCard.classList.remove("flip");
        secondCard.classList.remove("flip");

        lockBoard = false;
        reseatBoard();
    }, 1500);
}

function reseatBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
    cards.forEach((card) => {
        card.classList.add("cursor-pointer");
    });
}

cards.forEach((card) =>
    card.addEventListener("click", flipCard)
);

//colocando a função entre parêntesis para ela ser executada sem estar associada a nenhum
//evento; é, portanto, executada assim que a página carrega
//execução logo após sua definição
(function shuffle() {
    cards.forEach((card) => {
        let randomNum = Math.floor(Math.random() * 16);
        card.style.order = randomNum;
    });
})();

tryAgainBtn.addEventListener("click", () => {
    sessionStorage.setItem(
        "previous-time",
        document.getElementById("counter").innerText
    );
    location.reload();
    clear();
});
