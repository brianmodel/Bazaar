import React from "react";
import Select from "react-select";

import "FilterRow.sass";

export default class FilterRow extends React.Component {
  constructor(props) {
    super(props);

    this.selectColumn = React.createRef();
    this.selectCondition = React.createRef();
    this.selectValue = React.createRef();
  }

  getInputs = () => {
    const values = this.selectValue.current.value.split(",");

    return {
      column: this.selectColumn.current.state.value,
      condition: this.selectCondition.current.value,
      values
    };
  };
  clearValues = () => {
    this.selectColumn.current.select.clearValue();
    this.selectCondition.current.value = undefined;
    this.selectValue.current.value = "";
  };

  handleDeleteClick = () => {
    this.props.deleteFilter(this.props.index);
  };

  render() {
    return (
      <div className="filter-box columns">
        <div className="column is-3">
          <h5>Column</h5>
          <Select
            name="outputs"
            options={this.props.filterColumns}
            classname="basic"
            classNamePrefix="select"
            onChange={this.handleChange}
            ref={this.selectColumn}
            placeholder="Type desired filter"
          />
        </div>
        <div className="column is-2">
          <h5>Is</h5>
          <div className="select">
            <select ref={this.selectCondition}>
              <option disabled value={0}>
                select condition
              </option>
              <option>=</option>
            </select>
          </div>
        </div>
        <div className="column is-3">
          <h5>Value</h5>
          <input
            type="text"
            className="input"
            placeholder="Enter value"
            ref={this.selectValue}
          />
        </div>
        <div className="close-filter-row column">
          <h2 onClick={this.handleDeleteClick}>×</h2>
        </div>
      </div>
    );
  }
}
