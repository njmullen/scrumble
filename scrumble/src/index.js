import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import ClearIcon from '@material-ui/icons/Clear'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'
import ShuffleIcon from '@material-ui/icons/Shuffle';
import ProgressBar from "./progress-bar.component";
import { Text, TouchableOpacity, StyleSheet } from 'react-native';

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

    // Bind "this"
    this.keydown = this.keydown.bind(this);
    this.shuffle = this.shuffle.bind(this);
    this.handleShuffle = this.handleShuffle.bind(this);
    this.handleClear = this.handleClear.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    // Load the game
    this.loadFile();
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

  submitWord(){
    // Check if we've found the word
    var foundWord = false;

    // Loop through the valid words and check against the created word
    for(var i = 0; i < this.validWords.length; i++){
      if(this.validWords[i].word.toUpperCase() === this.createdWord && !this.foundWords.includes(this.validWords[i].word)){
        // Word is valid!
        var wordId = 'word--' + this.validWords[i].word;
        this.createdWord = '';
        this.clickedLetters = [];
        this.points += this.validWords[i].score;
        this.score = Math.round((this.points / this.totalScore) * 100);
        this.foundWords.push(this.validWords[i].word);
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
    }
  }

  // Load the game
  loadFile(){
    // Get JSON string
    let gameString = {"total_score": 172, "key_letter": "l", "letters": ["l", "a", "e", "r", "p", "n", "y"], "words": [{"word": "lane", "definition": "a narrow way or road", "score": 4}, {"word": "lear", "definition": "British artist and writer of nonsense verse (1812-1888)", "score": 4}, {"word": "leap", "definition": "a light, self-propelled movement upwards or forwards", "score": 4}, {"word": "lean", "definition": "the property possessed by a line or surface that departs from the vertical", "score": 4}, {"word": "lyra", "definition": "a small constellation in the northern hemisphere near Cygnus and Draco; contains the star Vega", "score": 4}, {"word": "lyre", "definition": "a harp used by ancient Greeks for accompaniment", "score": 4}, {"word": "earl", "definition": "a British peer ranking below a marquess and above a viscount", "score": 4}, {"word": "rely", "definition": "have confidence or faith in", "score": 4}, {"word": "real", "definition": "any rational or irrational number", "score": 4}, {"word": "plan", "definition": "a series of steps to be carried out or goals to be accomplished", "score": 4}, {"word": "play", "definition": "a dramatic work intended for performance by actors on a stage", "score": 4}, {"word": "plea", "definition": "a humble request for help from someone in authority", "score": 4}, {"word": "pale", "definition": "a wooden strip forming part of a fence", "score": 4}, {"word": "peal", "definition": "a deep prolonged sound (as of thunder or large bells)", "score": 4}, {"word": "yale", "definition": "a university in Connecticut", "score": 4}, {"word": "yelp", "definition": "a sharp high-pitched cry (especially by a dog)", "score": 4}, {"word": "laney", "definition": "United States educator who founded the first private school for Black students in Augusta, Georgia (1854-1933)", "score": 5}, {"word": "layer", "definition": "single thickness of usually some homogeneous substance", "score": 5}, {"word": "learn", "definition": "gain knowledge or skills", "score": 5}, {"word": "early", "definition": "at or near the beginning of a period of time or course of events or before the usual or expected time", "score": 5}, {"word": "relay", "definition": "the act of passing something along from one person or group to another", "score": 5}, {"word": "reply", "definition": "a statement (either spoken or written) that is made to reply to a question or request or criticism or accusation", "score": 5}, {"word": "renal", "definition": "of or relating to the kidneys", "score": 5}, {"word": "plane", "definition": "an aircraft that has a fixed wing and is powered by propellers or jets", "score": 5}, {"word": "plyer", "definition": "someone who plies a trade", "score": 5}, {"word": "paler", "definition": "very light colored; highly diluted with white", "score": 5}, {"word": "panel", "definition": "sheet that forms a distinct (usually flat and rectangular) section or component of something", "score": 5}, {"word": "pearl", "definition": "a smooth lustrous round structure inside the shell of a clam or oyster; much valued as a jewel", "score": 5}, {"word": "penal", "definition": "of or relating to punishment", "score": 5}, {"word": "replay", "definition": "something (especially a game) that is played again", "score": 6}, {"word": "planer", "definition": "a power tool for smoothing or shaping wood", "score": 6}, {"word": "player", "definition": "a person who participates in or is skilled at some game", "score": 6}, {"word": "parley", "definition": "a negotiation between enemies", "score": 6}, {"word": "pearly", "definition": "informal terms for a human `tooth'", "score": 6}, {"word": "nearly", "definition": "(of actions or states) slightly short of or not quite accomplished; all but", "score": 6}, {"word": "plenary", "definition": "full in all respects", "score": 7}]}
    // Get key and non-key letters for rendering
    let nonKeyLetters = gameString['letters']
    nonKeyLetters.splice(0, 1);
    this.nonKeyLetters = nonKeyLetters;
    this.keyLetter = gameString['key_letter'];
    this.validWords = gameString['words'];

    // Calculate total score
    for(var i = 0; i < this.validWords.length; i++){
      this.totalScore += this.validWords[i].score;
    }
  }

  handleLetterClick = (val, letter) => {
    // Receive a value back from the letter press
    this.clickedLetters.push(val.toUpperCase());
    this.createdWord += val.toUpperCase();
    this.forceUpdate();
  }

  handleClear(){
    // Clear the clicked letters and current draft word
    this.clickedLetters = [];
    this.createdWord = '';
    this.forceUpdate();
  }

  handleShuffle(){
    this.shuffle(this.nonKeyLetters);
    this.forceUpdate();
  }

  handleSubmit(){
    this.submitWord();
  }

  handleActionClick = (val) => {
    // Receive an action
    if(val === 'shuffle'){
      this.shuffle(this.nonKeyLetters);
    } else if(val === 'clear'){
      this.clickedLetters = [];
      this.createdWord = '';
    } else if(val === 'arrow-forward') {
      //
    }
    this.forceUpdate();
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
      width: 60,
      height: 60,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 10,
      margin: 10,
      borderRadius: 100,
      backgroundColor: 'white',
      borderWidth: 2,
      borderColor: 'grey',
    },
    letterText: {
      fontSize: 48,
      fontWeight: 'bold',
    }
  });

  render(){
    return(
      <div>
        <div className='top-bar'></div>
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
              <TouchableOpacity style={this.styles.nonKeyLetterButton} onPress={() => this.handleLetterClick(letter)} key={index} value={letter}>
                <Text style={this.styles.letterText}>{letter.toUpperCase()}</Text>
              </TouchableOpacity>
            ))}
          </div>

          <div className="game-buttons">
            {/* Add the action buttons */}
            <TouchableOpacity style={this.styles.actionButton} onPress={this.handleClear}>
              <Text style={this.styles.letterText}><ClearIcon className="action-icon" /></Text>
            </TouchableOpacity>
            <TouchableOpacity style={this.styles.actionButton} onPress={this.handleShuffle}>
              <Text style={this.styles.letterText}><ShuffleIcon className="action-icon" /></Text>
            </TouchableOpacity>
            <TouchableOpacity style={this.styles.actionButton} onPress={this.handleSubmit}>
              <Text style={this.styles.letterText}><ArrowForwardIcon className="action-icon" /></Text>
            </TouchableOpacity>
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

