import React from "react";
import Board from "./board";

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
        squares[r][t] = "e";
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
      xIsNext: true,
      currentSelected: -1,
			isOrderAsc: true,
			winnerMoves: null
    };
  }

  handleClick(rowIdx, columnIdx) {
    const history = JSON.parse(
      JSON.stringify(this.state.history.slice(0, this.state.stepNumber + 1))
    );
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const winner = calculateWinner(squares);
    if (winner || squares[rowIdx][columnIdx] !== "e") {
      console.log(winner);
      return;
    }
    squares[rowIdx][columnIdx] = this.state.xIsNext ? "x" : "o";
    this.setState({
      history: history.concat([
        {
          squares: squares
        }
      ]),
      moves: this.state.moves.concat({
        row: rowIdx,
        col: columnIdx
      }),
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
    console.log(step, this.state.stepNumber, this.state.history);

    this.setState({
      stepNumber: step,
      xIsNext: step % 2 !== 0,
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
        const row = historyMoves[move - 1].row;
        const column = historyMoves[move - 1].col;
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
  for (let i = 0; i < squares.length; i++) {
    const hStr = squares[i].join("");
    const result = xoWinner(hStr);

    if (result) {
      return {
        winner: result.winner,
        fromRow: i,
        toRow: i,
        fromCol: result.index,
        toCol: result.index + STEP_WIN
      };
    }
  }

  return null;
}

function winnerVertical(squares) {
  for (let c = 0; c < squares[0].length; c++) {
    let vStr = "";
    for (let r = 0; r < squares.length; r++) {
      vStr = vStr + squares[r][c];
    }

    const result = xoWinner(vStr);

    if (result) {
      return {
        winner: result.winner,
        fromRow: result.index,
        toRow: result.index + STEP_WIN,
        fromCol: c,
        toCol: c
      };
    } else {
    }
  }

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
