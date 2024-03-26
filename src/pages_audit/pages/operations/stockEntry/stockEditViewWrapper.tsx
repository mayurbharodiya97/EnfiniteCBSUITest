import {
  AppBar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  LinearProgress,
  Tooltip,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { stockViewEditMSTMetaData } from "./stockEditViewMetadata";
import { useLocation } from "react-router-dom";
import { useMutation, useQuery } from "react-query";
import { uploadDocument, viewDocument } from "./api";
import { queryClient } from "cache";
import { MasterDetailsForm } from "components/formcomponent";
import { transformFileObject } from "components/fileUpload/utils";
import { utilFunction } from "components/utils";
import { GradientButton } from "components/styledComponent/button";
import { useStyles } from "pages_audit/pages/profile/profilePhotoUpload/style";
import { Alert } from "components/common/alert";
import { LinearProgressBarSpacer } from "components/dataTable/linerProgressBarSpacer";
import { LoaderPaperComponent } from "components/common/loaderPaper";

export const StockEditViewWrapper = ({ navigate }) => {
  const [isopenImgViewer, setOpenImgViewer] = useState(false);
  const { state: rows }: any = useLocation();
  const myImgRef = useRef<any>(null);
  const myRef = useRef<any>(null);

  const viewDocuments = useQuery<any, any>(["viewDocument"], () =>
    viewDocument({
      COMP_CD: rows?.[0]?.data?.COMP_CD,
      BRANCH_CD: rows?.[0]?.data?.BRANCH_CD,
      REF_TRAN_CD: rows?.[0]?.data?.TRAN_CD,
    })
  );

  const uploadDocuments: any = useMutation("uploadDocument", uploadDocument, {
    onSuccess: (data) => {},
    onError: (error: any) => {},
  });

  useEffect(() => {
    return () => {
      queryClient.removeQueries(["viewDocument"]);
      queryClient.removeQueries(["uploadDocument"]);
    };
  }, []);

  const AddNewRow = () => {
    myRef.current?.addNewRow(true);
  };

  const onSubmitHandler = ({
    data,
    resultValueObj,
    resultDisplayValueObj,
    endSubmit,
  }) => {
    if (
      data?.DETAILS_DATA?.isNewRow.length ||
      data?.DETAILS_DATA?.isUpdatedRow.length
    ) {
      let apiReq = {
        ENTERED_COMP_CD: data?.ENTERED_COMP_CD,
        ENTERED_BRANCH_CD: data?.ENTERED_BRANCH_CD,
        TRAN_CD: data?.TRAN_CD,
        DETAILS_DATA: data?.DETAILS_DATA,
      };
      uploadDocuments.mutate(apiReq);
    }

    //@ts-ignore
    endSubmit(true);
  };

  return (
    <>
      <Dialog
        open={true}
        fullWidth={true}
        PaperProps={{
          style: {
            maxWidth: "1150px",
          },
        }}
      >
        <>
          {uploadDocuments.isLoading ? (
            <LinearProgress color="secondary" />
          ) : viewDocuments?.isError || uploadDocuments?.isError ? (
            <div style={{ paddingRight: "10px", paddingLeft: "10px" }}>
              <AppBar position="relative" color="primary">
                <Alert
                  severity="error"
                  errorMsg={
                    viewDocuments?.error?.error_msg ??
                    uploadDocuments?.error?.error_msg ??
                    "Unknow Error"
                  }
                  errorDetail={
                    viewDocuments?.error?.error_detail ??
                    uploadDocuments?.error?.error_detail ??
                    ""
                  }
                  color="error"
                />
              </AppBar>
            </div>
          ) : (
            <LinearProgressBarSpacer />
          )}

          {viewDocuments.isLoading ? (
            <div style={{ margin: "2rem" }}>
              <LoaderPaperComponent />
            </div>
          ) : (
            <MasterDetailsForm
              key={"stockEntryUploadDOC" + viewDocuments.isSuccess}
              metaData={stockViewEditMSTMetaData}
              initialData={{
                _isNewRow: false,
                ...rows?.[0]?.data,
                DETAILS_DATA: viewDocuments?.data,
              }}
              displayMode={"edit"}
              onSubmitData={onSubmitHandler}
              isLoading={viewDocuments?.isLoading}
              isNewRow={false}
              onClickActionEvent={(index, id, data) => {
                setOpenImgViewer(true);
                myImgRef.current = data;
              }}
              ref={myRef}
              formStyle={{
                background: "white",
                height: "40vh",
                overflowY: "auto",
                overflowX: "hidden",
              }}
            >
              {({ isSubmitting, handleSubmit }) => {
                return (
                  <>
                    <Button
                      onClick={AddNewRow}
                      // disabled={isSubmitting}
                      //endIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                      color={"primary"}
                    >
                      Add Row
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      // disabled={isSubmitting}
                      // endIcon={
                      //   isSubmitting ? <CircularProgress size={20} /> : null
                      // }
                      color={"primary"}
                    >
                      Save
                    </Button>
                    <Button
                      onClick={() => navigate(".")}
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
        </>
      </Dialog>

      {isopenImgViewer ? (
        <ImgaeViewerandUpdate
          isOpen={isopenImgViewer}
          title={"Document Image"}
          onClose={() => {
            setOpenImgViewer(false);
          }}
          onSubmit={(fileData: any) => {
            setOpenImgViewer(false);
            myRef.current.setGridData((old) => {
              let gridData: any = [];
              gridData = old.map((row) => {
                if (row.SR_CD === myImgRef.current.SR_CD) {
                  return {
                    ...row,
                    DOC_DATA: fileData,
                    _isTouchedCol: {
                      ...row._isTouchedCol,
                      DOC_DATA: true,
                    },
                  };
                } else {
                  return { ...row };
                }
              });
              return [...gridData];
            });
          }}
          filedata={myImgRef.current.DOC_DATA}
        />
      ) : null}
    </>
  );
};

const ImgaeViewerandUpdate = ({
  isOpen,
  title,
  onClose,
  onSubmit,
  filedata,
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
        submitBtnRef.current?.click?.();
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
    } else {
      fileURL.current = "";
      setFilecnt(filecnt + 1);
    }
  };
  useEffect(() => {
    setImageURL(filedata);
  }, []);
  return (
    <Dialog
      open={true}
      //@ts-ignore
      // TransitionComponent={Transition}
      fullWidth={false}
      PaperProps={{
        style: {
          minWidth: "530px",
        },
      }}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Tooltip
          key={"tooltip-"}
          title={"Double click to change the image"}
          placement={"top"}
          arrow={true}
        >
          <div
            className={classes.uploadWrapper}
            style={{
              width: 480,
              height: 325,
              background: "#cfcfcf",
              cursor: "pointer",
            }}
            onDoubleClick={() => {
              fileUploadControl?.current?.click();
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
                  maxWidth: 465,
                  maxHeight: 368,
                  minWidth: 225,
                  minHeight: 308,
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
      <DialogActions sx={{ paddingRight: "24px" }}>
        <GradientButton onClick={onClose}>Close</GradientButton>
        <>
          <GradientButton
            onClick={() => {
              setFilesData("");
              fileURL.current = null;
              // onSubmit("")
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
      </DialogActions>
    </Dialog>
  );
};
