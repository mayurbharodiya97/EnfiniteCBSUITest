import {
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Grid,
  IconButton,
  Tooltip,
} from "@material-ui/core";
import { MasterDetailsForm } from "components/formcomponent";
import { AppBar } from "@material-ui/core";
import { Alert } from "components/common/alert";
import { useMutation } from "react-query";
import { useContext, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import * as API from "pages_audit/pages/configurations/operatorMaster/api";
import * as API2 from "../api";
import { Transition } from "pages_audit/common";
import { useDialogStyles } from "pages_audit/common/dialogStyles";
import HighlightOffOutlinedIcon from "@material-ui/icons/HighlightOffOutlined";
import { LoaderPaperComponent } from "components/common/loaderPaper";
import { AuthContext } from "pages_audit/auth";
import { operatorMasterDetailsMetaData } from "./metaData";
import { useStyles } from "../../profile/profilePhotoUpload/style";
import { transformFileObject } from "components/fileUpload/utils";
import { utilFunction } from "components/utils";
import { GradientButton } from "components/styledComponent/button";
import { PopupMessageAPIWrapper } from "components/custom/popupMessage";
import { useSnackbar } from "notistack";

interface updateOperatorMasterDetailsDataType {
  data: object;
  displayData?: object;
  endSubmit?: any;
  setFieldError?: any;
  setLoading?: any;
}

const updateOperatorMasterDetailsDataWrapperFn =
  (updateMasterData) =>
  async ({ data }: updateOperatorMasterDetailsDataType) => {
    return updateMasterData(data);
  };

export const OperatorMstConfirmDetails = ({
  ClosedEventCall,
  isRefreshRef,
  defaultmode = "view",
}) => {
  const classes = useDialogStyles();

  const myImgRef = useRef<any>(null);
  const { state: rows }: any = useLocation();
  const { authState } = useContext(AuthContext);
  const [isopenImgViewer, setOpenImgViewer] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [isOpenAccept, setIsOpenAccept] = useState(false);
  const [isOpenReject, setIsOpenReject] = useState(false);
  const authController = useContext(AuthContext);

  const mutationRet: any = useMutation(
    updateOperatorMasterDetailsDataWrapperFn(API.getOperatorDetailGridData)
  );
  const mutation = useMutation(API2.updateOperatorMSTConfirm, {
    onSuccess: (response: any) => {
      enqueueSnackbar(response, {
        variant: "success",
      });
      isRefreshRef.current = true;
      //onActionCancel();
      ClosedEventCall();
    },
    onError: (error: any) => {
      let errorMsg = "Unknown Error occured";
      if (typeof error === "object") {
        errorMsg = error?.error_msg ?? errorMsg;
      }
      enqueueSnackbar(errorMsg, {
        variant: "error",
      });
      onActionCancel();
    },
  });

  const onSubmitHandler = ({ endSubmit, data }) => {
    // mutation.mutate({ data, endSubmit, setLoading });
  };

  const onFormButtonClickHandel = (id) => {
    setOpenImgViewer(true);
  };

  useEffect(() => {
    mutationRet.mutate({
      data: {
        TRAN_CD: rows[0]?.data?.TRAN_CD,
        COMP_CD: authState.companyID,
      },
    });
    return () => {};
  }, []);

  useEffect(() => {
    if (Boolean(rows?.[0]?.data?.OPERATOR_IMAGE)) {
      myImgRef.current = rows?.[0]?.data?.OPERATOR_IMAGE;
    }
  }, [rows]);

  const updateAcceptData = (rows) => {
    mutation.mutate({
      confirmed: "Y",
      tranCode: rows[0]?.data?.TRAN_CD ?? "",
      companyCode: rows[0]?.data?.COMP_CD ?? "",
    });
  };
  const updateRejectData = (rows) => {
    mutation.mutate({
      confirmed: "R",
      tranCode: rows[0]?.data?.TRAN_CD ?? "",
      companyCode: rows[0]?.data?.COMP_CD ?? "",
    });
  };
  const onActionCancel = () => {
    setIsOpenAccept(false);
    setIsOpenReject(false);
  };
  return (
    <>
      <Dialog
        open={true}
        //@ts-ignore
        TransitionComponent={Transition}
        PaperProps={{
          style: {
            width: "100%",
          },
        }}
        maxWidth="lg"
        classes={{
          scrollPaper: classes.topScrollPaper,
          paperScrollBody: classes.topPaperScrollBody,
        }}
      >
        {mutationRet.isLoading ? (
          <div style={{ height: 100, paddingTop: 10 }}>
            <div style={{ padding: 10 }}>
              <LoaderPaperComponent />
            </div>
            {typeof ClosedEventCall === "function" ? (
              <div style={{ position: "absolute", right: 0, top: 0 }}>
                <IconButton onClick={ClosedEventCall}>
                  <HighlightOffOutlinedIcon />
                </IconButton>
              </div>
            ) : null}
          </div>
        ) : mutationRet.isError ? (
          <>
            <div
              style={{
                paddingRight: "10px",
                paddingLeft: "10px",
                height: 100,
                paddingTop: 10,
              }}
            >
              <AppBar position="relative" color="primary">
                <Alert
                  severity="error"
                  errorMsg={mutationRet.error?.error_msg ?? "Unknow Error"}
                  errorDetail={mutationRet.error?.error_detail ?? ""}
                  color="error"
                />
                {typeof ClosedEventCall === "function" ? (
                  <div style={{ position: "absolute", right: 0, top: 0 }}>
                    <IconButton onClick={ClosedEventCall}>
                      <HighlightOffOutlinedIcon />
                    </IconButton>
                  </div>
                ) : null}
              </AppBar>
            </div>
          </>
        ) : (
          <MasterDetailsForm
            key={"OperatorDetails-" + defaultmode}
            metaData={operatorMasterDetailsMetaData}
            // ref={myRef}
            initialData={{
              _isNewRow: false,
              ...(rows?.[0]?.data ?? {}),
              DETAILS_DATA: mutationRet?.data || [],
            }}
            displayMode={"view"}
            isLoading={true}
            onSubmitData={onSubmitHandler}
            isNewRow={true}
            containerstyle={{
              padding: "10px",
            }}
            formStyle={{
              background: "white",
              height: "25vh",
              overflowY: "auto",
              overflowX: "hidden",
            }}
            formName={"OperatorMaster"}
            formNameMaster={"OperatorMaster"}
            onFormButtonClickHandel={onFormButtonClickHandel}
          >
            {({ isSubmitting, handleSubmit }) => {
              return (
                <>
                  <Button
                    onClick={(event) => {
                      if (
                        (rows[0]?.data?.LAST_ENTERED_BY || "").toLowerCase() ===
                        (
                          authController?.authState?.user?.id || ""
                        ).toLowerCase()
                      ) {
                        enqueueSnackbar("You can not accept your own entry.", {
                          variant: "warning",
                        });
                      } else {
                        setIsOpenAccept(true);
                      }
                    }}
                    // disabled={isSubmitting}
                    color={"primary"}
                  >
                    Accept
                  </Button>
                  <Button
                    onClick={(event) => {
                      if (
                        (rows[0]?.data?.LAST_ENTERED_BY || "").toLowerCase() ===
                        (
                          authController?.authState?.user?.id || ""
                        ).toLowerCase()
                      ) {
                        enqueueSnackbar("You can not reject your own entry.", {
                          variant: "warning",
                        });
                      } else {
                        setIsOpenReject(true);
                      }
                    }}
                    // disabled={isSubmitting}
                    color={"primary"}
                  >
                    Reject
                  </Button>
                  <Button
                    onClick={ClosedEventCall}
                    // disabled={isSubmitting}
                    color={"primary"}
                  >
                    Close
                  </Button>
                </>
              );
            }}
          </MasterDetailsForm>
        )}
        {isopenImgViewer ? (
          <ImgaeViewerandUpdate
            isOpen={isopenImgViewer}
            title={"Operator Icon"}
            onClose={() => {
              setOpenImgViewer(false);
            }}
            onSubmit={(fileData) => {
              myImgRef.current = fileData;
              setOpenImgViewer(false);
            }}
            filedata={myImgRef.current}
            formMode={"view"}
          />
        ) : null}
        {isOpenAccept ? (
          <PopupMessageAPIWrapper
            MessageTitle="Confirmation"
            Message="Do You want to accept this Request?"
            onActionYes={() => updateAcceptData(rows)}
            onActionNo={() => onActionCancel()}
            rows={rows[0]?.data ?? {}}
            open={isOpenAccept}
            loading={mutation.isLoading}
          />
        ) : null}
        {isOpenReject ? (
          <PopupMessageAPIWrapper
            MessageTitle="Confirmation"
            Message="Do You want to reject this Request?"
            onActionYes={() => updateRejectData(rows)}
            onActionNo={() => onActionCancel()}
            rows={rows[0]?.data ?? {}}
            open={isOpenReject}
            loading={mutation.isLoading}
          />
        ) : null}
      </Dialog>
    </>
  );
};

const ImgaeViewerandUpdate = ({
  isOpen,
  title,
  onClose,
  onSubmit,
  filedata,
  formMode,
}) => {
  const classes = useStyles();
  const fileURL = useRef<any | null>(null);
  const submitBtnRef = useRef<any | null>(null);
  const fileUploadControl = useRef<any | null>(null);
  const [filesdata, setFilesData] = useState<any>(filedata);
  const [filecnt, setFilecnt] = useState(0);
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
    setFilesData(base64?.[1]);
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
    setImageURL(filedata);
  }, []);
  return (
    <Dialog
      open={isOpen}
      //@ts-ignore
      TransitionComponent={Transition}
      fullWidth={false}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Tooltip
          key={"tooltip-" + formMode}
          title={formMode === "view" ? "" : "Double click to change the image"}
          placement={"top"}
          arrow={true}
        >
          <div
            className={classes.uploadWrapper}
            style={{
              width: 280,
              height: 280,
              background: "#cfcfcf",
              cursor: formMode === "view" ? "auto" : "pointer",
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
                  maxWidth: 250,
                  maxHeight: 250,
                  minWidth: 150,
                  minHeight: 150,
                }}
              />
            </Grid>
            <input
              name="fileselect"
              type="file"
              style={{ display: "none" }}
              ref={fileUploadControl}
              onChange={handleFileSelect}
              accept=".png,.jpg,.jpeg"
              onClick={(e) => {
                //to clear the file uploaded state to reupload the same file (AKA allow our handler to handle duplicate file)
                //@ts-ignore
                e.target.value = "";
              }}
            />
          </div>
        </Tooltip>
      </DialogContent>
      <DialogActions>
        <GradientButton onClick={onClose}>Close</GradientButton>
        {formMode === "view" ? null : (
          <>
            <GradientButton
              onClick={() => {
                setFilesData(null);
                fileURL.current = null;
              }}
            >
              Clear
            </GradientButton>
            {/* <GradientButton
              onClick={() => {
                onSubmit(filesdata);
              }}
            >
              Update
            </GradientButton> */}
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};
