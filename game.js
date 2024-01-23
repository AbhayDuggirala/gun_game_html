// TO-DOs -- Change ending alert to some pop-up or just alert saying what you scored or saying game complete. Make sure no bugs. Plug into Qualtrics. Remember to somehow record number correct out of 10. 
// Maybe play around with the timeouts or not allow them to do another click while its still timing out...



// List of possible words

const words = ["Front Sight", "Barrel", "Slide Stop", "Rear Sight", "Hammer", "Safety", "Grip", "Magazine", "Magazine Release", "Trigger", "Disassembly Lever", "Slide"]

let totalattemptCount = 0;
let gameStarted = false;
let usedWords = [];
let currentattemptCount = 0;
let correct = 0;
let incorrect = 0;

function getRandomWord() {
    let randomWord;
    do {
        randomWord = words[Math.floor(Math.random() * words.length)];
    } while (usedWords.includes(randomWord));

    usedWords.push(randomWord);
    return randomWord;
}

function displayWord () {
    const wordContainer = document.getElementById("word-container");
    wordContainer.textContent = getRandomWord();
    resetButtonStyles();
}

function checkAnswer(buttonId) {
    const wordContainer = document.getElementById("word-container");
    const correctAnswer = wordContainer.textContent;
    const buttons = document.querySelectorAll(".game-button");
    const clickedButton = document.getElementById(buttonId);


    // if the id of the clicked button matches the correct answer without spaces then the user is correct

    if (clickedButton.id === correctAnswer.replace(/\s/g, "")) {
        showCorrectMessage();
        setTimeout(() => {
            hideCorrectMessage();
            totalattemptCount++
            currentattemptCount = 0
            correct++
            updateScoreBar();
            if (totalattemptCount < 10) {
                displayWord();
            }
            else {
                alert("Game Over. You've completed 10 attempts.");
                resetGame();
            }
        }, 1000);
    } else if (currentattemptCount >= 2) {
        incorrect++
        showAttemptsMessage();
        setTimeout(() => {
            hideAttemptsMessage();
            totalattemptCount++
            currentattemptCount = 0
            updateScoreBar();
            if (totalattemptCount < 10) {
                displayWord();
            }
            else {
                alert("Game Over. You've completed 10 attempts.");
                resetGame();
            }
        }, 1000);
    } 
    else {
        updateScoreBar();
        showIncorrectMessage();
        showIncorrectStyle(clickedButton);
        setTimeout(() => {
            hideIncorrectMessage(correctAnswer);
            hideIncorrectStyle(clickedButton);
            totalattemptCount++
            incorrect++
            updateScoreBar();
            if (totalattemptCount >= 10) {
                alert("Game Over. You've completed 10 attempts.");
                resetGame();
            }
        }, 1000);
        currentattemptCount++
    }
}

function updateScoreBar() {
    document.getElementById("attempts").innerText = (10 - totalattemptCount);
    document.getElementById("wins").innerText = correct;
    document.getElementById("losses").innerText = incorrect
}

function showAttemptsMessage() {
    const wordContainer = document.getElementById("word-container");
    wordContainer.innerHTML = "<span class='incorrect'>Incorrect. Next Word. </span>";
}

function hideAttemptsMessage() {
    const wordContainer = document.getElementById("word-container");
    wordContainer.innerHTML = "";
}

function showCorrectMessage() {
    const wordContainer = document.getElementById("word-container");
    wordContainer.innerHTML = "<span class='correct'>Correct!</span>";
}

function hideCorrectMessage() {
    const wordContainer = document.getElementById("word-container");
    wordContainer.innerHTML = "";
}

function showIncorrectMessage() {
    const wordContainer = document.getElementById("word-container");
    wordContainer.innerHTML = "<span class='incorrect'>Incorrect!</span>";
}

function hideIncorrectMessage(currentWord) {
    const wordContainer = document.getElementById("word-container");
    wordContainer.innerHTML = currentWord;
}

function showIncorrectStyle(button) {
    button.classList.add("incorrect");
}

function hideIncorrectStyle(button) {
    button.classList.remove("incorrect");
}

function resetButtonStyles() {
    const buttons = document.querySelectorAll(".game-button");

    buttons.forEach(button => {
        button.classList.remove("incorrect");
    });
}

function startGame() {
    gameStarted = true;
    wordCount = 0;
    usedWords =[];
    displayWord();
}

function resetGame() {
    Qualtrics.SurveyEngine.setJSEmbeddedData("correct", correct);
    Qualtrics.SurveyEngine.setJSEmbeddedData("incorrect", incorrect);
    Qualtrics.SurveyEngine.setJSEmbeddedData("totalattemptCount", totalattemptCount);
    gameStarted = false;
    totalattemptCount = 0;
    currentattemptCount = 0;
    correct = 0;
    incorrect = 0;
    updateScoreBar();
    usedWords = [];
    const wordContainer = document.getElementById("word-container");
    wordContainer.innerHTML = "";
}

document.getElementById("start-button").addEventListener("click", () => {
    if (!gameStarted) {
        startGame();
    }
    else {
        alert("Game is already in progress.");
    }
});

document.querySelectorAll(".game-button").forEach((button) => {
   button.addEventListener("click", function () {
       if (gameStarted) {
           checkAnswer(this.id);
       } else {
           alert("Please start the game first.");
       }
   });
});