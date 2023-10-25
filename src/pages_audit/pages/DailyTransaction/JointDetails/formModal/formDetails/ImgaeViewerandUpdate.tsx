import React, { useEffect, useRef, useState } from "react";
// import { useStyles } from "../../../profile/profilePhotoUpload/style";
import { useStyles } from "../../../../profile/profilePhotoUpload/style"
import { Dialog, DialogActions, DialogContent, DialogTitle, Grid, Tooltip } from "@mui/material";
import { GradientButton } from "components/styledComponent/button";
import { utilFunction } from "components/utils";
import { transformFileObject } from "components/fileUpload/utils";

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

  export default ImgaeViewerandUpdate;