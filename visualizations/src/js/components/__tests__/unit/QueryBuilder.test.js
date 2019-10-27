import React from "react";
import { shallow, mount } from "enzyme";

import QueryBuilder from "components/QueryBuilder";

import { toast } from "react-toastify";
import axios from "axios";

describe("Query Builder test", () => {
  it("renders main div", () => {
    const wrapper = shallow(<QueryBuilder />);
    expect(wrapper.find("#queryBuilder")).toBeDefined();
  });

  it("renders run query button", () => {
    const wrapper = shallow(<QueryBuilder />);

    expect(wrapper.exists("#runQuery")).toEqual(true);
    expect(
      wrapper
        .find("#runQuery")
        .last()
        .props()["disabled"]
    ).toBe(true);
  });

  it("button becomes enabled when exists selectedOutputs", () => {
    const wrapper = shallow(<QueryBuilder />);
    wrapper.setState({
      selectedOutputs: new Set([{ value: "set_id", label: "set id" }])
    });

    wrapper.update();

    const runQueryButton = wrapper.find("#runQuery").last();

    expect(runQueryButton.props()["disabled"]).toBe(false);
  });

  it("check if toast appears", () => {
    const wrapper = mount(<QueryBuilder />);
    const instance = wrapper.instance();

    const toastErrorMock = jest.spyOn(toast, "error");

    instance.runQuery();

    expect(toastErrorMock).toHaveBeenCalled();
  });

  it("mock axios send", () => {
    const wrapper = mount(<QueryBuilder />);
    const instance = wrapper.instance();

    instance.isQueryValid = jest.fn(() => true);
    instance.filteredColumns.current.getFilterRowInputs = jest.fn(() => [
      {
        column: "yeet",
        values: [1, 2, 3, 4, 5]
      }
    ]);

    const axiosPostMock = jest.spyOn(axios, "post");

    wrapper.setState({
      selectedOutputs: new Set([{ value: "set_id", label: "set id" }])
    });

    instance.runQuery();

    expect(axiosPostMock).toHaveBeenCalled();
  });

  it("test remove selectedOutput", () => {
    const wrapper = shallow(<QueryBuilder />);
    const instance = wrapper.instance();

    const setIdObj = { value: "set_id", label: "set id" };

    wrapper.setState({
      selectedOutputs: new Set([setIdObj, { value: "yeet", label: "yaah" }])
    });

    instance.removeSelectedOutput(setIdObj);

    expect([...wrapper.state().selectedOutputs]).toHaveLength(1);
  });

  it("test add selectedOutput", () => {
    const wrapper = shallow(<QueryBuilder />);
    const instance = wrapper.instance();

    const setIdObj = { value: "set_id", label: "set id" };

    wrapper.setState({
      selectedOutputs: new Set([{ value: "yeet", label: "yaah" }])
    });

    instance.addSelectedOutput(setIdObj);

    expect([...wrapper.state().selectedOutputs]).toHaveLength(2);
  });

  it("check query valid is false", () => {
    const wrapper = shallow(<QueryBuilder />);
    const instance = wrapper.instance();

    const filterInputs = [
      {
        column: "yeet",
        condition: false,
        values: [1, 2, 3, 4]
      }
    ];

    expect(instance.isQueryValid(filterInputs)).toBeFalsy();
  });
});
