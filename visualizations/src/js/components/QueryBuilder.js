import React from "react";
import { toast } from "react-toastify";
import axios from "axios";

import SystemOptions from "components/SystemOptions";
import SelectOutputs from "components/SelectOutputs";
import FilteredColumns from "components/FilteredColumns";

import "QueryBuilder.sass";

import endpoints from "endpoints.config";

export default class QueryBuilder extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      outputColumns: [
        { value: "set:set_id", label: "set id" },
        { value: "set:set_name", label: "set name" },
        { value: "set:created_date", label: "set: created date" },
        { value: "set:created_by", label: "set: created by" },
        { value: "set:modified_date", label: "set: modified date" },
        { value: "set:modified_by", label: "set: modified by" },
        { value: "set:key_id", label: "key id" },
        { value: "key:key_name", label: "key name" },
        { value: "key:class_id", label: "class id" },
        { value: "key:department_id", label: "department" },
        { value: "key:created_by", label: "key: created by" },
        { value: "key:created_date", label: "key: created date" },
        { value: "key:modified_by", label: "key: modified by" },
        { value: "key:modified_date", label: "key: modified date" }
      ],
      filterColumns: [
        { value: "set_id", label: "set id" },
        { value: "set_name", label: "set name" },
        { value: "created_by", label: "created by" },
        { value: "modified_by", label: "modified by" },
        { value: "key_id", label: "key id" }
      ],
      selectedOutputs: new Set()
    };

    this.filteredColumns = React.createRef();
  }

  addSelectedOutput = output => {
    let selectedOutputs = new Set(this.state.selectedOutputs);
    selectedOutputs.add(output);
    this.setState({
      selectedOutputs
    });
  };
  removeSelectedOutput = output => {
    let selectedOutputs = new Set(this.state.selectedOutputs);
    selectedOutputs.delete(output);
    this.setState({
      selectedOutputs
    });
  };

  isQueryValid = filterInputs => {
    let valid = true;
    filterInputs.forEach(filterInput => {
      if (!filterInput.column) {
        valid = false;
      }
      if (!filterInput.condition) {
        valid = false;
      }
      filterInput.values.forEach(value => {
        if (!value && value !== 0) {
          valid = false;
        }
      });
    });
    return valid;
  };

  runQuery = () => {
    const filterInputs = this.filteredColumns.current.getFilterRowInputs();
    if (!this.isQueryValid(filterInputs)) {
      toast.error(
        "Please provide at least one input and one output in order to proceed with the query."
      );
    } else {
      const filters = filterInputs.map(filterInput => {
        return {
          column: filterInput.column.value,
          values: filterInput.values
        };
      });
      const outputs = [...this.state.selectedOutputs].map(
        output => output.value
      );

      axios.post(endpoints.queryEndpoint, { outputs, filters }).then(res => {
        this.props.displayResults(res.data);
      });
    }
  };

  render() {
    return (
      <div id="queryBuilder" className="content-div">
        <SystemOptions />
        <SelectOutputs
          outputColumns={this.state.outputColumns}
          selectedOutputs={this.state.selectedOutputs}
          addSelectedOutput={this.addSelectedOutput}
          removeSelectedOutput={this.removeSelectedOutput}
        />
        <FilteredColumns
          filterColumns={this.state.filterColumns}
          ref={this.filteredColumns}
        />

        <div className="columns query-builder-footer">
          <div className="column is-11 is-offset-1 button-holder">
            <button
              id="runQuery"
              className="button is-clear is-medium"
              onClick={this.runQuery}
              disabled={!this.state.selectedOutputs.size}
            >
              Run Query
            </button>
          </div>
        </div>
      </div>
    );
  }
}
