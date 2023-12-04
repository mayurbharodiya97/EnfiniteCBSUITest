import {
  AppBar,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { getApiFormMetadata } from "./getApiiFormMetadata";
import { SubmitFnType } from "packages/form";
import { CreateDetailsRequestData, utilFunction } from "components/utils";
import { AuthContext } from "pages_audit/auth";
import { useMutation } from "react-query";
import { savedynamicAPIconfig } from "../api";
import { enqueueSnackbar } from "notistack";
import { Alert } from "components/common/alert";

const GetApiFormCustom = ({ closeDialog, isDataChangedRef }) => {
  const formRef = useRef<any>(null);
  const { authState } = useContext(AuthContext);
  const [sqlSyntax, setSqlSyntax] = useState("");
  const mynewSqlSyntaxRef = useRef<any>("");

  useEffect(() => {
    // setSqlSyntax(sqlSyntax ?? "");
    mynewSqlSyntaxRef.current = sqlSyntax ?? "";
  }, [sqlSyntax]);
  // const ClickEventManage = () => {
  //   let event: any = { preventDefault: () => {} };
  //   formRef?.current?.handleSubmit(event, "BUTTON_CLICK");
  // };

  const mutation: any = useMutation(savedynamicAPIconfig, {
    onSuccess: (data) => {
      enqueueSnackbar("Data Save successfully", { variant: "success" });
      isDataChangedRef.current = true;
      closeDialog();
    },
    onError: (error: any) => {},
  });

  const onSubmitHandler: SubmitFnType = (
    data: any,
    displayData,
    endSubmit,
    setFieldError,
    value
  ) => {
    //@ts-ignore
    endSubmit(true);

    let newData = data?.requestParameters?.map((item) => {
      const newItem = {
        ...item,
        _isNewRow: true,
      };
      return newItem;
    });
    newData = CreateDetailsRequestData(newData);
    let reqData = {
      _isNewRow: true,
      ACTION: data?.ACTION.toUpperCase(),
      GET_QUERY: mynewSqlSyntaxRef.current,
      GET_TYPE: data?.GET_API_TYPE,
      DETAILS_DATA: newData,
      DOC_API_DTL: {
        COMP_CD: authState.companyID,
        _isNewRow: true,
        BRANCH_CD: authState.user.branchCode,
        DOC_CD: data?.DOC_CD,
        // API_ID: "73",
        API_ENDPOINT: `/enfinityCommonServiceAPI/GETDYNAMICDATA/${data?.ACTION.toUpperCase()}`,
      },
    };
    if (Boolean(mynewSqlSyntaxRef.current)) {
      mutation.mutate({ ...reqData });
    } else {
      enqueueSnackbar("Please Enter SQL Syntax.", {
        variant: "warning",
      });
    }
  };
  return (
    <>
      <DialogTitle
        sx={{
          m: 1,
          p: 0,
          background: "var(--theme-color5)",
          color: "var(--theme-color2)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          "& .MuiTypography-body1": {
            fontSize: "1.5rem",
            paddingLeft: "10px",
            fontWeight: 500,
          },
          "& .MuiButtonBase-root": {
            color: "var(--theme-color2) !important",
          },
        }}
        id="customized-dialog-title"
      >
        <Typography>Get Api Configuration</Typography>
        <DialogActions>
          <Button
            onClick={(event) =>
              formRef?.current?.handleSubmit(event, "BUTTON_CLICK")
            }
            endIcon={
              mutation?.isLoading ? <CircularProgress size={20} /> : null
            }
          >
            Save
          </Button>
          <Button onClick={closeDialog}>Close</Button>
        </DialogActions>
      </DialogTitle>
      {mutation.isError && (
        <Alert
          severity={mutation.error?.severity ?? "error"}
          errorMsg={mutation.error?.error_msg ?? "Something went to wrong.."}
          errorDetail={mutation.error?.error_detail}
          color="error"
        />
      )}
      <Grid container>
        <Grid item xs={7} sm={7} md={7} lg={7} xl={7}>
          <FormWrapper
            key={`MerchantOnboardConfig`}
            metaData={getApiFormMetadata as MetaDataType}
            initialValues={[]}
            onSubmitHandler={onSubmitHandler}
            formStyle={{
              background: "white",
            }}
            loading={mutation.isLoading}
            hideHeader={true}
            // onFormButtonCicular={mutation.isLoading}
            ref={formRef}
          ></FormWrapper>
        </Grid>
        <Grid
          item
          xs={5}
          sm={5}
          md={5}
          lg={5}
          xl={5}
          style={{ padding: "17px 10px 10px 0" }}
        >
          <TextField
            id="outlined-multiline-static"
            label="SQL ANSI Query Syntax"
            multiline
            minRows="23"
            // rows={verifySql.isError ? 18 : 20}
            // minRows={verifySql.isError ? 21 : 24}
            value={sqlSyntax}
            variant="outlined"
            color="secondary"
            style={{
              width: "100%",
            }}
            // disabled={formMode === "view" ? true : false}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(event) => {
              mynewSqlSyntaxRef.current = event.target.value;
              setSqlSyntax(event.target.value);
              // mySqlSyntaxRef.current = false;
            }}
            // onBlur={(event) => {
            //   myTextFieldPositionRef.current = event.target?.selectionStart;
            // }}
          />
        </Grid>
      </Grid>
    </>
  );
};
export const GetApiForm = ({ closeDialog, isDataChangedRef }) => {
  const { state: data }: any = useLocation();
  return (
    <Dialog
      open={true}
      fullWidth={true}
      PaperProps={{
        style: {
          maxWidth: "1150px",
        },
      }}
      // maxWidth="lg"
    >
      <GetApiFormCustom
        isDataChangedRef={isDataChangedRef}
        closeDialog={closeDialog}
        // defaultView={defaultView}
        // docCD={data?.[0]?.data?.DOC_CD ?? ""}
        // data={data}
      />
    </Dialog>
  );
};
