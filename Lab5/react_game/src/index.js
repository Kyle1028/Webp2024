import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return <Square value={this.props.squares[i]} onClick={() => this.props.onClick(i)} />;
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
        },
      ],
      stepNumber: 0,
      xIsNext: true,
      aiEnabled: false, // Add this line to manage AI state
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{ squares: squares }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    }, () => {
      // Trigger AI move only if AI is enabled and it's AI's turn
      if (!this.state.xIsNext && !calculateWinner(squares) && this.state.aiEnabled) {
        this.handleAIMove();
      }
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
        const desc = move ? `Go to move #${move}` : 'Go to game start';
        return (
            <li key={move}>
                <button onClick={() => this.jumpTo(move)}>{desc}</button>
            </li>
        );
    });

    let status;
    if (winner) {
        status = 'Winner: ' + winner;
    } else if (this.state.stepNumber === 9) {
        status = 'Draw: Board is full';
    } else {
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
        <div className="game">
            <div className="game-board">
                <Board squares={current.squares} onClick={(i) => this.handleClick(i)} />
            </div>
            <div className="game-info">
                <div>{status}</div>
                <ol>{moves}</ol>
                <button onClick={() => this.toggleAI()}>
                  {this.state.aiEnabled ? "Turn AI Off" : "Turn AI On"}
                </button><br />
                <button onClick={() => this.resetGame()}>Reset Game</button>
            </div>
        </div>
    );
  }
  
  toggleAI() {
    this.setState({
      aiEnabled: !this.state.aiEnabled
    }, () => {
      // After updating the state, check if it's the AI's turn and make a move
      if (this.state.aiEnabled && !this.state.xIsNext && !calculateWinner(this.state.history[this.state.stepNumber].squares)) {
        this.handleAIMove();
      }
    });
  }

  handleAIMove() {
    const history = this.state.history;
    const current = history[history.length - 1];
    const squares = current.squares.slice();
  
    // AI to find the best move
    let bestMove = this.findBestMove(squares);
    if (bestMove !== -1) {
      squares[bestMove] = 'O';
      this.setState({
        history: history.concat([{
          squares: squares,
        }]),
        stepNumber: history.length,
        xIsNext: true, // Switch turn back to X
      });
    }
  }

  evaluateBoard(squares, player) {
    let score = 0;
  
    // Lines that might lead to a win
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
  
    lines.forEach((line) => {
      const [a, b, c] = line;
      let countPlayer = 0;
      let countEmpty = 0;
  
      [a, b, c].forEach((pos) => {
        if (squares[pos] === player) {
          countPlayer++;
        } else if (squares[pos] === null) {
          countEmpty++;
        }
      });
  
      if (countPlayer === 2 && countEmpty === 1) { // Potential winning move
        score += 10;
      } else if (countPlayer === 1 && countEmpty === 2) { // Setting up a win
        score += 5;
      }
    });
  
    return score;
  }  
  
  findBestMove(squares) {
    let bestMove = -1;
    let bestScore = -Infinity;
  
    for (let i = 0; i < squares.length; i++) {
      if (squares[i] === null) {
        squares[i] = 'O'; // Assume AI is 'O'
        let score = this.evaluateBoard(squares, 'O') - this.evaluateBoard(squares, 'X');
        squares[i] = null; // Reset the square
  
        if (score > bestScore) {
          bestScore = score;
          bestMove = i;
        }
      }
    }
  
    return bestMove;
  } 

  resetGame() {
    this.setState({
        history: [{ squares: Array(9).fill(null) }],
        stepNumber: 0,
        xIsNext: true,
    }, () => {
        // If AI is enabled and supposed to move first, trigger the move
        if (this.state.aiEnabled && !this.state.xIsNext) {
            this.handleAIMove();
        }
    });
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Game />
  </React.StrictMode>
);

// ========================================

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

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
