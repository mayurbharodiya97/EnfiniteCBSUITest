import { FC, useContext, useEffect, useRef, useState } from "react";
import { useMutation, useQueries, useQuery } from "react-query";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Dialog from "@mui/material/Dialog";
import { GradientButton } from "components/styledComponent/button";
import * as API from "../api";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { chequeReturnPostFormMetaData } from "./metaData";
import { format } from "date-fns";
import { ChequeSignImage } from "./chequeSignImage";
import { usePopupContext } from "components/custom/popupContext";
import { SubmitFnType } from "packages/form";
import { queryClient } from "cache";
import { LoaderPaperComponent } from "components/common/loaderPaper";
import { Alert } from "components/common/alert";
import { AuthContext } from "pages_audit/auth";
import { useSnackbar } from "notistack";
import { PopupMessageAPIWrapper } from "components/custom/popupMessage";
import { PositivePayFormWrapper } from "./positvePayForm";
import { CircularProgress } from "@mui/material";
import { utilFunction } from "components/utils";

export const ChequeReturnPostForm: FC<{
  onClose?: any;
  inwardData?: any;
}> = ({ onClose, inwardData }) => {
  const formRef = useRef<any>(null);
  const [rotate, setRotate] = useState<number>(0);
  const { MessageBox } = usePopupContext();
  const { authState } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();
  const [isOpenSave, setIsOpenSave] = useState(false);
  const [messageData, setMessageData] = useState<any>();
  const [isPositivePay, setIsPositvePay] = useState(false);
  const isDataChangedRef = useRef(false);
  const result: any = useQueries([
    {
      queryKey: ["getInwardChequeSignFormData"],
      queryFn: () =>
        API.getInwardChequeSignFormData({
          COMP_CD: inwardData.current?.COMP_CD,
          ENTERED_COMP_CD: inwardData.current?.ENTERED_COMP_CD,
          ENTERED_BRANCH_CD: inwardData.current?.ENTERED_BRANCH_CD,
          BRANCH_CD: inwardData.current?.BRANCH_CD,
          ACCT_TYPE: inwardData.current?.ACCT_TYPE,
          ACCT_CD: inwardData.current?.ACCT_CD,
          DAILY_TRN_CD: inwardData.current?.DAILY_TRN_CD,
          TRAN_CD: inwardData.current?.TRAN_CD,
          TRAN_DT:
            format(new Date(inwardData.current?.TRAN_DT), "dd/MMM/yyyy") ?? "",
          TRAN_FLAG: "E",
          WITH_SIGN: "Y",
          ENTERED_BY: inwardData.current?.ENTERED_BY,
        }),
    },
    {
      queryKey: ["getBussinessDate"],
      queryFn: () => API.getBussinessDate(),
    },
  ]);
  let errorMsg = `${result[1].error?.error_msg}`;
  errorMsg = Boolean(errorMsg.trim()) ? errorMsg : "Unknown error occured";
  //@ts-ignore
  let error_detail = `${result[1]?.error?.error_detail}`;

  useEffect(() => {
    return () => {
      queryClient.removeQueries(["getBussinessDate"]);
      queryClient.removeQueries(["getInwardChequeSignFormData"]);
    };
  }, []);
  const viewDetailValidatePostData: any = useMutation(API.validatePost, {
    onSuccess: (data, variables) => {
      let apiReq = {
        ...variables,
        _isNewRow: true,
      };
      if (data?.[0]?.O_STATUS === "0") {
        setMessageData({
          messageTitle: "Validation Successfull..",
          message: "Do you Want to save this data",
          apiReq: apiReq,
        });
        setIsOpenSave(true);
      } else if (data?.[0]?.O_STATUS === "9") {
        MessageBox({
          messageTitle: "Validation Alert..",
          message: data?.[0]?.O_MESSAGE,
        });
      } else if (data?.[0]?.O_STATUS === "99") {
        setMessageData({
          messageTitle: "Are you sure do you want to continue?",
          message: data?.[0]?.O_MESSAGE,
          apiReq: apiReq,
        });
        setIsOpenSave(true);
      } else if (data?.[0]?.O_STATUS === "999") {
        MessageBox({
          messageTitle: "Validation Failed...!",
          message: data?.[0]?.O_MESSAGE,
        });
      }
    },
  });
  const viewDetailValidateReturnData: any = useMutation(API.validateReturn, {
    onSuccess: async (data, variables) => {
      if (data?.[0]?.O_STATUS === "999" && data?.[0]?.O_MESSAGE) {
        MessageBox({
          messageTitle: "Validation Failed",
          message: data?.[0]?.O_MESSAGE,
        });
      } else if (data?.[0]?.O_STATUS === "0" && data?.[0]?.O_MESSAGE) {
        enqueueSnackbar(data?.[0]?.O_MESSAGE, {
          variant: "success",
        });
        onClose();
      }
    },
  });

  const postConfigDML: any = useMutation(API.postConfigDML, {
    onSuccess: (data, variables) => {
      isDataChangedRef.current = true;
      enqueueSnackbar(data, { variant: "success" });
    },

    onError: (error: any) => {},
  });
  const handleRotateChange = () => {
    const newRotateValue = (rotate + 90) % 360;
    setRotate(newRotateValue);
  };

  const onSubmitHandler: SubmitFnType = async (
    data: any,
    displayData,
    endSubmit,
    setFieldError,
    actionFlag
  ) => {
    endSubmit(true);
    if (actionFlag === "Save") {
      const oldData = {
        COMP_CD: inwardData.current?.COMP_CD ?? "",
        BRANCH_CD: inwardData.current?.BRANCH_CD ?? "",
        ACCT_TYPE: inwardData.current?.ACCT_TYPE ?? "",
        ACCT_CD: inwardData.current?.ACCT_CD ?? "",
        CHEQUE_NO: inwardData.current?.CHEQUE_NO ?? "",
        TRAN_CD: inwardData.current?.TRAN_CD,
        MICR_TRAN_CD: inwardData.current?.MICR_TRAN_CD ?? "",
      };
      const newData = {
        COMP_CD: inwardData.current?.COMP_CD ?? "",
        BRANCH_CD: data?.BRANCH_CD ?? "",
        ACCT_TYPE: data?.ACCT_TYPE ?? "",
        ACCT_CD: data?.ACCT_CD ?? "",
        CHEQUE_NO: data?.CHEQUE_NO ?? "",
        TRAN_CD: inwardData.current?.TRAN_CD,
        MICR_TRAN_CD: data?.MICR_TRAN_CD ?? "",
      };

      let upd: any = utilFunction.transformDetailsData(newData ?? {}, oldData);
      const updateData = {
        ...newData,
        ...upd,
        _isUpdatedRow: true,
      };
      endSubmit(true);
      postConfigDML.mutate(updateData);
    } else if (actionFlag === "POST") {
      const postData = {
        COMP_CD: inwardData.current?.COMP_CD ?? "",
        BRANCH_CD: data?.BRANCH_CD ?? "",
        ACCT_TYPE: data?.ACCT_TYPE ?? "",
        ACCT_CD: data?.ACCT_CD ?? "",
        ERROR_STATUS: inwardData.current?.ERR_STATUS ?? "",
        SCREEN_REF: "TRN/650",
        ENTERED_BY: inwardData.current?.ENTERED_BY ?? "",
        ENTERED_BRANCH_CD: inwardData.current?.ENTERED_BRANCH_CD ?? "",
        REMARKS: data?.REMARKS ?? "",
        CHEQUE_DATE: format(new Date(data["CHEQUE_DATE"]), "dd/MMM/yyyy"), //data?.CHEQUE_DT,
        CHEQUE_NO: data?.CHEQUE_NO ?? "",
        AMOUNT: data?.AMOUNT ?? "",
        TRAN_CD: inwardData.current?.TRAN_CD,
        MICR_TRAN_CD: data?.MICR_TRAN_CD ?? "",
      };
      endSubmit(true);
      viewDetailValidatePostData.mutate(postData);
    } else if (actionFlag === "RETURN") {
      viewDetailValidateReturnData.mutate({
        ...data,
        CHEQUE_DATE: format(new Date(data["CHEQUE_DATE"]), "dd/MMM/yyyy"),
        TRAN_DATE: format(new Date(data["TRAN_DATE"]), "dd/MMM/yyyy"),
        COMP_CD: inwardData.current?.COMP_CD ?? "",
        TRAN_CD: inwardData.current?.TRAN_CD,
        RET_COMP_CD: inwardData.current?.RET_COMP_CD,
        ENTERED_BRANCH_CD: inwardData.current?.ENTERED_BRANCH_CD,
        ENTERED_BY: inwardData.current?.ENTERED_BY,
        LAST_MACHINE_NM: inwardData.current?.LAST_MACHINE_NM,
      });
    }
  };

  if (chequeReturnPostFormMetaData.form.label) {
    chequeReturnPostFormMetaData.form.label =
      "A/C No:-" +
      " " +
      inwardData.current?.BRANCH_CD +
      "-" +
      inwardData.current?.ACCT_TYPE +
      "-" +
      inwardData.current?.ACCT_CD +
      "--" +
      "Customer Level Post/Return" +
      " ";
  }
  return (
    <>
      {result?.[1]?.isLoading || result?.[1]?.isFetching ? (
        <LoaderPaperComponent />
      ) : result[1].isError ? (
        <Alert
          severity="error"
          errorMsg={errorMsg}
          errorDetail={error_detail ?? ""}
        />
      ) : (
        <>
          <FormWrapper
            key={`chequeReturnPost`}
            metaData={chequeReturnPostFormMetaData as unknown as MetaDataType}
            initialValues={{
              ...inwardData.current,
              RANGE_DATE: result?.[1]?.data?.[0]?.RANGE_DATE ?? "",
              TRAN_DATE: result?.[1]?.data?.[0]?.TRAN_DATE ?? "",
              CHEQUE_DATE: authState?.workingDate ?? "",
            }}
            onSubmitHandler={onSubmitHandler}
            formStyle={{
              background: "white",
            }}
            onFormButtonClickHandel={(id, dependentFields) => {
              if (id === "POST") {
                let event: any = { preventDefault: () => {} };
                formRef?.current?.handleSubmit(event, "POST");
              } else if (
                id === "RETURN" &&
                dependentFields?.RETURN?.value.length > 0
              ) {
                let event: any = { preventDefault: () => {} };
                formRef?.current?.handleSubmit(event, "RETURN");
              } else if (id === "POSITIVE_PAY") {
                setIsPositvePay(true);
              }
            }}
            formState={{
              MessageBox: MessageBox,
            }}
            // onFormButtonCicular={mutation.isLoading}
            ref={formRef}
          >
            {({ isSubmitting, handleSubmit }) => (
              <>
                <GradientButton onClick={handleRotateChange}>
                  {rotate === 0 ? "Rotate" : "Reset"}
                </GradientButton>
                <GradientButton
                  onClick={(event) => {
                    handleSubmit(event, "Save");
                  }}
                  disabled={isSubmitting}
                  endIcon={
                    postConfigDML.isLoading ? (
                      <CircularProgress size={20} />
                    ) : null
                  }
                  color={"primary"}
                >
                  Save
                </GradientButton>
                <GradientButton onClick={onClose}>Close</GradientButton>
              </>
            )}
          </FormWrapper>

          <>
            <ChequeSignImage
              imgData={result?.[0]?.data}
              rotate={rotate}
              loading={result[0].isLoading || result[0].isFetching}
              error={result[0].isError}
            />
          </>
          <>
            {isOpenSave && (
              <PopupMessageAPIWrapper
                MessageTitle={messageData.messageTitle}
                Message={messageData.message}
                onActionYes={() => ({})}
                onActionNo={() => setIsOpenSave(false)}
                rows={[]}
                open={isOpenSave}
                // loading={crudLimitData.isLoading}
              />
            )}
          </>
          {isPositivePay ? (
            <PositivePayFormWrapper
              onClose={() => {
                setIsPositvePay(false);
              }}
              positiveData={inwardData.current}
            />
          ) : null}
        </>
      )}
    </>
  );
};
export const ChequeReturnPostFormWrapper = ({ onClose, inwardData }) => {
  return (
    <Dialog
      open={true}
      PaperProps={{
        style: {
          width: "100%",
        },
      }}
      maxWidth="lg"
    >
      <ChequeReturnPostForm onClose={onClose} inwardData={inwardData} />
    </Dialog>
  );
};
