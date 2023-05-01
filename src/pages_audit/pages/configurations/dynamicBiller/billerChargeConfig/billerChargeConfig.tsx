import { FC, useEffect, useState, useRef } from "react";
import { useMutation, useQuery } from "react-query";
import { queryClient } from "cache";
import { InitialValuesType, SubmitFnType } from "packages/form";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { useSnackbar } from "notistack";
import { useLocation } from "react-router-dom";
import { useDialogStyles } from "pages_audit/common/dialogStyles";
import { Transition } from "pages_audit/common/transition";
import * as API from "../api";
import { DynBillerChargeMetadata } from "./metaData";
import { LoaderPaperComponent } from "components/common/loaderPaper";
import { Alert } from "components/common/alert";
import { PopupMessageAPIWrapper } from "components/custom/popupMessage";
import {
  Grid,
  makeStyles,
  Tooltip,
  Typography,
  Button,
  Dialog,
} from "@material-ui/core";
import { utilFunction } from "components/utils";
import { useStyles } from "../../../profile/profilePhotoUpload/style";
import { transformFileObject } from "components/fileUpload/utils";

const useTypeStyles = makeStyles((theme) => ({
  title: {
    flex: "1 1 100%",
    color: "var(--theme-color1)",
    textAlign: "center",
  },
  refreshiconhover: {},
}));

interface updateMasterDataType {
  data: object;
  displayData?: object;
  endSubmit?: any;
  setFieldError?: any;
}

const updateMasterDataWrapperFn =
  (updateMasterData) =>
  async ({ data }: updateMasterDataType) => {
    return updateMasterData({ data });
  };

