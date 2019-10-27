import React from "react";
import Select from "react-select";

import SelectedChips from "components/SelectedChips";

import "SelectOutputs.sass";

export default class SelectOutputs extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedOutput: undefined
    };

    this.selectInput = React.createRef();
  }

  handleChange = (value, selectBar) => {
    if (selectBar.action === "select-option") {
      this.setState({
        selectedOutput: value
      });
    }
  };

  addOutput = () => {
    if (this.state.selectedOutput) {
      this.props.addSelectedOutput(this.state.selectedOutput);
      this.selectInput.current.select.clearValue();
    }
  };
  deleteChip = output => {
    this.props.removeSelectedOutput(output);
  };

  render() {
    return (
      <div id="selectOutputs" className="step-section">
        <div className="columns">
          <div className="column is-1 number-item-holder">
            <h2 className="number-item">2</h2>
          </div>
          <div className="column is-11">
            <h2 className="option-header">SELECT</h2>
            <h4 className="header-text">
              Select the specific outputs for your query below.
            </h4>
            <h5 className="section-title">Output</h5>
            <div className="columns">
              <div className="column is-4">
                <Select
                  name="outputs"
                  options={this.props.outputColumns}
                  classname="basic"
                  classNamePrefix="select-options"
                  onChange={this.handleChange}
                  ref={this.selectInput}
                  placeholder="Type desired output"
                />
              </div>
              <div className="column">
                <button
                  className="button is-white plus-button"
                  onClick={this.addOutput}
                >
                  <span>+</span> Add Output
                </button>
              </div>
            </div>
            <div className="selected-chips-holder">
              {[...this.props.selectedOutputs].map(selectedOutput => (
                <SelectedChips
                  output={selectedOutput}
                  key={selectedOutput.value}
                  deleteChip={this.deleteChip}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
