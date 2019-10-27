import React from "react";

import "SelectedChips.sass";

export default class SelectedChips extends React.Component {
  handleDelete = () => {
    this.props.deleteChip(this.props.output);
  };

  render() {
    return (
      <h5 className="selected-chips">
        <span className="chip-column">{this.props.output.value} </span>
        <span className="close-chip" onClick={this.handleDelete}>
          ✗
        </span>
      </h5>
    );
  }
}
