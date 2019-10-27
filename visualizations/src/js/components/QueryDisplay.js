import React from "react";

import "QueryDisplay.sass";

const QueryDisplay = ({ deletePopup, sqlQuery }) => {
  return (
    <div id="sqlQueryHolder">
      <div id="sqlQuery">
        <h1>Query Preview</h1>
        <h2 onClick={deletePopup}>×</h2>
        <pre>{sqlQuery}</pre>
      </div>
    </div>
  );
};

export default QueryDisplay;
