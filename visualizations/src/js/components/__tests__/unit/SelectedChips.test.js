import React from "react";
import { shallow } from "enzyme";

import SelectedChips from "components/SelectedChips";

describe("Selected Chips", () => {
  it("fills in with appropriate data", () => {
    const wrapper = shallow(
      <SelectedChips
        output={{
          value: "STR_NBR",
          label: "yeet"
        }}
      />
    );
    expect(wrapper.text()).toEqual("STR_NBR ✗");
  });

  it("test delete chip called", () => {
    const wrapper = shallow(
      <SelectedChips
        output={{
          value: "STR_NBR",
          label: "yeet"
        }}
      />
    );

    const mockDeleteChip = jest.fn();

    wrapper.setProps({
      deleteChip: mockDeleteChip
    });

    wrapper
      .find("span")
      .last()
      .simulate("click");

    expect(mockDeleteChip).toHaveBeenCalled();
  });
});
