import { ClearCacheProvider } from "cache";
import { AuthContext } from "pages_audit/auth";
import { Fragment, useCallback, useContext, useRef, useState } from "react";
import { RetrievalParameterFormMetaData } from "./formMetaData";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { SubmitFnType } from "packages/form";
import { format } from "date-fns";
import * as API from "./api";
import { useMutation } from "react-query";
import { Alert } from "components/common/alert";
import { GridMetaDataType } from "components/dataTableStatic";
import { RetrieveGridMetaData } from "./gridMetaData";
import GridWrapper from "components/dataTableStatic/";
import { ActionTypes } from "components/dataTable";
import { Route, Routes, useNavigate } from "react-router-dom";
import { usePopupContext } from "components/custom/popupContext";
import { ReturnChequeForm } from "./returnChequeForm";
import {t} from "i18next";
const { MessageBox, CloseMessageBox } = usePopupContext();

const actions: ActionTypes[] = [
{
    actionName: "view-details",
    actionLabel: "View Detail",
    multiple: false,
    rowDoubleClick: true,
  },

];

const ChequeSearchMain = () => {
  const { authState } = useContext(AuthContext);
  const formRef = useRef<any>(null);
  const navigate = useNavigate();
const[returnChequeForm,setReturnChequeForm]=useState(false);

  const setCurrentAction = useCallback(
    async (data) => {
      if (data?.name === "view-detail") {
        if(data?.rows[0]?.data.ALLOW_RETURN==="Y")
        {
          checkDuplicateMutation.mutate({  
        A_COMP_CD:authState?.companyID,
        A_BRANCH_CD:authState?.user?.branchCode,
        A_ACCT_TYPE:data?.rows[0]?.data?.ACCT_TYPE,
        A_ACCT_CD:data?.rows[0]?.data?.ACCT_CD,
        A_TRAN_TYPE:data?.rows[0]?.data?.TRAN_TYPE,
        A_TRAN_DT:data?.rows[0]?.data?.TRAN_DT,
        A_BANK_CD:data?.rows[0]?.data?.BANK_CD,
        A_CHEQUE_NO:data?.rows[0]?.data?.CHEQUE_NO,
        A_AMOUNT:data?.rows[0]?.data?.AMOUNT,
        A_LANG:"en"
          })
        }
       
      }
      navigate(data?.name, {
        state: data?.rows,
      });
    },
    [navigate]
  );

  const checkDuplicateMutation = useMutation(API.getCheckDuplicate, {
    onSuccess: async (response) => {
      const deletValidData = response?.data; // Assuming response contains data array
      for (const data of deletValidData ?? []) {
        if (data?.O_STATUS === "999") {
          await MessageBox({
            messageTitle: "ValidationFailed",
            message: response?.O_MESSAGE ?? "",
          });
        } else if (response?.O_STATUS === "9") {
          await MessageBox({
            messageTitle: "Alert",
            message: response?.O_MESSAGE ?? "",
          });
        } else if (response?.O_STATUS === "99") {
          const buttonName = await MessageBox({
            messageTitle: "Confirmation",
            message: response?.O_MESSAGE ?? "",
            buttonNames: ["Yes", "No"],
            defFocusBtnName: "Yes",
          });
          if (buttonName === "No") {
            break;
          }
        } else if (response?.O_STATUS === "0") {
          const buttonName = await MessageBox({
            messageTitle: "Confirmation",
            message:t("GenerateOutwardReturnEntry"),
            buttonNames: ["Yes", "No"],
          });
          if (buttonName === "Yes") {
          setReturnChequeForm(true);
          } 
        }
      }
    },
    onError: (error: any) => {},
  });

  const retrieveMutation = useMutation(API.getChequeSearchData, {
    onSuccess: (data) => {},
    onError: (error: any) => {},
  });

  const onSubmitHandler: SubmitFnType = async (
    data: any,
    displayData,
    endSubmit,
    setFieldError,
    actionFlag
  ) => {
    delete data["RETRIEVE"];
    delete data["VIEW_ALL"];

    if (Boolean(data["FROM_DT"])) {
      data["FROM_DT"] = format(new Date(data["FROM_DT"]), "dd/MMM/yyyy");
    }
    if (Boolean(data["TO_DT"])) {
      data["TO_DT"] = format(new Date(data["TO_DT"]), "dd/MMM/yyyy");
    }

    data = {
      ...data,
      COMP_CD: authState.companyID,
      BRANCH_CD: authState.user.branchCode,
    };

    retrieveMutation.mutate(data);
    endSubmit(true);
  };

  return (
    <Fragment>
      <FormWrapper
        key="retrieveForm"
        metaData={RetrievalParameterFormMetaData as MetaDataType}
        initialValues={{
          FROM_DT: authState?.workingDate ?? "",
          TO_DT: authState?.workingDate ?? "",
        }}
        onSubmitHandler={onSubmitHandler}
        formStyle={{
          background: "white",
        }}
        onFormButtonClickHandel={(id) => {
          let event: any = { preventDefault: () => {} };
          if (id === "RETRIEVE") {
            formRef?.current?.handleSubmit(event, "RETRIEVE");
          }
        }}
        ref={formRef}
      />
        {retrieveMutation.isError && (
              <Alert
                severity="error"
                errorMsg={
                    retrieveMutation.error?.error_msg ?? "Something went to wrong.."
                }
                errorDetail={retrieveMutation.error?.error_detail}
                color="error"
              />
            )}
              <GridWrapper
              key={"RetrieveGridMetaData"}
              finalMetaData={RetrieveGridMetaData as GridMetaDataType}
              data={retrieveMutation?.data ?? []}
              setData={() => null}
              loading={retrieveMutation.isLoading}
              actions={actions}
              setAction={setCurrentAction}
            />
           <Routes>
         {
          returnChequeForm? (

          <Route path="view-details/*" 
          element={
          <ReturnChequeForm
          open={returnChequeForm}
          onclose={()=>setReturnChequeForm(false)}
          />
          }
          />
          ):""
         }     
          </Routes>
  
     
    </Fragment>
  );
};

export const ChequeSearch = () => {
  return (
    <ClearCacheProvider>
      <ChequeSearchMain />
    </ClearCacheProvider>
  );
};
