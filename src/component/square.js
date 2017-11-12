import React from 'react';

class Square extends React.Component {
  render() {
    return (
      <button className="square" data-row={this.props.row} data-column={this.props.column}
                 onClick={this.props.onClick}>
        {this.props.value}
      </button>
    );
  }
}


export default Square;