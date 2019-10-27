import React from "react";
import { shallow, mount } from "enzyme";

import ResultsDisplay from "components/ResultsDisplay";

describe("<ResultsDisplay />", () => {
  const resultsData = {
    outputs: ["set:ishan", "set:is", "key:awesome"],
    data: [
      {
        set_id: 1,
        ishan: "yeet",
        is: 13,
        assortKey: {
          awesome: "yeet yeet"
        }
      },
      {
        set_id: 34,
        ishan: "gds",
        is: 324,
        assortKey: {
          awesome: "jgf"
        }
      },
      {
        set_id: 534,
        ishan: "kf",
        is: 326,
        assortKey: {
          awesome: "ytrewd"
        }
      },
      {
        set_id: 8659,
        ishan: "nvca",
        is: 73,
        assortKey: {
          awesome: "hnnf"
        }
      }
    ]
  };

  it("ResultsDisplay fills table", () => {
    const wrapper = shallow(
      <ResultsDisplay resultsData={Object.assign({}, resultsData)} />
    );

    wrapper.update();

    expect(wrapper.find("tr")).toHaveLength(5);
  });
  it("New Query button exists", () => {
    const wrapper = shallow(<ResultsDisplay resultsData={{}} />);

    expect(wrapper.exists("#resultsDisplay .button-holder button")).toBe(true);
  });
  it("Record count exists", () => {
    const wrapper = shallow(<ResultsDisplay resultsData={{}} />);

    expect(
      wrapper.exists("#resultsDisplay .record-count-holder h4")
    ).toBeTruthy();
  });

  it("Check show popup", () => {
    const wrapper = shallow(<ResultsDisplay resultsData={{}} />);

    expect(wrapper.state("showQuery")).toBeFalsy();
    wrapper
      .find("button")
      .first()
      .simulate("click");

    expect(wrapper.state("showQuery")).toBeTruthy();
  });

  it("delete popup", () => {
    const wrapper = mount(<ResultsDisplay resultsData={{}} />);
    const instance = wrapper.instance();
    wrapper.setState({
      showQuery: true
    });
    wrapper
      .find("h2")
      .first()
      .simulate("click");

    expect(wrapper.state("showQuery")).toBeFalsy();
  });

  it("Check sorting data", () => {
    const wrapper = shallow(
      <ResultsDisplay resultsData={Object.assign({}, resultsData)} />
    );

    const instance = wrapper.instance();

    instance.sortData("set:ishan");

    expect(wrapper.state("data")[0].set_id).toEqual(34);

    instance.sortData("set:ishan");

    expect(wrapper.state("data")[0].set_id).toEqual(1);
  });
});
