//Get Elements
const header = document.getElementById("header");
const start = document.getElementById("start");
const quiz = document.getElementById("quiz");
const question = document.getElementById("question");
const counter = document.getElementById("counter");
const timeGauge = document.getElementById("timeGauge");
const choiceA = document.getElementById("A");
const choiceB = document.getElementById("B");
const choiceC = document.getElementById("C");
const choiceD = document.getElementById("D");
const scoreContainer = document.getElementById("scoreContainer");
const messageOutput = document.getElementById("messageOutput");
const scoreOutput = document.getElementById("scoreOutput");
const submitQuiz = document.getElementById("submitQuiz");
const submitScore = document.getElementById("submitScore");

//Question Variables
var selectedQuiz;
var questions = new Array();
var lastQuestionIndex;
var runningQuestionIndex;

//Counter Variables
const questionTime = 10;
const gaugeWidth = 200;
var count = 0;
const gaugeProgressUnit = gaugeWidth/questionTime;
var TIMER;

//Score
var score = 0;

//Questions
function selectQuiz()
{
  if(header.innerHTML == "HTML Quiz"){
    selectedQuiz = 1;
  }else{
    if(header.innerHTML == "CSS Quiz"){
      selectedQuiz = 2;
    }
  }


  if (selectedQuiz == 1) //Html Quiz
  {
    questions = [
      {
        question : "What does HTML stand for?",
        choiceA: "Housed Translation Merit Link",
        choiceB: "Hot Text Multiple Layers",
        choiceC: "Hyper Text Markup Language",
        choiceD: "Halo Terminal Matrix Language",
        correct: "C"
      },{
        question : "What is the first line you should enter in HTML 5?",
        choiceA: "< !DOCTYPE html >",
        choiceB: "< html 5 >",
        choiceC: "< !TYPE html >",
        choiceD: "< html >",
        correct: "A"
      },{
        question : "Which of the following would produce the text 'hello' on the page?",
        choiceA: "< p >hello< p >",
        choiceB: "< p / >hello",
        choiceC: "< p >hello< / p >",
        choiceD: "< hello >",
        correct: "C"
      },{
        question : "Which element would be the correct way to insert an image to the page?",
        choiceA: "< image >",
        choiceB: "< pic >",
        choiceC: "< photo >",
        choiceD: "< img >",
        correct: "D"
      },{
        question : "Which syntax would create a line space between text?",
        choiceA: "< line / >",
        choiceB: "< br / >",
        choiceC: "< break / >",
        choiceD: "< space / >",
        correct: "B"
      }
    ]

    lastQuestionIndex = questions.length - 1;
    runningQuestionIndex = 0;

  }else{
    if(selectedQuiz == 2){//CSS Quiz
    questions = [
      {
        question : "What does CSS stand for?",
        choiceA: "Created Style Showcase",
        choiceB: "Chosen Shading Style",
        choiceC: "Creation and Shading Standards",
        choiceD: "Cascading Style Sheet",
        correct: "D"
      },{
        question : "What is the correct syntax for an ID in CSS?",
        choiceA: ".",
        choiceB: "#",
        choiceC: "*",
        choiceD: "%",
        correct: "B"
      },{
        question : "What is the way to input a measurement in pixels? ",
        choiceA: "px",
        choiceB: "pixels",
        choiceC: "pix",
        choiceD: "[]",
        correct: "A"
      },{
        question : "What is the correct syntax for an Class in CSS?",
        choiceA: ".",
        choiceB: "#",
        choiceC: "*",
        choiceD: "%",
        correct: "A"
      },{
        question : "What is the correct syntax for inserting internal CSS into HTML",
        choiceA: "< CSS >",
        choiceB: "< styling >",
        choiceC: "< style >",
        choiceD: "< CSS Style >",
        correct: "C"
      }
    ]

    lastQuestionIndex = questions.length - 1;
    runningQuestionIndex = 0;

    }
  }
}

//Render Questions
function questionRender()
{
  let q = questions[runningQuestionIndex];
  question.innerHTML = "<p>" + q.question + "</p>";
  choiceA.innerHTML = q.choiceA;
  choiceB.innerHTML = q.choiceB;
  choiceC.innerHTML = q.choiceC;
  choiceD.innerHTML = q.choiceD;
}

//Render Counter
function counterRender()
{
  if( count <= questionTime ){
    counter.innerHTML = count;
    timeGauge.style.width = gaugeProgressUnit * count + "px";
    count++;
  }else{
    count = 0;
    if( runningQuestionIndex < lastQuestionIndex){
      runningQuestionIndex++;
      questionRender();
    }else{
      clearInterval(TIMER);
      scoreRender();
    }
  }
}

//Check Answer
function checkAnswer(answer)
{
  if(questions[runningQuestionIndex].correct == answer){
    score++;
  }
  if(runningQuestionIndex < lastQuestionIndex){
    count = 0;
    runningQuestionIndex++;
    questionRender();
  }else{
    clearInterval(TIMER);
    scoreRender();
  }
}

function scoreRender()
{
    scoreContainer.style.display = "block";
    quiz.style.display = "none";
    var scorePerCent = Math.round(100 * score/questions.length);
    var message = ( scorePerCent >= 80 ) ? "Congratulations! Amazing Score!" :
                  ( scorePerCent >= 60 ) ? "Well done!" :
                  ( scorePerCent >= 40 ) ? "Not Bad, Could do better though." :
                  ( scorePerCent >= 20 ) ? "Not ideal, try and revise more." : "Better luck next time."
    messageOutput.innerHTML = message;
    scoreOutput.innerHTML = scorePerCent + "%";
    submitQuiz.value = selectedQuiz;
    submitScore.value = score;
}

//Start the Quiz
function startQuiz()
{
  start.style.display = "none";
  selectQuiz();
  counterRender();
  TIMER = setInterval(counterRender,1000);
  questionRender();
  quiz.style.display = "block";

}

//Listen For Events
start.addEventListener("click", startQuiz);
