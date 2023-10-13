import {
  AppBar,
  Button,
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
import React from "react";
import { useLocation } from "react-router-dom";
import { getApiFormMetadata } from "./getApiiFormMetadata";

const GetApiFormCustom = ({ closeDialog }) => {
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
          <Button>Save</Button>
          <Button onClick={closeDialog}>Close</Button>
        </DialogActions>
      </DialogTitle>
      <Grid container>
        <Grid item xs={7} sm={7} md={7} lg={7} xl={7}>
          <FormWrapper
            key={`MerchantOnboardConfig`}
            metaData={getApiFormMetadata as MetaDataType}
            initialValues={[]}
            // onSubmitHandler={onSubmitHandler}
            formStyle={{
              background: "white",
            }}
            hideHeader={true}

            // onFormButtonCicular={mutation.isLoading}
            // ref={formRef}
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
                <Button
                  onClick={closeDialog}
                  color={"primary"}
                  disabled={isSubmitting}
                >
                  Close
                </Button>
              </>
            )}
          </FormWrapper>
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
            // value={sqlSyntax}
            variant="outlined"
            color="secondary"
            style={{
              width: "100%",
            }}
            // disabled={formMode === "view" ? true : false}
            InputLabelProps={{
              shrink: true,
            }}
            // onChange={(event) => {
            //   mynewSqlSyntaxRef.current = event.target.value;
            //   setSqlSyntax(event.target.value);
            //   mySqlSyntaxRef.current = false;
            // }}
            // onBlur={(event) => {
            //   myTextFieldPositionRef.current = event.target?.selectionStart;
            // }}
          />
        </Grid>
      </Grid>
    </>
  );
};
export const GetApiForm = ({ closeDialog }) => {
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
        // isDataChangedRef={isDataChangedRef}
        closeDialog={closeDialog}
        // defaultView={defaultView}
        // docCD={data?.[0]?.data?.DOC_CD ?? ""}
        // data={data}
      />
    </Dialog>
  );
};
