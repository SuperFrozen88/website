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
toggleDigitsVisibility(false);

// Add event listeners for digit buttons
document.addEventListener("DOMContentLoaded", function() {
  const digitButtons = document.querySelectorAll(".digits");
  digitButtons.forEach(button => {
    button.addEventListener("click", handleDigitClick);
  });
  
  // Add event listeners for number selector
  const numberCheckboxes = document.querySelectorAll('input[type="checkbox"][id^="num"]');
  numberCheckboxes.forEach(checkbox => {
    checkbox.addEventListener("change", saveNumberSelections);
  });
  
  // Add event listeners for select all/none buttons
  document.getElementById("selectAll").addEventListener("click", selectAllNumbers);
  document.getElementById("selectNone").addEventListener("click", selectNoNumbers);
  
  // Load saved number selections from cookies
  loadNumberSelections();
});

let num1, num2;
let correctAnswers = 0;
let wrongAnswers = 0;
const MAXIMUM_TIME_SECONDS = 120;
const TIMER_UPDATE_INTERVAL_SECONDS = 0.1;
let startTime;
let playing = false;

// Cookie functions
function setCookie(name, value, days) {
  const expires = new Date();
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
  const cookieString = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
  document.cookie = cookieString;
  console.log("Setting cookie:", cookieString);
}

function getCookie(name) {
  console.log("Getting cookie for:", name);
  console.log("All cookies:", document.cookie);
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) {
      const cookieValue = c.substring(nameEQ.length, c.length);
      console.log("Found cookie value:", cookieValue);
      return cookieValue;
    }
  }
  console.log("Cookie not found");
  return null;
}

// Number selection functions
function getSelectedNumbers() {
  const selectedNumbers = [];
  for (let i = 1; i <= 12; i++) {
    const checkbox = document.getElementById(`num${i}`);
    if (checkbox && checkbox.checked) {
      selectedNumbers.push(i);
    }
  }
  return selectedNumbers.length > 0 ? selectedNumbers : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
}

function saveNumberSelections() {
  const selections = [];
  for (let i = 1; i <= 12; i++) {
    const checkbox = document.getElementById(`num${i}`);
    if (checkbox && checkbox.checked) {
      selections.push(i);
    }
  }
  console.log("Saving selections to cookie:", selections);
  setCookie("selectedNumbers", JSON.stringify(selections), 365);
  console.log("Cookie set. Current document.cookie:", document.cookie);
}

function loadNumberSelections() {
  console.log("Loading number selections...");
  const savedSelections = getCookie("selectedNumbers");
  console.log("Saved selections from cookie:", savedSelections);
  
  if (savedSelections) {
    try {
      const selections = JSON.parse(savedSelections);
      console.log("Parsed selections:", selections);
      // First uncheck all
      for (let i = 1; i <= 12; i++) {
        const checkbox = document.getElementById(`num${i}`);
        if (checkbox) checkbox.checked = false;
      }
      // Then check the saved ones
      selections.forEach(num => {
        const checkbox = document.getElementById(`num${num}`);
        if (checkbox) {
          checkbox.checked = true;
          console.log(`Checked box for number ${num}`);
        }
      });
      console.log("Loaded selections from cookie successfully");
    } catch (e) {
      console.error("Error loading saved number selections:", e);
      // If there's an error, default to all selected
      selectAllNumbers();
    }
  } else {
    // No saved selections found, default to all numbers selected (first time visit)
    console.log("No saved selections found, selecting all numbers");
    selectAllNumbers();
  }
}

function selectAllNumbers() {
  console.log("Selecting all numbers");
  for (let i = 1; i <= 12; i++) {
    const checkbox = document.getElementById(`num${i}`);
    if (checkbox) checkbox.checked = true;
  }
  saveNumberSelections();
}

function selectNoNumbers() {
  console.log("Selecting no numbers");
  for (let i = 1; i <= 12; i++) {
    const checkbox = document.getElementById(`num${i}`);
    if (checkbox) checkbox.checked = false;
  }
  saveNumberSelections();
}

function handleDigitClick(event) {
  if (!playing) {
    return;
  }
  const value = event.target.value;
  
  if (value === "clear") {
    answer.value = "";
  } else if (value === "backspace") {
    answer.value = answer.value.slice(0, -1);
  } else {
    // It's a digit
    answer.value += value;
  }
  
  answer.focus();
  // Check answer as user types (without marking wrong until Enter is pressed)
  checkAnswer(false);
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
  setTimeout(updateTimer, TIMER_UPDATE_INTERVAL_SECONDS * 1000);
}

function toggleDigitsVisibility(visible) {
  console.log('toggleDigitsVisibility : called');
  if (visible === true) {
    console.log('toggleDigitsVisibility : setting digitsContainer display style to block');
    document.getElementById('digitsContainer').style['display'] = 'block';
  } else {
    console.log('toggleDigitsVisibility : setting digitsContainer display style to None');
    document.getElementById('digitsContainer').style['display'] = 'None';
  }
}


function endGame() {
  toggleDigitsVisibility(false);
  playing = false;
  timesUpAudio.play();
  const value = `Congratulations, you got ${correctAnswers} right!  Play again and try to beat it!`;
  instructions.innerText = value;
  console.log(`set instructions inner text to ${value}`);
}

function start() {
  toggleDigitsVisibility(true);
  playing = true;
  correctAnswers = 0;
  wrongAnswers = 0;
  startTime = new Date();
  updateTimer();
  regenerate();
  answer.focus();
}

function regenerate() {
  const selectedNumbers = getSelectedNumbers();
  const allNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  
  // Pick one number from selected numbers and one from all numbers
  const selectedNum = selectedNumbers[Math.floor(Math.random() * selectedNumbers.length)];
  const allNum = allNumbers[Math.floor(Math.random() * allNumbers.length)];
  
  // Randomly decide which goes first
  if (Math.random() < 0.5) {
    num1 = selectedNum;
    num2 = allNum;
  } else {
    num1 = allNum;
    num2 = selectedNum;
  }
  
  question.innerText = `${num1} * ${num2}`;
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
  console.log(`checkAnswer called with on keyup checkForWrongAnswers=${checkForWrongAnswers}`);
  
  if (value == num1 * num2) {
    result.innerText = "correct";
    result.style.color = "black";
    result.style.opacity = 1;
    regenerate();
    showResult("CORRECT", "green");
    correctAnswers += 1;
    correctAudio.play();
    shouldClearValue = true;
    console.log('correct!');
  } else if (value === "Emily") {
    showResult("EMILY IS AWESOME", "purple");
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
  if (shouldClearValue) {    
    answer.value = "";
    console.log('clearing value');
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
