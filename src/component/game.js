import React from "react";
import Board from "./board";

const GAMEBOARD_ROW = 10;
const GAMEBOARD_COLUMN = 10;
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
			winnerMoves: null
    };
  }

  handleClick(rowIdx, columnIdx) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice(0);
    const winner = calculateWinner(squares);
    console.log('stop condition', winner, squares[rowIdx * GAMEBOARD_ROW + columnIdx]);
    if (winner || squares[rowIdx * GAMEBOARD_ROW + columnIdx] !== "e") {
      console.log('should stop');
      return;
    }
    console.log('handleClick', squares);
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

    const winner = calculateWinner(current.squares);

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

function winnerDianogal(square) {
	// TODO: implemented
	return null;
}

function calculateWinner(squares) {
  const winnerH = winnerHorizontal(squares);

  if (winnerH) return winnerH;

  const winnerV = winnerVertical(squares);
  if (winnerV) return winnerV;

  return null;
}

export default Game;
