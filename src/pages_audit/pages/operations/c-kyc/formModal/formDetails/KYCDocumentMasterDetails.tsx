import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Button, Dialog } from "@mui/material";
import { MasterDetailsForm } from "components/formcomponent";
import { useDialogStyles } from "pages_audit/common/dialogStyles";
import { cloneDeep } from "lodash";
import { documentMasterDetailsMetaData } from "./metadata/documentMasterDetailsMetaData";
import ImgaeViewerandUpdate from "./ImgaeViewerandUpdate";
import { useLocation } from "react-router-dom";
import { useMutation, useQuery } from "react-query";
import { FormWrapper } from "components/dyanmicForm/formWrapper";
import { InitialValuesType, SubmitFnType } from "packages/form";
import { extractMetaData } from "components/utils";
import { MetaDataType } from "components/dyanmicForm";
import { KYCDocumentMasterMetaData } from "./metadata/kycDocument/kycDocumentMetadata";
import { UploadTarget } from "components/fileUpload/uploadTarget";
import { FileObjectType } from "components/fileUpload/type";
import {
  transformFileObject,
  validateFilesAndAddToList,
} from "components/fileUpload/utils";
import {
  ImageViewer,
  NoPreview,
  PDFViewer,
} from "components/fileUpload/preView";
import { useSnackbar } from "notistack";
import { AuthContext } from "pages_audit/auth";
import * as API from "../../api";
import { CkycContext } from "../../CkycContext";