const BillerChargeConfig: FC<{
  isDataChangedRef: any;
  closeDialog?: any;
  defaultmode: string;
}> = ({ isDataChangedRef, closeDialog, defaultmode }) => {
  const headerClasses = useTypeStyles();
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [formMode, setFormMode] = useState(defaultmode);
  const isErrorFuncRef = useRef<any>(null);
  const [isOpenSave, setIsOpenSave] = useState(false);
  const { state: rows }: any = useLocation();
  const fileUploadControl = useRef<any | null>(null);
  const fileUploadControl2 = useRef<any | null>(null);
  const submitBtnRef = useRef<any | null>(null);
  const [filecnt, setFilecnt] = useState(0);
  const [filecnt2, setFilecnt2] = useState(0);
  const fileURL = useRef<any | null>({ subCategoryImg: "", billerImg: "" });
  const filesdata = useRef<any | null>({ subCategoryImg: "", billerImg: "" });

  //const [filesdata, setFilesData] = useState<any>(""); //(filedata);
  //const moveToViewMode = useCallback(() => setFormMode("view"), [setFormMode]);
  // const moveToEditMode = useCallback(() => setFormMode("edit"), [setFormMode]);

  const {
    data: mainData,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery<any, any>(
    [
      "getBillerChargeData",
      {
        categoryID: rows?.[0]?.data?.CATEGORY_ID,
        subCategoryID: rows?.[0]?.data?.SUB_CATEGORY_ID,
        billerID: rows?.[0]?.data?.BILLER_ID,
      },
    ],
    () =>
      API.getBillerChargeData({
        categoryID: rows?.[0]?.data?.CATEGORY_ID,
        subCategoryID: rows?.[0]?.data?.SUB_CATEGORY_ID,
        billerID: rows?.[0]?.data?.BILLER_ID,
      })
  );

  const mutation = useMutation(
    updateMasterDataWrapperFn(API.updateBillerChargeConfig),
    {
      onError: (error: any, { endSubmit }) => {
        let errorMsg = "Unknown Error occured";
        if (typeof error === "object") {
          errorMsg = error?.error_msg ?? errorMsg;
        }
        endSubmit(false, errorMsg, error?.error_detail ?? "");
      },
      onSuccess: (data, { endSubmit }) => {
        // queryClient.refetchQueries(["getFormData", transactionID]);
        endSubmit(true, "");
        enqueueSnackbar(data, {
          variant: "success",
        });
        isDataChangedRef.current = true;
        if (typeof closeDialog === "function") {
          closeDialog();
        }
      },
    }
  );

  useEffect(() => {
    return () => {
      queryClient.removeQueries([
        "getBillerChargeData",
        {
          categoryID: rows?.[0]?.data?.CATEGORY_ID,
          subCategoryID: rows?.[0]?.data?.SUB_CATEGORY_ID,
          billerID: rows?.[0]?.data?.BILLER_ID,
        },
      ]);
    };
  }, [
    rows?.[0]?.data?.CATEGORY_ID,
    rows?.[0]?.data?.SUB_CATEGORY_ID,
    rows?.[0]?.data?.BILLER_ID,
  ]);

  const onSubmitHandler: SubmitFnType = (
    data,
    displayData,
    endSubmit,
    setFieldError,
    actionFlag
  ) => {
    //@ts-ignore
    endSubmit(true);
    data = {
      ...data,
      SUB_CATEGORY_ICON: filesdata.current.subCategoryImg,
      BILLER_ICON: filesdata.current.billerImg,
    };

    let upd = utilFunction.transformDetailsData(data, mainData?.[0] ?? {});

    isErrorFuncRef.current = {
      data: {
        ...data,
        ...upd,
        _isNewRow: rows?.[0]?.data?.IS_CHARGE_CONFIG === "N" ? true : false,
      },
      displayData,
      endSubmit,
      setFieldError,
    };

    setIsOpenSave(true);
  };

  const onPopupYes = (rows) => {
    mutation.mutate(isErrorFuncRef.current);
  };

  const onActionCancel = () => {
    setIsOpenSave(false);
  };

  const customTransformFileObj = (currentObj) => {
    return transformFileObject({})(currentObj);
  };

  const handleFileSelect = async (imageName, e) => {
    const files = e.target.files;
    const filesArray = Array.from(files);
    if (filesArray.length > 0) {
      let resdata = filesArray.map((one) => customTransformFileObj(one));
      if (resdata.length > 0) {
        let filesObj: any = await Promise.all(resdata);
        if (imageName === "SUB_CATEGORY") {
          fileURL.current.subCategoryImg =
            typeof filesObj?.[0]?.blob === "object" &&
            Boolean(filesObj?.[0]?.blob)
              ? await URL.createObjectURL(filesObj?.[0]?.blob as any)
              : null;

          setImageData(filesObj?.[0]?.blob);
          //submitBtnRef.current?.click?.();
          setFilecnt(filecnt + 1);
        } else if (imageName === "BILLER") {
          fileURL.current.billerImg =
            typeof filesObj?.[0]?.blob === "object" &&
            Boolean(filesObj?.[0]?.blob)
              ? await URL.createObjectURL(filesObj?.[0]?.blob as any)
              : null;

          setBillerImageData(filesObj?.[0]?.blob);
          //submitBtnRef.current?.click?.();
          setFilecnt2(filecnt2 + 1);
        }
      }
    }
  };
  const setImageData = async (blob) => {
    let base64 = await utilFunction.convertBlobToBase64(blob);
    filesdata.current.subCategoryImg = base64?.[1];
  };
  const setBillerImageData = async (blob) => {
    let base64 = await utilFunction.convertBlobToBase64(blob);
    filesdata.current.billerImg = base64?.[1];
  };

  const setImageURL = async (imageName, filedata) => {
    if (filedata !== null) {
      let blob = utilFunction.base64toBlob(filedata, "image/png");
      if (imageName === "SUB_CATEGORY") {
        fileURL.current.subCategoryImg =
          typeof blob === "object" && Boolean(blob)
            ? await URL.createObjectURL(blob as any)
            : null;
        setFilecnt(filecnt + 1);
      } else if (imageName === "BILLER") {
        fileURL.current.billerImg =
          typeof blob === "object" && Boolean(blob)
            ? await URL.createObjectURL(blob as any)
            : null;
        setFilecnt2(filecnt2 + 1);
      }
    }
  };

  useEffect(() => {
    if (Boolean(mainData?.[0]?.SUB_CATEGORY_ICON)) {
      setImageURL("SUB_CATEGORY", mainData?.[0]?.SUB_CATEGORY_ICON);
      filesdata.current.subCategoryImg = mainData?.[0]?.SUB_CATEGORY_ICON;
    }
  }, [mainData?.[0]?.SUB_CATEGORY_ICON]);

  useEffect(() => {
    if (Boolean(mainData?.[0]?.BILLER_ICON)) {
      setImageURL("BILLER", mainData?.[0]?.BILLER_ICON);
      filesdata.current.billerImg = mainData?.[0]?.BILLER_ICON;
    }
  }, [mainData?.[0]?.BILLER_ICON]);
  return (
    <>
      {isLoading ? (
        <LoaderPaperComponent />
      ) : isError ? (
        <Grid container>
          <Grid item xs={12} sm={12} md={10}>
            <Alert
              severity="error"
              errorMsg={error?.error_msg ?? "Something went to wrong.."}
              errorDetail={error?.error_detail}
              color="error"
            />
          </Grid>
          <Grid item xs={12} sm={12} md={2}>
            <Button
              onClick={closeDialog}
              color={"secondary"}
              style={{ marginTop: "7px" }}
            >
              Close
            </Button>
          </Grid>
        </Grid>
      ) : (
        <>
          <Grid container>
            <Grid item xs={12} sm={12} md={12} style={{ padding: "10px" }}>
              <FormWrapper
                key={"BillerChargeForm" + formMode}
                metaData={DynBillerChargeMetadata as MetaDataType}
                initialValues={
                  (mainData?.[0] ?? {
                    CATEGORY_ID: rows?.[0]?.data?.CATEGORY_ID,
                    SUB_CATEGORY_ID: rows?.[0]?.data?.SUB_CATEGORY_ID,
                    BILLER_ID: rows?.[0]?.data?.BILLER_ID,
                  }) as InitialValuesType
                }
                onSubmitHandler={onSubmitHandler}
                //@ts-ignore
                displayMode={formMode}
                formStyle={{
                  background: "white",
                  // height: "55vh",
                  // overflowY: "auto",
                  // overflowX: "hidden",
                }}
              >
                {({ isSubmitting, handleSubmit }) => (
                  <>
                    {formMode === "edit" ? (
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
                          onClick={() => {
                            setFormMode("view");
                          }}
                          color={"primary"}
                          disabled={isSubmitting}
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          onClick={() => {
                            setFormMode("edit");
                          }}
                          //disabled={isSubmitting}
                          color={"primary"}
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={closeDialog}
                          //disabled={isSubmitting}
                          color={"primary"}
                        >
                          Close
                        </Button>
                      </>
                    )}
                  </>
                )}
              </FormWrapper>
            </Grid>
            <Grid item xs={12} sm={4} md={4} style={{ padding: "10px" }}>
              <Typography
                className={headerClasses.title}
                color="inherit"
                variant={"h6"}
                component="div"
              >
                Sub Category Image
              </Typography>
              <Tooltip
                key={"tooltip-" + formMode}
                title={
                  formMode === "view" ? "" : "Double click to change the image"
                }
                placement={"top"}
                arrow={true}
              >
                <div
                  className={classes.uploadWrapper}
                  style={{
                    width: 180,
                    height: 180,
                    background: "#cfcfcf",
                    cursor: formMode === "view" ? "auto" : "pointer",
                    margin: "auto",
                    padding: "4px",
                  }}
                  onDoubleClick={() => {
                    if (!(formMode === "view")) {
                      fileUploadControl?.current?.click();
                    }
                  }}
                  ref={submitBtnRef}
                  key={"div" + filecnt}
                >
                  <Grid
                    container
                    spacing={0}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <img
                      src={
                        Boolean(fileURL.current?.subCategoryImg)
                          ? fileURL.current?.subCategoryImg
                          : ""
                      }
                      style={{
                        maxWidth: 175,
                        maxHeight: 175,
                        minWidth: 170,
                        minHeight: 170,
                      }}
                    />
                  </Grid>
                  <input
                    name="fileselect"
                    type="file"
                    style={{ display: "none" }}
                    ref={fileUploadControl}
                    onChange={(event) =>
                      handleFileSelect("SUB_CATEGORY", event)
                    }
                    accept=".png,.jpg,.jpeg"
                    onClick={(e) => {
                      //to clear the file uploaded state to reupload the same file (AKA allow our handler to handle duplicate file)
                      //@ts-ignore
                      e.target.value = "";
                    }}
                  />
                </div>
              </Tooltip>
            </Grid>
            <Grid item xs={12} sm={4} md={4} style={{ padding: "10px" }}>
              <Typography
                className={headerClasses.title}
                color="inherit"
                variant={"h6"}
                component="div"
              >
                Biller Image
              </Typography>
              <Tooltip
                key={"tooltip2-" + formMode}
                title={
                  formMode === "view" ? "" : "Double click to change the image"
                }
                placement={"top"}
                arrow={true}
              >
                <div
                  className={classes.uploadWrapper}
                  style={{
                    width: 180,
                    height: 180,
                    background: "#cfcfcf",
                    cursor: formMode === "view" ? "auto" : "pointer",
                    margin: "auto",
                    padding: "4px",
                  }}
                  onDoubleClick={() => {
                    if (!(formMode === "view")) {
                      fileUploadControl2?.current?.click();
                    }
                  }}
                  ref={submitBtnRef}
                  key={"div2" + filecnt2}
                >
                  <Grid
                    container
                    spacing={0}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <img
                      src={
                        Boolean(fileURL.current?.billerImg)
                          ? fileURL.current?.billerImg
                          : ""
                      }
                      style={{
                        maxWidth: 175,
                        maxHeight: 175,
                        minWidth: 170,
                        minHeight: 170,
                      }}
                    />
                  </Grid>
                  <input
                    name="fileselectbiller"
                    type="file"
                    style={{ display: "none" }}
                    ref={fileUploadControl2}
                    onChange={(event) => handleFileSelect("BILLER", event)}
                    accept=".png,.jpg,.jpeg"
                    onClick={(e) => {
                      //to clear the file uploaded state to reupload the same file (AKA allow our handler to handle duplicate file)
                      //@ts-ignore
                      e.target.value = "";
                    }}
                  />
                </div>
              </Tooltip>
            </Grid>
            <Grid
              item
              xs={12}
              sm={4}
              md={4}
              style={{ padding: "10px 20px 10px 10px" }}
            >
              <Typography
                className={headerClasses.title}
                color="inherit"
                variant={"h6"}
                component="div"
              >
                {formMode === "edit"
                  ? "Note: Double-click on the Image box to upload a new Image."
                  : ""}
              </Typography>
            </Grid>
          </Grid>
        </>
      )}
      {isOpenSave ? (
        <PopupMessageAPIWrapper
          MessageTitle="Confirmation"
          Message="Do you want to save this Request?"
          onActionYes={(rowVal) => onPopupYes(rowVal)}
          onActionNo={() => onActionCancel()}
          rows={isErrorFuncRef.current?.data}
          open={isOpenSave}
          loading={mutation.isLoading}
        />
      ) : null}
    </>
  );
};

export const BillerChargeConfigWrapper = ({
  handleDialogClose,
  isDataChangedRef,
  defaultmode,
}) => {
  const classes = useDialogStyles();

  return (
    <>
      <Dialog
        open={true}
        //@ts-ignore
        TransitionComponent={Transition}
        PaperProps={{
          style: {
            //width: "50%",
            // minHeight: "48vh",
            // height: "62vh",
          },
        }}
        maxWidth="md"
        classes={{
          scrollPaper: classes.topScrollPaper,
          paperScrollBody: classes.topPaperScrollBody,
        }}
      >
        <BillerChargeConfig
          isDataChangedRef={isDataChangedRef}
          closeDialog={handleDialogClose}
          defaultmode={defaultmode}
        />
      </Dialog>
    </>
  );
};
