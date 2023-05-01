import Button from "@material-ui/core/Button";
import ErrorImg from "assets/images/error.svg";
import { useNavigate } from "react-router";
import { useStyles } from "./style";
import "app/audit/index.css";
export const ErrorPage = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const returnToHomePage = () => {
    navigate("/netbanking");
  };
  return (
    <div className={classes.wrapper}>
      <img alt="" src={ErrorImg} className={classes.successImg} />
      <div className={classes.center}>
        <h3 style={{ color: "black" }}>Something Unexpected Happened</h3>
      </div>
      <Button
        onClick={returnToHomePage}
        style={{ color: "var(--theme-color1)" }}
      >
        Return to Home Page
      </Button>
    </div>
  );
};
