import './Game.css'
import { useState, useRef } from 'react'

const Game = ({ 
  verifyLetter, 
  pickedWord, 
  pickedCategory, 
  letters, 
  guessedLetters, 
  wrongLetters, 
  guesses, 
  score 
}) => {

  const [letter, setLetter] = useState("");

  //  Input area in focus
  const letterInputRef = useRef(null)

  const handleSubmit = (event) => {

    event.preventDefault()
    verifyLetter(letter)
    setLetter("")

    //  Input area in focus
    letterInputRef.current.focus()
  }

  return (
    <div className="game">
      <p className="points">
        <span>Pontuação: {score} </span>
      </p>
      <h1>Adivinhe a palavra:</h1>
      <h3 className="tip">
        Dica sobre a palavra: <span>{pickedCategory}</span>
      </h3>
      <p>Você ainda tem {guesses} tentativas!</p>
      <div className="wordContainer">
        {letters.map((letter, indice) => (
          guessedLetters.includes(letter) ? (
            <span key={indice} className="letter">{letter}</span>
          ) : (
            <span key={indice} className="blankSquare"></span>
          )
        ))}
      </div>
      <div className="letterContainer">
        <p>Tente adivinhar uma letra da palavra:</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="letter"
            id="letter"
            maxLength="1"
            required
            onChange={(event) => setLetter(event.target.value)}
            value={letter}
            //  Input area in focus
            ref={letterInputRef}
          />
          <button>Jogar!</button>
        </form>
        <div className="wrongLettersContainer">
          <p>Letras já utilizadas:</p>
          {wrongLetters.map((letter, indice) => (
            <span key={indice}>{letter}, </span>
          ))}
        </div>
      </div>

    </div>
  )
}

export default Game