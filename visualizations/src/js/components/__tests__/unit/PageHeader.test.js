import React from "react";
import { shallow } from "enzyme";

import PageHeader from "components/PageHeader";

describe("<PageHeader />", () => {
  const wrapper = shallow(<PageHeader />);
  wrapper.setProps({
    title: "yeet"
  });
  it("title exists", () => {
    expect(
      wrapper
        .find("h2")
        .first()
        .text()
    ).toEqual("yeet");
  });
});
