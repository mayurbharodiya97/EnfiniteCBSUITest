import { useTranslation } from "react-i18next";
import "./style.css";
export const FullScreenLoader = () => {
  const { t } = useTranslation();

  return (
    // <div className="wrap-forloader">
    //   <div className="loading">
    //     <div className="bounceball"></div>
    //     <div className="text-forloader"> Loading...</div>
    //   </div>
    // </div>
    <>
      <div className="maindiv">
        <div className="loading-container">
          <div className="wave-container">
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="wave"></div>
          </div>
          <div className="loading-text">
            <span>C</span>
            <span>B</span>
            <span>S</span>
            <span>-</span>
            <span>E</span>
            <span>N</span>
            <span>F</span>
            <span>I</span>
            <span>N</span>
            <span>I</span>
            <span>T</span>
            <span>Y</span>
          </div>
        </div>
      </div>
    </>
  );
};
