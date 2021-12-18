import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import ClearIcon from './img/clear.svg';
import ArrowForwardIcon from './img/arrow_forward.svg';
import ShuffleIcon from './img/shuffle.svg';
import CachedIcon from './img/cached.svg';
import QuestionMarkIcon from './img/question_mark.svg';
import LightbulbIcon from './img/lightbulb.svg';
import ProgressBar from "./progress-bar.component";
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import logo from './img/BW_Logo.png';
import games from './games.json';
import Modal from 'react-modal';

// Main class for the game, loads the words and letters
class GameBoard extends React.Component {
  constructor(props){
    super(props);
    this.nonKeyLetters = null;
    this.keyLetter = null;

    // Setup data
    this.clickedLetters = [];
    this.createdWord = '';
    this.points = 0;
    this.score = 0;
    this.totalScore = 0;
    this.foundWords = [];
    this.validWords = [];
    this.hint = '';
    this.state = {
      showModal: false
    }

    // Bind "this"
    this.keydown = this.keydown.bind(this);
    this.shuffle = this.shuffle.bind(this);
    this.handleShuffle = this.handleShuffle.bind(this);
    this.handleClear = this.handleClear.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleNewGame = this.handleNewGame.bind(this);
    this.handleHint = this.handleHint.bind(this);
    this.loadGame = this.loadGame.bind(this);
    this.startGame = this.startGame.bind(this);
    this.handleOpenHelp = this.handleOpenHelp.bind(this);
    this.handleCloseHelp = this.handleCloseHelp.bind(this);
    Modal.setAppElement(document.getElementById('root'));

    // Start the game
    this.startGame();
  }

  // Add key listeners for the key and non-key letters, as well as Enter and Backspace
  componentDidMount(){
    document.addEventListener("keydown", this.keydown, false);
  }
  componentWillUnmount(){
    document.removeEventListener("keydown", this.keydown, false);
  }
  keydown(e){
    // Check if the key pressed matches any of the letters
    if (e.key === this.keyLetter || this.nonKeyLetters.includes(e.key)){
      this.clickedLetters.push(e.key.toUpperCase());
      this.createdWord += e.key.toUpperCase();
      this.forceUpdate();
    } else if (e.key === "Backspace"){
      // If user pushes Backspace, delete the last letter
      this.clickedLetters.splice(this.clickedLetters.length - 1, 1);
      this.createdWord = this.createdWord.substring(0, this.createdWord.length - 1);
      this.forceUpdate();
    } else if (e.key === "Enter"){
      // If users submits, check the word
      this.submitWord();
    }
  }

  // Shuffle the non-key letters around
  shuffle(array) {
    var currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }

