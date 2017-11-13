import React from "react";
import Board from "./board";

const GAMEBOARD_ROW = 10;
const GAMEBOARD_COLUMN = GAMEBOARD_ROW;
const STEP_WIN = 5;

class Game extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      history: [
        {
          squares: Array(GAMEBOARD_COLUMN * GAMEBOARD_ROW).fill('e')
        }
      ],
      moves: [],
      stepNumber: 0,
      xIsNext: true,
      currentSelected: -1,
			isOrderAsc: true,
      winnerMoves: null,
    };
  }

  handleClick(rowIdx, columnIdx) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice(0);
    const lastMove = this.state.moves[this.state.moves.length - 1];
    const winner = calculateWinner(squares, lastMove);
    if (winner || squares[rowIdx * GAMEBOARD_ROW + columnIdx] !== "e") {
      return;
    }
    squares[rowIdx * GAMEBOARD_ROW + columnIdx] = this.state.xIsNext ? "x" : "o";
    this.setState({
      history: history.concat([
        {
          squares: squares
        }
      ]),
      moves: this.state.moves.concat(rowIdx * GAMEBOARD_ROW + columnIdx),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
			currentSelected: -1,
			winnerMoves: winner
    });
  }

  handleToggleOrder() {
    this.setState({ isOrderAsc: !this.state.isOrderAsc });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 == 0,
      currentSelected: step
    });
  }

  render() {
    const isOrderAsc = this.state.isOrderAsc;
    const history = isOrderAsc
      ? this.state.history
      : this.state.history.slice(0).reverse();
    const historyMoves = this.state.moves;
    const current = this.state.history[this.state.stepNumber];
    const currentSelected = this.state.currentSelected;

    const winner = calculateWinner(current.squares, this.state.moves[this.state.moves.length - 1]);

    const moves = history.map((step, idx) => {
      let move;

      if (isOrderAsc) {
        move = idx;
      } else {
        move = history.length - idx - 1;
      }

      let desc;
      if (move) {
        const row = parseInt(historyMoves[move - 1] / GAMEBOARD_ROW);
        const column = historyMoves[move - 1] % GAMEBOARD_COLUMN;
        desc = `Go to move ${move}, (${row}, ${column})`;
      } else {
        desc = "Go to game start";
      }

      return (
        <li key={move}>
          <button
            className={move === currentSelected ? "bold-text" : ""}
            onClick={() => this.jumpTo(move)}
          >
            {desc}
          </button>
        </li>
      );
    });

    let status;
    if (winner) {
			status = "Winner: " + winner.winner;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            rows={GAMEBOARD_ROW}
            columns={GAMEBOARD_COLUMN}
						squares={current.squares}
						winnerMoves={winner}
            onClick={(rowIdx, columnIdx) => this.handleClick(rowIdx, columnIdx)}
          />
        </div>
        <div className="game-info">
          <button type="button" onClick={() => this.handleToggleOrder()}>
            {this.state.isOrderAsc ? "Sort: Asc" : "Sort: Desc"}
          </button>
          <div>{status}</div>
          <ol className="no-style">{moves}</ol>
        </div>
      </div>
    );
  }
}

function xoWinner(str) {
  const regX = RegExp(`x{${STEP_WIN},${STEP_WIN}}`);
  const regO = RegExp(`o{${STEP_WIN},${STEP_WIN}}`);

  const matchX = str.match(regX);
  if (matchX) {
    return {
      winner: "x",
      index: matchX.index
    };
  }

  const matchY = str.match(regO);
  if (matchY) {
    return {
      winner: "o",
      index: matchY.index
    };
  }

  return null;
}

function winnerHorizontal(squares) {
  for (let i = 0; i < GAMEBOARD_ROW; i++) {
    const hStr = squares.slice(i * GAMEBOARD_ROW, i * GAMEBOARD_ROW + GAMEBOARD_COLUMN).join('');
    const result = xoWinner(hStr);

    if (result) {
      return {
        winner: result.winner,
        type: 'h',
        fromRow: i,
        toRow: i,
        fromCol: result.index,
        toCol: result.index + STEP_WIN - 1
      };
    }
  }

  return null;
}

