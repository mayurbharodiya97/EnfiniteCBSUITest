import { ClearCacheProvider, queryClient } from "cache"
import { usePopupContext } from "components/custom/popupContext";
import { AuthContext } from "pages_audit/auth";
import { useCallback, useContext, useEffect, useState } from "react";
import * as API from './api';
import { useMutation, useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { ActionTypes } from "components/dataTable";
import { RemarksAPIWrapper } from "components/custom/Remarks";
import { t } from "i18next";
import { enqueueSnackbar } from "notistack";
import { Alert } from "components/common/alert";
import { format } from "date-fns";
import { GridMetaDataType } from "components/dataTableStatic";
import  GridWrapper from "components/dataTableStatic";
import { holdTrnsGridMetaData } from "./holdTrnsGridMetaData";


const actions: ActionTypes[] = [
    {
      actionName: "Confirm",
      actionLabel: "Confirm",
      multiple: undefined,
     rowDoubleClick:true
    },
    {
        actionName: "reject",
        actionLabel: "Reject",
        multiple: undefined,
       rowDoubleClick:true
      },
];
const HoldTrnsConfirmation = ()=>{
    const { authState } = useContext(AuthContext);
    const [openReport, setOpenReport] = useState(false);
    const [rowData, setRowData] = useState({});
    const [isDeleteRemark, SetDeleteRemark] = useState(false);
    const { MessageBox, CloseMessageBox } = usePopupContext();

    const navigate = useNavigate();

      const confirmMutation = useMutation(
        "holdtrnsCnfm",
        API.getTransactionConfmReject,
        {
          onSuccess: (data) => {
            enqueueSnackbar("success", {
              variant: "success",
            });
          
            CloseMessageBox();
          },
          onError: (error: any) => {
            CloseMessageBox();
          },
        }
      );
      const deleteMutation = useMutation("holdtrnsreject", API.getTransactionConfmReject, {
        onError: (error: any) => {
          let errorMsg = "Unknown Error occured";
          if (typeof error === "object") {
            errorMsg = error?.error_msg ?? errorMsg;
          }
          enqueueSnackbar(errorMsg, {
            variant: "error",
          });
          CloseMessageBox();
          SetDeleteRemark(false);
        },
        onSuccess: (data) => {
          enqueueSnackbar(typeof (t("RecordSuccessfullyDeleted")), {
            variant: "success",
          });
          CloseMessageBox();
          SetDeleteRemark(false);
        },
      });
      const setCurrentAction = useCallback(
        async (data) => {
          if (data?.name === "reject") {
            SetDeleteRemark(true);
            setRowData(data?.rows[0]?.data)
          }  
          if (data?.name === "Confirm") {
             if (authState?.user?.id === data?.rows[0]?.data?.ENTERED_BY) {
              await MessageBox({
                messageTitle: t("ValidationFailed"),
                message: t("ConfirmRestrictMsg"),
                buttonNames: ["Ok"],
              });
            }
           else{
            const btnName = await MessageBox({
              messageTitle: t("Confirmation"),
              message: t("DoYouWantToAllowTheTransaction"),
              buttonNames: ["No", "Yes"],
              loadingBtnName: ["Yes"],
            });
            if (btnName === "Yes") {
              const confirmPara = {
                ...data.rows[0].data,    
                CONFIRM:"Y",                          
                ACTIVITY_DONE_BY:data.rows[0].data.VERIFIED_BY,
                ACTIVITY_DATE:data.rows[0].data.VERIFIED_DATE,
                TRAN_TYPE:"Delete"
             };
              confirmMutation.mutate(confirmPara)
            }
           }
          }
          navigate(data?.name, {
            state: data?.rows,
          });
        },
        [navigate]
      );

    const { data, isLoading, isFetching, isError, error, refetch } = useQuery<any, any>(
        ["getHoldTrnsData"],
        () =>
          API.getHoldTrnsData({
            COMP_CD: authState?.companyID,
            BRANCH_CD: authState?.user?.branchCode,
          })
      );
      useEffect(() => {
        return () => {
          queryClient.removeQueries(["getHoldTrnsData"]);
        };
      }, []);
    
    return(
        <>
           {isError && (
        <Alert
          severity="error"
          errorMsg={error?.error_msg ?? "Somethingwenttowrong"}
          errorDetail={error?.error_detail}
          color="error"
        />
      )}
         <GridWrapper
            key={"holdtrnscnfData"}
            finalMetaData={holdTrnsGridMetaData as GridMetaDataType}
            data={data ?? []}
            setData={() => null}
            actions={[]}
            loading={isLoading || isFetching}
            ReportExportButton={true}
            setAction={setCurrentAction}
            />
          {isDeleteRemark && (
                      <RemarksAPIWrapper
                        TitleText={
                          t("EnterRemovalRemarksForRTGSBRANCHCONFIRMATION")
                        }
                        onActionNo={() => SetDeleteRemark(false)}
                        onActionYes={async (val, rows) => {
                          const buttonName = await MessageBox({
                            messageTitle: t("Confirmation"),
                            message: t("DoYouWantDeleteRow"),
                            buttonNames: ["Yes", "No"],
                            defFocusBtnName: "Yes",
                            loadingBtnName: ["Yes"],
                          });
                          if (buttonName === "Yes") {
                            let deleteReqPara = {
                               ...rows,                              
                              USER_DEF_REMARKS: val
                                ? val
                                : "WRONG ENTRY FROM HOLD TRANSACTION CONFIRMATION(TRN/579)",
                              ACTIVITY_DONE_BY:rows.VERIFIED_BY,
                              ACTIVITY_DATE:rows.VERIFIED_DATE,
                              TRAN_TYPE:"Delete"
                            };
                            deleteMutation.mutate(deleteReqPara);
                          }
                        }}
                        isEntertoSubmit={true}
                        AcceptbuttonLabelText="Ok"
                        CanceltbuttonLabelText="Cancel"
                        open={isDeleteRemark}
                        defaultValue={"WRONG ENTRY FROM HOLD TRANSACTION CONFIRMATION (MST/553)"
                        }
                        rows={rowData}
                      />
                    )}

        </>
    )
}
export const HoldTrnsConfirmationMain = ()=>{
    return(
        <ClearCacheProvider>
        <HoldTrnsConfirmation/>
        </ClearCacheProvider>
    )
}