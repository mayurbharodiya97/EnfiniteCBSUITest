import { FC, useEffect, useState, useRef, useContext } from "react";
import { useMutation } from "react-query";
import { InitialValuesType, SubmitFnType } from "packages/form";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { useSnackbar } from "notistack";
import { useLocation } from "react-router-dom";
import { useDialogStyles } from "pages_audit/common/dialogStyles";
import { Transition } from "pages_audit/common/transition";
import * as API from "../api";
import { MFSConfigEntryMetaData } from "./metaData";
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
import { AuthContext } from "pages_audit/auth";

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

const MFSConfigEntry: FC<{
  isDataChangedRef: any;
  closeDialog?: any;
  defaultmode: string;
}> = ({ isDataChangedRef, closeDialog, defaultmode }) => {
  const { authState } = useContext(AuthContext);

  const headerClasses = useTypeStyles();
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [formMode, setFormMode] = useState(defaultmode);
  const isErrorFuncRef = useRef<any>(null);
  const [isOpenSave, setIsOpenSave] = useState(false);
  const { state: rows }: any = useLocation();
  const fileUploadControl = useRef<any | null>(null);
  const submitBtnRef = useRef<any | null>(null);
  const [filecnt, setFilecnt] = useState(0);
  const fileURL = useRef<any | null>(null);
  const filesdata = useRef<any | null>(null);

  const mutation = useMutation(
    updateMasterDataWrapperFn(API.updateMFSConfigEntry),
    {
      onError: (error: any, { endSubmit }) => {
        let errorMsg = "Unknown Error occured";
        if (typeof error === "object") {
          errorMsg = error?.error_msg ?? errorMsg;
        }
        endSubmit(false, errorMsg, error?.error_detail ?? "");
      },
      onSuccess: (data, { endSubmit }) => {
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
      OPERATOR_IMAGE: filesdata.current,
      COMP_CD: authState.companyID,
    };
    let upd = utilFunction.transformDetailsData(data, rows?.[0]?.data ?? {});
    if (upd._UPDATEDCOLUMNS.length > 0) {
      isErrorFuncRef.current = {
        data: {
          ...data,
          ...upd,
          DETAILS_DATA: { isDeleteRow: [], isNewRow: [], isUpdatedRow: [] },
          _isNewRow: formMode === "add" ? true : false,
          isDeleteRow: false,
        },
        displayData,
        endSubmit,
        setFieldError,
      };
      setIsOpenSave(true);
    } else {
      setFormMode("view");
    }
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

  const handleFileSelect = async (e) => {
    const files = e.target.files;
    const filesArray = Array.from(files);
    if (filesArray.length > 0) {
      let resdata = filesArray.map((one) => customTransformFileObj(one));
      if (resdata.length > 0) {
        let filesObj: any = await Promise.all(resdata);
        fileURL.current =
          typeof filesObj?.[0]?.blob === "object" &&
          Boolean(filesObj?.[0]?.blob)
            ? await URL.createObjectURL(filesObj?.[0]?.blob as any)
            : null;
        setImageData(filesObj?.[0]?.blob);
        //submitBtnRef.current?.click?.();
        setFilecnt(filecnt + 1);
      }
    }
  };
  const setImageData = async (blob) => {
    let base64 = await utilFunction.convertBlobToBase64(blob);
    filesdata.current = base64?.[1];
  };

  const setImageURL = async (filedata) => {
    if (filedata !== null) {
      let blob = utilFunction.base64toBlob(filedata, "image/png");
      fileURL.current =
        typeof blob === "object" && Boolean(blob)
          ? await URL.createObjectURL(blob as any)
          : null;
      setFilecnt(filecnt + 1);
    }
  };

  useEffect(() => {
    if (Boolean(rows?.[0]?.data?.OPERATOR_IMAGE)) {
      setImageURL(rows?.[0]?.data?.OPERATOR_IMAGE);
      filesdata.current = rows?.[0]?.data?.OPERATOR_IMAGE;
    }
  }, [rows?.[0]?.data?.OPERATOR_IMAGE]);

  return (
    <>
      <Grid container>
        <Grid item xs={12} sm={12} md={12}>
          <FormWrapper
            key={"MFSConfig" + formMode}
            metaData={MFSConfigEntryMetaData as MetaDataType}
            initialValues={rows?.[0]?.data as InitialValuesType}
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
                ) : formMode === "add" ? (
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
                      //disabled={isSubmitting}
                      color={"primary"}
                    >
                      Close
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
        <Grid item xs={12} sm={4} md={4} style={{ paddingBottom: "10px" }}>
          <Typography
            className={headerClasses.title}
            color="inherit"
            variant={"h6"}
            component="div"
          >
            MFS Icon
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
                  src={Boolean(fileURL.current) ? fileURL.current : ""}
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
                onChange={(event) => handleFileSelect(event)}
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
          sm={8}
          md={8}
          style={{ padding: "10px 20px 10px 10px" }}
        >
          <Typography
            className={headerClasses.title}
            color="inherit"
            variant={"h6"}
            component="div"
          >
            {formMode === "edit" || formMode === "add"
              ? "Note: Double-click on the Image box to upload a new Image."
              : ""}
          </Typography>
        </Grid>
      </Grid>
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

export const MFSConfigEntryWrapper = ({
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
            width: "65%",
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
        <MFSConfigEntry
          isDataChangedRef={isDataChangedRef}
          closeDialog={handleDialogClose}
          defaultmode={defaultmode}
        />
      </Dialog>
    </>
  );
};
