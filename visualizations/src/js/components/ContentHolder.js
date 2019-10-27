import React from "react";

import ChartHolder from "components/ChartHolder";
import PriceRange from "components/PriceRange";
import HaggleAnalysis from "components/HaggleAnalysis";
import OrderChart from "components/OrderChart";

import "ContentHolder.sass";

export default class ContentHolder extends React.Component {
  render() {
    return (
      <div id="contentHolder">
        <ChartHolder chart={<OrderChart />} />
        <ChartHolder chart={<PriceRange />} />
        <ChartHolder chart={<HaggleAnalysis />} />
      </div>
    );
  }
}
