import { useState } from 'react';

function Square({value, isWinningSquare, onSquareClick}) {
  let btnClass = 'square';
  if (isWinningSquare) {
    btnClass += ' winning-square';
  } 
  return (
    <button className={btnClass} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({xIsNext, squares, onPlay}) {

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

    onPlay(nextSquares);
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
      row.push(<Square value={squares[squareIndex]} isWinningSquare={isWinningSquare} onSquareClick={() => handleClick(squareIndex)} />);
    }
    boardRows.push(<div className="board-row">{row}</div>);
  }

  return (
    <>
      <div className="status">{status}</div>
      {boardRows}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [desc, setDesc] = useState(false);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  let moves = getMoves();

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
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

  function getMoves() {
    let moves = history.map((squares, moveNum) => {
      let description;
  
      if (moveNum === history.length - 1) {
        description = moveNum === 0 ? 'You are at the game start' : `You are at move #${moveNum}`;
      
        return (
          <li key={moveNum}>
            <div>{description}</div> 
          </li>
        );
      }
  
      if (moveNum > 0) {
        description = `Go to move #${moveNum}`;
      } else {
        description = 'Go to game start';
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
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <button onClick={() => toggleSort()}>Toggle sort</button>
        <ul>{moves}</ul>
      </div>
    </div>
  )
}
