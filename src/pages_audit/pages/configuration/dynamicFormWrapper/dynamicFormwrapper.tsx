import { FC, useEffect, useState, useContext, useRef } from "react";
import { useMutation, useQuery } from "react-query";
import { ClearCacheContext, queryClient } from "cache";
import { InitialValuesType, SubmitFnType } from "packages/form";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { useSnackbar } from "notistack";
import { useLocation } from "react-router-dom";
import { useDialogStyles } from "pages_audit/common/dialogStyles";
import { Transition } from "pages_audit/common/transition";
import * as API from "./api";
import { format } from "date-fns";
import { PopupMessageAPIWrapper } from "components/custom/popupMessage";
import { extractMetaData, utilFunction } from "components/utils";
import { AuthContext } from "pages_audit/auth";
import { Button, Dialog } from "@mui/material";
import { LoaderPaperComponent } from "components/common/loaderPaper";

interface updateAUTHDetailDataType {
  data: any;
  endSubmit?: any;
}

const updateAUTHDetailDataWrapperFn =
  (updateAUTHDetailData) =>
  async ({ data }: updateAUTHDetailDataType) => {
    return updateAUTHDetailData(data);
  };

const DynamicForm: FC<{
  isDataChangedRef: any;
  closeDialog?: any;
  data: any;
  docID: any;
  // data: any;
}> = ({ isDataChangedRef, closeDialog, data, docID }) => {
  const { enqueueSnackbar } = useSnackbar();
  const isErrorFuncRef = useRef<any>(null);
  const [isOpenSave, setIsOpenSave] = useState(false);
  const { authState } = useContext(AuthContext);

  const {
    data: metaData,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery<any, any>(["getDynamicFormMetaData"], () =>
    API.getDynamicFormMetaData({
      DOC_CD: data?.DOC_CD ?? "",
      COMP_CD: authState?.companyID ?? "",
      BRANCH_CD: authState?.user?.branchCode ?? "",
      SR_CD: data?.FORM_METADATA_SR_CD,
    })
  );

  const mutation = useMutation(API.getDynamicFormData(), {
    onError: (error: any) => {},
    onSuccess: (data) => {
      enqueueSnackbar(data, {
        variant: "success",
      });
      closeDialog();
    },
  });
  useEffect(() => {
    return () => {
      queryClient.removeQueries(["getDynamicFormMetaData"]);
      queryClient.removeQueries(["getDynamicFormData"]);
    };
  }, []);
  const onActionCancel = () => {
    setIsOpenSave(false);
  };
  const onPopupYes = (rows) => {
    console.log("rows", rows);
    mutation.mutate(rows);
  };
  const onSubmitHandler: SubmitFnType = (
    data,
    displayData,
    endSubmit,
    setFieldError,
    actionFlag
  ) => {
    //@ts-ignore
    endSubmit(true);
    data["COMP_CD"] = authState.companyID;
    data["BRANCH_CD"] = authState.user.branchCode;
    data["DOC_CD"] = docID;
    delete data["TRAN_CD"];
    data["ALT_EXPIRY_DATE"] = format(
      new Date(data["ALT_EXPIRY_DATE"]),
      "dd/MMM/yyyy"
    );
    isErrorFuncRef.current = {
      data: {
        ...data,
        _isNewRow: true,
      },
      displayData,
      endSubmit,
      setFieldError,
    };

    setIsOpenSave(true);
  };
  return (
    <>
      {isLoading || isFetching ? (
        <LoaderPaperComponent />
      ) : (
        <FormWrapper
          key={`DynamicForm`}
          metaData={metaData}
          onSubmitHandler={onSubmitHandler}
          initialValues={[] as InitialValuesType}
          // hideHeader={true}
          formStyle={{
            background: "white",
          }}
        >
          {({ isSubmitting, handleSubmit }) => (
            <>
              <Button
                onClick={(event) => {
                  handleSubmit(event, "Save");
                }}
                disabled={isSubmitting}
                //endIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                color={"primary"}
              >
                Save
              </Button>
              <Button
                onClick={closeDialog}
                color={"primary"}
                disabled={isSubmitting}
              >
                Close
              </Button>
            </>
          )}
        </FormWrapper>
      )}

      {isOpenSave ? (
        <PopupMessageAPIWrapper
          MessageTitle="Confirmation"
          Message="Do you want to save this Request?"
          onActionYes={(rowVal) => onPopupYes(rowVal)}
          onActionNo={() => onActionCancel()}
          rows={isErrorFuncRef.current?.data}
          open={isOpenSave}
          // loading={mutation.isLoading}
        />
      ) : null}
    </>
  );
};

export const DynamicFormWrapper = ({
  handleDialogClose,
  isDataChangedRef,
  data,
  docID,
}) => {
  const classes = useDialogStyles();
  const { state: rows }: any = useLocation();
  const { getEntries } = useContext(ClearCacheContext);

  return (
    <>
      <Dialog
        open={true}
        //@ts-ignore
        TransitionComponent={Transition}
        PaperProps={{
          style: {
            width: "70%",
          },
        }}
        maxWidth="md"
        classes={{
          scrollPaper: classes.topScrollPaper,
          paperScrollBody: classes.topPaperScrollBody,
        }}
      >
        <DynamicForm
          // data={rows?.[0]?.data ?? ""}
          isDataChangedRef={isDataChangedRef}
          closeDialog={handleDialogClose}
          data={data}
          docID={docID}
        />
      </Dialog>
    </>
  );
};
