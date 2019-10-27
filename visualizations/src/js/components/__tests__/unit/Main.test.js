import React from "react";
import { shallow } from "enzyme";

import Main from "components/Main";

import NavBar from "components/NavBar";
import PageHeader from "components/PageHeader";
import ContentHolder from "components/ContentHolder";

describe("App", () => {
  it("renders all child components", () => {
    const wrapper = shallow(<Main />);

    expect(wrapper.exists(NavBar)).toBeTruthy();
    expect(wrapper.exists(PageHeader)).toBeTruthy();
    expect(wrapper.exists(ContentHolder)).toBeTruthy();
  });

  it("testing setPageMode", () => {
    const wrapper = shallow(<Main />);

    wrapper.setState({
      pageMode: 1
    });
    const instance = wrapper.instance();

    instance.setPageMode(2);

    expect(wrapper.state().pageMode).toEqual(2);
  });
});
