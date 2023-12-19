//UI
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Typography,
  Grid,
  TextField,
  IconButton,
  Divider,
  Tab,
  Button,
} from "@mui/material";

//logic
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { JointDetailGridMetaData } from "./gridMetadata";
import GridWrapper from "components/dataTableStatic";
import { Alert } from "components/common/alert";
import { ActionTypes, GridMetaDataType } from "components/dataTable/types";
import { ClearCacheProvider, queryClient } from "cache";
import { FormWrapper } from "components/dyanmicForm/formWrapper";
import { AuthContext } from "pages_audit/auth";
import { useContext } from "react";
import { InitialValuesType, SubmitFnType } from "packages/form";
import { jointViewDetailMetaData } from "./metaData";
import * as API from "./api";

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

  const getJointDataById: any = useMutation(API.getJointDataById, {
    onSuccess: (data) => {
      console.log("hello getJointDataById");
    },
    onError: (error: any) => {},
  });

  console.log(getJointDataById, "getJointDataById dataaaa");
  const setCurrentAction = useCallback((data) => {
    console.log(data, "rowdata");
    let obj = { id: 1, name: "alfa" };
    getJointDataById.mutate({ obj });

    setOpen(true);
  }, []);

  const sendJointData: any = useMutation(API.sendJointData, {
    onSuccess: (data) => {
      console.log("hello suc get joint");
    },
    onError: (error: any) => {},
  });
  const handleSave = () => {
    console.log("helllo");
    sendJointData.mutate({});
  };

  // const onSubmitHandler: SubmitFnType = (
  //   data: any,
  //   displayData,
  //   endSubmit,
  //   setFieldError,
  //   actionFlag
  // ) => {
  //   // @ts-ignore
  //   endSubmit(true);

  //   let newData = {
  //     IS_VIEW_NEXT: Boolean(data?.IS_VIEW_NEXT) ? "Y" : "N" ?? "",
  //   };

  //   let oldData = {
  //     IS_VIEW_NEXT: mainData?.[0]?.IS_VIEW_NEXT ?? "",
  //   };

  //   let upd: any = utilFunction.transformDetailsData(newData, oldData ?? {});

  //   if (upd?._UPDATEDCOLUMNS?.length > 0) {
  //     isErrorFuncRef.current = {
  //       data: {
  //         ...newData,
  //         ...upd,
  //         CIRCULAR_TRAN_CD: mainData?.[0]?.TRAN_CD ?? "",
  //         USER_NM: authState?.user?.id ?? "",
  //         _isNewRow: formView === "view" ? true : false,
  //       },
  //       displayData,
  //       endSubmit,
  //       setFieldError,
  //     };
  //     setIsOpenSave(true);
  //   }
  // };
  return (
    <>
      <div
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            ClickEventManage();
          }
        }}
      >
        <GridWrapper
          key={`JointDetailGridMetaData`}
          finalMetaData={JointDetailGridMetaData as GridMetaDataType}
          data={jointDetailsList?.data ?? []}
          setData={() => null}
          // loading={getData.isLoading}
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
              onFormButtonClickHandel={handleSave}
              initialValues={getJointDataById?.data as InitialValuesType}
              hideHeader={true}
              displayMode={"new"}
              formStyle={{
                background: "white",
                overflowY: "auto",
                overflowX: "hidden",
              }}
            >
              {({ isSubmitting, handleSubmit }) => (
                <>
                  <Button
                    onClick={(event) => {
                      handleSubmit(event, "Save");
                    }}
                    disabled={isSubmitting}
                    //endIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                    color={"primary"}
                  >
                    Save
                  </Button>
                </>
              )}
            </FormWrapper>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
export const JointDetailsForm = () => {
  return (
    <ClearCacheProvider>
      <JointDetails />
    </ClearCacheProvider>
  );
};
