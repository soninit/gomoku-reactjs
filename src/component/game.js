import React from 'react';
import Board from './board';


const GAMEBOARD_ROW = 10;
const GAMEBOARD_COLUMN = 10;
const STEP_WIN = 5;

class Game extends React.Component {
	constructor(props) {
    super(props);
    
    const squares = [GAMEBOARD_ROW];

    for (let r = 0; r < GAMEBOARD_ROW; r++) {
        squares[r] = [GAMEBOARD_COLUMN];

        for (let t = 0; t < GAMEBOARD_COLUMN; t++) {
            squares[r][t] = 'e';
        }
    }

		this.state = {
			history: [
				{
					squares: squares
				}
			],
			moves: [],
			stepNumber: 0,
			xIsNext: true
		}
	}

	

	handleClick(rowIdx, columnIdx) {
		const history = JSON.parse(JSON.stringify(this.state.history.slice(0, this.state.stepNumber + 1)));
		const current = history[history.length - 1];
		const squares = current.squares.slice();
		const winner = calculateWinner(squares);
		if (calculateWinner(squares) || squares[rowIdx][columnIdx] !== 'e') {
				return;
		}
		squares[rowIdx][columnIdx] = this.state.xIsNext ? 'x' : 'o';
		this.setState({
				history: history.concat([{
						squares: squares,
				}]),
				moves: this.state.moves.concat({
					row: rowIdx,
					col: columnIdx
				}),
				xIsNext: !this.state.xIsNext,
				stepNumber: history.length
		});
	}
    
    
	jumpTo(step) {
		this.setState({
			stepNumber: step,
			xIsNext: (step % 2) !== 0
		})
	}

  render() {
		const history = this.state.history;
		const historyMoves = this.state.moves;
		const current = history[this.state.stepNumber];
		const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
			let desc;
			if (move) {
				const row = historyMoves[move - 1].row;
				const column = historyMoves[move - 1].col;
				desc =`Go to move ${move}, (${row}, ${column})`;
			} else {
				desc ='Go to game start'; ;
			}
			
			return (
					<li key={move}>
							<button onClick={() => this.jumpTo(move)}>{desc}</button>
					</li>
			)
    });

    let status;
    if (winner) {
        status = 'Winner: ' + winner;
    } else {
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

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
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function xoWinner(str)  {
  const regX = RegExp(`x{${STEP_WIN},${STEP_WIN}}`);
  const regO = RegExp(`o{${STEP_WIN},${STEP_WIN}}`);
  
  if (str.match(regX)) 
    return 'x';
  
  if (str.match(regO))
    return 'o';

  return null;
}

function winnerHorizontal(squares) {
  let hStr = '';

  for (let i = 0; i < squares.length; i++) {
		hStr = hStr +  squares[i].join('') + '|';
  }
  const winner = xoWinner(hStr);

  if (winner === 'x')
    return 'x';
  else if (winner === 'o')
    return 'o';
  else
    return null;
}

function winnerVertical(squares) {
	let vStr = '';

  for (let c = 0; c < squares[0].length; c++) {
    for (let r = 0; r < squares.length; r++) {
			vStr = vStr + squares[r][c];
		}
		vStr = vStr + '|';
  }

  const winner = xoWinner(vStr);

  if (winner === 'x')
    return 'x';
  else if (winner === 'o')
    return 'o';
  else
    return null;
}

function calculateWinner(squares) {
  const winnerH = winnerHorizontal(squares);

  if (winnerH)
		return winnerH;
	
	const winnerV = winnerVertical(squares);
	if (winnerV)
		return winnerV;

  return null;
}


export default Game;