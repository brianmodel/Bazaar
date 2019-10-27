import React from "react";

import ReactTable from "react-table";
import "react-table/react-table.css";

import endpoints from "endpoints.config";

export default class ContentHolder extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      columns: [
        {
          Header: "ID",
          accessor: "id" // String-based value accessors!
        },
        {
          Header: "Date Created",
          accessor: "dateCreated",
          Cell: props => <span className="number">{props.value}</span> // Custom cell components!
        },
        {
          Header: "Customer Name",
          accessor: "customerName" // Custom value accessors!
        },
        {
          Header: "Amount Paid", // Custom header components!
          accessor: "amountPaid"
        },
        {
          Header: "Item",
          accessor: "item"
        }
      ]
    };
  }

  componentDidMount = async () => {
    const rangesEndpoint = `${endpoints.queryEndpoint}orders`;
    const response = await fetch(rangesEndpoint);
    const data = await response.json();

    console.log(data);

    this.setState({
      data
    });
  };

  render() {
    return (
      <div>
        <ReactTable
          data={this.state.data}
          columns={this.state.columns}
          defaultPageSize={5}
        ></ReactTable>
      </div>
    );
  }
}
