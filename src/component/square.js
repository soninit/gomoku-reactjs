import React from 'react';

class Square extends React.Component {
  render() {
    return (
      <button className="square" 
              style={{color:  this.props.isWinnerMove ? 'red' : 'black'}}
              data-row={this.props.row} data-column={this.props.column}
              onClick={this.props.onClick}>
        {this.props.value === 'x' ? 'X' : (this.props.value === 'o' ? 'O' : '')}
      </button>
    );
  }
}


export default Square;