import { Button, CircularProgress, Dialog } from "@mui/material";
import { useContext, useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "react-query";
import * as API from "../api";
import { queryClient } from "cache";
import { useSnackbar } from "notistack";
// import { ActionsMetaData } from "./actionMetadata";
import { makeStyles } from "@mui/styles";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { InitialValuesType, SubmitFnType } from "packages/form";
import { PopupMessageAPIWrapper } from "components/custom/popupMessage";
import { AuthContext } from "pages_audit/auth";
import { LoaderPaperComponent } from "components/common/loaderPaper";
import { ProcessDetailsData, utilFunction } from "components/utils";
import { useLocation } from "react-router-dom";
import { DynamicDropdownConfigMetaData } from "./metaData";
export const useDialogStyles = makeStyles({
  topScrollPaper: {
    alignItems: "center",
  },
  topPaperScrollBody: {
    verticalAlign: "top",
  },
  title: {
    flex: "1 1 100%",
    color: "var(--white)",
    letterSpacing: "1px",
    fontSize: "1.5rem",
  },
});
export const DynamicDropdownConfig = ({
  isDataChangedRef,
  closeDialog,
  defaultView = "view",
  docCD,
  data: reqData,
}) => {
  const { authState } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();
  const [isOpenSave, setIsOpenSave] = useState(false);
  const isErrorFuncRef = useRef<any>(null);
  // const {
  //   data: actionData,
  //   isLoading,
  //   isFetching,
  //   isError,
  //   error,
  //   refetch,
  // } = useQuery<any, any>(["actionsFormData"], () =>
  //   API.actionsFormData({
  //     COMP_CD: authState?.companyID ?? "",
  //     BRANCH_CD: authState?.user?.branchCode ?? "",
  //     DOC_CD: reqData[0]?.data?.DOC_CD ?? "",
  //   })
  // );

  // const mutation = useMutation(API.actionsFormDataDML(), {
  //   onError: (error: any) => {},
  //   onSuccess: (data) => {
  //     enqueueSnackbar(data, {
  //       variant: "success",
  //     });
  //     onClose();
  //   },
  // });
  useEffect(() => {
    return () => {
      queryClient.removeQueries(["actionsFormData"]);
      queryClient.removeQueries(["actionsFormDataDML"]);
    };
  }, []);

  const onSubmitHandler: SubmitFnType = (
    data: any,
    displayData,
    endSubmit,
    setFieldError,
    actionFlag
  ) => {
    // @ts-ignore
    endSubmit(true);
    let transformedActionsDetails = data.actionsDetails?.map((item) => ({
      ...item,
      MULTIPLE: item.MULTIPLE ? "Y" : "N",
      ROWDOUBLECLICK: item.ROWDOUBLECLICK ? "Y" : "N",
      ALWAYSAVAILABLE: item.ALWAYSAVAILABLE ? "Y" : "N",
      ISNODATATHENSHOW: item.ISNODATATHENSHOW ? "Y" : "N",
    }));
    let upd: any = ProcessDetailsData(transformedActionsDetails ?? [], []);
    if (upd["_OLDROWVALUE"]) {
      const oldRowValue = upd["_OLDROWVALUE"];

      for (const key in oldRowValue) {
        if (oldRowValue.hasOwnProperty(key)) {
          // Convert boolean values to "Y" or "N"
          if (typeof oldRowValue[key] === "boolean") {
            oldRowValue[key] = oldRowValue[key] ? "Y" : "N";
          }
        }
      }
    }

    const updatedData: any = {
      // _isNewRow: formView === "edit" ? true : false,
      COMP_CD: authState.companyID,
      BRANCH_CD: authState.user.branchCode,
      DOC_CD: reqData[0]?.data?.DOC_CD ?? "",
      DETAILS_DATA: upd,
    };
    setIsOpenSave(true);
    isErrorFuncRef.current = {
      data: updatedData,
      displayData,
      endSubmit,
      setFieldError,
    };
  };

  const onPopupYes = (rows) => {
    // mutation.mutate(rows);
  };
  const onActionCancel = () => {
    setIsOpenSave(false);
  };

  return (
    <>
      {/* {isLoading || isFetching ? ( */}
      {/* <LoaderPaperComponent /> */}
      {/* ) : ( */}
      <Dialog
        fullWidth
        maxWidth="lg"
        open={true}
        PaperProps={{
          style: {
            width: "100%",
            height: "100%",
          },
        }}
        key="actionsFormDialog"
      >
        <FormWrapper
          key={"DynamicDropdownConfigMetaData"}
          metaData={DynamicDropdownConfigMetaData as unknown as MetaDataType}
          // displayMode={formMode}
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
                //disabled={isSubmitting}
                color={"primary"}
              >
                Close
              </Button>
            </>
          )}
        </FormWrapper>
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
      </Dialog>
      {/* )} */}
    </>
  );
};

export const DynamicDropdownConfigWrapper = ({
  isDataChangedRef,
  closeDialog,
  defaultView,
}) => {
  const { state: data }: any = useLocation();
  return (
    <Dialog
      open={true}
      // fullScreen={true}
      PaperProps={{
        style: {
          width: "100%",
          // height: "110vh",
          overflow: "auto",
        },
      }}
      maxWidth="lg"
    >
      <DynamicDropdownConfig
        isDataChangedRef={isDataChangedRef}
        closeDialog={closeDialog}
        defaultView={defaultView}
        docCD={data?.[0]?.data?.DOC_CD ?? ""}
        data={data}
      />
    </Dialog>
  );
};
