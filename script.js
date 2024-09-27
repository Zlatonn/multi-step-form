const steps = document.querySelectorAll(".step-box");

const sectionContainer = document.querySelector(".section-container");

const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const historyBtn = document.getElementById("history-btn");

const usernameInput = document.getElementById("usename-input");
const passwordInput = document.getElementById("password-input");

let pagesCount = 0;

const questions = [
    {
        question:"Question1",
        answers:[
            {text:"Answer1",correct:false},
            {text:"Answer2",correct:true},
            {text:"Answer3",correct:false},
            {text:"Answer4",correct:false},
        ]
    },
    {
        question:"Question2",
        answers:[
            {text:"Answer1",correct:false},
            {text:"Answer2",correct:false},
            {text:"Answer3",correct:false},
            {text:"Answer4",correct:true},
        ]
    },
    {
        question:"Question3",
        answers:[
            {text:"Answer1",correct:false},
            {text:"Answer2",correct:true},
            {text:"Answer3",correct:false},
            {text:"Answer4",correct:false},
        ]
    }
    ,{
        question:"Question4",
        answers:[
            {text:"Answer1",correct:true},
            {text:"Answer2",correct:false},
            {text:"Answer3",correct:false},
            {text:"Answer4",correct:false},
        ]
    }
];

let userData = {
    username:"",
    password:""
};

let answerHistory =[];
let score = 0;

showQuestion();
updatePage();

function showQuestion() {
    questions.forEach((cuurQuestion,i) =>{
        // create question
        const targetQuestion = document.getElementById(`question${i+1}`);
        targetQuestion.innerHTML = cuurQuestion.question;

        //create answer
        const targetSection = document.getElementById(`section-${i + 2}`);          
        cuurQuestion.answers.forEach(e => {
            const btn = document.createElement("button");
            btn.innerHTML = e.text;               
            btn.classList.add(`btn-${i + 1}`);          
            targetSection.appendChild(btn); 
            // define correct answer with custom attribue  
            if (e.correct) {
                btn.dataset.correct = e.correct;
            }
            btn.addEventListener("click",selectAnswer);
        });
    });  
};

function updatePage() {
    updateStepStyle(pagesCount);
    displayChangePageBtn();
    const translateX = -pagesCount * 750;
    sectionContainer.style.transform = `translateX(${translateX}px)`;
};

function nextPage() {
    if (pagesCount === 0){
        updateUserData();
        if (userData.username === "" && userData.password === ""){
            alert("Please input username & password completly first!!");
            return;
        }
        else{
            pagesCount++;
            updatePage();
        }       
    }
    else if(pagesCount === 4){
        if (answerHistory.length < questions.length) {
            alert("Please answer all questions before proceeding!");
            return;
        }
        else{
            pagesCount++;
            updatePage();
        }
    }
    else{
        pagesCount++;
        updatePage();
    }
    
}

function previousPage() {
    if (pagesCount > 0 && pagesCount <= 4){
        pagesCount--;
        updatePage();
    } 
}

function displayChangePageBtn() {
    if (pagesCount === 0) {
        prevBtn.style.visibility = "hidden";
        nextBtn.style.visibility = "visible";
    }
    else if (pagesCount === 5){
        prevBtn.style.visibility = "hidden";
        nextBtn.style.visibility = "hidden";
        calculationScore();
        summaryResult();
    }      
    else{
        prevBtn.style.visibility = "visible";
        nextBtn.style.visibility = "visible";
    }
}

function updateStepStyle(pagesCount){
    steps.forEach((e,i)=>{
        if (i === pagesCount){
            e.classList.add("active-step");
            e.classList.remove("completed-step");
        }
        else if (i < pagesCount){
            e.classList.remove("active-step");
            e.classList.add("completed-step");
        }
        else{
            e.classList.remove("active-step");
            e.classList.remove("completed-step");
        }
    });
}

function updateUserData() {
    userData.username = usernameInput.value;
    userData.password = passwordInput.value; 
}

function selectAnswer(selectedElement) {
    const selectedBtn = selectedElement.target;
    
    Array.from(selectedBtn.parentElement.children).forEach(e =>{
        e.classList.remove("selected");
        e.disabled=false;
    })

    selectedBtn.classList.add("selected");
    selectedBtn.disabled=true;

    const questionText = document.getElementById(`question${pagesCount}`).innerHTML; 
    const isCorrect = selectedBtn.dataset.correct === "true"; 
    const existingAnswer = answerHistory.find(function(answer) {
        return answer.question === questionText;
    });

    if (existingAnswer) {
        existingAnswer.selectedAnswer = selectedBtn.textContent;
        existingAnswer.isCorrect = isCorrect;
    } else {
        answerHistory.push({
            question: questionText,
            selectedAnswer: selectedBtn.textContent,
            isCorrect: isCorrect
        });
    }
}

function calculationScore(){
    console.log(answerHistory);
    score = 0;
    answerHistory.forEach(e => {
        if (e.isCorrect){
            score++;
        }
    })
}

function summaryResult() {
    const resultText = document.getElementById("result-text");
    resultText.innerHTML = "";
    resultText.innerHTML = `Successfully!!!<br>Username: ${userData.username}<br>Your score is ${score} of ${questions.length}.`;
}

function showAnswerHistory() {
    
    const answerHistoryText = document.getElementById("answer-history");   
    answerHistoryText.innerHTML = "";
    answerHistory.forEach((e,i) => {
        const questionObj = questions.find(q => q.question === e.question);
        const correctAnswer = questionObj.answers.find(a => a.correct).text;
        answerHistoryText.innerHTML += `
        <br>${e.question} : Your answer is <span>${e.selectedAnswer}</span> / Correct answer is <span>${correctAnswer}</span> / Status = <span>${e.isCorrect}</span>`;
    })

    if (historyBtn.textContent === "Show History"){
        answerHistoryText.style.visibility = "visible";
        historyBtn.textContent = "Hide History";
    }
    else{
        answerHistoryText.style.visibility = "hidden";
        historyBtn.textContent = "Show History";
    }
}

//Add EventListenner
prevBtn.addEventListener("click",previousPage);
nextBtn.addEventListener("click",nextPage);
historyBtn.addEventListener("click",showAnswerHistory);
