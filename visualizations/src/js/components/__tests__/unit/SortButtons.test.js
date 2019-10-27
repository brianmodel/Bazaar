import React from "react";
import { shallow } from "enzyme";

import SortButtons from "components/SortButtons";

describe("SortButtons test", () => {
  it("renders main div", () => {
    const wrapper = shallow(
      <SortButtons
        column="key_id"
        sortingData={{
          column: "set_id"
        }}
      />
    );
    expect(wrapper.find("#sortArrowHolder")).toBeDefined();
  });
  it("Testing Arrows", () => {
    const wrapper = shallow(
      <SortButtons
        column="key_id"
        sortingData={{
          column: "set_id"
        }}
      />
    );

    wrapper.update();

    expect(wrapper.find("h6")).toHaveLength(2);
  });

  it("Disappear on ascending", () => {
    const wrapper = shallow(
      <SortButtons
        column="key_id"
        sortingData={{
          column: "key_id",
          isAscending: true
        }}
      />
    );

    wrapper.update();

    expect(wrapper.find("h6")).toHaveLength(1);
  });

  it("Disappear on descending", () => {
    const wrapper = shallow(
      <SortButtons
        column="key_id"
        sortingData={{
          column: "key_id",
          isAscending: false
        }}
      />
    );

    wrapper.update();

    expect(wrapper.find("h6")).toHaveLength(1);
  });
});
