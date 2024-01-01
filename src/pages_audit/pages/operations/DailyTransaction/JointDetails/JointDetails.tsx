//UI
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton, Button } from "@mui/material";

//logic
import {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
  useContext,
} from "react";
import { useMutation, useQuery } from "react-query";
import { JointDetailGridMetaData } from "./gridMetadata";
import GridWrapper from "components/dataTableStatic";
import { Alert } from "components/common/alert";
import { ActionTypes, GridMetaDataType } from "components/dataTable/types";
import { ClearCacheProvider, queryClient } from "cache";
import { FormWrapper } from "components/dyanmicForm/formWrapper";

import { InitialValuesType, SubmitFnType } from "packages/form";
import { jointViewDetailMetaData } from "./metaData";
import * as API from "./api";
import { AuthContext } from "pages_audit/auth";
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
const JointDetails = () => {
  const myGridRef = useRef<any>(null);
  const { authState } = useContext(AuthContext);
  const { tempStore, setTempStore } = useContext(AuthContext);
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  //api define

  const getJointDetails = useMutation(API.getJointDetailsList, {
    onSuccess: (data) => {
      console.log(data, " joint detailssss");
      setRows(data);
    },
    onError: (error) => {},
  });

  useEffect(() => {
    tempStore?.accInfo?.ACCT_CD && getJointDetails.mutate(tempStore.accInfo);
  }, [tempStore]);

  const setCurrentAction = useCallback((data) => {
    console.log(data, "rowdata");
    setOpen(true);
  }, []);

  const handleSave = () => {
    console.log("helllo");
  };

  return (
    <>
      <div>
        <GridWrapper
          key={`JointDetailGridMetaData`}
          finalMetaData={JointDetailGridMetaData as GridMetaDataType}
          data={rows}
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
              // initialValues={getJointDataById?.data as InitialValuesType}
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
