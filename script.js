// Access html element
const steps = document.querySelectorAll(".step-box");

const sectionContainer = document.querySelector(".section-container");

const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const historyBtn = document.getElementById("history-btn");

const usernameInput = document.getElementById("username-input");

// Global variable
let pagesCount = 0;

const questions = [
  {
    id: 1,
    question: "What continent is Thailand in? (1 choice)",
    choices: ["Africa", "Asia", "Europe", "South America"],
    answers: [1],
  },
  {
    id: 2,
    question: "What is the capital city of Thailand? (1 choice)",
    choices: ["Bangkok", "Chiang Mai", "Phuket", "Pattaya"],
    answers: [0],
  },
  {
    id: 3,
    question: "Which of the following are Thai dishes? (2 choice)",
    choices: ["Pad Thai", "Spaghetti", "Tom Yum Goong", "Sushi"],
    answers: [0, 2],
  },
  {
    id: 4,
    question: "Which of the following are traditional Thai festivals? (2 choice)",
    choices: ["Christmas", "Loy krathong", "Halloween", "Songkran"],
    answers: [1, 3],
  },
];

let questionId, numAnswers;

let answered = {};

let currentUser = "";

let userData = {};

// Initial call function
showQuestion();
updatePage();
loadUserData();

function showQuestion() {
  questions.forEach((currentQuestion) => {
    // create question
    const targetQuestion = document.getElementById(`question${currentQuestion.id}`);
    targetQuestion.innerHTML = currentQuestion.question;

    //create answer
    const targetSection = document.getElementById(`section-${currentQuestion.id + 1}`);
    currentQuestion.choices.forEach((choice, i) => {
      const btn = document.createElement("button");
      btn.innerHTML = choice;
      btn.classList.add(`btn-${currentQuestion.id}`);
      btn.value = i;
      targetSection.appendChild(btn);
      btn.addEventListener("click", selectAnswer);
    });
  });
}

function updatePage() {
  updateStepStyle(pagesCount);
  displayChangePageBtn();
  const translateX = -pagesCount * 750;
  sectionContainer.style.transform = `translateX(${translateX}px)`;

  // update current question id & no.answered
  if (pagesCount > 0 && pagesCount <= questions.length) {
    questionId = questions[pagesCount - 1].id;
    numAnswers = questions[pagesCount - 1].answers.length;

    // create answered array for current question
    if (!answered[questionId]) {
      answered[questionId] = [];
    }
  }
}

function nextPage() {
  if (pagesCount === 0) {
    if (currentUser === "") {
      alert("Make sure to fill in both your username completely before continuing!");
      return;
    }
  } else if (pagesCount > 0 && pagesCount <= questions.length) {
    if (answered[questionId].length !== numAnswers) {
      alert("Ensure that all options are answered before you continue!");
      return;
    }
  }
  pagesCount++;
  updatePage();
}

function previousPage() {
  if (pagesCount > 0 && pagesCount <= questions.length) {
    pagesCount--;
    updatePage();
  }
}

function displayChangePageBtn() {
  if (pagesCount === 0) {
    prevBtn.style.visibility = "hidden";
    nextBtn.style.visibility = "visible";
  } else if (pagesCount > 0 && pagesCount <= questions.length) {
    prevBtn.style.visibility = "visible";
    nextBtn.style.visibility = "visible";
  } else {
    prevBtn.style.visibility = "hidden";
    nextBtn.style.visibility = "hidden";
    summaryResult();
  }
}

function updateStepStyle(pagesCount) {
  steps.forEach((e, i) => {
    if (i === pagesCount) {
      e.classList.add("active-step");
      e.classList.remove("completed-step");
    } else if (i < pagesCount) {
      e.classList.remove("active-step");
      e.classList.add("completed-step");
    } else {
      e.classList.remove("active-step");
      e.classList.remove("completed-step");
    }
  });
}

function updateUserData() {
  if (usernameInput.value) {
    currentUser = usernameInput.value;
    showUserDataHistory(currentUser);
  } else {
    currentUser = "";
    showUserDataHistory(currentUser);
  }
}

function selectAnswer(selectedElement) {
  const selectedBtn = selectedElement.target;

  if (numAnswers === 1) {
    Array.from(selectedBtn.parentElement.children).forEach((e) => {
      e.classList.remove("selected");
      e.disabled = false;
    });
    selectedBtn.classList.add("selected");
    selectedBtn.disabled = true;
    answered[questionId] = [parseInt(selectedBtn.value)];
  } else {
    if (!selectedBtn.classList.contains("selected")) {
      selectedBtn.classList.add("selected");
      answered[questionId].push(parseInt(selectedBtn.value));
    } else {
      selectedBtn.classList.remove("selected");
      const indexRemove = answered[questionId].indexOf(parseInt(selectedBtn.value));
      answered[questionId].splice(indexRemove, 1);
    }
  }
}

