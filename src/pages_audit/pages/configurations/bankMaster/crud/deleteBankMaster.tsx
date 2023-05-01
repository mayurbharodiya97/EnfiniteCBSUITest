import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { AuthContext } from "pages_audit/auth";
import { useContext, useEffect } from "react";
import { Alert } from "components/common/alert";
import { useMutation } from "react-query";
import * as API from "../api";
import { LoadingTextAnimation } from "components/common/loader";
import { useLocation } from "react-router-dom";
interface updateBankMasterDataType {
  data: object;
  displayData?: object;
  endSubmit?: any;
  setFieldError?: any;
}
const updateBankMasterDataWrapperFn =
  (updateMasterData) =>
  async ({ data }: updateBankMasterDataType) => {
    return updateMasterData(data);
  };
export const DeleteBankMaster = ({ isOpen, closeDialog, isDataChangedRef }) => {
  const { enqueueSnackbar } = useSnackbar();
  const { authState } = useContext(AuthContext);
  const { state: rows }: any = useLocation();
  useEffect(() => {
    if (rows.length === 0) {
      enqueueSnackbar("Please select records.", {
        variant: "warning",
      });
      closeDialog();
      return;
    }
  }, [rows, enqueueSnackbar, closeDialog]);
  const mutation = useMutation(
    updateBankMasterDataWrapperFn(API.updateBankMastersDataDelete),
    {
      onError: (error: any) => {},
      onSuccess: (data) => {
        enqueueSnackbar("Record deleted successfully.", {
          variant: "success",
        });
        isDataChangedRef.current = true;
        closeDialog();
      },
    }
  );
  const CallDeleteBankMasterRecords = () => {
    DeleteRecord(rows);
  };
  const DeleteRecord = (data) => {
    if (Array.isArray(data) && data.length > 0) {
      let newData = data.map((item) => {
        let { _hidden, _isNewRow, ...other } = item.data;
        return {
          ...other,
          BEFTN_ENABLED: Boolean(other?.BEFTN_ENABLED) ? "Y" : "N",
          RTGS_ENABLED: Boolean(other?.RTGS_ENABLED) ? "Y" : "N",
          NPSB_ENABLED: Boolean(other?.NPSB_ENABLED) ? "Y" : "N",
        };
      });
      let req_data = {};
      req_data["DETAILS_DATA"] = {
        isDeleteRow: newData,
        isUpdatedRow: [],
        isNewRow: [],
      };
      req_data["COMP_CD"] = authState.companyID;
      mutation.mutate({ data: req_data });
    }
  };
  // mutation.isLoading = true;
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
          onClick={CallDeleteBankMasterRecords}
          color="secondary"
          disabled={mutation.isLoading}
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};
