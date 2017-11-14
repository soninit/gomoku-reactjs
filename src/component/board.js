import React from 'react';
import Square from './square';

class Board extends React.Component {

	renderBoard() {
		var rowEles = [];
		for (let rowIdx = 0; rowIdx < this.props.rows; rowIdx++) {
			rowEles.push(this.renderRows(rowIdx));
		}

		return rowEles;
	}

	renderRows(rowIdx) {
		var colEles = [];
		for (let columnIdx = 0; columnIdx < this.props.columns; columnIdx++) {
			colEles.push(this.renderSquare(rowIdx, columnIdx));
		}

		return <div className="board-row" row-id={rowIdx}>{colEles}</div>;
	}

	checkWinnerSquare(winnerMoves, rowIdx, columnIdx) {
		if (winnerMoves && (winnerMoves.type === 'v' || winnerMoves.type === 'h')) {
			return winnerMoves && rowIdx <= winnerMoves.toRow && rowIdx >= winnerMoves.fromRow 
			&& columnIdx <= winnerMoves.toCol && columnIdx >= winnerMoves.fromCol;
		} else if (winnerMoves && winnerMoves.type === 'ltr') {
			for (let i = 0; i < this.props.stepToWin; i++) {
				if (rowIdx === winnerMoves.rowFromPoint + i && columnIdx === winnerMoves.colFromPoint + i)
					return true;
			}
		} else if (winnerMoves && winnerMoves.type === 'rtl') {
			for (let i = 0; i < this.props.stepToWin; i++) {
				if (rowIdx === winnerMoves.rowFromPoint + i && columnIdx === winnerMoves.colFromPoint - i)
					return true;
			}
		}

		return false;
	}

  renderSquare(rowIdx, columnIdx) {
		const winnerMoves = this.props.winnerMoves;
		let isWinnerMove = this.checkWinnerSquare(winnerMoves, rowIdx, columnIdx);

    return <Square row={rowIdx} column={columnIdx} 
			isWinnerMove={isWinnerMove}
			value={this.props.squares[rowIdx * this.props.rows + columnIdx]}
			onClick={() => this.props.onClick(rowIdx, columnIdx)}/>;
  }

  render() {
		const board = this.renderBoard();

    return (
      <div>
				{board}
      </div>
    );
  }
}


export default Board;