import { useContext, useEffect, useRef, useCallback } from "react";
import { useQuery } from "react-query";
import { ClearCacheContext } from "cache";
import { FormNew } from "./formNew";
import { CRUDContext } from "./context";
import { cacheWrapperKeyGen } from "cache";
import IconButton from "@material-ui/core/IconButton";
import HighlightOffOutlinedIcon from "@material-ui/icons/HighlightOffOutlined";
import Alert from "@material-ui/lab/Alert";
import { LoaderPaperComponent } from "components/common/loaderPaper";

export const FormNewExistsIfNotCreate = ({
  isDataChangedRef,
  successAction,
  readOnly,
  closeDialog,
  formStyle,
}) => {
  const { addEntry } = useContext(ClearCacheContext);
  const { checkFormDataExist } = useContext(CRUDContext);
  const { insertFormData } = useContext(CRUDContext);
  const wrapperKey = useRef<any>(null);
  if (wrapperKey.current === null) {
    wrapperKey.current = cacheWrapperKeyGen(Object.values(insertFormData.args));
  }
  let result = useQuery(["checkFormDataExist", wrapperKey.current], () =>
    checkFormDataExist.fn(checkFormDataExist.args)()
  );
  useEffect(() => {
    addEntry(["checkFormDataExist", wrapperKey.current]);
  }, [addEntry]);
  const loading = result.isFetching || result.isLoading;
  const isError = result.isError;
  //const errorMsg = result.error;
  const dataExist =
    result.data?.exists === "YES"
      ? true
      : result.data?.exists === "NO"
      ? false
      : false;

  /*eslint-disable react-hooks/exhaustive-deps*/
  const successActionAlways = useCallback(() => {
    if (typeof successAction === "function") {
      successAction();
      result.refetch();
    }
  }, []);

  useEffect(() => {
    if (dataExist) {
      if (typeof successAction === "function") {
        successActionAlways();
      }
    }
  }, [dataExist, successActionAlways]);

  return loading ? (
    <>
      <LoaderPaperComponent />
      {typeof closeDialog === "function" ? (
        <div style={{ position: "absolute", right: 0, top: 0 }}>
          <IconButton onClick={closeDialog}>
            <HighlightOffOutlinedIcon />
          </IconButton>
        </div>
      ) : null}
    </>
  ) : isError ? (
    <>
      {/*@ts-ignore*/}
      <div>{result?.error?.error_msg ?? "Unknown error occured"} </div>
      {typeof closeDialog === "function" ? (
        <div style={{ position: "absolute", right: 0, top: 0 }}>
          <IconButton onClick={closeDialog}>
            <HighlightOffOutlinedIcon />
          </IconButton>
        </div>
      ) : null}
    </>
  ) : !dataExist ? (
    <CreateFormConfirmation
      successAction={successActionAlways}
      isDataChangedRef={isDataChangedRef}
      readOnly={readOnly}
      closeDialog={closeDialog}
      formStyle={formStyle}
    />
  ) : null;
};

export const CreateFormConfirmation = ({
  successAction,
  isDataChangedRef,
  readOnly,
  closeDialog,
  formStyle,
}) => {
  const cancleFormSubmit = useCallback(() => {
    if (typeof closeDialog === "function") {
      closeDialog();
    }
  }, []);
  // const [showAsk, setShowAsk] = useState(true);
  // const cancleFormSubmit = useCallback(() => {
  //   setShowAsk(true);
  //   if (typeof closeDialog === "function") {
  //     closeDialog();
  //   }
  // }, [setShowAsk]);
  // return showAsk ? (
  //   <Fragment>
  //     <Typography variant="h6">No Data Found</Typography>
  //     {!Boolean(readOnly) ? (
  //       <Button onClick={() => setShowAsk(false)}>Click Here to Add</Button>
  //     ) : null}
  //   </Fragment>
  // ) : (

  return readOnly ? (
    <Alert severity="info">No Details Found</Alert>
  ) : (
    <FormNew
      isDataChangedRef={isDataChangedRef}
      cancelAction={cancleFormSubmit}
      successAction={successAction}
      formStyle={formStyle}
    />
  );

  //);
};
