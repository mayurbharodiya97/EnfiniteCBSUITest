import { Fragment, useContext, useEffect, useRef, useState } from "react";
import { Transition } from "pages_audit/common";
import { useDialogStyles } from "pages_audit/common/dialogStyles";
import { MasterDetailsForm } from "components/formcomponent";
import { operatorMasterDetailsMetaData } from "./metadata";
import { MasterDetailsMetaData } from "components/formcomponent/masterDetails/types";
import { cloneDeep } from "lodash";
import { useStyles } from "../../../profile/profilePhotoUpload/style";
import { GradientButton } from "components/styledComponent/button";
import { Tooltip } from "components/styledComponent/tooltip";
import { transformFileObject } from "components/fileUpload/utils";
import { utilFunction } from "components/utils";
import { useLocation } from "react-router-dom";
import { useMutation } from "react-query";
import * as API from "../api";
import { AuthContext } from "pages_audit/auth";
import { LoaderPaperComponent } from "components/common/loaderPaper";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import { Alert } from "components/common/alert";
import { useSnackbar } from "notistack";
import { SpecialAmountGrid } from "./specialAmount";
import {
  AppBar,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
} from "@mui/material";

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
export const OperatorMasterDetails = ({
  ClosedEventCall,
  isDataChangedRef,
  defaultmode = "view",
}) => {
  const classes = useDialogStyles();
  const myRef = useRef<any>(null);
  const myImgRef = useRef<any>(null);
  const mysubdtlRef = useRef<any>({});
  const [isLoading, setLoading] = useState(false);
  const [isSpecialAmount, setSpecialAmount] = useState(false);
  const [isopenImgViewer, setOpenImgViewer] = useState(false);
  const [formMode, setFormMode] = useState(defaultmode);
  const [metadata, setMetadata] = useState<any>({});
  const [formName, setFormName] = useState<any>("");
  const { state: rows }: any = useLocation();
  const { authState } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();

  const mutationRet: any = useMutation(
    updateOperatorMasterDetailsDataWrapperFn(API.getOperatorDetailGridData)
  );
  const mutation = useMutation(
    updateOperatorMasterDetailsDataWrapperFn(
      API.updateOperatorMasterDetailGridData
    ),
    {
      onError: (error: any, { endSubmit, setLoading }) => {
        setLoading(false);
        endSubmit(true, error?.error_msg, error?.error_detail);
      },
      onSuccess: (data, { endSubmit, setLoading }) => {
        setLoading(false);
        endSubmit(true);
        enqueueSnackbar("Record Updated successfully.", {
          variant: "success",
        });
        isDataChangedRef.current = true;
        ClosedEventCall();
      },
    }
  );
  const AddNewRow = () => {
    myRef.current?.addNewRow(true);
  };

  const onSubmitHandler = ({
    data,
    resultValueObj,
    resultDisplayValueObj,
    endSubmit,
    setFieldErrors,
    actionFlag,
  }) => {
    if (
      formMode !== "new" &&
      data?._UPDATEDCOLUMNS?.length === 0 &&
      data?.DETAILS_DATA?.isDeleteRow?.length === 0 &&
      data?.DETAILS_DATA?.isNewRow?.length === 0 &&
      data?.DETAILS_DATA?.isUpdatedRow?.length === 0 &&
      rows?.[0]?.data?.OPERATOR_IMAGE === myImgRef.current
    ) {
      setFormMode("view");
    } else {
      if (
        formMode !== "new" &&
        rows?.[0]?.data?.OPERATOR_IMAGE === myImgRef.current
      ) {
        data["OPERATOR_IMAGE"] = "";
      } else {
        data["OPERATOR_IMAGE"] = Boolean(myImgRef.current)
          ? myImgRef.current
          : "";
        data._UPDATEDCOLUMNS.push("OPERATOR_IMAGE");
      }
      data["TRN_LABEL_BN"] = "";
      data["TRN_LABEL_EN"] = "";
      data["TRN_TYPE"] = "";
      if (data?.DETAILS_DATA?.isNewRow?.length > 0) {
        data.DETAILS_DATA.isNewRow = data?.DETAILS_DATA?.isNewRow?.map(
          (item) => {
            return {
              ...item,
              ACTIVE: item.ACTIVE ? "Y" : "N",
              CHARGE_ALLOW: item.CHARGE_ALLOW ? "Y" : "N",
            };
          }
        );
      }
      if (data?.DETAILS_DATA?.isUpdatedRow?.length > 0) {
        data.DETAILS_DATA.isUpdatedRow = data?.DETAILS_DATA?.isUpdatedRow?.map(
          (item) => {
            return {
              ...item,
              ACTIVE: item.ACTIVE ? "Y" : "N",
              CHARGE_ALLOW: item.CHARGE_ALLOW ? "Y" : "N",
              _OLDROWVALUE: {
                ...item._OLDROWVALUE,
                ACTIVE: Boolean(item._OLDROWVALUE.ACTIVE) ? "Y" : "N",
                CHARGE_ALLOW: Boolean(item._OLDROWVALUE.CHARGE_ALLOW)
                  ? "Y"
                  : "N",
              },
            };
          }
        );
      }
      data["COMP_CD"] = authState.companyID;
      setLoading(true);
      mutation.mutate({ data, endSubmit, setLoading });
    }
  };
  let metadataold: MasterDetailsMetaData = {} as MasterDetailsMetaData;
  metadataold = cloneDeep(
    operatorMasterDetailsMetaData
  ) as MasterDetailsMetaData;
  useEffect(() => {
    //@ts-ignore
    window._CHANGE_OPERATOR_TYPE = (value) => {
      if (value === "M") {
        metadataold.detailsGrid.columns = metadataold.detailsGrid.columns.map(
          (item) => {
            if (item.accessor === "OPTION_TYPE") {
              return {
                ...item,
                options: () => {
                  return [
                    { value: "PREPAID", label: "PREPAID" },
                    { value: "POSTPAID", label: "POSTPAID" },
                  ];
                },
              };
            } else {
              return item;
            }
          }
        );
        setMetadata(metadataold);
        setFormName("OperatorMaster-Mobile");
      } else if (value === "I") {
        metadataold.detailsGrid.columns = metadataold.detailsGrid.columns.map(
          (item) => {
            if (item.accessor === "OPTION_TYPE") {
              return {
                ...item,
                options: () => {
                  return [{ value: "INTERNET", label: "INTERNET" }];
                },
              };
            } else {
              return item;
            }
          }
        );
        //console.log(metadataold);
        setMetadata(metadataold);
        setFormName("OperatorMaster-Internet");
      }
    };

    if (Boolean(rows?.[0]?.data?.OPERATOR_TYPE)) {
      //@ts-ignore
      window?._CHANGE_OPERATOR_TYPE?.(rows?.[0]?.data?.OPERATOR_TYPE);
    } else {
      setMetadata(metadataold);
    }
    if (defaultmode !== "new") {
      mutationRet.mutate({
        data: {
          TRAN_CD: rows[0]?.data?.TRAN_CD,
          COMP_CD: authState.companyID,
        },
      });
      mysubdtlRef.current = {
        ...mysubdtlRef.current,
        TRAN_CD: rows[0]?.data?.TRAN_CD,
        COMP_CD: authState.companyID,
      };
    }
    return () => {
      //@ts-ignore
      window._CHANGE_OPERATOR_TYPE = null;
    };
  }, []);
  const onFormButtonClickHandel = (id) => {
    setOpenImgViewer(true);
  };
  useEffect(() => {
    if (Boolean(rows?.[0]?.data?.OPERATOR_IMAGE)) {
      myImgRef.current = rows?.[0]?.data?.OPERATOR_IMAGE;
    }
  }, [rows]);

  return (
    <Fragment>
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
        ) : formMode === "new" ? (
          <MasterDetailsForm
            metaData={metadata}
            ref={myRef}
            initialData={{ _isNewRow: true, DETAILS_DATA: [] }}
            displayMode={"New"}
            isLoading={isLoading}
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
            formName={formName}
            formNameMaster={"OperatorMaster"}
            onFormButtonClickHandel={onFormButtonClickHandel}
          >
            {({ isSubmitting, handleSubmit }) => {
              return (
                <>
                  <Button
                    onClick={AddNewRow}
                    disabled={isSubmitting}
                    //endIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                    color={"primary"}
                  >
                    Add Row
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    endIcon={
                      isSubmitting ? <CircularProgress size={20} /> : null
                    }
                    color={"primary"}
                  >
                    Save
                  </Button>
                  <Button
                    onClick={ClosedEventCall}
                    disabled={isSubmitting}
                    color={"primary"}
                  >
                    Cancel
                  </Button>
                </>
              );
            }}
          </MasterDetailsForm>
        ) : formMode === "view" ? (
          <MasterDetailsForm
            key={"OperatorDetails-" + formMode}
            metaData={metadata}
            ref={myRef}
            initialData={{
              _isNewRow: false,
              ...(rows?.[0]?.data ?? {}),
              DETAILS_DATA: mutationRet.data || [],
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
            formName={formName}
            formNameMaster={"OperatorMaster"}
            onFormButtonClickHandel={onFormButtonClickHandel}
          >
            {({ isSubmitting, handleSubmit }) => {
              return (
                <>
                  <Button
                    onClick={() => {
                      setFormMode("edit");
                    }}
                    // disabled={isSubmitting}
                    // endIcon={
                    //   isSubmitting ? <CircularProgress size={20} /> : null
                    // }
                    color={"primary"}
                  >
                    Edit
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
        ) : formMode === "edit" ? (
          <MasterDetailsForm
            key={"OperatorDetails-" + formMode}
            metaData={metadata}
            ref={myRef}
            initialData={{
              _isNewRow: false,
              ...(rows?.[0]?.data ?? {}),
              DETAILS_DATA: mutationRet.data || [],
            }}
            displayMode={"edit"}
            isLoading={isLoading}
            onSubmitData={onSubmitHandler}
            isNewRow={false}
            containerstyle={{
              padding: "10px",
            }}
            formStyle={{
              background: "white",
              height: "25vh",
              overflowY: "auto",
              overflowX: "hidden",
            }}
            formName={formName}
            formNameMaster={"OperatorMaster"}
            onFormButtonClickHandel={onFormButtonClickHandel}
            onClickActionEvent={(index, id, data) => {
              //console.log(index, id, data);
              mysubdtlRef.current = {
                ...mysubdtlRef.current,
                SR_CD: data?.SR_CD,
              };
              setSpecialAmount(true);
            }}
          >
            {({ isSubmitting, handleSubmit }) => {
              return (
                <>
                  <Button
                    onClick={AddNewRow}
                    disabled={isSubmitting}
                    //endIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                    color={"primary"}
                  >
                    Add Row
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    endIcon={
                      isSubmitting ? <CircularProgress size={20} /> : null
                    }
                    color={"primary"}
                  >
                    Save
                  </Button>
                  <Button
                    onClick={() => {
                      setFormMode("view");
                    }}
                    disabled={isSubmitting}
                    color={"primary"}
                  >
                    Cancel
                  </Button>
                </>
              );
            }}
          </MasterDetailsForm>
        ) : null}
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
            formMode={formMode}
          />
        ) : null}
        {isSpecialAmount ? (
          <SpecialAmountGrid
            isOpen={isSpecialAmount}
            formMode={formMode}
            onClose={() => {
              setSpecialAmount(false);
            }}
            reqDataRef={mysubdtlRef}
          />
        ) : null}
      </Dialog>
    </Fragment>
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
        //console.log(filesObj);
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
            <GradientButton
              onClick={() => {
                onSubmit(filesdata);
              }}
            >
              Update
            </GradientButton>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};
