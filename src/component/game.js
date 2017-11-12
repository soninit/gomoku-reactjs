import React from 'react';
import Board from './board';


const GAMEBOARD_ROW = 10;
const GAMEBOARD_COLUMN = 10;

class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			history: [
				{
					squares: Array(GAMEBOARD_ROW).fill(Array(GAMEBOARD_COLUMN).fill('x'))
				}
			],
			stepNumber: 0
		}
	}

	

	handleClick(rowIdx, columnIdx) {
        // const history = this.state.history.slice(0, this.state.stepNumber + 1);
        // const current = history[history.length - 1];
        // const squares = current.squares.slice();
        // if (calculateWinner(squares) || squares[i]) {
        // return;
        // }
        // squares[i] = this.state.xIsNext ? 'X' : 'O';
        // this.setState({
        // history: history.concat([{
        //     squares: squares,
        // }]),
        //         xIsNext: !this.state.xIsNext,
        //         stepNumber: history.length
        // });
	}
    
    
	jumpTo(step) {
		// this.setState({
		// 	stepNumber: step,
		// 	xIsNext: (step % 2) === 0
		// })
	}

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    // const winner = calculateWinner(current.squares);

    // const moves = history.map((step, move) => {
    //     const desc = move ?
    //         'Go to move #' + move :
    //         'Go to game start';

    //     return (
    //         <li key={move}>
    //             <button onClick={() => this.jumpTo(move)}>{desc}</button>
    //         </li>
    //     )
    // });

    // let status;
    // if (winner) {
    //     status = 'Winner: ' + winner;
    // } else {
    //     status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    // }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            rows={GAMEBOARD_ROW}
            columns={GAMEBOARD_COLUMN}
            squares={current.squares}
            onClick={ (rowIdx, columnIdx) => this.handleClick(rowIdx, columnIdx)}
			/>
        </div>
        <div className="game-info">
          <div>{/* stastus */}</div>
          <ol>{/* moves */}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  

  return null;
}


export default Game;