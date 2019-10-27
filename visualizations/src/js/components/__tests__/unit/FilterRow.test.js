import React from "react";
import { shallow, mount } from "enzyme";

import FilterRow from "components/FilterRow";

describe("Filter Row test", () => {
  it("renders main div", () => {
    const wrapper = shallow(<FilterRow />);
    expect(wrapper.find("#filteredColumns")).toBeDefined();
  });
  it("has 1 text input", () => {
    const wrapper = shallow(<FilterRow />);
    expect(wrapper.find('input[type="text"]')).toHaveLength(1);
  });
  it("has 1 select dropdown", () => {
    const wrapper = shallow(<FilterRow />);
    expect(wrapper.find("select")).toHaveLength(1);
  });

  it("check initial inputs", () => {
    const wrapper = mount(<FilterRow />);

    const instance = wrapper.instance();
    const rowInputs = instance.getInputs();

    expect(rowInputs.column).toBeNull();
    expect(rowInputs.condition).toEqual("=");
    expect(rowInputs.values).toEqual([""]);
  });
});
