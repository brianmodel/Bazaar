import React from "react";

export default class ChartHolder extends React.Component {
  render() {
    return <div className="content-div">{this.props.chart}</div>;
  }
}
