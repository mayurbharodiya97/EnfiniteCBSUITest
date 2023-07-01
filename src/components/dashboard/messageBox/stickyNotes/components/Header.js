import { GradientButton } from "components/styledComponent/button";
import React from "react";

const Header = ({ handleToggleDarkMode, closeDialog }) => {
  return (
    <div className="header">
      <h1>Notes</h1>
      <button
        onClick={() =>
          handleToggleDarkMode((previousDarkMode) => !previousDarkMode)
        }
        className="save"
      >
        Toggle Mode
      </button>
      <GradientButton
        onClick={closeDialog}
        className="save"
        style={{
          // backgroundColor: "var(--theme-color5)",
          // height: "32px",
          // width: "20px",
          // borderRadius: "05px",
          color: "var(--theme-color2)",
        }}
      >
        Close
      </GradientButton>
    </div>
  );
};

export default Header;
