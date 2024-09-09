import { useContext, useRef, useState, useEffect } from "react";
import { useMutation, useQuery } from "react-query";
import GridWrapper from "components/dataTableStatic";
import { ClearCacheContext } from "cache";
import { DOCCRUDContext } from "./context";
import { useSnackbar } from "notistack";
import { LoaderPaperComponent } from "components/common/loaderPaper";
import Alert from "@mui/material/Alert";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  LinearProgress,
} from "@mui/material";

interface DeleteFormDataType {
  docType: string;
  data?: any;
}

const updateDocumentDataFnWrapper =
  (updateDocuments) =>
  async ({ docType, data }: DeleteFormDataType) => {
    return updateDocuments(docType, data);
  };

export const UpdateDocumentData = ({
  row: { data, id },
  closeDialog,
  dataChangedRef,
}) => {
  const [gridData, setGridData] = useState(Array.isArray(data) ? data : [data]);
  const { updateDocument, getDocumentEditGridMetaData, context } =
    useContext(DOCCRUDContext);
  const docType = context.docCategory.filter(
    (one) => one.categoryCD === data.docCategory
  )[0].type;

  const primaryDocType = context.docCategory.filter(
    (one) => one.primary === true
  )[0].type;
  const { addEntry } = useContext(ClearCacheContext);
  const { enqueueSnackbar } = useSnackbar();
  const gridRef = useRef<any>(null);
  useEffect(() => {
    addEntry([
      "getDocumentEditGridMetaData",
      context.moduleType,
      context.productType ?? "legal",
      docType,
    ]);
  }, [addEntry, context, docType]);
  const query = useQuery(
    [
      "getDocumentEditGridMetaData",
      context.moduleType,
      context.productType ?? "legal",
      docType,
    ],
    () =>
      getDocumentEditGridMetaData.fn(getDocumentEditGridMetaData.args)(docType)
  );

  const mutation = useMutation(
    updateDocumentDataFnWrapper(updateDocument.fn(updateDocument.args)),
    {
      onError: (error: any) => {},
      onSuccess: (data) => {
        dataChangedRef.current = true;
        enqueueSnackbar("Document changes successful", { variant: "success" });
        closeDialog();
      },
    }
  );

  const sendDataForUpdate = async () => {
    let { hasError, data } = await gridRef?.current?.validate?.();
    if (hasError === true) {
      setGridData(data);
    } else {
      let result = gridRef?.current?.cleanData?.();
      await mutation.mutate({ docType: primaryDocType, data: result });
    }
  };
  //@ts-ignore
  let error = `${query.error?.error_msg ?? "unknown message"}`;

  const renderResult = query.isLoading ? (
    <LoaderPaperComponent />
  ) : query.isError === true ? (
    <span>{error}</span>
  ) : (
    <>
      {mutation.isError ? (
        <Alert severity="error">
          {mutation?.error?.error_msg ?? "Unknown Error occured"}
        </Alert>
      ) : null}
      {mutation.isLoading ? <LinearProgress variant={"indeterminate"} /> : null}
      <DialogTitle id="alert-dialog-title">Update Documents</DialogTitle>
      <DialogContent>
        <GridWrapper
          key={`listingDocumentsForUpdate`}
          data={gridData ?? []}
          finalMetaData={query.data}
          setData={setGridData}
          gridProps={context}
          ref={gridRef}
          loading={mutation.isLoading}
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={closeDialog}
          color="primary"
          disabled={mutation.isLoading}
        >
          Cancel
        </Button>
        <Button
          color="primary"
          onClick={sendDataForUpdate}
          disabled={mutation.isLoading}
        >
          Update
        </Button>
      </DialogActions>
    </>
  );
  return renderResult;
};
