import { FC, useState, useRef } from "react";
import { TextField } from "components/styledComponent/textfield";
import { InitialValuesType } from "packages/form";
import Dialog from "@material-ui/core/Dialog";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { useSnackbar } from "notistack";
import { useLocation } from "react-router-dom";
import { useDialogStyles } from "pages_audit/common/dialogStyles";
import { Transition } from "pages_audit/common/transition";
import { ScreenNoteEditMetadata } from "./metaData";
import {
  CircularProgress,
  DialogActions,
  DialogContent,
} from "@material-ui/core";
import { useMutation } from "react-query";
import * as API from "../api";
import { useStyles } from "pages_audit/auth/style";
import { GradientButton } from "components/styledComponent/button";
import { GeneralAPI } from "registry/fns/functions";

export const ScreenNoteEditWrapper: FC<{
  isDataChangedRef: any;
  handleDialogClose?: any;
  defaultView?: "edit";
}> = ({ isDataChangedRef, handleDialogClose, defaultView = "edit" }) => {
  const classes = useDialogStyles();
  const actionClasses = useStyles();
  const { state: rows }: any = useLocation();
  const OtherLanguageCode = "bn";
  const [isLocalLoding, setLocalLoading] = useState(false);
  const [inputdata, setInputData] = useState({
    engdata: rows?.[0]?.data?.SCREEN_MSG,
    localdata: rows?.[0]?.data?.SCREEN_MSG_BN,
    isError: false,
    errorMsg: "",
  });
  const { enqueueSnackbar } = useSnackbar();

  const result = useMutation(API.updateScreenNote, {
    onSuccess: (response: any) => {
      //refetch();
      enqueueSnackbar(response, {
        variant: "success",
      });
      isDataChangedRef.current = true;
      handleDialogClose();
      //onActionCancel();
    },
    onError: (error: any) => {
      let errorMsg = "Unknown Error occured";
      if (typeof error === "object") {
        errorMsg = error?.error_msg ?? errorMsg;
      }
      enqueueSnackbar(errorMsg, {
        variant: "error",
      });
      //onActionCancel();
    },
  });

  const handleChange = (event) => {
    if (event.target.name === "english") {
      setInputData((values) => ({
        ...values,
        engdata: event.target.value,
        isError: false,
      }));
    } else {
      setInputData((values) => ({ ...values, localdata: event.target.value }));
    }
  };
  const onTranslateProccess = async () => {
    setLocalLoading(true);
    let resText = await GeneralAPI.getTranslateDataFromGoole(
      Boolean(inputdata.engdata) ? inputdata.engdata : inputdata.localdata,
      Boolean(inputdata.engdata) ? "en" : OtherLanguageCode,
      Boolean(inputdata.engdata) ? OtherLanguageCode : "en"
    );
    setLocalLoading(false);
    if (Boolean(resText)) {
      if (Boolean(inputdata.engdata)) {
        setInputData((values) => ({ ...values, localdata: resText }));
      } else {
        setInputData((values) => ({
          ...values,
          engdata: resText,
          isError: false,
        }));
      }
    }
  };
  const saveScreenNote = (engNote, localNote) => {
    result.mutate({
      screenID: rows[0]?.data?.SCREEN_ID ?? "",
      screenNoteEn: engNote,
      screenNoteBn: localNote,
    });
  };
  return (
    <>
      <Dialog
        open={true}
        //@ts-ignore
        TransitionComponent={Transition}
        PaperProps={{
          style: {
            width: "65%",
            // minHeight: "36vh",
            // height: "36vh",
          },
        }}
        maxWidth="md"
        classes={{
          scrollPaper: classes.topScrollPaper,
          paperScrollBody: classes.topPaperScrollBody,
        }}
      >
        <FormWrapper
          key={`paraEditDetail`}
          metaData={ScreenNoteEditMetadata as MetaDataType}
          initialValues={rows?.[0]?.data as InitialValuesType}
          //@ts-ignore
          // displayMode={formMode}
          formStyle={{
            background: "white",
            // height: "calc(42vh - 100px)",
            // overflowY: "auto",
            // overflowX: "hidden",
          }}
          containerstyle={{ padding: "10px" }}
        >
          {({ isSubmitting, handleSubmit }) => <></>}
        </FormWrapper>
        <DialogContent style={{ padding: "0px 12px" }}>
          <TextField
            autoFocus={true}
            label={"English"}
            placeholder="Enter English Message"
            fullWidth
            multiline={true}
            minRows={8}
            maxRows={8}
            type={"text"}
            name="english"
            value={inputdata.engdata}
            onChange={handleChange}
            error={inputdata.isError}
            helperText={inputdata.isError ? inputdata.errorMsg : ""}
            InputLabelProps={{ shrink: true }}
            disabled={result.isLoading}
            autoComplete="off"
            // onKeyPress={(e) => {
            //   if (e.key === "F9") {
            //   }
            // }}
          />
          <TextField
            autoFocus={false}
            label={"Bangla"}
            placeholder="Enter Bangla Message"
            fullWidth
            multiline={true}
            minRows={8}
            maxRows={8}
            type={"text"}
            name="local"
            value={inputdata.localdata}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            disabled={result.isLoading}
            autoComplete="off"
            onKeyPress={(e) => {
              // if (e.key === "Enter" && isEntertoSubmit) {
              //   inputButtonRef?.current?.click?.();
              // }
            }}
          />
        </DialogContent>
        <DialogActions
          className={actionClasses.verifybutton}
          style={{ marginTop: "2px", marginBottom: "2px" }}
        >
          <>
            <GradientButton
              endIcon={result.isLoading ? <CircularProgress size={20} /> : null}
              disabled={isLocalLoding}
              onClick={() => {
                if (!Boolean(inputdata.engdata)) {
                  setInputData((values) => ({
                    ...values,
                    isError: true,
                    errorMsg: "This field is required.",
                  }));
                } else {
                  saveScreenNote(inputdata.engdata, inputdata.localdata);
                }
              }}
              // ref={inputButtonRef}
            >
              Save
            </GradientButton>

            <GradientButton
              disabled={result.isLoading || isLocalLoding}
              onClick={handleDialogClose}
            >
              Close
            </GradientButton>
            {!Boolean(inputdata.engdata) || !Boolean(inputdata.localdata) ? (
              <GradientButton
                disabled={result.isLoading || isLocalLoding}
                onClick={onTranslateProccess}
                endIcon={isLocalLoding ? <CircularProgress size={20} /> : null}
              >
                Translate
              </GradientButton>
            ) : null}
          </>
        </DialogActions>
      </Dialog>
    </>
  );
};

// export const ScreenNoteEditWrapper = ({
//   handleDialogClose,
//   isDataChangedRef,
// }) => {
//   const classes = useDialogStyles();
//   const { state: rows }: any = useLocation();
//   return (
//     <>
//       <Dialog
//         open={true}
//         //@ts-ignore
//         TransitionComponent={Transition}
//         PaperProps={{
//           style: {
//             width: "100%",
//             // minHeight: "36vh",
//             // height: "36vh",
//           },
//         }}
//         maxWidth="md"
//         classes={{
//           scrollPaper: classes.topScrollPaper,
//           paperScrollBody: classes.topPaperScrollBody,
//         }}
//       >
//         <ScreenNoteEdit
//           isDataChangedRef={isDataChangedRef}
//           closeDialog={handleDialogClose}
//         />
//       </Dialog>
//     </>
//   );
// };
