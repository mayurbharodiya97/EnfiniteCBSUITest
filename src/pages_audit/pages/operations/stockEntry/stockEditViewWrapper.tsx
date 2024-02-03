import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Tooltip,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";

import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { stockViewEditMSTMetaData } from "./stockEditViewMetadata";
import { useLocation } from "react-router-dom";
import { useMutation, useQuery } from "react-query";
import { crudDocument, viewDocument } from "./api";
import { queryClient } from "cache";
import { MasterDetailsForm } from "components/formcomponent";
import { transformFileObject } from "components/fileUpload/utils";
import { utilFunction } from "components/utils";
import { GradientButton } from "components/styledComponent/button";
import { useStyles } from "pages_audit/pages/profile/profilePhotoUpload/style";

export const StockEditViewWrapper = ({ ClosedEventCall }) => {
  const { state: rows }: any = useLocation();
  const [isopenImgViewer, setOpenImgViewer] = useState(false);
  const myImgRef = useRef<any>(null);
  const [formMode, setFormMode] = useState("view");
  const myRef = useRef<any>(null);

  const viewDocuments = useQuery<any, any>(["viewDocument"], () =>
    viewDocument({
      COMP_CD: rows?.[0]?.data?.COMP_CD,
      BRANCH_CD: rows?.[0]?.data?.BRANCH_CD,
      REF_TRAN_CD: rows?.[0]?.data?.TRAN_CD,
    })
  );

  const crudDocuments: any = useMutation("uploadDocument", crudDocument, {
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
    setFieldErrors,
    actionFlag,
    displayData,
    setFieldError,
  }) => {
    //@ts-ignore
    endSubmit(true);
    console.log("<<<sub", data);

    // let apireq = {
    //   DETAILS_DATA: {
    //     isNewRow: [
    //       ...data?.DETAILS_DATA,
    //       {
    //         ENTERED_BRANCH_CD: "099 ",
    //         COMP_CD: "132 ",
    //         ACCT_TYPE: data?.ACCT_TYPE,
    //         ACCT_CD: data?.ACCT_CD,
    //         REF_TRAN_CD: data?.REF_TRAN_CD,
    //         ENTERED_COMP_CD: "132 ",
    //         REF_SR_CD: data?.REF_SR_CD,
    //         TABLE_NM: "stock",
    //         // DOC_DEC: "",
    //         // DOC_DATA: "",
    //         ACTIVE: "Y",
    //       },
    //     ],
    //     isDeleteRow: [],
    //     isUpdatedRow: [],
    //   },
    // };

    // crudDocuments.mutate(apireq);
  };

  // useEffect(() => {
  //   if (Boolean(rows?.[0]?.data?.DOC_DATA)) {
  //     myImgRef.current = rows?.[0]?.data?.DOC_DATA;
  //   }
  // }, [rows]);
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
          {formMode === "view" ? (
            <MasterDetailsForm
              key={"stockEntryUploadDOC" + formMode + viewDocuments.data}
              metaData={stockViewEditMSTMetaData}
              initialData={{
                ...rows?.[0]?.data,
                DETAILS_DATA: viewDocuments?.data,
              }}
              displayMode={formMode}
              // onSubmitData={}
              isLoading={viewDocuments?.isLoading}
              isNewRow={true}
              ref={myRef}
              formStyle={{
                background: "white",
                height: "40vh",
                overflowY: "auto",
                overflowX: "hidden",
              }}
              // onFormButtonClickHandel={onFormButtonClickHandel}
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
                      onClick={() => ClosedEventCall()}
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
              key={"stockEntryUploadDOC" + formMode + viewDocuments.data}
              metaData={stockViewEditMSTMetaData}
              initialData={{
                ...rows?.[0]?.data,
                DETAILS_DATA: viewDocuments?.data,
              }}
              displayMode={formMode}
              onSubmitData={onSubmitHandler}
              isLoading={viewDocuments?.isLoading}
              isNewRow={true}
              onClickActionEvent={(index, id, data) => {
                console.log("<<<onclick", index, id, data);
                setOpenImgViewer(true);
                if (data?.DOC_DATA) {
                  myImgRef.current = data?.DOC_DATA;
                }
              }}
              ref={myRef}
              formStyle={{
                background: "white",
                height: "40vh",
                overflowY: "auto",
                overflowX: "hidden",
              }}
              // onFormButtonClickHandel={onFormButtonClickHandel}
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
                      onClick={() => {
                        setFormMode("view");
                      }}
                      // disabled={isSubmitting}
                      color={"primary"}
                    >
                      Cancel
                    </Button>
                  </>
                );
              }}
            </MasterDetailsForm>
          ) : null}
        </>
      </Dialog>
      {isopenImgViewer ? (
        <ImgaeViewerandUpdate
          isOpen={isopenImgViewer}
          title={"Operator Icon"}
          onClose={() => {
            setOpenImgViewer(false);
          }}
          onSubmit={(fileData) => {
            console.log("<<<filrimg", fileData);
            myImgRef.current = fileData;
            setOpenImgViewer(false);
          }}
          filedata={myImgRef.current}
          formMode={formMode}
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
