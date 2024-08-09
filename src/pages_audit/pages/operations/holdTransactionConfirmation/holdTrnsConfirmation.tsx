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
    actionName: "confirm",
    actionLabel: "Confirm",
    multiple: false,
    rowDoubleClick:true,
  },
  {
    actionName: "reject",
    actionLabel: "Reject",
    multiple: false,
    rowDoubleClick:true,
  },
];
const HoldTrnsConfirmation = ()=>{
    const { authState } = useContext(AuthContext);
    const [openReport, setOpenReport] = useState(false);
    const [rowData, setRowData] = useState({});
    const [isDeleteRemark, SetDeleteRemark] = useState(false);
    const { MessageBox, CloseMessageBox } = usePopupContext();

    const navigate = useNavigate();
    const { data, isLoading, isFetching, isError, error, refetch } = useQuery<any, any>(
      ["getHoldTrnsData"],
      () =>
        API.getHoldTrnsData({
          COMP_CD: authState?.companyID,
          BRANCH_CD: authState?.user?.branchCode,
        })
    );
      const confRejectMutation = useMutation(
        "confRejectMutation",
        API.getTransactionConfmReject,
        {
          onSuccess: (data) => {
            enqueueSnackbar("success", {
              variant: "success",
            });
            SetDeleteRemark(false);
            refetch();
            CloseMessageBox();
            
          },
          onError: (error: any) => {
            CloseMessageBox();
          },
        }
      );
    
      const setCurrentAction = useCallback(
        async (data) => {
          if (data?.name === "reject") {
            SetDeleteRemark(true);
            setRowData(data?.rows[0]?.data)
          }  
          if (data?.name === "confirm") {
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
              buttonNames: ["Yes", "No"],
              loadingBtnName: ["Yes"],
            });
            if (btnName === "Yes") {
              const confirmPara:any = {
                ...data?.rows[0]?.data, 
                CONFIRM:"Y",  
                ACTIVITY_DONE_BY:authState?.user?.id,
                ENT_BRANCH_CD:data?.rows[0]?.data?.ENTERED_BRANCH_CD,
                ENT_COMP_CD:data?.rows[0]?.data?.ENTERED_COMP_CD,
                ACTIVITY_DATE:authState?.workingDate,
                ACTIVITY_TYPE:"",
                TRAN_TYPE:"",
                TRAN_AMOUNT:"0",
                
             };
             console.log(confirmPara);
             
             confRejectMutation.mutate({...confirmPara})
            }
           }
          }
          navigate(data?.name, {
            state: data?.rows,
          });
        },
        [navigate]
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
            actions={actions}
            loading={isLoading || isFetching}
            ReportExportButton={true}
            setAction={setCurrentAction}
            />
          {isDeleteRemark && (
                      <RemarksAPIWrapper
                        TitleText={
                        "WRONG ENTRY FROM HOLD TRANSACTION CONFIRMATION(TRN/579)"
                        }
                        onActionNo={() => SetDeleteRemark(false)}
                        onActionYes={async (val, rows) => {
                          const buttonName = await MessageBox({
                            messageTitle: t("confirmation"),
                            message: t("DoYouWantDeleteRow"),
                            buttonNames: ["Yes", "No"],
                            defFocusBtnName: "Yes",
                            loadingBtnName: ["Yes"],
                          });
                          if (buttonName === "Yes") {
                            const deleteReqPara:any = {
                              ...rowData,                             
                              USER_DEF_REMARKS: val
                                ? val
                                : "WRONG ENTRY FROM HOLD TRANSACTION CONFIRMATION(TRN/579)",
                              ACTIVITY_DONE_BY:authState?.user?.id,
                              //@ts-ignore
                              ENT_COMP_CD: rowData?.ENTERED_COMP_CD,
                              //@ts-ignore
                              ENT_BRANCH_CD:rowData?.ENTERED_BRANCH_CD,
                              ACTIVITY_DATE:authState?.workingDate,
                              ACTIVITY_TYPE:"Delete",
                              TRAN_AMOUNT:"0",
                              TRAN_TYPE:"Delete",
                                CONFIRM:"N"
                            };
                            console.log(deleteReqPara);
                            SetDeleteRemark(false);
                            confRejectMutation.mutate({...deleteReqPara});
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