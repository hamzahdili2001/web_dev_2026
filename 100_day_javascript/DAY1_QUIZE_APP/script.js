// ==============================
// 1️⃣ DOM ELEMENTS
// ==============================
// Here we grab elements from the HTML so JavaScript can control them.
// document.getElementById() finds an element by its ID attribute.

const startScreen = document.getElementById('start-screen') // Start screen container
const quizScreen = document.getElementById('quiz-screen') // Quiz screen container
const resultScreen = document.getElementById('result-screen') // Results screen container

const startButton = document.getElementById('start-btn') // "Start Quiz" button
const restartButton = document.getElementById('restart-btn') // "Restart Quiz" button

const questionText = document.getElementById('question-text') // Where the question text appears
const answersContainer = document.getElementById('answers-container') // Holds answer buttons

const currentQuestionSpan = document.getElementById('current-question') // Current question number
const totalQuestionsSpan = document.getElementById('total-questions') // Total number of questions

const scoreSpan = document.getElementById('score') // Live score during quiz
const finalScoreSpan = document.getElementById('final-score') // Final score on results screen
const maxScoreSpan = document.getElementById('max-score') // Maximum possible score

const resultMessage = document.getElementById('result-message') // Message shown at the end
const progressBar = document.getElementById('progress') // Progress bar element

// ==============================
// 2️⃣ QUIZ DATA (QUESTIONS)
// ==============================
// This is an array of objects.
// Each object represents ONE question.

const quizQuestions = [
  {
    question: 'What is the capital of France?', // The question text
    answers: [
			{ text: 'London', correct: false },
			{ text: 'Berlin', correct: false },
			{ text: 'Paris', correct: true },
			{ text: 'Madrid', correct: false }
    ]
  },
  {
    question: 'Which planet is known as the Red Planet?',
    answers: [
			{ text: 'Venus', correct: false },
			{ text: 'Mars', correct: true },
			{ text: 'Jupiter', correct: false },
			{ text: 'Saturn', correct: false }
    ]
  },
  {
    question: 'What is the largest ocean on Earth?',
    answers: [
			{ text: 'Atlantic Ocean', correct: false },
			{ text: 'Indian Ocean', correct: false },
			{ text: 'Arctic Ocean', correct: false },
			{ text: 'Pacific Ocean', correct: true }
    ]
  },
  {
    question: 'Which of these is NOT a programming language?',
    answers: [
			{ text: 'Java', correct: false },
			{ text: 'Python', correct: false },
			{ text: 'Banana', correct: true },
			{ text: 'JavaScript', correct: false }
    ]
  },
  {
    question: 'What is the chemical symbol for gold?',
    answers: [
			{ text: 'Go', correct: false },
			{ text: 'Gd', correct: false },
			{ text: 'Au', correct: true },
			{ text: 'Ag', correct: false }
    ]
  }
]

// ==============================
// 3️⃣ QUIZ STATE VARIABLES
// ==============================
// These variables track the quiz state while the app is running.

let currentQuestionIndex = 0 // Which question we are on (starts at 0)
let score = 0 // Number of correct answers
let answersDisabled = false // Prevents clicking multiple answers

// Set total questions and max score in the UI
totalQuestionsSpan.textContent = quizQuestions.length
maxScoreSpan.textContent = quizQuestions.length

// ==============================
// 4️⃣ EVENT LISTENERS
// ==============================
// These listen for user actions (clicks).

startButton.addEventListener('click', startQuiz)
restartButton.addEventListener('click', restartQuiz)

// ==============================
// 5️⃣ START QUIZ FUNCTION
// ==============================
// This runs when the user clicks "Start Quiz"

function startQuiz () {
	// Reset quiz values
  currentQuestionIndex = 0
  score = 0
  scoreSpan.textContent = 0

	// Hide start screen, show quiz screen
  startScreen.classList.remove('active')
  quizScreen.classList.add('active')

	// Load the first question
  showQuestion()
}

// ==============================
// 6️⃣ SHOW QUESTION FUNCTION
// ==============================
// Displays the current question and its answers

function showQuestion () {
	// Allow answers again for the new question
  answersDisabled = false

	// Get the current question object from the array
  const currentQuestion = quizQuestions[currentQuestionIndex]

	// Show question number (add 1 because index starts at 0)
  currentQuestionSpan.textContent = currentQuestionIndex + 1

	// Calculate progress bar percentage
  const progressPercent = currentQuestionIndex / quizQuestions.length * 100

	// Update progress bar width
  progressBar.style.width = progressPercent + '%'

	// Display the question text
  questionText.textContent = currentQuestion.question

	// Remove old answer buttons
  answersContainer.innerHTML = ''

	// Create a button for each answer
  currentQuestion.answers.forEach(answer => {
    const button = document.createElement('button')

		// Set button text
    button.textContent = answer.text

		// Add a CSS class
    button.classList.add('answer-btn')

		// Store whether the answer is correct (as a data attribute)
    button.dataset.correct = answer.correct

		// When clicked, run selectAnswer()
    button.addEventListener('click', selectAnswer)

		// Add button to the page
    answersContainer.appendChild(button)
  })
}

// ==============================
// 7️⃣ SELECT ANSWER FUNCTION
// ==============================
// Runs when the user clicks an answer button

function selectAnswer (event) {
	// Stop function if answers are already disabled
  if (answersDisabled) return

	// Disable further clicks
  answersDisabled = true

	// The button the user clicked
  const selectedButton = event.target

	// Check if selected answer is correct
  const isCorrect = selectedButton.dataset.correct === 'true'

	// Loop through all answer buttons
  Array.from(answersContainer.children).forEach(button => {
    if (button === selectedButton) {
			// This is the clicked button
      if (button.dataset.correct === 'true') {
        button.classList.add('correct')
      } else {
        button.classList.add('incorrect')
      }
    } else if (button.dataset.correct === 'true') {
			// Highlight the correct answer
      button.classList.add('correct')
    }
  })

	// Increase score only if answer is correct
  if (isCorrect) {
    score++
    scoreSpan.textContent = score
  }

	// Wait 1 second, then move to next question or results
  setTimeout(() => {
    currentQuestionIndex++

    if (currentQuestionIndex < quizQuestions.length) {
      showQuestion()
    } else {
      showResults()
    }
  }, 1000)
}

// ==============================
// 8️⃣ SHOW RESULTS FUNCTION
// ==============================
// Displays the final results screen

function showResults () {
  quizScreen.classList.remove('active')
  resultScreen.classList.add('active')

	// Show final score
  finalScoreSpan.textContent = score

	// Calculate percentage score
  const percentage = score / quizQuestions.length * 100

	// Display message based on performance
  if (percentage === 100) {
    resultMessage.textContent = "Perfect! You're a genius!"
  } else if (percentage >= 80) {
    resultMessage.textContent = 'Great job! You know your stuff!'
  } else if (percentage >= 60) {
    resultMessage.textContent = 'Good effort! Keep learning!'
  } else if (percentage >= 40) {
    resultMessage.textContent = 'Not bad! Try again to improve!'
  } else {
    resultMessage.textContent = "Keep studying! You'll get better!"
  }
}

// ==============================
// 9️⃣ RESTART QUIZ FUNCTION
// ==============================
// Resets everything and starts again

function restartQuiz () {
  resultScreen.classList.remove('active')
  startQuiz()
}
