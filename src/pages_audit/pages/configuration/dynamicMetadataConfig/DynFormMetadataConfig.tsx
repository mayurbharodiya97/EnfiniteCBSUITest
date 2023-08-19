import { useMutation, useQuery } from "react-query";
import { useSnackbar } from "notistack";
import { cloneDeep } from "lodash-es";
// import * as API from "./api";
import { DynamicFormConfigMetaData } from "./metaData";
import { MasterDetailsMetaData } from "components/formcomponent/masterDetails/types";
import { FC, useCallback, useContext, useRef, useState } from "react";
import {
  AppBar,
  Grid,
  Toolbar,
  Typography,
  Theme,
  Dialog,
} from "@mui/material";
import { GradientButton } from "components/styledComponent/button";
import { MasterDetailsForm } from "components/formcomponent";
import { makeStyles } from "@mui/styles";
import { useStyles } from "pages_audit/appBar/style";
import { useLocation } from "react-router-dom";
import { PopupMessageAPIWrapper } from "components/custom/popupMessage";
import { AuthContext } from "pages_audit/auth";
const useTypeStyles = makeStyles((theme: Theme) => ({
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
  formMode: string;
  displayData?: object;
  endSubmit?: any;
  setFieldError?: any;
  SetLoadingOWN?: any;
}

const addMasterFormDataFnWrapper =
  (addMasterFn) =>
  async ({ data, formMode }: addMasterDataType) => {
    return addMasterFn(data, formMode);
  };

const DynamicFormMetadataConfig: FC<{
  isDataChangedRef: any;
  closeDialog?: any;
  defaultView?: "view" | "edit" | "add";
  docCD: number;
  data: any;
}> = ({
  isDataChangedRef,
  closeDialog,
  defaultView = "view",
  docCD,
  data: reqData,
}) => {
  const headerClasses = useTypeStyles();
  const { enqueueSnackbar } = useSnackbar();
  const myRef = useRef<any>(null);
  const [isLocalLoading, setLocalLoading] = useState(false);
  const [formName, setformName] = useState("");
  const [formMode, setFormMode] = useState(defaultView);
  const moveToViewMode = useCallback(() => setFormMode("view"), [setFormMode]);
  const moveToEditMode = useCallback(() => setFormMode("edit"), [setFormMode]);
  const { authState } = useContext(AuthContext);
  const [isOpenSave, setIsOpenSave] = useState(false);
  const isErrorFuncRef = useRef<any>(null);
  const [errorObjData, seterrorObjData] = useState({
    isError: false,
    error: { error_msg: "", error_detail: "" },
  });

  // const { data, isLoading, isError, error } = useQuery<any, any>(
  //   ["getDynamicGridConfigData"],
  //   () =>
  //     API.getDynamicGridConfigData({
  //       COMP_CD: authState?.companyID ?? "",
  //       BRANCH_CD: authState?.user?.branchCode ?? "",
  //       docCD,
  //     })
  // );

  // useEffect(() => {
  //   return () => {
  //     queryClient.removeQueries(["getDynamicGridConfigData"]);
  //   };
  // }, []);

  // const mutation = useMutation(
  //   addMasterFormDataFnWrapper(API.dynamicGridConfigDML()),
  //   {
  //     onError: (error: any, { endSubmit, SetLoadingOWN }) => {
  //       SetLoadingOWN(false, error?.error_msg, error?.error_detail ?? "");
  //       onActionCancel();
  //     },
  //     onSuccess: (data) => {
  //       // SetLoadingOWN(true, "");
  //       enqueueSnackbar(data, {
  //         variant: "success",
  //       });

  //       isDataChangedRef.current = true;
  //       closeDialog();
  //     },
  //   }
  // );

  const onPopupYes = (rows) => {
    // mutation.mutate({
    //   data: rows,
    //   formMode: "",
    // });
  };
  const onActionCancel = () => {
    setIsOpenSave(false);
  };
  const onSubmitHandler = ({
    data,
    resultValueObj,
    resultDisplayValueObj,
    endSubmit,
    setFieldErrors,
    actionFlag,
  }) => {
    //@ts-ignore
    endSubmit(true);

    setLocalLoading(true);
    const SetLoadingOWN = (isLoading, error_msg = "", error_detail = "") => {
      setLocalLoading(isLoading);
      endSubmit(isLoading, error_msg, error_detail);
    };

    if (
      data["_UPDATEDCOLUMNS"].length > 0 ||
      data.DETAILS_DATA["isUpdatedRow"].length > 0
    ) {
      isErrorFuncRef.current = {
        data,
        SetLoadingOWN,
        endSubmit,
        formMode,
      };
      setIsOpenSave(true);
    }
  };

  const setLocalError = (isError, error_msg = "", error_detail = "") => {
    seterrorObjData({
      isError: isError,
      error: { error_msg: error_msg, error_detail: error_detail },
    });
  };

  let metadata: MasterDetailsMetaData = {} as MasterDetailsMetaData;

  metadata = cloneDeep(DynamicFormConfigMetaData) as MasterDetailsMetaData;

  return (
    <>
      {/* {isLoading ? (
        <div style={{ margin: "2rem" }}>
          <LoaderPaperComponent />
          {typeof closeDialog === "function" ? (
            <div style={{ position: "absolute", right: 0, top: 0 }}>
              <IconButton onClick={closeDialog}>
                <HighlightOffOutlinedIcon />
              </IconButton>
            </div>
          ) : null}
        </div>
      ) : isError === true ? (
        <>
          <div style={{ margin: "1.2rem" }}>
            <Alert
              severity="error"
              errorMsg={error?.error_msg ?? ""}
              errorDetail={error?.error_detail ?? ""}
            />
          </div>
        </>
      ) : ( */}
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
                Dynamic Metadata Configure
              </Typography>

              {formMode === "edit" ? (
                <>
                  <GradientButton
                    onClick={(event) => {
                      myRef.current?.onSubmitHandler(event);
                    }}
                    // disabled={isLocalLoading}
                    // endIcon={
                    //   isLocalLoading ? <CircularProgress size={20} /> : null
                    // }
                  >
                    Save
                  </GradientButton>
                  <GradientButton
                    onClick={moveToViewMode}
                    // disabled={isLocalLoading}
                    color={"primary"}
                  >
                    Cancel
                  </GradientButton>
                </>
              ) : formMode === "view" ? (
                <>
                  <GradientButton onClick={moveToEditMode}>Edit</GradientButton>
                  <GradientButton onClick={closeDialog}>Close</GradientButton>
                </>
              ) : (
                <>
                  <GradientButton
                    onClick={(event) => {
                      myRef.current?.onSubmitHandler(event);
                    }}
                    // endIcon={
                    //   isLocalLoading ? <CircularProgress size={20} /> : null
                    // }
                  >
                    Save
                  </GradientButton>
                  <GradientButton onClick={closeDialog}>Close</GradientButton>
                </>
              )}
            </Toolbar>
          </AppBar>
          {/* {mutation?.isError ? (
              <>
                <Alert
                  severity="error"
                  errorMsg={mutation?.error?.error_msg ?? ""}
                  errorDetail={mutation?.error?.error_detail ?? ""}
                />
              </>
            ) : null} */}
        </Grid>

        <MasterDetailsForm
          key={"dynGridConfig" + formMode}
          formNameMaster={"dynGridConfig" + formMode}
          formName={formName + formMode}
          metaData={metadata}
          ref={myRef}
          initialData={{
            _isNewRow: formMode === "add" ? true : false,
            // ...(data?.[0] ?? {}),
            // ...reqData?.[0]?.data,
            // DETAILS_DATA: data,
          }}
          // initialData={{ _isNewRow: true, DETAILS_DATA: [] }}
          displayMode={formMode === "add" ? "New" : formMode}
          isLoading={formMode === "view" ? true : isLocalLoading}
          onSubmitData={onSubmitHandler}
          isNewRow={formMode === "add" ? true : false}
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
          isError={errorObjData.isError}
          errorObj={errorObjData.error}
        >
          {({ isSubmitting, handleSubmit }) => {
            return <></>;
          }}
        </MasterDetailsForm>
      </Grid>
      {/* )} */}

      {isOpenSave ? (
        <PopupMessageAPIWrapper
          MessageTitle="Confirmation"
          Message="Do you want to save this Request?"
          onActionYes={(rowVal) => onPopupYes(rowVal)}
          onActionNo={() => onActionCancel()}
          rows={isErrorFuncRef.current?.data}
          open={isOpenSave}
          // loading={mutation.isLoading}
        />
      ) : null}
    </>
  );
};

export const DynamicFormMetadataWrapper = ({ onClose, formView, isOpen }) => {
  const { state: data }: any = useLocation();
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
      <DynamicFormMetadataConfig
        // isDataChangedRef={isDataChangedRef}
        closeDialog={onClose}
        defaultView={formView}
        isDataChangedRef={undefined}
        docCD={0}
        data={undefined}
      />
    </Dialog>
  );
};
