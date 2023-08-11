import { Button, CircularProgress, Dialog } from "@mui/material";
import { useContext, useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "react-query";
import * as API from "../api";
import { ClearCacheContext, queryClient } from "cache";
import { useSnackbar } from "notistack";
import { ActionsMetaData } from "./actionMetadata";
import { makeStyles } from "@mui/styles";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { InitialValuesType, SubmitFnType } from "packages/form";
import { PopupMessageAPIWrapper } from "components/custom/popupMessage";
import { AuthContext } from "pages_audit/auth";
import { LoaderPaperComponent } from "components/common/loaderPaper";
import { ProcessDetailsData, utilFunction } from "components/utils";
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
export const ActionFormWrapper = ({
  isOpen,
  formView,
  onClose,
  data: reqData,
  docCD,
}) => {
  const { authState } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();
  const [isOpenSave, setIsOpenSave] = useState(false);
  const isErrorFuncRef = useRef<any>(null);
  const {
    data: actionData,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery<any, any>(["actionsFormData"], () =>
    API.actionsFormData({
      COMP_CD: authState?.companyID ?? "",
      BRANCH_CD: authState?.user?.branchCode ?? "",
      DOC_CD: reqData[0]?.data?.DOC_CD ?? "",
    })
  );
  console.log("actionData", actionData);
  const mutation = useMutation(API.actionsFormDataDML(), {
    onError: (error: any) => {},
    onSuccess: (data) => {
      enqueueSnackbar(data, {
        variant: "success",
      });
      onClose();
    },
  });
  useEffect(() => {
    return () => {
      queryClient.removeQueries(["actionsFormData"]);
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

    let transformedActionsDetails = data.actionsDetails.map((item) => ({
      ...item,
      MULTIPLE: item.MULTIPLE ? "Y" : "N",
      ROWDOUBLECLICK: item.ROWDOUBLECLICK ? "Y" : "N",
      ALWAYSAVAILABLE: item.ALWAYSAVAILABLE ? "Y" : "N",
      ISNODATATHENSHOW: item.ISNODATATHENSHOW ? "Y" : "N",
    }));

    let upd: any = ProcessDetailsData(
      transformedActionsDetails ?? [],
      actionData ?? []
    );

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
    let srCount = utilFunction.GetMaxCdForDetails(
      actionData?.[0]?.SR_CD,
      "SR_CD"
    );
    console.log("srCount", srCount);
    const updatedData: any = {
      _isNewRow: formView === "edit" ? true : false,
      COMP_CD: authState.companyID,
      BRANCH_CD: authState.user.branchCode,
      DOC_CD: reqData[0]?.data?.DOC_CD ?? "",
      DETAILS_DATA: upd,
      SR_CD: actionData?.[0]?.SR_CD ?? "",
    };

    isErrorFuncRef.current = {
      data: updatedData,
      displayData,
      endSubmit,
      setFieldError,
    };
    setIsOpenSave(true);
  };

  const onPopupYes = (rows) => {
    console.log("rows", rows);
    mutation.mutate(rows);
  };
  const onActionCancel = () => {
    setIsOpenSave(false);
  };
  return (
    <>
      {isLoading || isFetching ? (
        <LoaderPaperComponent />
      ) : (
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
          key="filepreviewDialog"
        >
          <FormWrapper
            key={"actionsForm"}
            metaData={ActionsMetaData as MetaDataType}
            // displayMode={formMode}
            onSubmitHandler={onSubmitHandler}
            initialValues={{ actionsDetails: actionData } as InitialValuesType}
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
                  onClick={onClose}
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
      )}
    </>
  );
};