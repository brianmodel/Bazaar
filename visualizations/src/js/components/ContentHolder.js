import React from "react";

import ChartHolder from "components/ChartHolder";
import PriceRange from "components/PriceRange";

import "ContentHolder.sass";

export default class ContentHolder extends React.Component {
  render() {
    return (
      <div id="contentHolder">
        <ChartHolder chart={<PriceRange />} />
      </div>
    );
  }
}
