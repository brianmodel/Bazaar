import React from "react";
import { shallow, mount } from "enzyme";

import SelectOutputs from "components/SelectOutputs";
import SelectedChips from "components/SelectedChips";

describe("Select Outputs test", () => {
  it("renders main div", () => {
    const wrapper = shallow(<SelectOutputs selectedOutputs={new Set()} />);
    wrapper.update();
    expect(wrapper.find("#selectOutputs")).toBeDefined();
  });

  it("simulate adding output", () => {
    const wrapper = mount(<SelectOutputs selectedOutputs={new Set()} />);
    const instance = wrapper.instance();

    const selectedOutputs = new Set([
      { value: "STR_NBR", label: "store number" }
    ]);
    wrapper.setState({
      selectedOutput: { value: "LAST_UPD_TS", label: "last upate ts" }
    });
    wrapper.setProps({
      selectedOutputs,
      addSelectedOutput: output => {
        selectedOutputs.add(output);
      }
    });

    expect([...wrapper.props().selectedOutputs]).toHaveLength(1);

    instance.addOutput();

    expect([...wrapper.props().selectedOutputs]).toHaveLength(2);
  });

  it("simulate adding output with no change", () => {
    const wrapper = mount(<SelectOutputs selectedOutputs={new Set()} />);
    const instance = wrapper.instance();

    const selectedOutputs = new Set([
      { value: "STR_NBR", label: "store number" }
    ]);
    wrapper.setProps({
      selectedOutputs,
      addSelectedOutput: output => {
        selectedOutputs.add(output);
      }
    });

    expect([...wrapper.props().selectedOutputs]).toHaveLength(1);

    instance.addOutput();

    expect([...wrapper.props().selectedOutputs]).toHaveLength(1);
  });

  it("simulate selecting option", () => {
    const wrapper = mount(<SelectOutputs selectedOutputs={new Set()} />);
    const instance = wrapper.instance();

    instance.selectInput.current.select.selectOption("set_id");

    expect(wrapper.state("selectedOutput")).toEqual("set_id");
  });

  it("simulate deleting output", () => {
    const wrapper = mount(<SelectOutputs selectedOutputs={new Set()} />);
    const instance = wrapper.instance();

    const deletingObj = { value: "LAST_UPD_TS", label: "last upate ts" };
    const selectedOutputs = new Set([
      { value: "STR_NBR", label: "store number" },
      deletingObj
    ]);

    wrapper.setProps({
      selectedOutputs,
      removeSelectedOutput: output => selectedOutputs.delete(output)
    });

    expect([...wrapper.props().selectedOutputs]).toHaveLength(2);

    instance.deleteChip(deletingObj);

    expect([...wrapper.props().selectedOutputs]).toHaveLength(1);
  });
});
