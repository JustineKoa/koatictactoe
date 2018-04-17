import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import bagel from './images/phoebe.png'
import ventus from './images/maki.png'
import corgi_title1 from './images/ventus.png'
import corgi_title2 from './images/bagel.png'
import blank from './images/transparent.png'

function Square(props){
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={(this.props.squares[i]==null) ? <img src={blank} id="blank" alt="BLANK"/>:this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div className="board-rows">
        <div className="board-row1">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row2">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row3">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i){
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length -1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]){
      return;
    }
    squares[i] = this.state.xIsNext ? <img src={bagel} id="bagel" alt="BAGEL"/> : <img src={ventus} id="ventus" alt="VENTUS"/>;
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step){
    this.setState({
      stepNumber: step,
      xIsNext: (step%2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step,move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner){
      if (winner === "TIED GAME"){
        status = winner;
      }
      else{
        status = 'WINNER: TEAM ' + winner.toUpperCase();
      }
    }
    else{
      status = 'TURN: TEAM ' + (this.state.xIsNext ? 'BAGEL ' : 'VENTUS');
    }
    return (
      <div className="game">
      <div className = "top-info">
      <img src={corgi_title1} id="corgi_title1"/>
      <h1 className = "app-title">VENTUS & BAGEL<br></br>CORGI TIC TAC TOE</h1>
      <img src={corgi_title2} id = "corgi_title2"/>
      </div>
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            />
        </div>
        <div className="game-info-parent">
        <div className="game-info">
          <div className="status-info">{status}</div>
          <button className="new_game_button" onClick={() => this.jumpTo(0)}>NEW GAME</button>
          {/*<ol>{moves}</ol> commented this out to hide previous moves feature*/}
        </div>
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

function calculateWinner(squares){
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
  for (let i = 0; i < lines.length; i++){
    const [a,b,c] = lines[i];
    if(squares[a] != null && squares[b] != null && squares[c] != null){
      if (squares[a].props.id === squares[b].props.id && squares[a].props.id === squares[c].props.id){
        return squares[a].props.id;
      }
    }
  }
  for (let i = 0; i < squares.length; i++){
    if(squares[i] == null){
      return null;
    }
  }
  return "TIED GAME"
}