function calculationScore() {
  let currentScore = 0;
  questions.forEach((q, i) => {
    const userAnswered = answered[i + 1].sort();
    const correctAnswers = q.answers.sort();
    const isCorrect = compareAnswer(correctAnswers, userAnswered);
    if (isCorrect) {
      currentScore++;
    }
  });
  return currentScore;
}

function compareAnswer(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return false;
  }
  for (let j = 0; j < arr1.length; j++) {
    if (arr1[j] !== arr2[j]) {
      return false;
    }
  }
  return true;
}

function summaryResult() {
  let score = calculationScore();
  const resultText = document.getElementById("result-text");
  resultText.innerHTML = "";
  resultText.innerHTML = `Successfully!!!<br>Username: ${currentUser}<br>Your score is ${score} of ${questions.length}.`;
  registerUserData(currentUser, score);
}

function displayAnswerHistory() {
  const answerHistoryText = document.getElementById("answer-history");
  answerHistoryText.innerHTML = "";

  for (let i = 0; i < questions.length; i++) {
    const currentHistory = getCurrentHistory(i);
    const currentQuestion = currentHistory[0];
    const userAnsweredText = currentHistory[1];
    const correctAnswersText = currentHistory[2];
    const isCorrect = compareAnswer(correctAnswersText, userAnsweredText);

    answerHistoryText.innerHTML += `
        <u>Question${i + 1}</u>: ${currentQuestion}<br>
        Your Answer: <span style="font-weight: bold; color: ${isCorrect ? "green" : "red"};">${userAnsweredText.join(", ")}</span><br>
        Correct Answer: ${correctAnswersText.join(", ")}<br><br>`;
  }

  if (historyBtn.textContent === "Show History") {
    answerHistoryText.style.visibility = "visible";
    historyBtn.textContent = "Hide History";
  } else {
    answerHistoryText.style.visibility = "hidden";
    historyBtn.textContent = "Show History";
  }
}

function getCurrentHistory(index) {
  const currentQuestion = questions[index].question;
  const userAnsweredText = answered[index + 1].map((e) => questions[index].choices[e]).sort();
  const correctAnswersText = questions[index].answers.map((e) => questions[index].choices[e]).sort();
  return [currentQuestion, userAnsweredText, correctAnswersText];
}

function getTimeStamp() {
  const today = new Date();
  const day = today.getDate();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const hour = today.getHours();
  const minute = today.getMinutes();
  const second = today.getSeconds();
  return `${day}-${month}-${year} ${hour}:${minute}:${second}`;
}

function registerUserData(currentUser, currentScore) {
  const timeStampFormat = getTimeStamp();
  const score = currentScore;

  const userAnswered = questions.map((_, i) => getCurrentHistory(i)[1]);

  const userEntry = {
    timeStamp: timeStampFormat,
    score: score,
  };
  userAnswered.forEach((e, i) => {
    userEntry[`answer${i + 1}`] = e;
  });

  if (!userData[currentUser]) {
    userData[currentUser] = [userEntry];
  } else {
    if (userData[currentUser].length === 5) {
      userData[currentUser].shift();
    }
    userData[currentUser].push(userEntry);
  }
  localStorage.setItem("userData", JSON.stringify(userData));
}

function loadUserData() {
  const storedData = localStorage.getItem("userData");
  if (storedData) {
    userData = JSON.parse(storedData);
  } else {
    userData = {};
  }
}

function showUserDataHistory(currentUser) {
  const userDataHistoryText = document.getElementById("user-history");
  if (!userData[currentUser]) {
    userDataHistoryText.innerHTML = "";
  } else {
    userDataHistoryText.innerHTML = "";

    const maxScore = findMaxScoreHistory(currentUser);

    for (i = userData[currentUser].length - 1; i >= 0; i--) {
      const isMaxScore = userData[currentUser][i].score === maxScore;
      userDataHistoryText.innerHTML += `
      <div style="padding: 5px; border:1px solid #ccc ;border-radius:3px; margin-bottom: 10px; color: ${isMaxScore ? "green" : ""};">
        <strong>Time: </strong>${userData[currentUser][i].timeStamp}<br>
        <strong>Score:</strong>${userData[currentUser][i].score} |
        <strong>Answers:</strong> 1: ${userData[currentUser][i].answer1}, 2: ${userData[currentUser][i].answer2}, 3: ${userData[
        currentUser
      ][i].answer3.join(", ")}, 4: ${userData[currentUser][i].answer4.join(", ")}
      </div>`;
    }
  }
}

function findMaxScoreHistory(user) {
  const scoreHistory = userData[user].map((e) => e.score);
  return Math.max(...scoreHistory);
}

//Add EventListenner
prevBtn.addEventListener("click", previousPage);
nextBtn.addEventListener("click", nextPage);
historyBtn.addEventListener("click", displayAnswerHistory);
usernameInput.addEventListener("input", updateUserData);

// Prevent tab workig
usernameInput.addEventListener("keydown", function (event) {
  if (event.key === "Tab") {
    event.preventDefault();
  }
});
