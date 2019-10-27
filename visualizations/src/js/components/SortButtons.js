import React from "react";

import "SortButtons.sass";

const sortingModes = Object.freeze({
  SHOW_ALL: 0,
  ASCENDING: 1,
  DESCENDING: 2
});

const SortButtons = ({ sortingData, column }) => {
  let sortingMode = sortingModes.SHOW_ALL;
  if (sortingData.column === column) {
    sortingMode = sortingData.isAscending
      ? sortingModes.ASCENDING
      : sortingModes.DESCENDING;
  }
  return (
    <div className="sort-arrow-holder">
      {sortingMode === sortingModes.DESCENDING ? null : <h6>▲</h6>}
      {sortingMode === sortingModes.ASCENDING ? null : <h6>▼</h6>}
    </div>
  );
};

export default SortButtons;
