import { useTranslation } from "react-i18next";
import "./style.css";
export const FullScreenLoader = () => {
  const { t } = useTranslation();
  const divStyle = {
    "--i": 1,
    backgroundColor: "tomato",
  };
  const divStyle1 = {
    "--i": 2,
    backgroundColor: "#5037c9",
  };
  const divStyle2 = {
    "--i": 3,
    backgroundColor: "#1ae2ac",
  };
  const divStyle3 = {
    "--i": 4,
    backgroundColor: "#e29f1a",
  };
  const divStyle4 = {
    "--i": 5,
    backgroundColor: "#e21ab9",
  };
  const divStyle5 = {
    "--i": 6,
    backgroundColor: "#c395bf",
  };
  const divStyle6 = {
    "--i": 7,
    backgroundColor: "#4032bb",
  };
  const divStyle7 = {
    "--i": 8,
    backgroundColor: "#0fe0b7",
  };

  return (
    // <div className="wrap-forloader">
    //   <div className="loading">
    //     <div className="bounceball"></div>
    //     <div className="text-forloader"> Loading...</div>
    //   </div>
    // </div>
    <>
      <div className="wrapper">
        <div style={divStyle} className="rect"></div>
        <div style={divStyle1} className="rect"></div>
        <div style={divStyle2} className="rect"></div>
        <div style={divStyle3} className="rect"></div>
        <div style={divStyle4} className="rect"></div>
        <div style={divStyle5} className="rect"></div>
        <div style={divStyle6} className="rect"></div>
        <div style={divStyle7} className="rect"></div>
        <div className="text-forloader"> {t("Loading")}</div>
      </div>
    </>
  );
};
