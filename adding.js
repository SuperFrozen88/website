const question = document.querySelector(".question");
const answer = document.querySelector(".answerField");
const result = document.querySelector(".result");
const answerButton = document.querySelector(".answerSubmit");
const startButton = document.querySelector(".startSubmit");
const correctCount = document.querySelector(".correctCount");
const wrongCount = document.querySelector(".wrongCount");

const wrongAudio = new Audio("sounds/wrong.mp3");
const correctAudio = new Audio("sounds/correct.mp3");
const awesomeAudio = new Audio("sounds/awesome.mp3");

startButton.addEventListener("click", start);
answerButton.addEventListener("click", checkAnswer);
let num1, num2;
let correctAnswers = 0;
let wrongAnswers = 0;

function start() {
  correctAnswers = 0;
  wrongAnswers = 0;
  regenerate();
}

function regenerate() {
  num1 = Math.floor(Math.random() * 10) + 1;
  num2 = Math.floor(Math.random() * 10) + 1;
  question.innerText = `${num1} + ${num2}`;
  updateScore();
}

function updateScore() {
  correctCount.innerText = `Correct: ${correctAnswers}`;
  wrongCount.innerText = `Wrong: ${wrongAnswers}`;
}

function checkAnswer() {
  const value = answer.value;
  if (value == num1 + num2) {
    result.innerText = "correct";
    result.style.color = "black";
    result.style.opacity = 1;
    regenerate();
    showResult("CORRECT", "green");
    correctAnswers += 1;
    correctAudio.play();
  } else if (value === "Emily") {
    showResult("EMILY IS AWESOME", "pink");
    awesomeAudio.currentTime = 4;
    awesomeAudio.play();
    const stopAwesome = () => {
      fadeAudio(awesomeAudio);
    };
    setInterval(stopAwesome, 3000);
  } else {
    wrongAnswers += 1;
    showResult("WRONG", "red");
    wrongAudio.play();
  }
  answer.value = "";
  updateScore();
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
