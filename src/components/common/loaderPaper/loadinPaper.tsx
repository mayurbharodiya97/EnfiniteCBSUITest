import { Paper } from "@mui/material";
import { LoadingTextAnimation } from "../loader/textLoading";
import "./loader.css";
export const LoaderPaperComponent = (props) => {
  return (
    <Paper
      style={{
        width: "100%",
      }}
    >
      {/* <div className="sk-fading-circle" {...props}>
        <div className="sk-circle1 sk-circle"></div>
        <div className="sk-circle2 sk-circle"></div>
        <div className="sk-circle3 sk-circle"></div>
        <div className="sk-circle4 sk-circle"></div>
        <div className="sk-circle5 sk-circle"></div>
        <div className="sk-circle6 sk-circle"></div>
        <div className="sk-circle7 sk-circle"></div>
        <div className="sk-circle8 sk-circle"></div>
        <div className="sk-circle9 sk-circle"></div>
        <div className="sk-circle10 sk-circle"></div>
        <div className="sk-circle11 sk-circle"></div>
        <div className="sk-circle12 sk-circle"></div>
        <div
          style={{
            fontSize: "9px",
            color: "red",
            paddingTop: "27px",
            paddingLeft: "11px",
          }}
        >
          Loading...
        </div>
      </div> */}
      {/* <div className="loading" style={{ textAlign: "center", margin: "2px" }}>
        <div className="bounceball"></div>
        <div className="text"> Loading...</div>
      </div> */}
      <div className="loading" style={{ textAlign: "center", margin: "2px" }}>
        <div className="bounceball"></div>
        <div className="text-forloader">
          <LoadingTextAnimation key={"loaderWithbounce"} text="Loading..." />
        </div>
      </div>
    </Paper>
  );
};
