import React from "react";
import fetch from "node-fetch";

import endpoints from "endpoints.config";

import CanvasJSReact from "./canvasjs.react";
let CanvasJSChart = CanvasJSReact.CanvasJSChart;

export default class HaggleAnalysis extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      lowerDataPoints: [],
      higherDataPoints: []
    };

    this.chart = React.createRef();
  }

  componentDidMount = async () => {
    const analysisEndpoint = `${endpoints.queryEndpoint}analysis`;
    const response = await fetch(analysisEndpoint);
    const dataPoints = await response.json();

    const lowerDataPoints = [];
    const higherDataPoints = [];

    for (const [food, details] of Object.entries(dataPoints)) {
      lowerDataPoints.push({ label: food, y: details.haggle_score });
      higherDataPoints.push({ label: food, y: 100 - details.haggle_score });
    }

    this.setState({
      lowerDataPoints,
      higherDataPoints
    });
  };

  render() {
    const options = {
      title: {
        text: "Haggle Score",
        fontFamily: "geneva"
      },
      toolTip: {
        shared: true
      },
      legend: {
        verticalAlign: "top"
      },
      axisY: {
        suffix: "%"
      },
      data: [
        {
          type: "stackedBar100",
          color: "#F5847B",
          name: "Lower price",
          showInLegend: true,
          indexLabel: "{y}",
          indexLabelFontColor: "white",
          yValueFormatString: "#,###'%'",
          dataPoints: this.state.lowerDataPoints
        },
        {
          type: "stackedBar100",
          color: "#432430",
          name: "Raise price",
          showInLegend: true,
          indexLabel: "{y}%",
          indexLabelFontColor: "white",
          yValueFormatString: "#,###'%'",
          dataPoints: this.state.higherDataPoints
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
