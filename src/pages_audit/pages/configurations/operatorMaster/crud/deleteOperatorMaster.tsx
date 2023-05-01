import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { Alert } from "components/common/alert";
import { LoadingTextAnimation } from "components/common/loader";
import { useSnackbar } from "notistack";
import { AuthContext } from "pages_audit/auth";
import { useContext } from "react";
import { useMutation } from "react-query";
import { useLocation } from "react-router-dom";
import * as API from "../api";
interface updateOperatorMasterDetailsDataType {
  data: object;
  displayData?: object;
  endSubmit?: any;
  setFieldError?: any;
  setLoading?: any;
}
const updateOperatorMasterDetailsDataWrapperFn =
  (updateMasterData) =>
  async ({ data }: updateOperatorMasterDetailsDataType) => {
    return updateMasterData(data);
  };
export const DeleteOperatorMaster = ({
  isOpen,
  closeDialog,
  isDataChangedRef,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const { authState } = useContext(AuthContext);
  const { state: rows }: any = useLocation();
  const mutation = useMutation(
    updateOperatorMasterDetailsDataWrapperFn(
      API.updateOperatorMasterDetailGridData
    ),
    {
      onError: (error: any) => {},
      onSuccess: (data) => {
        enqueueSnackbar("Record Updated successfully.", {
          variant: "success",
        });
        isDataChangedRef.current = true;
        closeDialog();
      },
    }
  );
  const CallDeleteOperatorMasterRecords = () => {
    mutation.mutate({
      data: {
        ...(rows?.[0]?.data ?? {}),
        _isNewRow: false,
        _isDeleteRow: true,
      },
    });
  };
  return (
    <Dialog open={isOpen} maxWidth="sm">
      <DialogTitle>Do you want to delete the selected records?</DialogTitle>
      <DialogContent>
        {mutation.isLoading ? (
          //   "Deleting..."
          <LoadingTextAnimation key={"loaderforDeleteing"} text="Deleting..." />
        ) : mutation.isError ? (
          <Alert
            severity="error"
            // I suspect this, mutation.error?.error_msg is misspelt. Try errorMessage
            errorMsg={mutation.error?.error_msg ?? "Unknown Error occured"}
            errorDetail={mutation.error?.error_detail ?? ""}
          />
        ) : null}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={closeDialog}
          color="secondary"
          disabled={mutation.isLoading}
        >
          No
        </Button>
        <Button
          onClick={CallDeleteOperatorMasterRecords}
          color="secondary"
          disabled={mutation.isLoading}
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};
