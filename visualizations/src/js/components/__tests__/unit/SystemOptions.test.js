import React from "react";
import { shallow } from "enzyme";

import SystemOptions from "components/SystemOptions";

describe("System Options test", () => {
  const wrapper = shallow(<SystemOptions />);
  it("renders main div", () => {
    expect(wrapper.find("#systemOptions")).toBeDefined();
  });
  it("has 3 radio buttons", () => {
    expect(wrapper.find('input[type="radio"]')).toHaveLength(3);
  });
});
