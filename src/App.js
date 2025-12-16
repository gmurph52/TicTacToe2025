import { useState } from 'react';

// Run npm start to start the app

function Square({value, isWinningSquare, isLastPlayed, onSquareClick}) {
  let btnClass = 'square';
  let valueClass = undefined;
  if (isWinningSquare) {
    btnClass += ' winning-square';
  } 
  if (isLastPlayed) {
    valueClass = 'last-square';
  } 
  return (
    <button className={btnClass} onClick={onSquareClick}>
      <div className={valueClass}>{value}</div>
    </button>
  );
}

function Board({xIsNext, squares, lastPlayedIndex, onPlay }) {

  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        let winner = squares[a];
        let winnerIndexes = [a, b, c];
        return { winner: winner, winningSquares: winnerIndexes };
      }
    }
    if (squares.every((square) => square !== null)) {
      return { winner: `Cat's game`, winningSquares: null };
    }
    return null;
  }

  function handleClick(i) {
    // Can't play on a square that is already filled or if the game is over
    if(squares[i] || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();
    if(xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares, i);
  }

  // Handle the game status
  const winnerResuluts = calculateWinner(squares);
  const winner = winnerResuluts?.winner;
  const winningSquares = winnerResuluts?.winningSquares;
  let status;
  if (winner) {
    status = `Winner: ${winner}`;
  } else {
    status = `Next player: ${xIsNext ? 'X' : 'O'}`;
  }

  // Build the board
  const boardRows = [];
  for (let i = 0; i < 3; i++) {
    const row = [];
    for (let j = 0; j < 3; j++) {
      let squareIndex = i * 3 + j;
      let isWinningSquare = winningSquares?.some(x => x === squareIndex);
      row.push(<Square value={squares[squareIndex]} isWinningSquare={isWinningSquare} isLastPlayed={squareIndex === lastPlayedIndex} onSquareClick={() => handleClick(squareIndex)} />);
    }
    boardRows.push(<div className="board-row">{row}</div>);
  }

  return (
    <>
      <h1 className="status">{status}</h1>
      {boardRows}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([{moveIndex: null, squares: Array(9).fill(null)}]);
  const [currentMove, setCurrentMove] = useState(0);
  const [desc, setDesc] = useState(false);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove]?.squares;
  const lastPlayedIndex = history[currentMove]?.moveIndex;
  let moves = getMoves();

  function handlePlay(nextSquares, moveIndex) {
    const nextHistory = [...history.slice(0, currentMove + 1), {moveIndex: moveIndex, squares: nextSquares}];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function toggleSort() {
    setDesc(!desc);
    moves = getMoves();
  }

  function restartGame() {
    setHistory([{moveIndex: null, squares: Array(9).fill(null)}]);
    setCurrentMove(0);
    setDesc(false);
  }

  function getMoves() {
    let moves = history.map((move, moveNum) => {
      let description;
      const row = Math.floor((move.moveIndex) / 3);
      const col = (move.moveIndex) % 3; 
 
      if (moveNum === 0) {
        description = 'You are at the game start';
      
        return (
          <li key={moveNum}>
            <div>{description}</div> 
          </li>
        );
      }

      if (moveNum === history.length - 1) {
        description = `You are at move #${moveNum} (${row}, ${col})`;
      } else if (moveNum > 0) {
        description = `Go to move #${moveNum} (${row}, ${col})`;
      } else {
        description = `Go to game start`;
      }
      return (
        <li key={moveNum}>
          <button onClick={() => jumpTo(moveNum)}>{description}</button>
        </li>
      )
    });
    if (desc) {
      moves.reverse();
    }
    return moves;
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} lastPlayedIndex={lastPlayedIndex} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <button onClick={() => toggleSort()}>Toggle Sort</button>
        <button onClick={() => restartGame()} className="restart-button">Restart Game</button>
        <ul>{moves}</ul>
      </div>
    </div>
  )
}
