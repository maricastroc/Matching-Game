const startBtn = document.querySelector(".start-btn");

const cards = document.querySelectorAll(".memory-card");
const backFaces = document.querySelectorAll(".back-face");
const frontFaces = document.querySelectorAll(".front-face");
const counter = document.getElementById("counter");

let disabled = [];

let hours = 0;
let minutes = 0;
let seconds = 0;

let time = 1000;
let cronometer;
let hasClicked = false;
let lockBoard = true;
let firstTimePlaying = true;

const startGame = () => {
    lockBoard = false;
    start();
    hasClicked = true;
    startBtn.innerText = "Started!";
    startBtn.style.setProperty("cursor", "default");
    startBtn.classList.add("btn-active");
    startBtn.removeEventListener("click", startGame);
};

startBtn.addEventListener("click", startGame);

//inicia o temporizador
function start() {
    if (hasClicked) return;
    cronometer = setInterval(() => {
        timer();
    }, time);
}

function timer() {
    seconds++;

    if (seconds == 60) {
        seconds = 0;
        minutes++;
    }

    if (minutes == 60) {
        minutes = 0;
        hours++;
    }

    let format =
        (hours < 10 ? "0" + hours : hours) +
        ":" +
        (minutes < 10 ? "0" + minutes : minutes) +
        ":" +
        (seconds < 10 ? "0" + seconds : seconds);

    counter.innerText = format;

    return format;
}

function clear() {
    clearInterval(cronometer);
    hours = 0;
    minutes = 0;
    seconds = 0;

    document.getElementById("counter").innerText =
        "00:00:00";
}

//Verificando o número de cliques
let counterNumber = 0;
document.getElementById(
    "clicks"
).innerText = `${counterNumber} clicks`;

//Jogo
cards.forEach((card) => {
    card.classList.add("cursor-pointer");
});

let hasFlippedCard = false;
let firstCard, secondCard;

function flipCard() {
    if (lockBoard) {
        return;
    }

    this.classList.add("flip");
    this.classList.remove("cursor-pointer");

    //número de cliques
    let count = counterNumber + 1;
    count === 1
        ? (document.getElementById(
              "clicks"
          ).innerText = `${count} click`)
        : (document.getElementById(
              "clicks"
          ).innerText = `${count} clicks`);

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    secondCard = this;
    counterNumber++;

    checkForMatch();

    if (disabled.length > 15) {
        firstTimePlaying = false;
        clearInterval(cronometer);

        const previousTime =
            sessionStorage.getItem("previous-time");

        if (!previousTime) {
            document.getElementById(
                "final-time"
            ).innerText = timer();
        } else {
            document.getElementById(
                "final-time"
            ).innerText = timer();
            document
                .querySelector(".previous-time-result")
                .classList.remove("hidden");
            document.getElementById(
                "previous-time"
            ).innerText = previousTime;
        }

        document
            .querySelector(".warning-start-container")
            .classList.add("hidden");
        document
            .querySelector(".warning-end-container")
            .classList.remove("hidden");

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

document
    .querySelector(".try-again-btn")
    .addEventListener("click", () => {
        sessionStorage.setItem(
            "previous-time",
            document.getElementById("counter").innerText
        );
        location.reload();
        clear();
    });

(function shuffle() {
    cards.forEach((card) => {
        let randomNum = Math.floor(Math.random() * 16);
        card.style.order = randomNum;
    });
})();
