import React from "react";
import nanoid from "nanoid";
import { shallow, mount } from "enzyme";

import FilteredColumns from "components/FilteredColumns";
import FilteredRow from "components/FilterRow";

describe("Filtered Columns test", () => {
  it("renders main div", () => {
    const wrapper = shallow(<FilteredColumns />);
    expect(wrapper.find("#filteredColumns")).toBeDefined();
  });
  it("renders filter rows", () => {
    const wrapper = shallow(<FilteredColumns />);
    wrapper.setState({
      filterRows: [
        { ref: React.createRef(), key: nanoid(5) },
        { ref: React.createRef(), key: nanoid(5) },
        { ref: React.createRef(), key: nanoid(5) }
      ]
    });
    expect(wrapper.find(FilteredRow)).toHaveLength(3);
  });
  it("add filter row", () => {
    const wrapper = mount(<FilteredColumns />);
    wrapper.setState({
      filterRows: [
        { ref: React.createRef(), key: nanoid(5) },
        { ref: React.createRef(), key: nanoid(5) }
      ]
    });

    expect(wrapper.find(FilteredRow)).toHaveLength(2);

    const addButton = wrapper.find("button.plus-button").last();

    addButton.simulate("click");

    expect(wrapper.find(FilteredRow)).toHaveLength(3);
  });
  it("delete filter row", () => {
    const wrapper = mount(<FilteredColumns />);
    wrapper.setState({
      filterRows: [
        { ref: React.createRef(), key: nanoid(5) },
        { ref: React.createRef(), key: nanoid(5) }
      ]
    });

    expect(wrapper.find(FilteredRow)).toHaveLength(2);

    const filterRowLast = wrapper.find(FilteredRow).last();
    filterRowLast
      .find(".close-filter-row h2")
      .first()
      .simulate("click");

    expect(wrapper.find(FilteredRow)).toHaveLength(1);
  });
  it("clear filter row", () => {
    const wrapper = mount(<FilteredColumns />);
    wrapper.setState({
      filterRows: [{ ref: React.createRef(), key: nanoid(5) }]
    });
    expect(wrapper.find(FilteredRow)).toHaveLength(1);

    const filterRowLast = wrapper.find(FilteredRow).last();
    filterRowLast
      .find(".close-filter-row h2")
      .first()
      .simulate("click");

    expect(wrapper.find(FilteredRow)).toHaveLength(1);
  });

  it("check values from filter rows", () => {
    const wrapper = mount(<FilteredColumns />);
    const instance = wrapper.instance();

    const inputs = instance.getFilterRowInputs();

    expect(inputs).toHaveLength(1);

    expect("column" in inputs[0]).toBeTruthy();
    expect("condition" in inputs[0]).toBeTruthy();
    expect("values" in inputs[0]).toBeTruthy();
  });
});
