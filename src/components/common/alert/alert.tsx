import { FC, useState } from "react";
import Alert, { AlertProps } from "@material-ui/lab/Alert";
import Dialog from "@material-ui/core/Dialog";
import Button from "@material-ui/core/Button";
import {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import { GradientButton } from "components/styledComponent/button";
interface MyAlertProps {
  errorMsg: string;
  errorDetail?: string;
}

export const MyAlert: FC<MyAlertProps & AlertProps> = ({
  errorMsg,
  errorDetail,
  ...others
}) => {
  const [showMore, setShowMore] = useState(false);
  // const { authState } = useContext(AuthContext);
  return (
    <>
      <Alert
        {...others}
        action={
          Boolean(errorDetail) ? (
            <Button
              color="secondary"
              onClick={() => setShowMore((more) => !more)}
            >
              {showMore ? "Show Less" : "Show More"}
            </Button>
          ) : null
        }
        style={{ background: "white" }}
      >
        <span style={{ fontWeight: "500", color: "red" }}>{errorMsg}</span>
        {/* {showMore ? (
          <Fragment>
            <br />
            <hr />
            <span>{errorDetail}</span>
          </Fragment>
        ) : null} */}
      </Alert>
      <Dialog
        open={showMore}
        fullWidth={false}
        onKeyUp={(event) => {
          if (event.key === "Escape") {
            setShowMore(false);
          }
        }}
      >
        <DialogTitle>Error Details</DialogTitle>
        <DialogContent>
          <DialogContentText>{errorDetail}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <GradientButton onClick={() => setShowMore(false)}>OK</GradientButton>
        </DialogActions>
      </Dialog>
    </>
  );
};
