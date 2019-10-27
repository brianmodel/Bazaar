import React from "react";
import { shallow } from "enzyme";

import NavBar from "components/NavBar";

describe("<NavBar />", () => {
  const wrapper = shallow(<NavBar />);
  it("logo exists", () => {
    expect(wrapper.exists("img")).toEqual(true);
  });
});
