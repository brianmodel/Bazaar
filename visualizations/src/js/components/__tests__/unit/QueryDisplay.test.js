import React from "react";
import { shallow } from "enzyme";

import QueryDisplay from "components/QueryDisplay";

describe("<QueryDisplay />", () => {
  const wrapper = shallow(<QueryDisplay />);
  it("logo exists", () => {
    expect(wrapper.exists("#sqlQueryHolder")).toEqual(true);
  });
});