    return array;
  }

  submitWord(){
    // Check if we've found the word
    var foundWord = false;

    // Loop through the valid words and check against the created word
    for(var i = 0; i < this.validWords.length; i++){
      if(this.validWords[i].word.toUpperCase() === this.createdWord && !this.foundWords.includes(this.validWords[i].word)){
        // Word is valid! Update the score and push word to word list
        var wordId = 'word--' + this.validWords[i].word;
        this.createdWord = '';
        this.clickedLetters = [];
        this.points += this.validWords[i].score;
        this.score = Math.round((this.points / this.totalScore) * 100);
        this.foundWords.push(this.validWords[i].word);

        // Sort the found words by length
        this.foundWords.sort(function(a, b){
          return a.length - b.length;
        });

        // Exit the loop and update the DOM
        foundWord = true;
        this.forceUpdate();
      }
    }

    // If we haven't found the word, clear the created word and give the user feedback
    if(!foundWord){
      // Clear it
      this.createdWord = '';
      this.clickedLetters = [];
      this.forceUpdate();
    } else {
      // Update the words found in localStorage
      localStorage.setItem('savedWords', this.foundWords);
      localStorage.setItem('savedScore', this.score);
      localStorage.setItem('savedPoints', this.points);
    }
  }

  // Start the game
  startGame(){
    // Load data from localStorage
    let currentGame = localStorage.getItem('currentGame');
    if(currentGame === null){
      // Get the first game and create localStorage
      currentGame = Math.floor(Math.random() * games.length);
      localStorage.setItem('currentGame', currentGame);
    } 
    this.loadGame(currentGame);
  }

  // Load the game
  loadGame(gameIndex){
    // Setup data
    this.clickedLetters = [];
    this.createdWord = '';
    this.points = 0;
    this.score = 0;
    this.totalScore = 0;
    this.foundWords = [];
    this.validWords = [];
    this.hint = '';

    // Load the game
    this.nonKeyLetters = [];
    for(var i = 1; i < games[gameIndex]['letters'].length; i++){
      this.nonKeyLetters.push(games[gameIndex]['letters'][i]);
    } 
    this.keyLetter = games[gameIndex]['key_letter'];
    this.validWords = games[gameIndex]['words'];
    this.totalScore = games[gameIndex]['total_score'];

    // Load any found words and score
    let currentWords = localStorage.getItem('savedWords');
    let currentScore = localStorage.getItem('savedScore');
    let currentPoints = localStorage.getItem('savedPoints');

    if(currentWords !== null){
      currentWords = currentWords.split(',');
      this.foundWords = currentWords;
      this.score = parseInt(currentScore);
      this.points = parseInt(currentPoints);
    }
    this.forceUpdate();
  }

  handleLetterClick = (val, letter) => {
    // Receive a value back from the letter press
    this.clickedLetters.push(val.toUpperCase());
    this.createdWord += val.toUpperCase();
    this.forceUpdate();
  }

  handleClear(e){
    // Detect an "Enter" keyup and re-direct it to "Submit"
    if(e.key === 'Enter'){
      this.submitWord();
    } else {
      // Clear the clicked letters and current draft word
      this.clickedLetters = [];
      this.createdWord = '';
      this.forceUpdate();
    }
  }

  handleShuffle(e){
    // Detect an "Enter" keyup and re-direct it to "Submit"
    if(e.key === 'Enter'){
      this.submitWord();
    } else {
      this.shuffle(this.nonKeyLetters);
      this.forceUpdate();
    }
  }

  handleSubmit(){
    this.submitWord();
  }

  handleHint(e){
    // Detect an "Enter" keyup and re-direct it to "Submit"
    if(e.key === 'Enter'){
      console.log("Enter");
      this.submitWord();
    } else {
      // Get a random word (that hasn't been found) and display the definition
      var currentGame = localStorage.getItem('currentGame');
      var foundWord = false;

      while(!foundWord){
        var index = Math.floor(Math.random() * games.length);
        if(!this.foundWords.includes(games[currentGame]['words'][index]['word'])){
          this.hint = games[currentGame]['words'][index]['definition'];
          foundWord = true;
        }
      }

      this.forceUpdate();
    }
  }

  handleNewGame(e){
    // Detect an "Enter" keyup and re-direct it to "Submit"
    if(e.key === 'Enter'){
      this.submitWord();
    } else {
      // Confirm that user wants a new game
      let newGame = window.confirm("Are you sure you want to play a new game?");
      if(newGame){
        // Clear current game from localStorage
        localStorage.removeItem('savedWords');
        localStorage.removeItem('savedScore');

        // Increment the new game in localStorage
        let currentGame = parseInt(localStorage.getItem('currentGame'));
        if(currentGame === (games.length - 1)){
          currentGame = 0;
        } else {
          currentGame += 1;
        }
        localStorage.setItem('currentGame', currentGame);

        // Reload the game
        this.loadGame(currentGame);
      } 
    }
  }

  handleOpenHelp(){
    this.setState({showModal: true});
  }
  
  handleCloseHelp(){
    this.setState({showModal: false});
  }

  styles = StyleSheet.create({
    keyLetterButton: {
      width: 100,
      height: 100,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 10,
      borderRadius: 100,
      backgroundColor: 'orange',
    },
    nonKeyLetterButton: {
      width: 100,
      height: 100,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 10,
      borderRadius: 100,
      backgroundColor: 'white',
      borderWidth: 3,
      borderColor: 'orange',
    },
    actionButton: {
      width: 100,
      height: 60,
      justifyContent: 'center',
      padding: 5,
      margin: 5,
      borderRadius: 10,
      backgroundColor: 'white',
      borderWidth: 2,
      borderColor: 'grey',
    },
    letterText: {
      fontSize: 48,
      fontWeight: 'bold',
    },
    buttonText: {
      fontSize: 18,
    },
    modal: {
      height: '100%',
      width: '100%',
    }
  });

  render(){
    return(
      <div>
        <div className='top-bar'>
          <img className='logo' src={logo} alt='scrumble logo' />
        </div>
        <div className="game-container">
          {/* Add the current word that the user is typing */}
          <div className="game-current-word">
            <CurrentWord value={this.createdWord} />
          </div>

          <div className='game-letters'>
            {/* Add the key letter */}
            <TouchableOpacity style={this.styles.keyLetterButton} onPress={() => this.handleLetterClick(this.keyLetter)}>
              <Text style={this.styles.letterText}>{this.keyLetter.toUpperCase()}</Text>
            </TouchableOpacity>

            {/* Add the non-key letters */}
            {this.nonKeyLetters.map((letter, index) => (
              <TouchableOpacity style={this.styles.nonKeyLetterButton} onPress={() => this.handleLetterClick(letter)} key={index} value={letter} alt={letter}>
                <Text style={this.styles.letterText}>{letter.toUpperCase()}</Text>
              </TouchableOpacity>
            ))}
          </div>

          <div className='action-button-container'>
            <div className="game-buttons">
              {/* Add the first row of action buttons */}
              <TouchableOpacity style={this.styles.actionButton} onPress={this.handleClear}>
                <div className='action-button-contents'>
                  <img src={ClearIcon} alt='clear word' className="action-icon" />
                  <Text style={this.styles.buttonText}>Clear</Text>
                </div>
              </TouchableOpacity>
              <TouchableOpacity style={this.styles.actionButton} onPress={this.handleShuffle}>
                <div className='action-button-contents'>
                  <img src={ShuffleIcon} alt='shuffle letters' className="action-icon" />
                  <Text style={this.styles.buttonText}>Shuffle</Text>
                </div>
              </TouchableOpacity>
              <TouchableOpacity style={this.styles.actionButton} onPress={this.handleSubmit}>
                <div className='action-button-contents'>
                  <img src={ArrowForwardIcon} alt='submit word' className="action-icon" />
                  <Text style={this.styles.buttonText}>Submit</Text>
                </div>
              </TouchableOpacity>
            </div>

            <div className='game-buttons'>
              {/* Add the second row of action buttons */}
              <TouchableOpacity style={this.styles.actionButton} onPress={this.handleNewGame}>
                <div className='action-button-contents'>
                  <img src={CachedIcon} alt='new game' className="action-icon action-icon-multiline" />
                  <Text style={this.styles.buttonText}>New Game</Text>
                </div>
              </TouchableOpacity>
              <TouchableOpacity style={this.styles.actionButton} onPress={this.handleHint}>
                <div className='action-button-contents'>
                  <img src={LightbulbIcon} alt='hint' className="action-icon" />
                  <Text style={this.styles.buttonText}>Hint</Text>
                </div>
              </TouchableOpacity>
              <TouchableOpacity style={this.styles.actionButton} onPress={this.handleOpenHelp}>
                <div className='action-button-contents'>
                  <img src={QuestionMarkIcon} alt='game help' className="action-icon" />
                  <Text style={this.styles.buttonText}>Help</Text>
                </div>
              </TouchableOpacity>
            </div>
          </div>

          {/* Add the help modal */}
          <Modal isOpen={this.state.showModal} style={this.styles.modal} contentLabel='help'>
            <h2>Scrumble</h2>
            <p>Scrumble is a word game where the goal is to make as many words as you can using the provided letters</p>
            <ul>
              <li>Each word must contain the "key" letter. This is the letter in the orange circle</li>
              <li>Each word must contain at least 4 letters</li>
              <li>Proper nouns may or may not be included</li>
            </ul>
            <p>
              Scrumble is still a beta application as there are improvements that I'd like to make to the puzzles and the gameplay.
              Visit my <a href='https://njmullen.com/' target='_blank'>homepage</a> to provide comments or feedback
            </p>
            <button onClick={this.handleCloseHelp}>Close</button>
          </Modal>

          <div className='game-hint'>
            <div className='hint'>{this.hint}</div>
          </div>

          <div className="game-score">
            <Score value={this.score} />
          </div>
          <div className="game-words">
            <WordBank value={this.foundWords} />
          </div>
        </div>
      </div>
    )
  }
}

// Hold the progress bar
class Score extends React.Component {
  render(){
    return (
      <ProgressBar bgcolor="#ffa500" completed={this.props.value} />
    )
  }
}

// Class to hold the current word that the user is typing
class CurrentWord extends React.Component {
  render(){
    return (
      <div className="current-word-div">
        <span className="current-word">{this.props.value}</span><span className="blinking-cursor">|</span>
      </div>
    )
  }
}

// Class to hold the words that the user has already found
class WordBank extends React.Component {
  render(){
    let validWords = this.props.value;
    let wordsList = [];
    for(var i = 0; i < validWords.length; i++){
      var wordId = 'word--' + validWords[i];
      wordsList.push(<div key={i}><p className='word-bank-word' id={wordId}>{validWords[i].toUpperCase()}</p></div>)
    }
    return (
      <div className='word-bank'>{wordsList}</div>
    )
  }
}

// ========================================

ReactDOM.render(
  <GameBoard />,
  document.getElementById('root')
);

