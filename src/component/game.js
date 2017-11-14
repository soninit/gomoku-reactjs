import React from "react";
import Board from "./board";
import GameConfig from './gameconfig';

const DEFAULT_GAMEBOARD_ROW = 10;
const DEFAULT_GAMEBOARD_COLUMN = DEFAULT_GAMEBOARD_ROW;
const DEFAULT_STEP_WIN = 5;

class Game extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      history: [
        {
          squares: Array(DEFAULT_GAMEBOARD_COLUMN * DEFAULT_GAMEBOARD_ROW).fill('e')
        }
      ],
      moves: [],
      stepNumber: 0,
      xIsNext: true,
      currentSelected: -1,
			isOrderAsc: true,
      winnerMoves: null,
      boardMetrics: {row: DEFAULT_GAMEBOARD_ROW, col: DEFAULT_GAMEBOARD_COLUMN},
      stepToWin: DEFAULT_STEP_WIN
    };
  }

  handleClick(rowIdx, columnIdx) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice(0);
    const lastMove = this.state.moves[this.state.moves.length - 1];
    const boardMetrics = this.state.boardMetrics;
    const winner = calculateWinner( {row: boardMetrics.row, col: boardMetrics.col
      , stepToWin: this.state.stepToWin}, squares, lastMove);
    if (winner || squares[rowIdx * boardMetrics.row + columnIdx] !== "e") {
      return;
    }
    squares[rowIdx * boardMetrics.row + columnIdx] = this.state.xIsNext ? "x" : "o";
    this.setState({
      history: history.concat([
        {
          squares: squares
        }
      ]),
      moves: this.state.moves.concat(rowIdx * boardMetrics.row + columnIdx),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
			currentSelected: -1,
			winnerMoves: winner
    });
  }

  handleToggleOrder() {
    this.setState({ isOrderAsc: !this.state.isOrderAsc });
  }

  handleGameConfigChange(newBoardSize, newStepToWin) {
    this.setState({
      history: [
        {
          squares: Array(newBoardSize * newBoardSize).fill('e')
        }
      ],
      moves: [],
      stepNumber: 0,
      xIsNext: true,
      currentSelected: -1,
			isOrderAsc: true,
      winnerMoves: null,
      boardMetrics: {row: newBoardSize, col: newBoardSize},
      stepToWin: newStepToWin
    })
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
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
    const boardMetrics = this.state.boardMetrics;

    const winner = calculateWinner(
      {row: boardMetrics.row, col: boardMetrics.col
        , stepToWin: this.state.stepToWin}
      , current.squares, this.state.moves[this.state.moves.length - 1]);

    const moves = history.map((step, idx) => {
      let move;

      if (isOrderAsc) {
        move = idx;
      } else {
        move = history.length - idx - 1;
      }

      let desc;
      if (move) {
        const row = parseInt(historyMoves[move - 1] / boardMetrics.row, 10);
        const column = historyMoves[move - 1] % boardMetrics.col;
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
            rows={boardMetrics.row}
            columns={boardMetrics.col}
						squares={current.squares}
            winnerMoves={winner}
            stepToWin={this.state.stepToWin}
            onClick={(rowIdx, columnIdx) => this.handleClick(rowIdx, columnIdx)}
          />
        </div>
        <GameConfig boardSize={boardMetrics.row} stepToWin={this.state.stepToWin} onClick={(newBoardSize, newStepToWin) => {
          this.handleGameConfigChange(newBoardSize, newStepToWin)
        }}/>
        <div className="game-info">
          <button type="button" style={{marginBottom: '30px'}} onClick={() => this.handleToggleOrder()}>
            {this.state.isOrderAsc ? "Sort: Asc" : "Sort: Desc"}
          </button>
          <div>{status}</div>
          <ol className="no-style">{moves}</ol>
        </div>
      </div>
    );
  }
}

function xoWinner(str, stepToWin) {
  const regX = RegExp(`x{${stepToWin},${stepToWin}}`);
  const regO = RegExp(`o{${stepToWin},${stepToWin}}`);

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

function winnerHorizontal(gameConfig, squares) {
  for (let i = 0; i < gameConfig.row; i++) {
    const hStr = squares.slice(i * gameConfig.row, i * gameConfig.row + gameConfig.col).join('');
    const result = xoWinner(hStr, gameConfig.stepToWin);

    if (result) {
    console.log(gameConfig,i * gameConfig.row, i * gameConfig.row + gameConfig.col,  i, hStr, result);    
      return {
        winner: result.winner,
        type: 'h',
        fromRow: i,
        toRow: i,
        fromCol: result.index,
        toCol: result.index + gameConfig.stepToWin - 1
      };
    }
  }

  return null;
}

function winnerVertical(gameConfig, squares) {
  for (let c = 0; c < gameConfig.col; c++) {
    let vStr = "";
    for (let r = 0; r < gameConfig.row; r++) {
      vStr = vStr + squares[r * gameConfig.row + c];
    }
    const result = xoWinner(vStr, gameConfig.stepToWin);

    if (result) {
      return {
        winner: result.winner,
        type: 'v',
        fromRow: result.index,
        toRow: result.index + gameConfig.stepToWin - 1,
        fromCol: c,
        toCol: c
      };
    } else {
    }
  }

  return null;
}

function findTopLeft(gameConfig, rowIdx, colIdx) {
  if (rowIdx === colIdx) 
    return {row: 0, col: 0};
  else if (rowIdx < colIdx) {
    if (rowIdx === 0 || colIdx === 0)
      return {row: rowIdx, col: colIdx};
    return {row: 0, col: colIdx - rowIdx};
  } else { // rowIdx > colIdx
    if (rowIdx === 0 || colIdx === 0)
      return {row: rowIdx, col: colIdx};
    return {row: rowIdx - colIdx, col: 0};
  }
}

function findTopRight(gameConfig, rowIdx, colIdx) {
  if (rowIdx + colIdx === gameConfig.col - 1)
    return {row: 0, col: gameConfig.col - 1};
  else if (rowIdx + colIdx > gameConfig.col - 1) {
    if (colIdx === gameConfig.col - 1 || rowIdx === 0)
      return {row: rowIdx, col: colIdx};
    return {row: rowIdx - (gameConfig.col - 1 - colIdx), col: gameConfig.col - 1}
  } else {
    if (colIdx === gameConfig.col - 1 || rowIdx === 0)
      return {row: rowIdx, col: colIdx};
    return {row: 0, col: colIdx + rowIdx};
  }
}

function winnerDianogal(gameConfig, squares, lastMove) {
  if (!lastMove)
    return null;

  const currentRow = parseInt(lastMove / gameConfig.row, 10);
  const currentCol = lastMove % gameConfig.col;

  // dianogal ltr
  const topLeft = findTopLeft(gameConfig, currentRow, currentCol);

  let ltrRow = topLeft.row;
  let ltrCol = topLeft.col;
  let strLtr = '';

  while (ltrRow <= gameConfig.row - 1 && ltrCol <= gameConfig.col - 1) {
    strLtr = strLtr + squares[ltrRow * gameConfig.row + ltrCol];

    ltrRow++;
    ltrCol++;
  }

  const ltrWinner = xoWinner(strLtr, gameConfig.stepToWin);
  if (ltrWinner) {
    return {
      winner: ltrWinner.winner,
      type: 'ltr',
      rowFromPoint: topLeft.row + ltrWinner.index,
      colFromPoint: topLeft.col + ltrWinner.index
    }
  }
  
  // dianogal rtl
  const topRight = findTopRight(gameConfig, currentRow, currentCol);

  let rtlRow = topRight.row;
  let rtlCol = topRight.col;
  let strRtl = '';

  while (rtlRow <= gameConfig.row - 1 && rtlCol >= 0) {
    strRtl = strRtl + squares[rtlRow  * gameConfig.row + rtlCol];

    rtlRow++;
    rtlCol--;
  }

  const rtlWinner = xoWinner(strRtl, gameConfig.stepToWin);
  if (rtlWinner) {
    return {
      winner: rtlWinner.winner,
      type: 'rtl',
      rowFromPoint: topRight.row + rtlWinner.index,
      colFromPoint: topRight.col - rtlWinner.index
    }
  }
    

	return null;
}

function calculateWinner(gameConfig, squares, lastMove) {
  const winnerH = winnerHorizontal(gameConfig, squares);

  if (winnerH) return winnerH;

  const winnerV = winnerVertical(gameConfig, squares);
  if (winnerV) return winnerV;
  
  const winnerD = winnerDianogal(gameConfig, squares, lastMove);
  if (winnerD) return winnerD;

  return null;
}

export default Game;
