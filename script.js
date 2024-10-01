// Access html element
const steps = document.querySelectorAll(".step-box");

const sectionContainer = document.querySelector(".section-container");

const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const historyBtn = document.getElementById("history-btn");

const usernameInput = document.getElementById("username-input");

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

let userData = {
  username: "",
};

let answered = {};

// Initial call function
showQuestion();
updatePage(0);

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

function updatePage(pageIndex) {
  updateStepStyle(pageIndex);
  displayChangePageBtn(pageIndex);
  const translateX = -pageIndex * 750;
  sectionContainer.style.transform = `translateX(${translateX}px)`;

  // update current question id & no.answered
  if (pageIndex > 0 && pageIndex <= questions.length) {
    questionId = questions[pageIndex - 1].id;
    numAnswers = questions[pageIndex - 1].answers.length;

    // create answered array for current question
    if (!answered[questionId]) {
      answered[questionId] = [];
    }
  }
}

function displayChangePageBtn(pageIndex) {
  if (pageIndex === 0) {
    prevBtn.style.visibility = "hidden";
    nextBtn.style.visibility = "visible";
  } else if (pageIndex > 0 && pageIndex <= questions.length) {
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
  userData.username = usernameInput.value;
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
    answered[questionId] = [selectedBtn.value];
  } else {
    if (!selectedBtn.classList.contains("selected")) {
      selectedBtn.classList.add("selected");
      answered[questionId].push(selectedBtn.value);
    } else {
      selectedBtn.classList.remove("selected");
      const indexRemove = answered[questionId].indexOf(selectedBtn.value);
      answered[questionId].splice(indexRemove, 1);
    }
  }
}

function calculationScore() {
  let currentScore = 0;
  questions.forEach((q, i) => {
    const correctAnswers = q.answers.map((e) => q.choices[e]).sort();
    const userAnswered = answered[i + 1].map((e) => q.choices[e]).sort();
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
  resultText.innerHTML = `Successfully!!!<br>Username: ${userData.username}<br>Your score is ${score} of ${questions.length}.`;
}

function showAnswerHistory() {
  const answerHistoryText = document.getElementById("answer-history");
  answerHistoryText.innerHTML = "";

  questions.forEach((q, i) => {
    const currentQuestion = q.question;
    const correctAnswers = q.answers.map((e) => q.choices[e]).sort();
    const userAnswered = answered[i + 1].map((e) => q.choices[e]).sort();
    const isCorrect = compareAnswer(correctAnswers, userAnswered);

    answerHistoryText.innerHTML += `
        <u>Question${i + 1}</u>: ${currentQuestion}<br>
        Your Answer: <span style="font-weight: bold; color: ${isCorrect ? "green" : "red"};">${userAnswered.join(", ")}</span><br>
        Correct Answer: ${correctAnswers.join(", ")}<br><br>`;
  });

  if (historyBtn.textContent === "Show History") {
    answerHistoryText.style.visibility = "visible";
    historyBtn.textContent = "Hide History";
  } else {
    answerHistoryText.style.visibility = "hidden";
    historyBtn.textContent = "Show History";
  }
}

let currentPageIndex = 0;

function nextPage() {
  if (currentPageIndex === 0) {
    updateUserData();
    if (userData.username === "" && userData.password === "") {
      alert("Make sure to fill in both your username completely before continuing!");
      return;
    }
  } else if (currentPageIndex > 0 && currentPageIndex <= questions.length) {
    if (answered[questionId].length !== numAnswers) {
      alert("Ensure that all options are answered before you continue!");
      return;
    }
  }
  currentPageIndex++;
  updatePage(currentPageIndex);
}

function previousPage() {
  if (currentPageIndex > 0 && currentPageIndex <= questions.length) {
    currentPageIndex--;
    updatePage(currentPageIndex);
  }
}

//Add EventListenner
prevBtn.addEventListener("click", previousPage);
nextBtn.addEventListener("click", nextPage);
historyBtn.addEventListener("click", showAnswerHistory);
