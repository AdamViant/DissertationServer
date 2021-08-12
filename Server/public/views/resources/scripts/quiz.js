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

selectedQuiz = quizData.quizId;

//Questions
questions =
  [
    {
      question: quizData.question1.question,
      choiceA: quizData.question1.choiceA,
      choiceB: quizData.question1.choiceB,
      choiceC: quizData.question1.choiceC,
      choiceD: quizData.question1.choiceD,
      correct: quizData.question1.answer
    },{
      question: quizData.question2.question,
      choiceA: quizData.question2.choiceA,
      choiceB: quizData.question2.choiceB,
      choiceC: quizData.question2.choiceC,
      choiceD: quizData.question2.choiceD,
      correct: quizData.question2.answer
    },{
      question: quizData.question3.question,
      choiceA: quizData.question3.choiceA,
      choiceB: quizData.question3.choiceB,
      choiceC: quizData.question3.choiceC,
      choiceD: quizData.question3.choiceD,
      correct: quizData.question3.answer
    },{
      question: quizData.question4.question,
      choiceA: quizData.question4.choiceA,
      choiceB: quizData.question4.choiceB,
      choiceC: quizData.question4.choiceC,
      choiceD: quizData.question4.choiceD,
      correct: quizData.question4.answer
    },{
      question: quizData.question5.question,
      choiceA: quizData.question5.choiceA,
      choiceB: quizData.question5.choiceB,
      choiceC: quizData.question5.choiceC,
      choiceD: quizData.question5.choiceD,
      correct: quizData.question5.answer
    }
  ]

  lastQuestionIndex = questions.length - 1;
  runningQuestionIndex = 0;

//Shuffle Function

function shuffle(array) {
  var currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

//Randomsise Question Order

shuffle(questions);

//Randomise the Answer Order for each question

questions.forEach((question, i) => {
  var tempAnswer = question.correct;
  var trueAnswer;
  var tempArray = new Array();

  //Finds Value of the Correct Answer
  switch(tempAnswer) {
    case "A":
      trueAnswer = question.choiceA;
      break;
    case "B":
      trueAnswer = question.choiceB;
      break;
    case "C":
      trueAnswer = question.choiceC;
      break;
    case "D":
      trueAnswer = question.choiceD;
      break;
  }

  //Shuffles the Answer Order
  tempArray = [question.choiceA, question.choiceB, question.choiceC, question.choiceD]
  shuffle(tempArray);

  //Matches the Correct Answer Post-Shuffle
  if(trueAnswer == tempArray[0])
  {
    tempAnswer = "A";
  }else if(tempArray[1] == trueAnswer){
    tempAnswer = "B";
  }else if(tempArray[2] == trueAnswer){
    tempAnswer = "C";
  }else if(tempArray[3] == trueAnswer){
    tempAnswer = "D";
  }

  //Outputs new Order with Correct Answer
  question.correct = tempAnswer;
  question.choiceA = tempArray[0];
  question.choiceB = tempArray[1];
  question.choiceC = tempArray[2];
  question.choiceD = tempArray[3];

});



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
  counterRender();
  TIMER = setInterval(counterRender,1000);
  questionRender();
  quiz.style.display = "block";

}

//Listen For Events
start.addEventListener("click", startQuiz);
