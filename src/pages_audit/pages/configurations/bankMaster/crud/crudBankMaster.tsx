import { useDialogStyles } from "pages_audit/common/dialogStyles";
import FormWrapper from "components/dyanmicForm";
import { Transition } from "pages_audit/common";
import { useContext, useEffect, useState } from "react";
import { CRUDBankMasterMetadata } from "./metadata";
import { useLocation } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useMemo } from "react";
import { extractMetaData, utilFunction } from "components/utils";
import { useMutation } from "react-query";
import * as API from "../api";
import { AuthContext } from "pages_audit/auth";
import { Button, CircularProgress, Dialog } from "@mui/material";
interface updateBankMasterDataType {
  data: object;
  displayData?: object;
  endSubmit?: any;
  setFieldError?: any;
}
const updateBankMasterDataWrapperFn =
  (updateMasterData) =>
  async ({ data }: updateBankMasterDataType) => {
    return updateMasterData(data);
  };

export const CRUDBankMaster = ({
  ClosedEventCall,
  isDataChangedRef,
  defaultmode = "view",
}) => {
  const [formMode, setFormMode] = useState(defaultmode);
  const classes = useDialogStyles();
  const { enqueueSnackbar } = useSnackbar();
  const { state: rows }: any = useLocation();
  const { authState } = useContext(AuthContext);
  const mutation = useMutation(
    updateBankMasterDataWrapperFn(API.updateBankMastersData),
    {
      onError: (error: any, { endSubmit, setFieldError }) => {
        let errorMsg = "Unknown Error occured";
        let isPrimaryKeyError = "";
        if (typeof error === "object") {
          errorMsg = error?.error_msg ?? errorMsg;
          isPrimaryKeyError = error?.isPrimaryKeyError;
        }
        console.log(isPrimaryKeyError);
        if (Boolean(isPrimaryKeyError)) {
          endSubmit(false, errorMsg);
          setFieldError({ ROUTING_NO: isPrimaryKeyError });
        } else {
          endSubmit(false, errorMsg, error?.error_detail ?? "");
        }
      },
      onSuccess: (data, { endSubmit }) => {
        // queryClient.refetchQueries(["getFormData", transactionID]);
        endSubmit(true, "");
        enqueueSnackbar(data, {
          variant: "success",
        });
        isDataChangedRef.current = true;
        if (typeof ClosedEventCall === "function") {
          ClosedEventCall();
        }
      },
    }
  );
  useEffect(() => {
    if (rows.length === 0 && formMode !== "new") {
      enqueueSnackbar("Please select one user to get the details", {
        variant: "warning",
      });
      ClosedEventCall();
      return;
    }
  }, [rows, enqueueSnackbar, ClosedEventCall]);
  //console.log(rows);
  const onSubmitHandler = (data, displayData, endSubmit, setFieldErrors) => {
    //console.log(data);
    let updateValue: any = {};
    if (formMode !== "new") {
      updateValue = utilFunction.transformDetailsData(
        data,
        rows?.[0]?.data ?? {}
      );
    }

    if (
      formMode !== "new" &&
      Array.isArray(updateValue?._UPDATEDCOLUMNS) &&
      updateValue?._UPDATEDCOLUMNS?.length === 0
    ) {
      endSubmit(true);
      setFormMode("view");
    } else {
      let datanew = data;
      if (datanew.hasOwnProperty("NPSB_ENABLED")) {
        datanew["NPSB_ENABLED"] = Boolean(datanew["NPSB_ENABLED"]) ? "Y" : "N";
      }
      if (datanew.hasOwnProperty("BEFTN_ENABLED")) {
        datanew["BEFTN_ENABLED"] = Boolean(datanew["BEFTN_ENABLED"])
          ? "Y"
          : "N";
      }
      if (datanew.hasOwnProperty("RTGS_ENABLED")) {
        datanew["RTGS_ENABLED"] = Boolean(datanew["RTGS_ENABLED"]) ? "Y" : "N";
      }
      if (formMode !== "new") {
        if (updateValue?._OLDROWVALUE?.hasOwnProperty("NPSB_ENABLED")) {
          updateValue._OLDROWVALUE["NPSB_ENABLED"] = Boolean(
            updateValue._OLDROWVALUE["NPSB_ENABLED"]
          )
            ? "Y"
            : "N";
        }
        if (updateValue?._OLDROWVALUE?.hasOwnProperty("BEFTN_ENABLED")) {
          updateValue._OLDROWVALUE["BEFTN_ENABLED"] = Boolean(
            updateValue._OLDROWVALUE["BEFTN_ENABLED"]
          )
            ? "Y"
            : "N";
        }
        if (updateValue?._OLDROWVALUE?.hasOwnProperty("RTGS_ENABLED")) {
          updateValue._OLDROWVALUE["RTGS_ENABLED"] = Boolean(
            updateValue._OLDROWVALUE["RTGS_ENABLED"]
          )
            ? "Y"
            : "N";
        }
      }
      let RedData = {
        COMP_CD: authState.companyID,
        ...data,
        ...updateValue,
        _isNewRow: formMode === "new" ? true : false,
      };
      mutation.mutate({
        data: RedData,
        endSubmit,
        setFieldError: setFieldErrors,
      });
    }
    //setFieldErrors({ ROUTING_NO: "already Registred" });
  };
  const metaData = useMemo(
    () => extractMetaData(CRUDBankMasterMetadata, formMode),
    [formMode]
  );
  return (
    <>
      <Dialog
        open={true}
        //@ts-ignore
        TransitionComponent={Transition}
        PaperProps={{
          style: {
            width: "100%",
          },
        }}
        maxWidth="md"
        classes={{
          scrollPaper: classes.topScrollPaper,
          paperScrollBody: classes.topPaperScrollBody,
        }}
      >
        {formMode == "new" ? (
          <FormWrapper
            key={"BankMaster-" + formMode}
            metaData={metaData}
            initialValues={{}}
            onSubmitHandler={onSubmitHandler}
            displayMode={formMode}
            formStyle={{
              background: "white",
              height: "35vh",
              overflowY: "auto",
              overflowX: "hidden",
            }}
          >
            {({ isSubmitting, handleSubmit }) => {
              return (
                <>
                  <Button
                    onClick={handleSubmit}
                    color={"primary"}
                    disabled={isSubmitting}
                    endIcon={
                      isSubmitting ? <CircularProgress size={20} /> : null
                    }
                  >
                    Save
                  </Button>
                  {typeof ClosedEventCall === "function" ? (
                    <Button
                      onClick={() => {
                        ClosedEventCall();
                      }}
                      color={"primary"}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                  ) : null}
                </>
              );
            }}
          </FormWrapper>
        ) : formMode == "edit" ? (
          <FormWrapper
            key={"BankMaster-" + formMode}
            metaData={metaData}
            initialValues={rows?.[0]?.data ?? {}}
            onSubmitHandler={onSubmitHandler}
            displayMode={formMode}
            formStyle={{
              background: "white",
              height: "35vh",
              overflowY: "auto",
              overflowX: "hidden",
            }}
          >
            {({ isSubmitting, handleSubmit }) => {
              return (
                <>
                  <Button
                    onClick={handleSubmit}
                    color={"primary"}
                    disabled={isSubmitting}
                    endIcon={
                      isSubmitting ? <CircularProgress size={20} /> : null
                    }
                  >
                    Save
                  </Button>
                  <Button
                    onClick={() => {
                      setFormMode("view");
                    }}
                    color={"primary"}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                </>
              );
            }}
          </FormWrapper>
        ) : (
          <FormWrapper
            key={"BankMaster-" + formMode}
            metaData={metaData}
            initialValues={rows?.[0]?.data ?? {}}
            onSubmitHandler={onSubmitHandler}
            displayMode={formMode}
            formStyle={{
              background: "white",
              height: "35vh",
              overflowY: "auto",
              overflowX: "hidden",
            }}
          >
            <>
              <Button
                onClick={() => {
                  setFormMode("edit");
                }}
                color={"primary"}
              >
                Edit
              </Button>
              {typeof ClosedEventCall === "function" ? (
                <Button onClick={ClosedEventCall} color={"primary"}>
                  Close
                </Button>
              ) : null}
            </>
          </FormWrapper>
        )}
      </Dialog>
    </>
  );
};
