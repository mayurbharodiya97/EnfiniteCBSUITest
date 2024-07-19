import { useContext, useRef, useState } from "react";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { extractMetaData, utilFunction } from "components/utils";
import { StandingInstructionMainMetaData } from "./metaData";
import { AuthContext } from "pages_audit/auth";
import { usePopupContext } from "components/custom/popupContext";
import { CircularProgress, Dialog } from "@mui/material";
import { GradientButton } from "components/styledComponent/button";
import { useMutation } from "react-query";
import * as API from "./api";
import { SubmitFnType } from "packages/form";
import { useLocation } from "react-router-dom";
import { format } from "date-fns/esm";
import { enqueueSnackbar } from "notistack";
const StandingInstruction = ({ isDataChangedRef,
  closeDialog,
  defaultView,
  data, }) => {
  const { authState } = useContext(AuthContext);
  const [formMode, setFormMode] = useState(defaultView);
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const [siDetails, setSiDetails] = useState<any>({
    SI_SDT: [
      { COMP_CD: authState?.companyID },
    ],
  });
  const isErrorFuncRef = useRef<any>(null);

  const validDataMutation = useMutation(API.validateStandingInstructionData,
    {
      onSuccess: async (data) => {
        if (data?.[0]?.O_STATUS === "0") {
          // const buttonName = await MessageBox({
          //   messageTitle: "Validation Successful",
          //   message: "Are you sure to Continue?",
          //   buttonNames: ["Yes", "No"],
          // });
          // if (buttonName === "Yes") {
          const btnName = await MessageBox({
            message: "Do you want to save this Request?",
            messageTitle: "Confirmation",
            buttonNames: ["Yes", "No"],
            loadingBtnName: ["Yes"],
          });
          if (btnName === "Yes") {
            mutation.mutate({
              data: { ...isErrorFuncRef.current?.data }
            });
          }
          // }

        } else if (data?.[0]?.O_STATUS === "999") {
          const messages = data.map(item => item.O_MESSAGE).join('\n');
          MessageBox({
            messageTitle: "Validation Failed",
            message: messages,
          });
        }
      },
      onError: (error: any) => {
        MessageBox({
          messageTitle: "Validation Alert",
          message: error?.error_detail,
        });
      },
    }
  );

  const mutation = useMutation(API.addStandingInstructionTemplate,
    {
      onError: (error: any) => {
        let errorMsg = "Unknown Error occured";
        if (typeof error === "object") {
          errorMsg = error?.error_msg ?? errorMsg;
        }
        enqueueSnackbar(errorMsg, {
          variant: "error",
        });
        CloseMessageBox();
      },
      onSuccess: (data) => {
        enqueueSnackbar("Records successfully Saved", {
          variant: "success",
        });
        isDataChangedRef.current = true;
        CloseMessageBox();
        closeDialog();
      },
    }
  );

  const onSubmitHandler: SubmitFnType = async (
    data: any,
    displayData: any,
    endSubmit,
    setFieldError
  ) => {
    endSubmit(true);

    const newData = data.SI_SDT;
    const oldData = []
    const updatedNewData = newData
      ? newData.map(item => {
        return {
          ...item,
          COMP_CD: authState?.companyID
        };

      })
      : [];
    let updPara2 = utilFunction.transformDetailDataForDML(
      oldData ? oldData : [],
      updatedNewData ? updatedNewData : [],
      ["TRAN_CD"]
    );


    isErrorFuncRef.current = {
      data: {
        COMP_CD: authState?.companyID,
        BRANCH_CD: authState?.user?.branchCode,
        DEF_TRAN_CD: data.COMM_TYPE_DESC,
        DESCRIPTION: data.DESCRIPTION,
        _isNewRow: defaultView === "add" ? true : false,
        SI_SDT: {
          ...updPara2
        }
      },
      displayData,
      endSubmit,
      setFieldError,
    };

    validDataMutation.mutate({
      START_DT: format(new Date(data.SI_SDT[0].START_DT), "dd/MMM/yyyy"),
      EXECUTE_DAY: data.SI_SDT[0].EXECUTE_DAY,
      SI_AMOUNT: data.SI_SDT[0].SI_AMOUNT,
      VALID_UPTO: format(new Date(data.SI_SDT[0].VALID_UPTO), "dd/MMM/yyyy"),
    })
  }

  return (
    <>
      <FormWrapper
        key={"standingInstructionForm" + formMode}
        metaData={
          extractMetaData(
            StandingInstructionMainMetaData,
            formMode
          ) as MetaDataType
        }
        displayMode={formMode}
        onSubmitHandler={onSubmitHandler}
        initialValues={
          // data ?? {} ,
          formMode === "add"
            ? {
              ...siDetails,
            }
            : { ...siDetails?.[0]?.data }}
        formStyle={{
          background: "white",
        }}
        formState={{
          MessageBox: MessageBox,
        }}
      >
        {({ isSubmitting, handleSubmit }) => (
          <>
            <GradientButton
              onClick={(event) => {
                handleSubmit(event, "Save");
              }}
              disabled={isSubmitting}
              endIcon={isSubmitting ? <CircularProgress size={20} /> : null}
              color={"primary"}
            >
              Save
            </GradientButton>
            <GradientButton onClick={closeDialog} color={"primary"}>
              Close
            </GradientButton>
          </>
        )}
      </FormWrapper>
      {/* <FormWrapper
          key={`SiDetails` + formMode}
          metaData={
            extractMetaData(
              StandingInstructionSubMetaData,
              formMode
            ) as MetaDataType
          }
          displayMode={formMode}
          onSubmitHandler={{onSubmitHandler}}
          initialValues={formMode === "add"
          ? {
              ...siDetails,
            }
          : { ...siDetails?.[0]?.data}}
          hideHeader={true}
          containerstyle={{ padding: "0px !important" }}
          formState={{
            MessageBox: MessageBox,
          }}/>
                */}

    </>
  )
};


export const StandingInstructionFormWrapper = ({
  isDataChangedRef,
  closeDialog,
  defaultView,
  data,
}) => {
  return (
    <Dialog
      open={true}
      PaperProps={{
        style: {
          width: "100%",
          overflow: "auto",
        },
      }}
      maxWidth="lg"
    >
      <StandingInstruction
        closeDialog={closeDialog}
        defaultView={defaultView}
        data={data}
        isDataChangedRef={isDataChangedRef}
      />
    </Dialog>
  );
};
