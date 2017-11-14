import React from "react";

class GameConfig extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			boardSize: this.props.boardSize,
			stepToWin: this.props.stepToWin
		}
	}

	onBoardSizeChange(e) {
		this.setState({boardSize: e.target.value});
	}

	onStepToWinChange(e) {
		this.setState({stepToWin: e.target.value});
	}

  render() {
    return (
        <div className="game-config">
        <label>BOARD SISE: </label><br/>
        <input type="number" value={this.state.boardSize} onChange={(e) => this.onBoardSizeChange(e) }/><br/>
        <label>MOVE TO WIN: </label><br/>
        <input type="number" value={this.state.stepToWin}  onChange={(e) => this.onStepToWinChange(e) } /><br/><br/>
        <input type="button" value="Change config" onClick={() => this.props.onClick(parseInt(this.state.boardSize, 10), parseInt(this.state.stepToWin, 10))}></input>
      </div>
    );
  }
}


export default GameConfig;