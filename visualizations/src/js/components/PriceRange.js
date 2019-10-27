import React from "react";
import fetch from "node-fetch";

import endpoints from "endpoints.config";

import CanvasJSReact from "./canvasjs.react";
let CanvasJSChart = CanvasJSReact.CanvasJSChart;

export default class ChartHolder extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dataPoints: []
    };

    this.chart = React.createRef();
  }

  componentDidMount = async () => {
    const rangesEndpoint = `${endpoints.queryEndpoint}ranges`;
    const response = await fetch(rangesEndpoint);
    const dataPoints = await response.json();

    this.setState({
      dataPoints
    });
  };

  render() {
    const options = {
      theme: "light1",
      exportEnabled: true,
      animationEnabled: true,
      title: {
        text: "Range of Barter Prices"
      },
      axisX: {
        title: "Food"
      },
      axisY: {
        title: "Price ($)",
        suffix: "$"
      },
      data: [
        {
          type: "rangeColumn",
          indexLabel: "{y[#index]}$",
          toolTipContent:
            "<strong>{x}</strong></br> Max: {y[1]}$<br/> Min: {y[0]}$",
          dataPoints: this.state.dataPoints
        }
      ]
    };
    return (
      <div>
        <CanvasJSChart options={options} ref={this.chart} />
      </div>
    );
  }
}
