// CSS
import './App.css';

// React
import { useCallback, useEffect, useState } from 'react'

// Data
import { wordList } from './data/word'

// Components
import StartScreen from './components/StartScreen'
import Game from './components/Game'
import GameOver from './components/GameOver'

const stages = [
  {
    id: 0,
    name: "start"
  },
  {
    id: 1,
    name: "game"
  },
  {
    id: 2,
    name: "end"
  }
]


function App() {

  // Game stages, using the "stages" list and index
  const [gameStage, setGameStage] = useState(stages[0].name)

  // Creating a variable that stores all the words in the game
  const [words] = useState(wordList)

  // Variables that are part of the game screen
  const [pickedWord, setPickedWord] = useState("")
  const [pickedCategory, setPickedCategory] = useState("")
  const [letters, setLetters] = useState([])

  const [guessedLetters, setGuessedLetters] = useState([])
  const [wrongLetters, setWrongLetters] = useState([])
  const [guesses, setGuesses] = useState(5)
  const [score, setScore] = useState(0)



  // Pick word and pick category functions
  const pickWordAndCategory = useCallback(() => {

    // Pick a random category
    const categories = Object.keys(words)
    const category = categories[Math.floor(Math.random() * Object.keys(categories).length)]

    // Pick a random word
    const word = words[category][Math.floor(Math.random() * words[category].length)]

    return { word, category }
  }, [words])

  // Starts the Secret Word game
  const StartGame = useCallback(() => {
    // Clear all letters
    clearLetterStates()

    // Pick word and pick category
    const { word, category } = pickWordAndCategory()

    // Create an array of letters
    let wordLetters = word.split("")

    // Fill States
    setPickedWord(word)
    setPickedCategory(category)
    setLetters(wordLetters)

    setGameStage(stages[1].name)
  }, [pickWordAndCategory])


  // Process the letter input
  const verifyLetter = (letter) => {

    const normalizedLetter = letter.toLowerCase()

    // Check if letter has already been utilized
    if (guessedLetters.includes(normalizedLetter) ||
      wrongLetters.includes(normalizedLetter)
    ) {
      return
    }
    // Push guessed letter or remove a guess
    if (letters.includes(normalizedLetter)) {
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters,
        normalizedLetter
      ])
    } else {
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters,
        normalizedLetter
      ])

      // Losing points
      setGuesses((actualGuesses) => actualGuesses - 1)
    }
  }

  const clearLetterStates = () => {
    setGuessedLetters([])
    setWrongLetters([])
  }

  // Check if guesses ended
  useEffect(() => {
    if (guesses <= 0){
      //Reset all states
      clearLetterStates()
      setGameStage(stages[2].name)
    }
  }, [guesses])

  
  // Check win condition
  useEffect(() => {
    const uniqueLetters = [...new Set(letters)]

    // Win condition
    if (guessedLetters.length === uniqueLetters.length) {
      // Add score
      setScore((actualScore) => (actualScore += 100))
      // Restart game with new word
      StartGame()
    }
  }, [guessedLetters, letters, StartGame])

  // Restarts the game
  const retry = () => {
    setScore(0)
    setGuesses(5)
    setGameStage(stages[0].name)
  }

  return (
    <div className="App">

      {/* If the game stage is equal to "start": */}
      {gameStage === "start" && <StartScreen StartGame={StartGame} />}

      {/* If the game stage is equal to "game" */}
      {gameStage === "game" && (
        <Game
          verifyLetter={verifyLetter}
          pickedWord={pickedWord}
          pickedCategory={pickedCategory}
          letters={letters}
          guessedLetters={guessedLetters}
          wrongLetters={wrongLetters}
          guesses={guesses}
          score={score}
        />
      )}

      {/* If the game stage is equal to "end" */}
      {gameStage === "end" && <GameOver retry={retry} score={score} />}
    </div>
  );
}

export default App;
