// Creates an array that lists out all of the options.
var computerChoices = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "x", "y", "z"];

// Creating variables to hold the number of wins and losses. They start at 0.
var wins = 0;
var losses = 0;
var guessesLeft = 10;
var guessedLetters = [];

// This function is run whenever the user presses a key.
document.onkeyup = function(event) {
  guessesLeft--;


  // Determines which key was pressed.
  var userGuess = event.key;

  // Randomly chooses a choice from the options array. This is the Computer's guess.
  var computerGuess = computerChoices[Math.floor(Math.random() * computerChoices.length)];

    // Function will be called when we reset everything
    var reset = function() {
      guessesLeft = 10;
      guessedLetters = [];
      userGuess = "press a key to guess again";
      computerGuess = " ";
    }

  guessedLetters.push(userGuess)


  // This logic determines the outcome of the game (win/loss), and increments the appropriate number
  if ((guessesLeft > 0)) {

    if ((userGuess === computerGuess)) {
      wins++;
      alert("Yes, you are psychic!");
      reset();
    } 
  }
    else if ((guessesLeft == 0)) {
      losses++;
      guessesLeft--;
      alert("Sorry, you're not psychic. Better luck next time!");
      reset();
    } 
  

    // Creating a variable to hold our new HTML. Our HTML now keeps track of the user and computer guesses, and wins/losses/guesses.
    var html =
      "<p>You chose: " + userGuess + "</p>" +
      "<p>I was thinking of: " + computerGuess + "</p>" +
      "<p>Wins: " + wins + "</p>" +
      "<p>Losses: " + losses + "</p>" +
      "<p>Guesses Left: " + guessesLeft + "</p>" +
      "<p>Your guesses so far: " + guessedLetters + " </p>";

    // Set the inner HTML contents of the #game div to our html string
    document.querySelector("#game").innerHTML = html;
  };