import React from "react";

import NavBar from "components/NavBar";
import PageHeader from "components/PageHeader";
import ContentHolder from "components/ContentHolder";

import "bulma/css/bulma.css";

export default class Main extends React.Component {
  render() {
    return (
      <div>
        <NavBar />
        <PageHeader
          title={"Visualizations"}
          subtext={"Charts on sales and predictive data."}
        />
        <ContentHolder />
      </div>
    );
  }
}
