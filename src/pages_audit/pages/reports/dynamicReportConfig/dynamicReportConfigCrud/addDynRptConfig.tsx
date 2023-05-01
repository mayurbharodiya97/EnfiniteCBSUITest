import { useMutation } from "react-query";
import { useSnackbar } from "notistack";
import { cloneDeep } from "lodash-es";
import Dialog from "@mui/material/Dialog";
import * as API from "../api";
import { DynamicReportConfigMetaData } from "./metaData";
import { MasterDetailsMetaData } from "components/formcomponent/masterDetails/types";
import { useRef, useState } from "react";
import {
  AppBar,
  CircularProgress,
  Grid,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { GradientButton } from "components/styledComponent/button";
import { MasterDetailsForm } from "components/formcomponent";
import { Alert } from "components/common/alert";
import { RetrievalParametersGrid } from "./retrievalParameters";
import { makeStyles } from "@mui/styles";

const useTypeStyles = makeStyles((theme: any) => ({
  root: {
    paddingLeft: theme.spacing(1.5),
    paddingRight: theme.spacing(1.5),
    background: "var(--theme-color1)",
  },
  title: {
    flex: "1 1 100%",
    color: "var(--white)",
    letterSpacing: "1px",
    fontSize: "1.5rem",
  },
  refreshiconhover: {},
}));

interface addMasterDataType {
  data: object;
  displayData?: object;
  endSubmit?: any;
  setFieldError?: any;
  SetLoadingOWN?: any;
}

const addMasterFormDataFnWrapper =
  (addMasterFn) =>
  async ({ data }: addMasterDataType) => {
    return addMasterFn(data);
  };

const AddDynamicReportConfig = ({ isDataChangedRef, closeDialog }) => {
  const headerClasses = useTypeStyles();
  const { enqueueSnackbar } = useSnackbar();
  const myRef = useRef<any>(null);
  const myVerifyCntRef = useRef(0);
  const mySqlSyntaxRef = useRef<any>(false);
  const myparameterDataRef = useRef<any>([]);
  const [isLoading, setLoading] = useState(false);
  const [isOpenRerieval, setIsOpenRerieval] = useState(false);
  const [formName, setformName] = useState("");
  const [sqlSyntax, setSqlSyntax] = useState("");
  const mutation = useMutation(
    addMasterFormDataFnWrapper(API.insertMastersData()),
    {
      onError: (error: any, { endSubmit, SetLoadingOWN }) => {
        SetLoadingOWN(false, error?.error_msg, error?.error_detail ?? "");
      },
      onSuccess: (data, { endSubmit, SetLoadingOWN }) => {
        SetLoadingOWN(true, "");
        isDataChangedRef.current = true;
        enqueueSnackbar(data, {
          variant: "success",
        });
        closeDialog();
      },
    }
  );
  const verifySql = useMutation(API.verifyDynRptSqlSyntax, {
    onError: (error: any) => {},
    onSuccess: (data) => {
      mySqlSyntaxRef.current = true;
      let detailData = data?.[0]?.DETAILS.map((item) => {
        return {
          ...item,
          _isNewRow: true,
        };
      });
      myRef.current?.setGridData(detailData);
      myparameterDataRef.current = data?.[0]?.PARAMETERS;
      setformName("dynDetail" + myVerifyCntRef.current);
      myVerifyCntRef.current = myVerifyCntRef.current + 1;
      enqueueSnackbar("Query Successfully Verified.", {
        variant: "success",
      });
    },
  });

  const onSubmitHandler = ({
    data,
    resultValueObj,
    resultDisplayValueObj,
    endSubmit,
    setFieldErrors,
    actionFlag,
  }) => {
    setLoading(true);
    const SetLoadingOWN = (isLoading, error_msg = "", error_detail = "") => {
      setLoading(isLoading);
      endSubmit(isLoading, error_msg, error_detail);
    };

    data.PARAMETERS = myparameterDataRef.current;
    mutation.mutate({ data, SetLoadingOWN, endSubmit });
  };

  const onCloseDialog = () => {
    setIsOpenRerieval(false);
  };
  const onSaveParameters = (data) => {
    myparameterDataRef.current = data;
    setIsOpenRerieval(false);
  };

  let metadata: MasterDetailsMetaData = {} as MasterDetailsMetaData;

  metadata = cloneDeep(DynamicReportConfigMetaData) as MasterDetailsMetaData;
  return (
    <>
      <Grid container>
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          style={{
            paddingTop: "10px",
            paddingLeft: "10px",
            paddingRight: "10px",
          }}
        >
          <AppBar
            position="relative"
            color="secondary"
            style={{ marginBottom: "5px" }}
          >
            <Toolbar className={headerClasses.root} variant={"dense"}>
              <Typography
                className={headerClasses.title}
                color="inherit"
                variant={"h6"}
                component="div"
              >
                Dynamic Report Configure
              </Typography>
              <GradientButton
                onClick={(event) => {
                  myRef.current?.onSubmitHandler(event);
                }}
              >
                Save
              </GradientButton>
              <GradientButton onClick={closeDialog}>Close</GradientButton>
            </Toolbar>
          </AppBar>
        </Grid>
        <Grid item xs={8} sm={6} md={8}>
          <MasterDetailsForm
            key={"dynReportConfig"}
            formNameMaster={"dynRptConfigMaster"}
            formName={formName}
            metaData={metadata}
            ref={myRef}
            initialData={{ _isNewRow: true, DETAILS_DATA: [] }}
            displayMode={"New"}
            isLoading={isLoading}
            onSubmitData={onSubmitHandler}
            isNewRow={true}
            containerstyle={{
              paddingRight: "10px",
              paddingLeft: "10px",
              paddingTop: "5px",
            }}
            formStyle={{
              background: "white",
              height: "25vh",
              overflowY: "auto",
              overflowX: "hidden",
            }}
            hideHeader={true}
          >
            {({ isSubmitting, handleSubmit }) => {
              return <></>;
            }}
          </MasterDetailsForm>
        </Grid>
        <Grid item xs={4} sm={6} md={4} style={{ paddingRight: "10px" }}>
          <Grid item xs={12} sm={12} md={12}>
            {verifySql.isError ? (
              <div style={{ marginBottom: "5px" }}>
                <AppBar position="relative" color="primary">
                  <Alert
                    severity="error"
                    errorMsg={
                      verifySql?.error?.error_msg ?? "Something went to wrong.."
                    }
                    errorDetail={verifySql?.error?.error_detail}
                    color="error"
                  />
                </AppBar>
              </div>
            ) : null}
          </Grid>
          <Grid item xs={12} sm={12} md={12} style={{ paddingTop: "12px" }}>
            <TextField
              id="outlined-multiline-static"
              label="SQL ANSI Query Syntax"
              multiline
              minRows={verifySql.isError ? 21 : 24}
              value={sqlSyntax}
              variant="outlined"
              color="secondary"
              style={{ width: "100%" }}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(event) => {
                setSqlSyntax(event.target.value);
                mySqlSyntaxRef.current = false;
              }}
              // onBlur={(event) => {
              //   myTextFieldPositionRef.current = event.target?.selectionStart;
              // }}
            />
          </Grid>
          <Grid container style={{ padding: "20px", placeContent: "center" }}>
            <Grid item xs={12} sm={12} md={3}>
              <GradientButton
                disabled={verifySql.isLoading}
                endIcon={
                  verifySql.isLoading ? <CircularProgress size={20} /> : null
                }
                onClick={() => {
                  if (Boolean(sqlSyntax)) {
                    verifySql.mutate({ sqlSyntax, detailsData: [] });
                  } else {
                    enqueueSnackbar("Please Enter SQL Syntax.", {
                      variant: "warning",
                    });
                  }
                }}
              >
                Verify
              </GradientButton>
            </Grid>
            <Grid item xs={12} sm={12} md={3}>
              <GradientButton
                onClick={() => {
                  if (!Boolean(sqlSyntax)) {
                    enqueueSnackbar("Please Enter SQL Syntax.", {
                      variant: "warning",
                    });
                  } else if (!mySqlSyntaxRef.current) {
                    enqueueSnackbar("Please Verify SQL Syntax.", {
                      variant: "warning",
                    });
                  } else {
                    // createRetrievalMetaData(sqlSyntax);
                    setIsOpenRerieval(true);
                  }
                }}
              >
                Parameters
              </GradientButton>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      {isOpenRerieval ? (
        <RetrievalParametersGrid
          isOpen={isOpenRerieval}
          formMode={undefined}
          onClose={onCloseDialog}
          rowsData={myparameterDataRef.current}
          onSaveData={onSaveParameters}
        />
      ) : null}
    </>
  );
};

export const AddDynamicReportConfigWrapper = ({
  isDataChangedRef,
  closeDialog,
}) => {
  return (
    <Dialog
      open={true}
      PaperProps={{
        style: {
          width: "100%",
        },
      }}
      maxWidth="lg"
    >
      <AddDynamicReportConfig
        isDataChangedRef={isDataChangedRef}
        closeDialog={closeDialog}
      />
    </Dialog>
  );
};
