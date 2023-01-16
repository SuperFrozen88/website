const question = document.querySelector(".question");
const answer = document.querySelector(".answerField");
const result = document.querySelector(".result");
const answerButton = document.querySelector(".answerSubmit");
const startButton = document.querySelector(".startSubmit");
const correctCount = document.querySelector(".correctCount");
const wrongCount = document.querySelector(".wrongCount");
const timer = document.querySelector(".timer");
const instructions = document.querySelector(".instructions");

const wrongAudio = new Audio("sounds/wrong.mp3");
const correctAudio = new Audio("sounds/correct.mp3");
const awesomeAudio = new Audio("sounds/awesome.mp3");
const timesUpAudio = new Audio("sounds/timesUp.m4a");

startButton.addEventListener("click", start);
answerButton.addEventListener("click", checkAnswer);
answer.addEventListener("keyup", answerKeyPress);
let num1, num2;
let correctAnswers = 0;
let wrongAnswers = 0;
const MAXIMUM_TIME_SECONDS = 120;
const TIMER_UPDATE_INTERFAL_SECONDS = 0.1;
let startTime;
let playing = false;
let numbersToInclude = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

function updateNumbersToInclude() {
  const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  numbersToInclude = numbers.map(n => {
    const checkbox = document.querySelector(`#n${n}`);
    return checkbox?.checked ? n : null;
  }).filter(n => n !== null)
}

function updateTimer() {
  const timePassedSeconds = (new Date() - startTime) / 1000;
  const timeRemainingSeconds = Math.max(
    0,
    MAXIMUM_TIME_SECONDS - timePassedSeconds
  );
  timer.innerText = `${Math.floor(timeRemainingSeconds * 10) / 10}`;
  if (timeRemainingSeconds <= 0) {
    return endGame();
  }
  setTimeout(updateTimer, TIMER_UPDATE_INTERFAL_SECONDS * 1000);
}

function endGame() {
  playing = false;
  timesUpAudio.play();
  const value = `Congratulations, you got ${correctAnswers} right!  Play again and try to beat it!`;
  instructions.innerText = value;
  console.log(`set instructions inner text to ${value}`);
}

function start() {
  updateNumbersToInclude();
  playing = true;
  correctAnswers = 0;
  wrongAnswers = 0;
  startTime = new Date();
  updateTimer();
  regenerate();
  answer.focus();
}

function regenerate() {
  num1 = numbersToInclude[Math.floor(Math.random() * numbersToInclude.length)];
  num2 = Math.floor(Math.random() * 10) + 1;
  if (Math.random() > 0.5) {
    [num1, num2] = [num2, num1];
  }
  question.innerText = `${num1} + ${num2}`;
  updateScore();
}

function updateScore() {
  correctCount.innerText = `Correct: ${correctAnswers}`;
  wrongCount.innerText = `Wrong: ${wrongAnswers}`;
}

function answerKeyPress(e) {
  // check if enter was pressed
  if (e.key === "Enter") {
    checkAnswer(true);
  } else {
    checkAnswer(false);
  }
}

function checkAnswer(checkForWrongAnswers) {
  if (!playing) {
    return;
  }

  const value = answer.value;
  let shouldClearValue = false;

  if (value == num1 + num2) {
    result.innerText = "correct";
    result.style.color = "black";
    result.style.opacity = 1;
    regenerate();
    showResult("CORRECT", "green");
    correctAnswers += 1;
    correctAudio.play();
    shouldClearValue = true;
  } else if (value === "Emily") {
    showResult("EMILY IS AWESOME", "pink");
    awesomeAudio.currentTime = 4;
    awesomeAudio.play();
    const stopAwesome = () => {
      fadeAudio(awesomeAudio);
    };
    setInterval(stopAwesome, 3000);
    shouldClearValue = true;
  } else if (checkForWrongAnswers === true) {
    wrongAnswers += 1;
    showResult("WRONG", "red");
    wrongAudio.play();
    shouldClearValue = true;
  }
  if (shouldClearValue === true) {
    answer.value = "";
  }
  updateScore();
  answer.focus();
}

function fadeAudio(sound) {
  const instance = window.setInterval(function () {
    if (sound.volume > 0.05) {
      sound.volume -= 0.05;
    } else {
      sound.volume = 0;
      window.clearInterval(instance);
    }
  }, 100);
}

function showResult(value, color) {
  result.innerText = value;
  result.style.color = color;
  const increment = 0.045;
  let opacity = 1;
  const instance = window.setInterval(function () {
    result.style.opacity = opacity;
    opacity = opacity - increment;
    if (opacity < 0) {
      window.clearInterval(instance);
    }
  }, 100);
}