function winnerVertical(squares) {
  for (let c = 0; c < GAMEBOARD_COLUMN; c++) {
    let vStr = "";
    for (let r = 0; r < GAMEBOARD_ROW; r++) {
      vStr = vStr + squares[r * GAMEBOARD_ROW + c];
    }
    const result = xoWinner(vStr);

    if (result) {
      return {
        winner: result.winner,
        type: 'v',
        fromRow: result.index,
        toRow: result.index + STEP_WIN - 1,
        fromCol: c,
        toCol: c
      };
    } else {
    }
  }

  return null;
}

function findTopLeft(rowIdx, colIdx) {
  if (rowIdx === colIdx) 
    return {row: 0, col: 0};
  else if (rowIdx < colIdx) {
    if (rowIdx === 0 || colIdx == 0)
      return {row: rowIdx, col: colIdx};
    return {row: 0, col: colIdx - rowIdx};
  } else { // rowIdx > colIdx
    if (rowIdx === 0 || colIdx == 0)
      return {row: rowIdx, col: colIdx};
    return {row: rowIdx - colIdx, col: 0};
  }
}

function findTopRight(rowIdx, colIdx) {
  if (rowIdx + colIdx === GAMEBOARD_COLUMN - 1)
    return {row: 0, col: GAMEBOARD_COLUMN - 1};
  else if (rowIdx + colIdx > GAMEBOARD_COLUMN - 1) {
    if (colIdx === GAMEBOARD_COLUMN - 1 || rowIdx === 0)
      return {row: rowIdx, col: colIdx};
    return {row: rowIdx - (GAMEBOARD_COLUMN - 1 - colIdx), col: GAMEBOARD_COLUMN - 1}
  } else {
    if (colIdx === GAMEBOARD_COLUMN - 1 || rowIdx === 0)
      return {row: rowIdx, col: colIdx};
    return {row: 0, col: colIdx + rowIdx};
  }
}

function winnerDianogal(squares, lastMove) {
  if (!lastMove)
    return null;

  const currentRow = parseInt(lastMove / GAMEBOARD_ROW);
  const currentCol = lastMove % GAMEBOARD_COLUMN;

  console.log('param lastmove', lastMove);
  // dianogal ltr
  const topLeft = findTopLeft(currentRow, currentCol);

  let ltrRow = topLeft.row;
  let ltrCol = topLeft.col;
  let strLtr = '';

  while (ltrRow <= GAMEBOARD_ROW - 1 && ltrCol <= GAMEBOARD_COLUMN - 1) {
    strLtr = strLtr + squares[ltrRow * GAMEBOARD_ROW + ltrCol];

    ltrRow++;
    ltrCol++;
  }


  console.log(`ltr str: ${strLtr}`);
  const ltrWinner = xoWinner(strLtr);

  if (ltrWinner) {
    console.log('ltr winner', ltrWinner);
    return {
      winner: ltrWinner.winner,
      type: 'ltr'
    }
  }
  
  // dianogal rtl
  const topRight = findTopRight(currentRow, currentCol);
  console.log('top right', topRight, lastMove, currentRow, currentCol);

  let rtlRow = topRight.row;
  let rtlCol = topRight.col;
  let strRtl = '';

  while (rtlRow < GAMEBOARD_ROW - 1 && rtlCol >= 0) {
    strRtl = strRtl + squares[rtlRow  * GAMEBOARD_ROW + rtlCol];

    rtlRow++;
    rtlCol--;
  }

  console.log(`rtl str: ${strRtl}`);

  const rtlWinner = xoWinner(strRtl);

  if (rtlWinner) {
    console.log('rtlWinner', rtlWinner);
    return {
      winner: rtlWinner.winner,
      type: 'rtl'
    }
  }
    

	return null;
}

function calculateWinner(squares, lastMove) {
  const winnerH = winnerHorizontal(squares);

  if (winnerH) return winnerH;

  const winnerV = winnerVertical(squares);
  if (winnerV) return winnerV;
  
  const winnerD = winnerDianogal(squares, lastMove);
  if (winnerD) return winnerD;

  return null;
}

export default Game;
