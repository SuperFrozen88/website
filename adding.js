const question = document.querySelector(".question");
const answer = document.querySelector(".answerField");
const result = document.querySelector(".result");
const answerButton = document.querySelector(".answerSubmit");
const startButton = document.querySelector(".startSubmit");

startButton.addEventListener("click", start);
answerButton.addEventListener("click", checkAnswer);
let num1, num2;
let correctAnswers = 0;
let wrongAnswers = 0;

function start() {
  regenerate();
}

function regenerate() {
  num1 = Math.floor(Math.random() * 10) + 1;
  num2 = Math.floor(Math.random() * 10) + 1;
  question.innerText = `${num1} + ${num2}`;
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
  } else {
    wrongAnswers += 1;
    showResult("WRONG", "red");
  }
  answer.value = "";
}

function showResult(value, color) {
  result.innerText = value;
  result.style.color = color;
  var increment = 0.045;
  var opacity = 1;
  var instance = window.setInterval(function () {
    result.style.opacity = opacity;
    opacity = opacity - increment;
    if (opacity < 0) {
      window.clearInterval(instance);
    }
  }, 100);
}
