import React from "react";

import SortButtons from "components/SortButtons";
import QueryDisplay from "components/QueryDisplay";

import "ResultsDisplay.sass";

export default class ResultsDisplay extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sortingData: {
        isAscending: undefined,
        column: undefined
      },
      columns: this.props.resultsData.outputs,
      data: this.props.resultsData.data,
      sqlQuery: this.props.resultsData.sqlQuery || "yeet",
      showQuery: false
    };
  }

  sortData = column => {
    let isAscending = true;
    if (this.state.sortingData.column === column) {
      isAscending = !this.state.sortingData.isAscending;
    }
    let data = this.state.data.slice();

    data.sort((a, b) => {
      const formattedA = this.formatColumnData(a, column);
      const formattedB = this.formatColumnData(b, column);
      const aCol = isAscending ? formattedA : formattedB;
      const bCol = isAscending ? formattedB : formattedA;
      if (aCol > bCol) {
        return 1;
      }
      if (aCol < bCol) {
        return -1;
      }
      return 0;
    });

    this.setState({
      data,
      sortingData: {
        isAscending,
        column
      }
    });
  };

  showPopup = () => {
    this.setState({
      showQuery: true
    });
  };

  deletePopup = () => {
    this.setState({
      showQuery: false
    });
  };

  formatColumnData = (datum, column) => {
    const [table, output] = column.split(":");
    if (table === "set") {
      return datum[output];
    } else {
      return datum["assortKey"][output];
    }
  };

  render() {
    const columns = this.state.columns || [];
    const data = this.state.data || [];
    return (
      <div id="resultsDisplay" className="content-div">
        <div className="result-options">
          <button
            className="button is-white view-query"
            onClick={this.showPopup}
          >
            View Query
          </button>
        </div>
        {this.state.showQuery ? (
          <QueryDisplay
            sqlQuery={this.state.sqlQuery}
            deletePopup={this.deletePopup}
          />
        ) : null}
        <div id="resultsHolder">
          <table className="table is-bordered">
            <thead>
              <tr>
                {columns.map(column => (
                  <th
                    key={column}
                    onClick={this.sortData.bind(this, column)}
                    className={
                      this.state.sortingData.column === column
                        ? "grey-header"
                        : "white-header"
                    }
                  >
                    <span className="output-name">{column}</span>{" "}
                    <SortButtons
                      sortingData={this.state.sortingData}
                      column={column}
                    />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map(datum => {
                return (
                  <tr key={datum.set_id}>
                    {columns.map((column, i) => (
                      <td
                        key={column}
                        className={
                          this.state.sortingData.column === column
                            ? "grey-column"
                            : "white-column"
                        }
                      >
                        {this.formatColumnData(datum, column)}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="columns">
          <div className="column record-count-holder">
            <h4>{data.length} Records Returned</h4>
          </div>
          <div className="column button-holder">
            <button
              id="newQuery"
              className="button is-clear is-medium"
              onClick={this.props.newQuery}
            >
              New Query
            </button>
          </div>
        </div>
      </div>
    );
  }
}
