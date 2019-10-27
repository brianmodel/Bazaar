import React from "react";
import fetch from "node-fetch";

import endpoints from "endpoints.config";

import CanvasJSReact from "./canvasjs.react";
const CanvasJS = CanvasJSReact.CanvasJS;
const CanvasJSChart = CanvasJSReact.CanvasJSChart;

export default class ChartHolder extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dataPoints: []
    };
    CanvasJS.addColorSet("niceColors", [
      "#C8A1D6",
      "#B096C8",
      "#9A8CB9",
      "#8481AA",
      "#70769A",
      "#5E6A8A",
      "#4D5F7A",
      "#3D546A",
      "#2F485A",
      "#233D4A",
      "#18313B",
      "#0F262D"
    ]);

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
      colorSet: "niceColors",
      exportEnabled: true,
      animationEnabled: true,
      title: {
        text: "Range of Barter Prices",
        fontFamily: "geneva"
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
