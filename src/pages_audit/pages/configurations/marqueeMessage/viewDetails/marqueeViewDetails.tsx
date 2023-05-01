import { Button, Dialog } from "@material-ui/core";
import { PopupMessageAPIWrapper } from "components/custom/popupMessage";
import { useDialogStyles } from "components/detailPopupGridData";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { useSnackbar } from "notistack";
import { FC, useContext, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { InitialValuesType, SubmitFnType } from "packages/form";
import { MarqueeMessageDetailsMetaData } from "./metaData";
import { Transition } from "pages_audit/common";
import { extractMetaData, utilFunction } from "components/utils";
import { useMutation } from "react-query";
import * as API from "../api";
import { AuthContext } from "pages_audit/auth";
import { format } from "date-fns";
import { StringtoUnicode } from "components/utils";
interface updateMasterDataType {
  data: object;
  displayData?: object;
  endSubmit?: any;
  setFieldError?: any;
}

const updateMasterDataWrapperFn =
  (updateMasterData) =>
  async ({ data }: updateMasterDataType) => {
    return updateMasterData({ data });
  };

export const MarqueeViewDetails: FC<{
  isDataChangedRef: any;
  closeDialog?: any;
  formView?: string;
}> = ({ isDataChangedRef, closeDialog, formView }) => {
  const { enqueueSnackbar } = useSnackbar();
  const isErrorFuncRef = useRef<any>(null);
  const [isOpenSave, setIsOpenSave] = useState(false);
  const { state: rows }: any = useLocation();
  const classes = useDialogStyles();
  const authController = useContext(AuthContext);

  const mutation = useMutation(
    updateMasterDataWrapperFn(API.updateUserMarqueeMessage),

    {
      onError: (error: any) => {
        let errorMsg = "Unknown Error occured";
        if (typeof error === "object") {
          errorMsg = error?.error_msg ?? errorMsg;
        }
        //endSubmit(false, errorMsg, error?.error_detail ?? "");
        if (isErrorFuncRef.current == null) {
          enqueueSnackbar(errorMsg, {
            variant: "error",
          });
        } else {
          isErrorFuncRef.current?.endSubmit(
            false,
            errorMsg,
            error?.error_detail ?? ""
          );
        }
        onActionCancel();
      },
      onSuccess: (data) => {
        enqueueSnackbar(data, {
          variant: "success",
        });
        isDataChangedRef.current = true;
        closeDialog();
      },
    }
  );

  const onSubmitHandler: SubmitFnType = (
    data: any,
    displayData,
    endSubmit,
    setFieldError,
    actionFlag
  ) => {
    //@ts-ignore
    endSubmit(true);
    let newData = {
      ...data,
      STATUS: formView === "add" ? "Y" : data?.STATUS ? "Y" : "N",
      MSG_ALERT_BN: StringtoUnicode(data?.MSG_ALERT_BN ?? "").replaceAll(
        "\\u",
        "\\"
      ),
      VALID_FROM_DT: Boolean(data?.VALID_FROM_DT)
        ? format(new Date(data?.VALID_FROM_DT), "dd/MM/yyyy HH:mm:ss")
        : "",
      VALID_TO_DT: Boolean(data?.VALID_TO_DT)
        ? format(new Date(data?.VALID_TO_DT), "dd/MM/yyyy HH:mm:ss")
        : "",
    };

    let oldData = {
      ...rows?.[0]?.data,
      STATUS:
        formView === "add" ? "Y" : Boolean(rows?.[0]?.data?.STATUS) ? "Y" : "N",
      MSG_ALERT_BN: StringtoUnicode(
        rows?.[0]?.data?.MSG_ALERT_BN ?? ""
      ).replaceAll("\\u", "\\"),
      VALID_FROM_DT: Boolean(rows?.[0]?.data?.VALID_FROM_DT)
        ? format(
            new Date(rows?.[0]?.data?.VALID_FROM_DT),
            "dd/MM/yyyy HH:mm:ss"
          )
        : "",
      VALID_TO_DT: Boolean(rows?.[0]?.data?.VALID_TO_DT)
        ? format(new Date(rows?.[0]?.data?.VALID_TO_DT), "dd/MM/yyyy HH:mm:ss")
        : "",
    };

    let upd = utilFunction.transformDetailsData(newData, oldData);

    isErrorFuncRef.current = {
      data: {
        ...newData,
        ...upd,
        COMP_CD: authController.authState.companyID,
        _isNewRow: formView === "add" ? true : false,
      },
      displayData,
      endSubmit,
      setFieldError,
    };
    if (isErrorFuncRef.current?.data?._UPDATEDCOLUMNS.length === 0) {
    } else {
      setIsOpenSave(true);
    }
  };

  const onActionCancel = () => {
    setIsOpenSave(false);
  };
  const onPopupYes = (rowsData) => {
    mutation.mutate({ data: rowsData });
  };

  return (
    <>
      <Dialog
        open={true}
        //@ts-ignore
        TransitionComponent={Transition}
        PaperProps={{
          style: {
            width: "80%",
          },
        }}
        maxWidth="lg"
        classes={{
          scrollPaper: classes.topScrollPaper,
          paperScrollBody: classes.topPaperScrollBody,
        }}
      >
        <FormWrapper
          key={"MarqueeMessageForm"}
          metaData={
            extractMetaData(
              MarqueeMessageDetailsMetaData,
              formView === "add" ? "new" : "edit"
            ) as MetaDataType
          }
          initialValues={rows?.[0]?.data as InitialValuesType}
          onSubmitHandler={onSubmitHandler}
          //@ts-ignore
          // displayMode={formMode}
          formStyle={{
            background: "white",
            // height: "40vh",
            // overflowY: "auto",
            // overflowX: "hidden",
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
        {isOpenSave ? (
          <PopupMessageAPIWrapper
            MessageTitle="Confirmation"
            Message="Do you want to save this Record?"
            onActionYes={(rowVal) => onPopupYes(rowVal)}
            onActionNo={() => onActionCancel()}
            rows={isErrorFuncRef.current?.data}
            open={isOpenSave}
            loading={mutation.isLoading}
          />
        ) : null}
      </Dialog>
    </>
  );
};
