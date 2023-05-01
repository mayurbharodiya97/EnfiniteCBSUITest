import { useMutation } from "react-query";
import { useSnackbar } from "notistack";
import { cloneDeep } from "lodash-es";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { SubmitFnType } from "packages/form";
import * as API from "../api";
import { ChecklistDetailsNewMetadata } from "../metadata/form";
import { Button, CircularProgress, Dialog } from "@mui/material";

interface addMasterDataType {
  data: object;
  displayData?: object;
  endSubmit?: any;
  setFieldError?: any;
}

const addMasterFormDataFnWrapper =
  (addMasterFn) =>
  async ({ data }: addMasterDataType) => {
    return addMasterFn(data);
  };

const AddChargeTempDetails = ({
  isDataChangedRef,
  closeDialog,
  transactionID,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const mutation = useMutation(
    addMasterFormDataFnWrapper(API.insertBranchData(transactionID)),
    {
      onError: (error: any, { endSubmit }) => {
        let errorMsg = "Unknown Error occured";
        if (typeof error === "object") {
          errorMsg = error?.errorMessage ?? errorMsg;
        }
        endSubmit(false, errorMsg, error?.errorDetail ?? "");
      },
      onSuccess: (data, { endSubmit }) => {
        endSubmit(true, "");
        isDataChangedRef.current = true;
        enqueueSnackbar("Added successfully", {
          variant: "success",
        });
        closeDialog();
      },
    }
  );

  const onSubmitHandler: SubmitFnType = (
    data,
    displayData,
    endSubmit,
    setFieldError
  ) => {
    mutation.mutate({ data, displayData, endSubmit, setFieldError });
  };

  let metadata: MetaDataType = {} as MetaDataType;
  metadata = cloneDeep(ChecklistDetailsNewMetadata) as MetaDataType;

  const renderResult = (
    <FormWrapper
      key="checklistDetails"
      metaData={metadata as MetaDataType}
      initialValues={{}}
      onSubmitHandler={onSubmitHandler}
      displayMode={"new"}
      hideDisplayModeInTitle={true}
      controlsAtBottom={true}
      formStyle={{
        background: "white",
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      {({ isSubmitting, handleSubmit }) => {
        return (
          <>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              endIcon={isSubmitting ? <CircularProgress size={20} /> : null}
            >
              Save
            </Button>
            <Button onClick={closeDialog} disabled={isSubmitting}>
              Cancel
            </Button>
          </>
        );
      }}
    </FormWrapper>
  );

  return renderResult;
};

export const AddChargeTempDetailsWrapper = ({
  isDataChangedRef,
  closeDialog,
  transactionID,
}) => {
  return (
    <Dialog open={true} maxWidth="md" fullWidth>
      <AddChargeTempDetails
        isDataChangedRef={isDataChangedRef}
        closeDialog={closeDialog}
        transactionID={transactionID}
      />
    </Dialog>
  );
};
