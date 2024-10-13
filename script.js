const wordsList = [
  { english: "Apple", indonesian: "Apel" },
  { english: "Banana", indonesian: "Pisang" },
  { english: "Orange", indonesian: "Jeruk" },
  { english: "Grape", indonesian: "Anggur" },
  { english: "Pineapple", indonesian: "Nanas" },
  { english: "Mango", indonesian: "Mangga" },
  { english: "Strawberry", indonesian: "Stroberi" },
  { english: "Cherry", indonesian: "Ceri" },
  { english: "Peach", indonesian: "Persik" },
  { english: "Lemon", indonesian: "Lemon" },
];

let currentLevel = 1;
let currentStage = 1;
let score = 0;
let targetPerStage = 3;
let totalCorrectNeeded = 9;
let timeRemaining = 60;
let timer;
let currentCorrectAnswers = 0;
let currentWrongAnswers = 0;

document.getElementById("start-btn").addEventListener("click", startGame);

function startGame() {
  const userName = document.getElementById("user-name").value;
  if (!userName) {
    alert("Masukkan nama Anda untuk memulai!");
    return;
  }

  document.getElementById("start-screen").style.display = "none";
  document.querySelector(".container").style.display = "block";
  document.getElementById("level-number").innerText = currentLevel;
  setLevelTargets();
  resetStage();
  startTimer();
}

function setLevelTargets() {
  if (currentLevel === 1) {
    totalCorrectNeeded = 9;
    targetPerStage = 3;
  } else if (currentLevel === 2) {
    totalCorrectNeeded = 12;
    targetPerStage = 4;
  } else if (currentLevel === 3) {
    totalCorrectNeeded = 15;
    targetPerStage = 5;
  }
}

function startTimer() {
  document.getElementById("time-remaining").innerText = timeRemaining;

  timer = setInterval(() => {
    timeRemaining--;
    document.getElementById("time-remaining").innerText = timeRemaining;

    if (timeRemaining <= 0) {
      clearInterval(timer);
      endStageOrGame(false);
    }
  }, 1000);
}

function resetStage() {
  currentStage = 1;
  currentCorrectAnswers = 0;
  currentWrongAnswers = 0;
  loadNextQuestion();
  updateStageIndicators();
}

function loadNextQuestion() {
  if (currentCorrectAnswers >= totalCorrectNeeded) {
    endLevel();
    return;
  }

  const questionElement = document.getElementById("question");
  const buttonContainer = document.getElementById("button-container");
  buttonContainer.innerHTML = "";

  const correctWord = getRandomWord();
  questionElement.innerText = correctWord.indonesian;

  const choices = getRandomChoices(correctWord.english);
  choices.forEach(choice => {
    const button = document.createElement("button");
    button.className = "choice";
    button.innerText = choice;
    button.addEventListener("click", () => handleAnswer(choice === correctWord.english, button));
    buttonContainer.appendChild(button);
  });
}

function handleAnswer(isCorrect, selectedButton) {
  const buttons = document.querySelectorAll(".choice");
  buttons.forEach(button => button.disabled = true);

  if (isCorrect) {
    currentCorrectAnswers++;
    selectedButton.classList.add("correct");
    if (currentCorrectAnswers % targetPerStage === 0) {
      currentStage++;
      updateStageIndicators();
      setTimeout(() => {
        if (currentStage > 3) {
          endLevel();
        } else {
          showModal("Tahap selesai! Lanjut ke tahap berikutnya.");
        }
      }, 1000);
    } else {
      setTimeout(loadNextQuestion, 1000);
    }
  } else {
    currentWrongAnswers++;
    selectedButton.classList.add("wrong");
    setTimeout(() => {
      selectedButton.classList.remove("wrong");
      buttons.forEach(button => button.disabled = false);
    }, 1000);
  }
}

function endStageOrGame(success) {
  clearInterval(timer);
  if (success) {
    showModal("Tahap selesai! Lanjut ke tahap berikutnya.");
  } else {
    showModal("Waktu habis! Mulai ulang atau keluar?");
    document.getElementById("restart-btn").style.display = "inline-block";
  }
}

function resetLevel() {
  clearInterval(timer);
  timeRemaining = 60; 
  currentCorrectAnswers = 0; 
  currentWrongAnswers = 0; 
  resetStage();
  setLevelTargets();
  startTimer();
  loadNextQuestion();
  updateStageIndicators();
  document.getElementById("level-number").innerText = currentLevel;
}

function endLevel() {
  showModal(`Level ${currentLevel} selesai! Pilih benar : ${currentCorrectAnswers}, Pilih salah : ${currentWrongAnswers}, Sisa Waktu : ${timeRemaining} detik, Selesai dalam ${60 - timeRemaining} detik. Lanjut ke Level berikutnya ?`);
  clearInterval(timer);
  if (currentLevel === 3) {
    showModal(`Game selesai! Pilih benar : ${currentCorrectAnswers}, Pilih salah : ${currentWrongAnswers}, Sisa Waktu : ${timeRemaining} detik, Selesai dalam ${60 - timeRemaining} detik.`);
  }
}

function showModal(message) {
  document.getElementById("modal-message").innerText = message;
  document.getElementById("modal").style.display = "block";
  clearInterval(timer);

  if (message.includes("tahap berikutnya")) {
    document.getElementById("continue-btn").style.display = "inline-block";
    document.getElementById("continue-next-lv-btn").style.display = "none";
    document.getElementById("restart-btn").style.display = "none";

  } else if (message.includes("Level berikutnya")) {
    document.getElementById("continue-btn").style.display = "none";
    document.getElementById("continue-next-lv-btn").style.display = "inline-block";
    document.getElementById("restart-btn").style.display = "none";
  } else {
    document.getElementById("continue-btn").style.display = "none";
    document.getElementById("continue-next-lv-btn").style.display = "none";
    document.getElementById("restart-btn").style.display = "inline-block";
  }
}

document.getElementById("continue-btn").addEventListener("click", () => {
  document.getElementById("modal").style.display = "none";
  loadNextQuestion();
  startTimer();
});

document.getElementById("continue-next-lv-btn").addEventListener("click", () => {
  document.getElementById("modal").style.display = "none";
  currentLevel++;
  resetLevel();
});

document.getElementById("restart-btn").addEventListener("click", () => {
  document.getElementById("modal").style.display = "none";
  resetLevel();
});

document.querySelector(".close").addEventListener("click", () => {
  document.getElementById("modal").style.display = "none";
});

function getRandomWord() {
  return wordsList[Math.floor(Math.random() * wordsList.length)];
}

function getRandomChoices(correctWord) {
  const choices = new Set([correctWord]);
  while (choices.size < 7) {
    const randomWord = getRandomWord().english;
    choices.add(randomWord);
  }
  return Array.from(choices).sort(() => Math.random() - 0.5);
}

function updateStageIndicators() {
  const stageIndicators = document.querySelectorAll(".stage-indicator");
  stageIndicators.forEach((indicator, index) => {
    indicator.classList.remove("active", "completed");
    if (index < currentStage - 1) {
      indicator.classList.add("completed");
    } else if (index === currentStage - 1) {
      indicator.classList.add("active");
    }
  });
}

document.getElementById("exit-manual").addEventListener("click", () => {
  window.location.reload();
});

document.getElementById("exit-btn").addEventListener("click", () => {
  window.location.reload();
});
