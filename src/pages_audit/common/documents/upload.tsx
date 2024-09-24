import { useContext, useEffect } from "react";
import { FileUploadControl } from "components/fileUpload";
import { useQuery } from "react-query";
import { DOCCRUDContext } from "./context";
import { ClearCacheContext } from "cache";
import { useSnackbar } from "notistack";
import { LoaderPaperComponent } from "components/common/loaderPaper";

export const UploadDocumentsApiWrapper = ({
  onClose,
  editableFileName,
  dataChangedRef,
  currentAction,
}) => {
  const { uploadDocuments, getDocumentUploadAddtionalFieldsMetaData, context } =
    useContext(DOCCRUDContext);
  const currentDoc = context.docCategory.filter(
    (one) => one.type === currentAction
  )[0];
  const docType = currentDoc.type;
  const categoryCD = currentDoc.categoryCD;
  const primaryDocType = context.docCategory.filter(
    (one) => one.primary === true
  )[0].type;
  const { addEntry } = useContext(ClearCacheContext);
  const { enqueueSnackbar } = useSnackbar();
  const closeWrapper = () => {
    if (dataChangedRef.current === true) {
      enqueueSnackbar("Documents Successfully uploaded", {
        variant: "success",
      });
    }
    onClose();
  };

  useEffect(() => {
    addEntry([
      "getDocumentUploadAddtionalFieldsMetaData",
      context.moduleType,
      context.productType,
      docType,
    ]);
  }, [context, addEntry, docType]);
  const query = useQuery(
    [
      "getDocumentUploadAddtionalFieldsMetaData",
      context.moduleType,
      context.productType,
      docType,
    ],
    () =>
      getDocumentUploadAddtionalFieldsMetaData.fn(
        getDocumentUploadAddtionalFieldsMetaData.args
      )(docType)
  );
  //@ts-ignore
  let error = `${query.error?.error_msg ?? "unknown error occured"}`;
  const renderResult = query.isLoading ? (
    <LoaderPaperComponent />
  ) : query.isError === true ? (
    <span>{error}</span>
  ) : (
    <FileUploadControl
      onClose={closeWrapper}
      additionalColumns={query.data}
      editableFileName={editableFileName}
      dataChangedRef={dataChangedRef}
      onUpload={uploadDocuments.fn({
        ...uploadDocuments.args,
        docCategory: primaryDocType,
        categoryCD: categoryCD,
      })}
      gridProps={{ ...context, docCategory: docType }}
      maxAllowedSize={1024 * 1204 * 10} //10Mb file
      allowedExtensions={
        context.productType === "partner"
          ? ["pdf", "jpg", "jpeg", "png"]
          : ["kyc", "other"].indexOf(docType) >= 0
          ? ["pdf", "jpg", "jpeg", "png"]
          : ["pdf"]
      }
    />
  );
  return renderResult;
};
