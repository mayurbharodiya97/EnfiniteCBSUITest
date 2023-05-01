//@ts-ignore
import { useLocation } from "react-router-dom";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import { Alert } from "components/common/alert";
import DialogContent from "@material-ui/core/DialogContent";
import Dialog from "@material-ui/core/Dialog";
import { LoadingTextAnimation } from "components/common/loader";

export const MessageBoxWrapper = ({
  isOpen = false,
  validMessage,
  onActionYes,
  onActionNo,
  rows,
  isLoading = false,
  isError = false,
  error_msg = "",
  error_detail = "",
  loadingText = "Loading...",
}) => {
  return (
    <Dialog open={isOpen} maxWidth="sm">
      <DialogTitle>{validMessage}</DialogTitle>
      <DialogContent>
        {isLoading ? (
          //   "Deleting..."
          <LoadingTextAnimation key={"loaderforDeleteing"} text={loadingText} />
        ) : isError ? (
          <Alert
            severity="error"
            // I suspect this, mutation.error?.error_msg is misspelt. Try errorMessage
            errorMsg={error_msg ?? "Unknown Error occured"}
            errorDetail={error_detail ?? ""}
          />
        ) : null}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => onActionYes(rows)}
          color="secondary"
          disabled={isLoading}
        >
          Yes
        </Button>
        <Button
          onClick={() => onActionNo()}
          color="secondary"
          disabled={isLoading}
        >
          No
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export const MessageBoxNavigateWrapper = ({
  validMessage,
  onActionYes,
  onActionNo,
  isLoading = false,
  isError = false,
  error_msg = "",
  error_detail = "",
  loadingText = "Loading...",
}) => {
  const { state: rows } = useLocation();
  return (
    <MessageBoxWrapper
      isOpen={true}
      validMessage={validMessage}
      isLoading={isLoading}
      onActionYes={onActionYes}
      onActionNo={onActionNo}
      isError={isError}
      rows={rows}
      error_msg={error_msg}
      error_detail={error_detail}
      loadingText={loadingText}
    />
  );
};
