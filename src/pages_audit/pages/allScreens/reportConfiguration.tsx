import {
  FormWrapper,
  GradientButton,
  LoaderPaperComponent,
  LoadingTextAnimation,
  MetaDataType,
  SubmitFnType,
  TextField,
} from "@acuteinfo/common-base";
import { CircularProgress, Dialog, Grid } from "@mui/material";
import { AppBar, Toolbar, Typography } from "@mui/material";
import { Theme } from "@mui/system";
import { makeStyles } from "@mui/styles";
import { reportConfigMetadata } from "./formMetadata";
import { Fragment, useContext, useRef, useState } from "react";
import { useMutation, useQuery } from "react-query";
import * as API from "./api";
import { AuthContext } from "pages_audit/auth";
import { t } from "i18next";
const useTypeStyles = makeStyles((theme: Theme) => ({
  root: {
    paddingLeft: theme.spacing(1.5),
    paddingRight: theme.spacing(1.5),
    background: "var(--theme-color5)",
  },
  title: {
    flex: "1 1 100%",
    color: "var(--white)",
    letterSpacing: "1px",
    fontSize: "1.5rem",
  },
  textField: {
    width: "50%", // Set width to 50%
    marginBottom: "10px", // Add some margin at the bottom
  },
}));

export const ReportConfiguration = ({
  OpenDialogue,
  closeDialogue,
  rowData,
  queryData,
  loading,
}) => {
  const headerClasses = useTypeStyles();

  const [metaData, setMetaData] = useState("");
  const [formData, setFormData] = useState({});
  const [formMode, setFormMode] = useState("add");
  const { authState } = useContext(AuthContext);
  const formRef = useRef<any>(null);

  const getmetadataMutation = useMutation(
    API.generateReportMetadata,

    {
      onError: (error: any) => {
        let errorMsg = t("Unknownerroroccured");
        if (typeof error === "object") {
          errorMsg = error?.error_msg ?? errorMsg;
        }
      },
      onSuccess: (data) => {
        // setMetaData(data)
      },
    }
  );
  const savemetadataMutation = useMutation(
    API.saveReportConfiguration,

    {
      onError: (error: any) => {
        setFormMode("add");
        let errorMsg = t("Unknownerroroccured");
        if (typeof error === "object") {
          errorMsg = error?.error_msg ?? errorMsg;
        }
      },
      onSuccess: (data) => {
        setFormMode("add");
      },
    }
  );
  const onSubmitHandler: SubmitFnType = async (
    data: any,
    displayData: any,
    endSubmit,
    setFieldError
  ) => {
    savemetadataMutation.mutate({ ...formData });
  };

  return (
    <Fragment>
      {queryData === "" || queryData === undefined || queryData.length == 0 ? (
        <>
          <Dialog
            open={true}
            fullWidth
            maxWidth="lg"
            PaperProps={{
              style: { width: "100%", height: "auto", padding: "7px" },
            }}
          >
            <div style={{ width: "100%", padding: "7px" }}>
              <LoaderPaperComponent />
            </div>
          </Dialog>
        </>
      ) : (
        <Dialog
          open={OpenDialogue}
          fullWidth
          maxWidth="xl"
          PaperProps={{
            style: { width: "100%", height: "100%", padding: "7px" },
          }}
        >
          <AppBar position="relative" color="secondary">
            <Toolbar className={headerClasses.root} variant="dense">
              <Typography
                className={headerClasses.title}
                color="inherit"
                variant="h6"
                component="div"
              >
                {`Report Configuration Form For ${rowData?.DOC_CD} ${rowData?.DOC_NM}`}
              </Typography>
              <GradientButton
                onClick={() => {
                  let event: any = { preventDefault: () => {} };
                  formRef?.current?.handleSubmit(event, "BUTTON_CLICK");
                }}
                endIcon={
                  savemetadataMutation.isLoading ? (
                    <CircularProgress size={20} />
                  ) : null
                }
                color={"primary"}
              >
                Save
              </GradientButton>
              {!loading ? (
                <GradientButton
                  onClick={(event) => {
                    getmetadataMutation.mutate({
                      DOC_CD: rowData?.DOC_CD,
                      DOC_NM: rowData?.DOC_NM,
                    });
                  }}
                  color={"primary"}
                >
                  Generate Metadata
                </GradientButton>
              ) : (
                ""
              )}

              <GradientButton onClick={closeDialogue} color="primary">
                Close
              </GradientButton>
            </Toolbar>
          </AppBar>
          <Grid container>
            <Grid item xs={12}>
              <FormWrapper
                key="reportConfigMetadata"
                metaData={reportConfigMetadata as MetaDataType}
                initialValues={{}}
                formStyle={{
                  height: "auto",
                  width: "100%",
                }}
                hideHeader={true}
                onSubmitHandler={onSubmitHandler}
                displayMode={formMode}
                ref={formRef}
              />
            </Grid>
            <Grid
              item
              xs={12}
              xl={12}
              sx={{ m: 2 }}
              style={{ padding: "10px", display: "flex" }}
            >
              <TextField
                id="sql-query"
                label="SQL Query"
                value={queryData?.SQL_ANSI_SYNTAX}
                placeholder="Query Loading..."
                multiline
                rows={20}
                disabled={true}
                sx={{ m: 2 }}
                variant="outlined"
                color="secondary"
                className={headerClasses.textField}
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={(event) => {}}
              />
              <TextField
                id="metadata"
                label="Metadata"
                placeholder="Enter Metadata"
                multiline
                sx={{ m: 2 }}
                rows={20}
                variant="outlined"
                color="secondary"
                className={headerClasses.textField}
                InputLabelProps={{
                  shrink: true,
                }}
                value={metaData ?? ""}
                onChange={(event) => {
                  setMetaData(event.target.value.trimStart());
                }}
              />
            </Grid>
          </Grid>
        </Dialog>
      )}
    </Fragment>
  );
};
