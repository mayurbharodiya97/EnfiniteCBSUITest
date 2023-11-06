import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { JointDetailGridMetaData } from "./gridMetadata";
import GridWrapper from "components/dataTableStatic";
import { Alert } from "components/common/alert";
import { ActionTypes, GridMetaDataType } from "components/dataTable/types";
import { ClearCacheProvider, queryClient } from "cache";
import * as API from "./api";
import { FormWrapper } from "components/dyanmicForm/formWrapper";
import { AuthContext } from "pages_audit/auth";
import { useContext } from "react";
import { InitialValuesType, SubmitFnType } from "packages/form";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import CloseIcon from "@mui/icons-material/Close";
import { jointViewDetailMetaData } from "./metaData";

import {
  Box,
  Typography,
  Grid,
  TextField,
  IconButton,
  Divider,
  Tab,
} from "@mui/material";
const JointDetails = () => {
  const myGridRef = useRef<any>(null);
  const { authState } = useContext(AuthContext);
  const isErrorFuncRef = useRef<any>(null);

  // useEffect(() => {
  //   getJointDet.mutate({});
  // }, []);

  const {
    data: jointDetailsList,
    isSuccess: isAccTypeSuccess,
    isLoading: isAccTypeLoading,
  } = useQuery(["getJointDetailsList", {}], () => API.getJointDetailsList());

  console.log(jointDetailsList, "jointDetailsList");

  // const getJointDet: any = useMutation(API.getTRXList, {
  //   onSuccess: (data) => {
  //     console.log("hello suc get joint");
  //   },
  //   onError: (error: any) => {},
  // });
  const getData = useMutation(API.getChequeBookEntryData, {
    onSuccess: (response: any) => {
      // Handle success
    },
    onError: (error: any) => {
      // Handle error
    },
  });

  const ClickEventManage = () => {
    let event: any = { preventDefault: () => {} };
    isErrorFuncRef?.current?.handleSubmit(event, "BUTTON_CLICK");
  };

  const actions: ActionTypes[] = [
    {
      actionName: "scroll",
      actionLabel: "Scroll",
      multiple: false,
      rowDoubleClick: true,
      actionTextColor: "var(--theme-color3)",
      alwaysAvailable: false,
      actionBackground: "inherit",
    },
  ];
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const setCurrentAction = useCallback((data) => {
    console.log(data, "data");

    setOpen(true);
  }, []);

  const onConfirmFormButtonClickHandel = () => {
    console.log("helllo");
  };
  return (
    <Fragment>
      <div
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            ClickEventManage();
          }
        }}
      >
        {getData.isError && (
          <Alert
            severity={getData.error?.severity ?? "error"}
            errorMsg={getData.error?.error_msg ?? "Something went to wrong.."}
            errorDetail={getData.error?.error_detail}
            color="error"
          />
        )}
        <GridWrapper
          key={`JointDetailGridMetaData`}
          finalMetaData={JointDetailGridMetaData as GridMetaDataType}
          data={jointDetailsList?.data ?? []}
          setData={() => null}
          loading={getData.isLoading}
          actions={actions}
          setAction={setCurrentAction}
          refetchData={() => {}}
          ref={myGridRef}
        />
      </div>

      <Dialog
        PaperProps={{
          style: {
            width: "100%",
            minHeight: "46vh",
          },
        }}
        open={open}
        // onClose={handleClose}
        maxWidth="md"
        scroll="body"
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Joint Full View for: Test Customer
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent>
          <div
            style={{
              boxShadow: "0px 1px 4px -1px #999999",
              borderRadius: "5px",
              margin: "10px",
              padding: "10px",
            }}
          >
            <FormWrapper
              metaData={jointViewDetailMetaData}
              // onSubmitHandler={onSubmitHandler}
              onFormButtonClickHandel={onConfirmFormButtonClickHandel}
              hideHeader={true}
              displayMode={"new"}
              formStyle={{
                background: "white",
                overflowY: "auto",
                overflowX: "hidden",
              }}
            ></FormWrapper>
          </div>
        </DialogContent>
        <DialogActions></DialogActions>
      </Dialog>
    </Fragment>
  );
};
export const JointDetailsForm = () => {
  return (
    <ClearCacheProvider>
      <JointDetails />
    </ClearCacheProvider>
  );
};
