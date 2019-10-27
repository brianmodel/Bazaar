import React from "react";
import { shallow } from "enzyme";

import ContentHolder from "components/ContentHolder";
import QueryBuilder from "components/QueryBuilder";
import ResultsDisplay from "components/ResultsDisplay";

describe("<ContentHolder />", () => {
  it("Query builder exists on mode 1", () => {
    const wrapper = shallow(
      <ContentHolder pageMode={1} modes={{ DISPLAYING: 2 }} />
    );
    wrapper.setState({
      resultsData: {
        outputs: ["ishan", "is", "awesome"],
        data: [
          {
            ishan: 1,
            is: 2,
            awesome: 3
          },
          {
            ishan: 3,
            is: 32,
            awesome: 7643
          },
          {
            ishan: 523,
            is: 764,
            awesome: 145
          },
          {
            ishan: 5432,
            is: 879,
            awesome: 5432
          }
        ]
      }
    });

    wrapper.update();

    expect(wrapper.exists(QueryBuilder)).toBe(true);
  });

  it("ResultsDisplay exists on mode 2 ", () => {
    const wrapper = shallow(
      <ContentHolder pageMode={1} modes={{ DISPLAYING: 1 }} />
    );
    wrapper.setState({
      resultsData: {
        outputs: ["ishan", "is", "awesome"],
        data: [
          {
            ishan: 1,
            is: 2,
            awesome: 3
          },
          {
            ishan: 3,
            is: 32,
            awesome: 7643
          },
          {
            ishan: 523,
            is: 764,
            awesome: 145
          },
          {
            ishan: 5432,
            is: 879,
            awesome: 5432
          }
        ]
      }
    });

    wrapper.update();

    expect(wrapper.exists(ResultsDisplay)).toBe(true);
  });

  it("test switch to display results", () => {
    const wrapper = shallow(
      <ContentHolder
        pageMode={1}
        modes={{ BUILDING: 1, DISPLAYING: 2 }}
        setPageMode={() => "hi"}
      />
    );

    const instance = wrapper.instance();

    instance.displayResults({
      outputs: ["ishan", "is", "awesome"],
      data: [
        {
          ishan: 1,
          is: 2,
          awesome: 3
        },
        {
          ishan: 3,
          is: 32,
          awesome: 7643
        },
        {
          ishan: 523,
          is: 764,
          awesome: 145
        },
        {
          ishan: 5432,
          is: 879,
          awesome: 5432
        }
      ]
    });

    expect(wrapper.state().resultsData.outputs[0]).toEqual("ishan");
  });

  it("test switch to query builder", () => {
    const wrapper = shallow(
      <ContentHolder
        pageMode={1}
        modes={{ BUILDING: 1, DISPLAYING: 2 }}
        setPageMode={() => "hi"}
      />
    );

    const instance = wrapper.instance();

    instance.createNewQuery();

    expect(wrapper.state().resultsData).toBeUndefined();
  });
});
