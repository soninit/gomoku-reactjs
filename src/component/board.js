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

  renderSquare(rowIdx, columnIdx) {
    return <Square row={rowIdx} column={columnIdx} onClick={() => this.props.onClick(rowIdx, columnIdx)}/>;
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