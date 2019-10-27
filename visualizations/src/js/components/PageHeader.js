import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "PageHeader.sass";

const PageHeader = ({ title, subtext }) => {
  return (
    <div id="pageHeader">
      <h2>{title}</h2>
      <h4>{subtext}</h4>
      <ToastContainer className="toastContainer" />
    </div>
  );
};

export default PageHeader;
