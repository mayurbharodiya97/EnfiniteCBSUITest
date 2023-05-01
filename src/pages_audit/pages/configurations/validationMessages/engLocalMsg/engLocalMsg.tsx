import { useState, useRef } from "react";
import { TextField } from "components/styledComponent/textfield";
import {
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { GradientButton } from "components/styledComponent/button";
import { useStyles } from "pages_audit/auth/style";
import { GeneralAPI } from "registry/fns/functions";

export const EngLocalMsgAPIWrapper = ({
  TitleText,
  onActionNo,
  onActionYes,
  isRequired = true,
  isEntertoSubmit = false,
  AcceptbuttonLabelText = "Yes",
  CanceltbuttonLabelText = "No",
  isLoading = false,
  EngValue = "",
  LocalValue = "",
  isOpen,
  rows,
  isEditable = true,
}) => {
  const [inputdata, setInputData] = useState({
    engdata: EngValue,
    localdata: LocalValue,
    isError: false,
    errorMsg: "",
  });
  const classes = useStyles();
  const inputButtonRef = useRef<any>(null);
  const [isLocalLoding, setLocalLoading] = useState(false);
  const OtherLanguageCode = "bn";
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
  //console.log(rows);
  return (
    <>
      <Dialog fullWidth={true} open={isOpen}>
        <DialogTitle className={classes.dialogTitleClass}>
          {TitleText}{" "}
          <span style={{ fontSize: 11 }}>
            {Boolean(rows[0]?.data?.MSG_ID)
              ? "(" + rows[0]?.data?.MSG_ID + ")"
              : ""}
            {!isEditable ? "-view" : ""}
          </span>
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus={true}
            label={"English"}
            placeholder="Enter English Message"
            fullWidth
            multiline={true}
            minRows={2}
            maxRows={4}
            type={"text"}
            name="english"
            value={inputdata.engdata}
            onChange={handleChange}
            error={inputdata.isError}
            helperText={inputdata.isError ? inputdata.errorMsg : ""}
            InputLabelProps={{ shrink: true }}
            disabled={isLoading}
            autoComplete="off"
            required={isRequired}
            InputProps={{ readOnly: !isEditable }}
            // onKeyPress={(e) => {
            //   //console.log("test Key=>", e);
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
            minRows={2}
            maxRows={4}
            type={"text"}
            name="local"
            value={inputdata.localdata}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            disabled={isLoading}
            autoComplete="off"
            InputProps={{ readOnly: !isEditable }}
            onKeyPress={(e) => {
              // if (e.key === "Enter" && isEntertoSubmit) {
              //   inputButtonRef?.current?.click?.();
              // }
            }}
          />
        </DialogContent>
        <DialogActions className={classes.verifybutton}>
          {isEditable ? (
            <>
              <GradientButton
                endIcon={isLoading ? <CircularProgress size={20} /> : null}
                disabled={isLocalLoding}
                onClick={() => {
                  if (!Boolean(inputdata.engdata) && isRequired) {
                    setInputData((values) => ({
                      ...values,
                      isError: true,
                      errorMsg: "This field is required.",
                    }));
                  } else {
                    onActionYes(inputdata.engdata, inputdata.localdata, rows);
                  }
                }}
                ref={inputButtonRef}
              >
                {AcceptbuttonLabelText}
              </GradientButton>

              <GradientButton
                disabled={isLoading || isLocalLoding}
                onClick={onActionNo}
              >
                {CanceltbuttonLabelText}
              </GradientButton>
              {!Boolean(inputdata.engdata) || !Boolean(inputdata.localdata) ? (
                <GradientButton
                  disabled={isLoading || isLocalLoding}
                  onClick={onTranslateProccess}
                  endIcon={
                    isLocalLoding ? <CircularProgress size={20} /> : null
                  }
                >
                  Translate
                </GradientButton>
              ) : null}
            </>
          ) : (
            <GradientButton
              disabled={isLoading || isLocalLoding}
              onClick={onActionNo}
            >
              Close
            </GradientButton>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};
