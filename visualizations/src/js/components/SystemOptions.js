import React from "react";

import "SystemOptions.sass";

const SystemOptions = () => {
  return (
    <div id="systemOptions" className="step-section">
      <div className="columns">
        <div className="column is-1 number-item-holder">
          <h2 className="number-item">1</h2>
        </div>
        <div className="column is-11">
          <h2 className="option-header">System</h2>
          <h4 className="header-text">
            Choose the system you would like to query.
          </h4>
          <div className="control">
            <label className="radio">
              <input
                type="radio"
                name="systemOption"
                value="AMT 2.0"
                disabled
              />{" "}
              <span>AMT 2.0</span>
            </label>
            <label className="radio">
              <input
                type="radio"
                name="systemOption"
                value="myAssortment"
                defaultChecked
              />{" "}
              <span>myAssortment</span>
            </label>
            <label className="radio">
              <input
                type="radio"
                name="systemOption"
                value="Base Tables"
                disabled
              />{" "}
              <span>Base Tables</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemOptions;
