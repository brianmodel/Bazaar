import React from "react";
import nanoid from "nanoid";

import FilterRow from "components/FilterRow";

import "FilterRow.sass";

export default class FilteredColumns extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      filterRows: [{ ref: React.createRef(), key: nanoid(5) }]
    };
  }

  addFilter = () => {
    const filterRows = this.state.filterRows.slice();
    filterRows.push({ ref: React.createRef(), key: nanoid(5) });
    this.setState({ filterRows });
  };
  deleteFilter = index => {
    const filterRows = this.state.filterRows.slice();

    if (filterRows.length <= 1) {
      filterRows[0].ref.current.clearValues();
    } else {
      filterRows.splice(index, 1);
      this.setState({ filterRows });
    }
  };

  getFilterRowInputs = () => {
    const inputs = [];
    this.state.filterRows.forEach(filterRow =>
      inputs.push(filterRow.ref.current.getInputs())
    );

    return inputs;
  };

  render() {
    const filterRows = this.state.filterRows;
    return (
      <div id="filteredColumns" className="step-section">
        <div className="columns">
          <div className="column is-1 number-item-holder">
            <h2 className="number-item">3</h2>
          </div>
          <div className="column is-11">
            <h2 className="option-header">WHERE</h2>
            <h4 className="header-text">
              Select the specific parameters for your query below.
            </h4>
            {filterRows.map((filterRow, i) => {
              return (
                <FilterRow
                  filterColumns={this.props.filterColumns}
                  ref={filterRow.ref}
                  index={i}
                  key={filterRow.key}
                  deleteFilter={this.deleteFilter}
                />
              );
            })}
            <button
              className="button is-white plus-button"
              onClick={this.addFilter}
            >
              <span>+</span> Add Filter
            </button>
          </div>
        </div>
      </div>
    );
  }
}