const KYCDocumentMasterDetails = ({
  ClosedEventCall,
  isDataChangedRef,
  defaultmode = "view",
  defaultFileData = [],
  allowedExtensions = ["pdf"],
  maxAllowedSize = 1024 * 1024 * 3,
}) => {
  const classes = useDialogStyles();
  const myImgRef = useRef<any>(null);
  const myRef = useRef<any>(null);
  const [formMode, setFormMode] = useState(defaultmode);
  const [isopenImgViewer, setOpenImgViewer] = useState(false);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<any>(defaultFileData);
  const onFormButtonClickHandel = (id) => {
    setOpenImgViewer(true);
  };
  const mysubdtlRef = useRef<any>({});
  const { enqueueSnackbar } = useSnackbar();
  const { authState } = useContext(AuthContext);
  const { state: rows }: any = useLocation();
  const { state } = useContext(CkycContext);
  // const updateOperatorMasterDetailsDataWrapperFn =
  // (updateMasterData) =>
  // async ({ data }: updateOperatorMasterDetailsDataType) => {
  //   return updateMasterData(data);
  // };
  // const mutationRet: any = useMutation(
  //   updateOperatorMasterDetailsDataWrapperFn(API.getOperatorDetailGridData)
  // );
  const customTransformFileObj = (currentObj) => {
    return transformFileObject({})(currentObj);
  };
  const validateFilesAndAddToListCB = useCallback(
    async (newFiles: File[], existingFiles: FileObjectType[] | undefined) => {
      if (newFiles.length > 0) {
        let resdata = newFiles.map((one) => customTransformFileObj(one));
        if (resdata.length > 0) {
          let filesObj: any = await Promise.all(resdata);

          let fileExt = filesObj?.[0]?.fileExt?.toUpperCase();
          if (
            fileExt === "JPG" ||
            fileExt === "JPEG" ||
            fileExt === "PNG" ||
            fileExt === "PDF"
          ) {
            let fileSize = filesObj?.[0]?.size;

            if (fileSize <= maxAllowedSize) {
              setFiles(filesObj);
              //   fileURL.current =
              //     typeof filesObj?.[0]?.blob === "object" &&
              //     Boolean(filesObj?.[0]?.blob)
              //       ? await URL.createObjectURL(filesObj?.[0]?.blob as any)
              //       : null;
              //   setImageData(filesObj?.[0]?.blob);

              //   fileName.current = filesObj?.[0]?.blob?.name;
              //   //submitBtnRef.current?.click?.();
              //   setFilecnt(filecnt + 1);
            } else {
              enqueueSnackbar("Image size should be less than 5 MB.", {
                variant: "warning",
              });
            }
          } else {
            enqueueSnackbar("Please Select Valid Format.", {
              variant: "warning",
            });
          }
        }
      }
    },
    [files, setFiles, maxAllowedSize, allowedExtensions]
  );

  // useEffect(() => {
  //   // console.log(rows[0]?.data, "efwqqqedqwsw", {
  //   //   _isNewRow: false,
  //   //   ...(rows?.[0]?.data ?? {}),
  //   //   // DETAILS_DATA: mutationRet.data || [],
  //   })
  // }, [rows])

  useEffect(() => {
    if (files && files.length > 0) {
      console.log(
        "fwefewqdqw",
        files[0]?._mimeType,
        files[0]?.blob,
        files[0]?.name
      );
    }
  }, [files]);

  let metadataold = {};
  metadataold = cloneDeep(documentMasterDetailsMetaData);

  const AddNewRow = () => {
    myRef.current?.addNewRow(true);
  };

  const onSubmitHandler: SubmitFnType = (
    data: any,
    displayData,
    endSubmit,
    setFieldError,
    actionFlag
  ) => {
    //@ts-ignore
    // endSubmit(true);
  };

  useEffect(() => {}, [rows]);

  // getDocumentTypes
  const {
    data: DocTypes,
    isError,
    isLoading: isKYCGridDocLoading,
    error,
    refetch,
  } = useQuery<any, any>(
    [
      "getKYCDocumentGridData",
      // {
      //   COMP_CD: authState?.companyID ?? "",
      //   BRANCH_CD: authState?.user?.branchCode ?? "",
      //   CUST_TYPE: state?.entityTypectx,
      //   CONSTITUTION_TYPE: state?.constitutionValuectx
      // }, {enabled: !!state?.entityTypectx}
    ],
    () =>
      API.getDocumentTypes({
        TRAN_CD: authState?.companyID ?? "",
        SR_CD: state?.entityTypectx,
        DOC_TYPE: state?.constitutionValuectx,
      })
  );

  return (
    <Dialog
      open={true}
      //@ts-ignore
      // TransitionComponent={Transition}
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
      <FormWrapper
        key={"MobileAppReviewGridMetaData"}
        // metaData={MobileAppReviewMetaData}
        metaData={
          extractMetaData(
            KYCDocumentMasterMetaData,
            formMode === "add" ? "new" : "edit"
          ) as MetaDataType
        }
        initialValues={rows?.[0]?.data as InitialValuesType}
        onSubmitHandler={onSubmitHandler}
        //@ts-ignore
        displayMode={formMode}
        formStyle={{
          background: "white",
          // height: "30vh",
          // overflowY: "auto",
          // overflowX: "hidden",
        }}
      >
        {({ isSubmitting, handleSubmit }) => {
          console.log("q3qwedqwe", isSubmitting);
          return (
            <>
              <Button
                onClick={(event) => {
                  handleSubmit(event, "Save");
                }}
                // disabled={isSubmitting}
                //endIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                color={"primary"}
              >
                Save
              </Button>
              <Button
                onClick={ClosedEventCall}
                color={"primary"}
                // disabled={isSubmitting}
              >
                Cancel
              </Button>
            </>
          );
        }}
      </FormWrapper>
      <UploadTarget
        existingFiles={files}
        onDrop={validateFilesAndAddToListCB}
        disabled={loading}
      />
      {/* <Dialog
            open={Boolean(files)}
            maxWidth="lg"
            onClose={() => setFiles(null)}
            PaperProps={{
              style: { width: "100%", height: "100%" },
            }}
          >             */}
      {files && files.length > 0 && files[0]?._mimeType?.includes("pdf") ? (
        <PDFViewer
          blob={files[0]?.blob}
          fileName={files[0]?.name}
          onClose={() => {
            setFiles(null);
          }}
          // onClose={() => setAction(null)}
        />
      ) : files &&
        files.length > 0 &&
        files[0]?._mimeType?.includes("image") ? (
        <ImageViewer
          blob={files[0]?.blob}
          fileName={files[0]?.name}
          onClose={() => {
            setFiles(null);
          }}
          // onClose={() => setAction(null)}
        />
      ) : files && files.length > 0 ? (
        <NoPreview
          fileName={files[0]?.name}
          onClose={() => {
            setFiles(null);
          }}
          // onClose={() => setAction(null)}
          message={"No preview available for the file"}
        />
      ) : null}
      {/* </Dialog> */}
    </Dialog>
  );
};

export default KYCDocumentMasterDetails;
