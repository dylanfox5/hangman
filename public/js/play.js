$(document).ready(function() {
    const words = ['welcome', 'hello', 'world', 'rare', 'extinct', 'ant', 'mean', 'devote', 'panic', 'solo', 'rise', 'swing', 'goal', 'misplace', 'teenager', 'punch', 'prestige', 'beginning']; // array of random words
    const word = words[Math.floor(Math.random() * words.length)]; // generate random word

    var spaces = document.getElementById("word"); // stores <ul> tag for generating spaces
    var numSpaces; // num of spaces remaining
    var lives = 6; // num of lives
    var guess; // user's guess
    var history = []; // array of guesses user has tried
    var didWin = false; // boolean to track when game has been won
    var canvas = document.getElementById("canvas"); // canvas for drawing hangman
    var ctx = canvas.getContext("2d"); // canvas context to draw
    var drawings = [drawLArm, drawRArm, drawLLeg, drawRLeg, drawBody, drawHead]; // array of functions to be drawn when user guesses incorrectly

    // used to draw lines on canvas easily
    function draw(x, y, toX, toY) {
        ctx.moveTo(x, y);
        ctx.lineTo(toX, toY);
        ctx.stroke();
    }

    // draws hangman's frame at the beginning
    function drawFrame() {
        draw(0, 150, 300, 150);
        draw(225, 300, 225, 0);
        draw(225, 0, 75, 0);
        draw(75, 0, 75, 25);
    }

    // lines 30-54 draw different parts of hangman's body
    function drawHead() {
        ctx.beginPath();
        ctx.arc(75, 40, 15, 0, 2*Math.PI);
        ctx.stroke();
    }

    function drawBody() {
        draw(75, 55, 75, 100)
    }

    function drawRLeg() {
        draw(75, 100, 100, 125);
    }

    function drawLLeg() {
        draw(75, 100, 50, 125);
    }

    function drawRArm() {
        draw(75, 75, 100, 75);
    }

    function drawLArm() {
        draw(75, 75, 50, 75);
    }

    // creates the spaces for each letter in the secret word
    // runs each time a guess is made
    // after each run, it checks the status of the game 
    function createSpaces() {
        removeChildren(spaces);
        numSpaces = 0;
        for (var i=0; i < word.length; i++) {
            if (history.includes(word[i])) {
                space = document.createElement("li");
                space.innerHTML = word[i];
                spaces.appendChild(space);
            }
            else {
                space = document.createElement("li");
                space.innerHTML = "___";
                spaces.appendChild(space);
                numSpaces++
            }
        }
        checkGame();
    };

    // removes the children from the <ul> used to display the spaces
    function removeChildren(parent) {
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    }

    // updates the text and checks the status of the game
    function updateLives() {
        document.getElementById("lives").innerHTML = "You have " + lives + " lives left.";
        checkGame();
    }

    // updates the array containing all of the user's guesses and displays them
    function updateHistory(guess) {
        history.push(guess);
        item = document.createElement("li");
        item.innerHTML = guess;
        document.getElementById("history").appendChild(item);
    }

    // checks to see if user input is in the secret word
    // if it is, the spaces are generated again with the appropriate characters displayed
    // if not, part of hangman is drawn and lives are updated
    function checkGuess(guess) {
        if (guess === word) {
            didWin = true;
            gameOver();
        }
        else if (word.indexOf(guess) > -1) {
            createSpaces();
        }
        else {
            lives--;
            drawings[lives]();
            updateLives();
        }
    }

    // checks the status of the game
    function checkGame() {
        if (numSpaces === 0) {
            didWin = true;
            gameOver();
        }
        else if (lives === 0) {
            didWin = false;
            gameOver();
        }
    }
    
    // checks if game is won or lost and displays appropriate message and complete secret word
    function gameOver() {
        if (didWin === false) {
            document.getElementById("lives").innerHTML = "Sorry, better luck next time.";
        }
        else {
            document.getElementById("lives").innerHTML = "Congrats! Play again?";
        }
        showWord();
        document.getElementById("submit").disabled = true;
    }

    // displays the entire word
    function showWord() {
        removeChildren(spaces);
        for (var i=0; i < word.length; i++) {
            space = document.createElement("li");
            space.innerHTML = word[i];
            spaces.appendChild(space);
        }
    }

    // sets up the start of the game and listens for user input
    function play() {
        drawFrame();
        updateLives();
        createSpaces();

        $("#submit").click(function() {
            guess = document.getElementById("userInput").value;
            if (guess === "") {
                alert("Please enter a value!");
            }
            else if (history.includes(guess)) {
                alert("You've already guessed that!");
                document.getElementById("userInput").value = "";
            }
            else {
                document.getElementById("userInput").value = "";
                updateHistory(guess);
                checkGuess(guess);
            }
        });
    };

    play();
});