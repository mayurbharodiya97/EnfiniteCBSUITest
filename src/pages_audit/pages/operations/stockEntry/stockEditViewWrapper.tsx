import {
  AppBar,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
} from "@mui/material";
import React, { useContext, useEffect, useRef, useState } from "react";
import { stockViewEditMSTMetaData } from "./stockEditViewMetadata";
import { useLocation } from "react-router-dom";
import { useMutation, useQuery } from "react-query";
import { uploadDocument, viewDocument } from "./api";
import { queryClient } from "cache";
import { MasterDetailsForm } from "components/formcomponent";
import { transformFileObject } from "components/fileUpload/utils";
import { utilFunction } from "components/utils";
import { GradientButton } from "components/styledComponent/button";
import { Alert } from "components/common/alert";
import { LoaderPaperComponent } from "components/common/loaderPaper";
import { enqueueSnackbar } from "notistack";
import { AuthContext } from "pages_audit/auth";

export const StockEditViewWrapper = ({ navigate, stockEntryGridData }) => {
  const [isopenImgViewer, setOpenImgViewer] = useState(false);
  const { state: rows }: any = useLocation();
  const myImgRef = useRef<any>(null);
  const myRef = useRef<any>(null);
  const { authState } = useContext(AuthContext);

  const viewDocuments = useQuery<any, any>(["viewDocument"], () =>
    viewDocument({
      COMP_CD: rows?.[0]?.data?.COMP_CD,
      BRANCH_CD: rows?.[0]?.data?.BRANCH_CD,
      REF_TRAN_CD: rows?.[0]?.data?.TRAN_CD,
    })
  );

  const uploadDocuments: any = useMutation("uploadDocument", uploadDocument, {
    onSuccess: (data, variables) => {
      stockEntryGridData.mutate({
        COMP_CD: rows?.[0]?.data?.COMP_CD,
        BRANCH_CD: rows?.[0]?.data?.BRANCH_CD,
        ACCT_CD: rows?.[0]?.data?.ACCT_CD,
        ACCT_TYPE: rows?.[0]?.data?.ACCT_TYPE,
        A_USER_LEVEL: authState?.role,
        A_GD_DATE: authState?.workingDate,
      });
      if (
        variables?.DETAILS_DATA?.isNewRow.length &&
        variables?.DETAILS_DATA?.isUpdatedRow.length
      ) {
        enqueueSnackbar("Data insert & update successfully", {
          variant: "success",
        });
      } else if (variables?.DETAILS_DATA?.isNewRow.length) {
        enqueueSnackbar("Document insert successfully", {
          variant: "success",
        });
      } else if (variables?.DETAILS_DATA?.isUpdatedRow.length) {
        enqueueSnackbar("Data Update successfully", {
          variant: "success",
        });
      }
    },
    onError: (error: any) => {},
  });

  useEffect(() => {
    return () => {
      queryClient.removeQueries(["viewDocument"]);
      queryClient.removeQueries(["uploadDocument"]);
    };
  }, []);

  const AddNewRow = async () => {
    myRef.current?.addNewRow(true, {
      COMP_CD: rows?.[0]?.data?.COMP_CD,
      BRANCH_CD: rows?.[0]?.data?.BRANCH_CD,
      REF_TRAN_CD: rows?.[0]?.data?.TRAN_CD,
      ACCT_TYPE: rows?.[0]?.data?.ACCT_TYPE,
      ACCT_CD: rows?.[0]?.data?.ACCT_CD,
      DOC_CD: "TRN/047",
      ENTERED_COMP_CD: rows?.[0]?.data?.ENTERED_COMP_CD,
      ENTERED_BRANCH_CD: rows?.[0]?.data?.ENTERED_BRANCH_CD,
      ACTIVE: "Y",
    });
  };

  const onSubmitHandler = ({
    data,
    resultValueObj,
    resultDisplayValueObj,
    endSubmit,
  }) => {
    const { isNewRow, isUpdatedRow } = data?.DETAILS_DATA || {};

    if (isNewRow?.length || isUpdatedRow?.length) {
      [isNewRow, isUpdatedRow].forEach((rows) => {
        if (rows) {
          rows.forEach(
            (item) => (item.ACTIVE = Boolean(item.ACTIVE) ? "Y" : "N")
          );
        }
      });
      const apiReq = {
        ENTERED_COMP_CD: data?.ENTERED_COMP_CD,
        ENTERED_BRANCH_CD: data?.ENTERED_BRANCH_CD,
        TRAN_CD: data?.TRAN_CD,
        ACCT_TYPE: data?.ACCT_TYPE,
        ACCT_CD: data?.ACCT_CD,
        DETAILS_DATA: data?.DETAILS_DATA,
      };
      uploadDocuments.mutate(apiReq);
    }
    //@ts-ignore
    endSubmit(true);
  };

  const handleDownloadImage = (DOC_DATA) => {
    const imageData = DOC_DATA;
    const byteCharacters = atob(imageData);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "image/jpeg" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "image.jpg";
    document.body.appendChild(link);
    link.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(link);
  };

  const customTransformFileObj = (currentObj) => {
    return transformFileObject({})(currentObj);
  };

  const handleImageChange = async (e) => {
    const files = e.target.files;
    const filesArray = Array.from(files);
    if (filesArray.length > 0) {
      let resdata = filesArray.map((one) => customTransformFileObj(one));
      if (resdata.length > 0) {
        let filesObj: any = await Promise.all(resdata);
        let base64 = await utilFunction.convertBlobToBase64(
          filesObj?.[0]?.blob
        );
        myRef.current.setGridData((old) => {
          let gridData: any = [];
          gridData = old.map((row) => {
            if (row.SR_CD === myImgRef.current.SR_CD) {
              return {
                ...row,
                DOC_DATA: base64?.[1],
              };
            } else {
              return { ...row };
            }
          });
          return [...gridData];
        });
      }
    }
  };

  const openFilePicker = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.style.display = "none";
    fileInput.addEventListener("change", handleImageChange);
    document.body.appendChild(fileInput);
    fileInput.click();
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
          {viewDocuments?.isError || uploadDocuments?.isError ? (
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
          ) : null}

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
              onSubmitData={onSubmitHandler}
              isLoading={uploadDocuments?.isLoading}
              isNewRow={false}
              onClickActionEvent={(index, id, data) => {
                if (id === "VIEW_DOC") {
                  if (data?.DOC_DATA) {
                    myImgRef.current = data;
                    setOpenImgViewer(true);
                  } else {
                    myImgRef.current = data;
                    openFilePicker();
                  }
                }
                if (id === "DOWNLOAD") {
                  handleDownloadImage(data?.DOC_DATA);
                }
              }}
              ref={myRef}
              formStyle={{
                background: "white",
                height: "43vh",
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
                      Add New Document
                    </Button>

                    <Button
                      onClick={handleSubmit}
                      // disabled={isSubmitting}
                      endIcon={
                        isSubmitting ? <CircularProgress size={20} /> : null
                      }
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
          title={"Document Image"}
          onClose={() => {
            setOpenImgViewer(false);
          }}
          filedata={myImgRef.current.DOC_DATA}
        />
      ) : null}
    </>
  );
};

const ImgaeViewerandUpdate = ({ title, onClose, filedata }) => {
  const fileURL = useRef<any | null>(null);
  const [filecnt, setFilecnt] = useState(0);

  const setImageURL = async (filedata) => {
    if (filedata) {
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
      fullWidth={false}
      PaperProps={{
        style: {
          minWidth: "530px",
        },
      }}
    >
      <DialogActions
        sx={{
          paddingRight: "24px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <DialogTitle>{title}</DialogTitle>
        <GradientButton onClick={onClose}>Close</GradientButton>{" "}
      </DialogActions>
      <DialogContent
        sx={{
          pt: 0,
        }}
      >
        <div
          style={{
            width: 540,
            height: 357,
            display: "flex",
            justifyContent: "center",
            background: "#cfcfcf",
          }}
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
            accept=".png,.jpg,.jpeg"
            onClick={(e) => {
              //@ts-ignore
              e.target.value = "";
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
