import { FC, Fragment, useCallback, useEffect, useState } from "react";
import { queryClient } from "cache";
import { useSnackbar } from "notistack";
import { cloneDeep } from "lodash-es";
import { useMutation, useQueries } from "react-query";
import { useLocation } from "react-router-dom";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import IconButton from "@material-ui/core/IconButton";
import HighlightOffOutlinedIcon from "@material-ui/icons/HighlightOffOutlined";
import Dialog from "@material-ui/core/Dialog";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { Alert } from "components/common/alert";
import { SubmitFnType } from "packages/form";
import * as API from "../api";
import { ChecklistDetailsEditViewMetadata } from "../metadata/form";
import { LoaderPaperComponent } from "components/common/loaderPaper";

interface updateChecklistDetailsDataType {
  data: object;
  displayData?: object;
  endSubmit?: any;
  setFieldError?: any;
  bankCode: string;
}

const updateMasterDataWrapperFn =
  (updateMasterData) =>
  async ({ data }: updateChecklistDetailsDataType) => {
    return updateMasterData(data);
  };

const ViewEditChargeTempMaster: FC<{
  isDataChangedRef: any;
  closeDialog?: any;
  defaultView?: "view" | "edit";
  readOnly?: boolean;
  transactionID: number;
  serialNo: number;
}> = ({
  isDataChangedRef,
  closeDialog,
  defaultView = "view",
  readOnly = false,
  transactionID,
  serialNo,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const [formMode, setFormMode] = useState(defaultView);
  const moveToViewMode = useCallback(() => setFormMode("view"), [setFormMode]);
  const moveToEditMode = useCallback(() => setFormMode("edit"), [setFormMode]);
  const mutation = useMutation(
    updateMasterDataWrapperFn(API.updateData(serialNo, transactionID)),
    // updateMasterDataWrapperFn(API.updateData(serialNo, transactionID)),
    {
      onError: (error: any, { endSubmit }) => {
        let errorMsg = "Unknown Error occured";
        if (typeof error === "object") {
          errorMsg = error?.errorMessage ?? errorMsg;
        }
        endSubmit(false, errorMsg, error?.errorDetail ?? "");
      },
      onSuccess: (data, { endSubmit }) => {
        queryClient.refetchQueries(["getFormData", transactionID]);
        endSubmit(true, "");
        enqueueSnackbar("Updated successfully", {
          variant: "success",
        });
        isDataChangedRef.current = true;
        moveToViewMode();
        if (typeof closeDialog === "function") {
          closeDialog();
        }
      },
    }
  );

  const onSubmitHandler: SubmitFnType = (
    data,
    displayData,
    endSubmit,
    setFieldError
  ) => {
    //@ts-ignore
    mutation.mutate({ data, displayData, endSubmit, setFieldError });
  };

  const result = useQueries([
    {
      queryKey: ["getFormData", transactionID],
      queryFn: () => API.getEditFormData(transactionID, serialNo),
    },
  ]);

  useEffect(() => {
    return () => {
      queryClient.removeQueries(["getFormData", transactionID]);
    };
  }, [transactionID]);

  const dataUniqueKey = `${result[0].dataUpdatedAt}`;
  const loading = result[0].isLoading || result[0].isFetching;
  let isError = result[0].isError;
  //@ts-ignore
  let errorMsg = `${result[0].error?.errorMessage}`;
  errorMsg = Boolean(errorMsg.trim()) ? errorMsg : "Unknown error occured";

  //@ts-ignore
  let errorDetail = `${result[0]?.error?.errorDetail ?? ""}`;

  let viewEditMetaData: MetaDataType = {} as MetaDataType;
  if (result[0].isSuccess) {
    viewEditMetaData = cloneDeep(
      ChecklistDetailsEditViewMetadata
    ) as MetaDataType;
  }

  const renderResult = loading ? (
    <div
      className="loadingImgContainer"
      style={{ margin: "1rem", display: "grid", placeItems: "center" }}
    >
      <LoaderPaperComponent />
    </div>
  ) : isError === true ? (
    <>
      <Alert severity="error" errorMsg={errorMsg} errorDetail={errorDetail} />
      {typeof closeDialog === "function" ? (
        <div style={{ position: "absolute", right: 0, top: 0 }}>
          <IconButton onClick={closeDialog}>
            <HighlightOffOutlinedIcon />
          </IconButton>
        </div>
      ) : null}
    </>
  ) : formMode === "view" ? (
    <FormWrapper
      key={`${dataUniqueKey}-${formMode}`}
      metaData={viewEditMetaData as MetaDataType}
      onSubmitHandler={onSubmitHandler}
      initialValues={result[0]?.data}
      //@ts-ignore
      displayMode={formMode}
      formStyle={{
        background: "white",
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      {!readOnly ? (
        <Button onClick={moveToEditMode} color={"primary"}>
          Edit
        </Button>
      ) : null}
      {typeof closeDialog === "function" ? (
        <Button onClick={closeDialog} color={"primary"}>
          Close
        </Button>
      ) : null}
    </FormWrapper>
  ) : formMode === "edit" ? (
    <FormWrapper
      key={`${dataUniqueKey}-${formMode}`}
      metaData={viewEditMetaData as MetaDataType}
      onSubmitHandler={onSubmitHandler}
      initialValues={result[0]?.data}
      //@ts-ignore
      displayMode={formMode}
      formStyle={{
        background: "white",
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      {({ isSubmitting, handleSubmit }) => (
        <>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            endIcon={isSubmitting ? <CircularProgress size={20} /> : null}
            color={"primary"}
          >
            Save
          </Button>
          <Button
            onClick={moveToViewMode}
            disabled={isSubmitting}
            color={"primary"}
          >
            Cancel
          </Button>
        </>
      )}
    </FormWrapper>
  ) : null;
  return renderResult;
};

export const ViewEditChargeTempMasterWrapper = ({
  isDataChangedRef,
  closeDialog,
}) => {
  const { state: data } = useLocation();
  return (
    <Fragment>
      <Dialog open={true} maxWidth="md" fullWidth onClose={closeDialog}>
        <ViewEditChargeTempMaster
          transactionID={0} //{data?.[0]?.data?.transactionID}
          serialNo={0} //{data?.[0]?.id}
          isDataChangedRef={isDataChangedRef}
          closeDialog={closeDialog}
        />
      </Dialog>
    </Fragment>
  );
};
