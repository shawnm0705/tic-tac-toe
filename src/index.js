import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function	Square(props) {
  const className = props.winSquare ? "square win-square" : "square";
  return (
    <button className={className} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
	renderSquare(i) {
  	return (
  		<Square 
        key={i}
	  		value={this.props.squares[i]} 
	  		onClick={() => this.props.onClick(i)}
        winSquare={this.props.winSquares.includes(i)}
	  	/>
  	);
	}

  renderRow(j) {
    return Array(3).fill(1).map((v, i) => {
      var index = 3 * j + i;
      return this.renderSquare(index);
    });
  }

	render() {
    const squares = Array(3).fill(1).map((v, i) => {
      return (
        <div className="board-row" key={i}>
          {this.renderRow(i)}
        </div>
      );
    });

    return (
      <div>
        {squares}
      </div>
    );
	}
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
      return {
        winner: squares[a],
        winSquares: [a, b, c]
      }
    }
  }
  return null;
}

class Game extends React.Component {
	 constructor() {
    super();
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      moveOrder: 'asc',
      xIsNext: true
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
    	history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
    	xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  changeMoveOrder(order) {
    if (order == 'asc') {
      this.setState({
        moveOrder: 'desc'
      });
    } else {
      this.setState({
        moveOrder: 'asc'
      });
    }
  }

  squareDiff(square1, square2) {
    var position = 0;
    for (var i = 0; i < square1.length; i++) {
      if (square1[i] !== square2[i]) {
        position = i;
        break;
      }
    }
    var x = Math.ceil((position + 1) / 3);
    var y = (position + 1) % 3;
    y = (y !== 0) ? y : 3;
    return '(' + x + ', ' + y + ')';
  }

	render() {
		const history = this.state.history;
		const current = history[this.state.stepNumber];
  	const win = calculateWinner(current.squares);
    const moves = history.map((step, move) => {
      move = (this.state.moveOrder == 'asc') ? move : history.length - move - 1;
      let desc = move ?
        'Move ' + this.squareDiff(history[move - 1].squares, history[move].squares) :
        'Game start';
      desc = (this.state.stepNumber === move) ? <b>{desc}</b> : desc;
      return (
        <li key={move}>
          <a href="javascrip:void(0)" onClick={() => this.jumpTo(move)}>{desc}</a>
        </li>
      );
    });
    let status;
    let winSquares = [];
    let winner = '';
    if (win) {
      winSquares = win.winSquares;
      status = 'Winner: ' + win.winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            winSquares={winSquares}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button type="button" onClick={() => this.changeMoveOrder(this.state.moveOrder)}>Change Order</button>
          <ol>{moves}</ol>
        </div>
      </div>
    );
	}
}

// ========================================

ReactDOM.render(
	<Game />,
	document.getElementById('root')
);
