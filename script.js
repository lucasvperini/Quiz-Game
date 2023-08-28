// Get references to HTML elements
const questionElement = document.getElementById("question");
const answerContainer = document.getElementById("answers");
const scoreElement = document.getElementById("score");
const restartButton = document.getElementById("restartButton");

// Initialize variables
let questions = [];
let score = 0;
let currentQuestion = 0;

// Fetch questions from JSON file
const fetchQuestions = async () => {
  try {
    const response = await fetch("questions.json");
    questions = await response.json();
    showQuestion();
  } catch (error) {
    console.log("Error fetching questions: ", error);
  }
};

// Display the current question and answer options
showQuestion = () => {
  const { question, answers } = questions[currentQuestion];
  questionElement.textContent = question;

  // Generate answer buttons and attach click event listeners
  answerContainer.innerHTML = answers
    .map((answer) => `<button>${answer}</button>`)
    .join("");

  answerContainer.querySelectorAll("button").forEach((button, index) => {
    button.addEventListener("click", () => checkAnswer(index));
    button.disabled = false; // Enable buttons for the current question
    button.classList.remove("correct", "incorrect"); // Reset button classes
  });
};

// Check if the selected answer is correct
checkAnswer = (selectedIndex) => {
  //Determine if the selected answer is correct for the current question
  const isCorrect = selectedIndex === questions[currentQuestion].correct;
  const selectedButton = answerContainer.querySelector(
    `button:nth-child(${selectedIndex + 1})`
  );

  // Apply visual feedback and update score
  selectedButton.classList.add(isCorrect ? "correct" : "incorrect");
  score += isCorrect;

  //   Disable all buttons to prevent further interaction
  answerContainer
    .querySelectorAll("button")
    .forEach((button) => (button.disabled = true));

  // Proceed to the next question after a brief delay
  setTimeout(() => {
    answerContainer.innerHTML = ""; // Clear answer buttons
    currentQuestion++;

    // Check if there are more questions
    if (currentQuestion < questions.length) {
      showQuestion();
    } else {
      // Display completion message and restart button
      answerContainer.innerHTML = `<p class='feedback completed'>Quiz completed!<br>Score: ${score} out of ${questions.length}</p>`;
      questionElement.style.display = "none"; // Hide the question field
      restartButton.style.display = "block"; //Show the restart button
    }

    // Update score display
    scoreElement.textContent = `Score: ${score}`;
  }, 500);
};

// Function to reset the quiz
resetQuiz = () => {
  currentQuestion = 0;
  scoreElement.textContent = 'Score: 0'; // Reset score display
  questionElement.style.display = "block"; // Show the question field again
  restartButton.style.display = "none"; // Hide the restart button
  fetchQuestions();
};

// Add event listener to the restart button
restartButton.addEventListener("click", resetQuiz);

// Fetch questions and start the quiz when the page loads!
fetchQuestions();
