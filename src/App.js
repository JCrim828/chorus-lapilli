import { useState } from 'react';

export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];
  const [lastSelectedSquare, setLastSquare] = useState(null);
  const canMove = countSelected(currentSquares, 'X') + countSelected(currentSquares, 'O') >= 6;


  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    setXIsNext(!xIsNext);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
    setXIsNext(nextMove % 2 === 0);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} 
        onPlay={handlePlay} canMove={canMove} lastSelectedSquare={lastSelectedSquare} setLastSquare={setLastSquare} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function Square({value, onSquareClick}) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}



function Board({ xIsNext, squares, onPlay, canMove, lastSelectedSquare, setLastSquare }) {
  function handleClick(i) {
    
    if (calculateWinner(squares) || squares[i] || 
    (squares[lastSelectedSquare] === 'X' && !xIsNext && canMove) || 
    (squares[lastSelectedSquare] === 'O' && xIsNext && canMove)){
      setLastSquare(i);
      return;
    }

    const nextSquares = squares.slice();
  
    if (canMove) {
      const selectedSquare = lastSelectedSquare; // Use the last clicked square as the piece to move
  
      if (selectedSquare !== null && validMove(i, selectedSquare) && !squares[i]) {

        // clear old position and place the piece in the new valid square
        nextSquares[selectedSquare] = null;
        nextSquares[i] = xIsNext ? 'X' : 'O';
        setLastSquare(i); // update the last selected square to the new position
      } else {
        return; // Exit if the move is invalid
      }
    } else if (!squares[i]) {
      nextSquares[i] = xIsNext ? 'X' : 'O';
      setLastSquare(i); // Update the last selected square to the new position
    } else {
      return;
    }
  
    onPlay(nextSquares); // Update the game state
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}



function countSelected(squares, char) {
  let count = 0;
  for(let i = 0; i < 9; i++)
  {
    if(squares[i] === char) {
      count += 1;
    }
  }
  return count;
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function validMove(toPlace, fromPlace) {
  const adjacencyMap = {
    0: [1, 3, 4],
    1: [0, 2, 3, 4, 5],
    2: [1, 4, 5],
    3: [0, 1, 4, 6, 7],
    4: [0, 1, 2, 3, 5, 6, 7, 8],
    5: [1, 2, 4, 7, 8],
    6: [3, 4, 7],
    7: [3, 4, 5, 6, 8],
    8: [4, 5, 7]
  };
  
  return adjacencyMap[fromPlace]?.includes(toPlace);
}