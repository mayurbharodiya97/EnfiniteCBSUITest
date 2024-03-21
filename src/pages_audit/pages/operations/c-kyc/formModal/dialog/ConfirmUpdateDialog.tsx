import { CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { GradientButton } from 'components/styledComponent/button';
import { AuthContext } from 'pages_audit/auth';
import * as React from 'react';
import { useMutation } from 'react-query';
import { CkycContext } from '../../CkycContext';
import { PopupRequestWrapper } from 'components/custom/popupMessage';
import { Alert } from 'components/common/alert';
import * as API from "../../api";

export const ConfirmUpdateDialog = ({open, onClose, mutationFormDTL, setAlertOnUpdate
    // isLoading, setIsLoading, data, mt
}) => {
    const [shouldUpdate, setShouldUpdate] = React.useState(false)
    const { authState } = React.useContext(AuthContext);
    const {state, handleUpdatectx, handleFormDataonSavectx, handleModifiedColsctx, onFinalUpdatectx, handleCurrFormctx} = React.useContext(CkycContext);


    const mutation: any = useMutation(API.updateCustomer, {
        onSuccess: (data:any) => {
            handleCurrFormctx({
                currentFormSubmitted: null,
                isLoading: false,
            })
            onFinalUpdatectx(false)
            // setIsUpdated(true)
            // console.log("data on save", data)
            handleModifiedColsctx({})
            handleFormDataonSavectx({})

            // calling this api for getting updated formdata from updated req_cd
            let reqPayload = {
                // COMP_CD: authState?.companyID ?? "",
                BRANCH_CD: authState?.user?.branchCode ?? "",
                REQUEST_CD: data[0].REQ_CD ?? "",
            }
            mutationFormDTL.mutate(reqPayload)
            // if(data?.[0]?.REQ_CD) {
            //     // handleReqCDctx(data?.[0]?.REQ_CD)
            //     // handleColTabChangectx(state?.colTabValuectx+1)
            // }
        },
        onError: (error: any) => {
            handleCurrFormctx({
                currentFormSubmitted: null,
                isLoading: false,
            })
            onFinalUpdatectx(false)
            handleModifiedColsctx({})
            handleFormDataonSavectx({})
            // console.log("data on error", error)
            // setIsUpdated(true)
        },
    });

    // useEffect(() => {
    //         if(mutationFormDTL.isSuccess && mutationFormDTL.data) {
    //         // on success of form data retrieve            
    //     }
    // }, [mutationFormDTL.data, mutationFormDTL.isSuccess])

    const abortUpdate = () => {
        handleCurrFormctx({
            currentFormSubmitted: null,
            isLoading: false,
        })
        onFinalUpdatectx(false)
        onClose()
    }

    return <PopupRequestWrapper
        MessageTitle={mutation.isError ? "ERROR" : "SUCCESS"}
        Message={
            !shouldUpdate 
                ? "Are you sure you want to apply changes and update ?"
                : mutation.isLoading
                    ? "Updating..."
                    : mutation.data 
                        ? state?.customerIDctx 
                            ? `Customer ID : ${state?.customerIDctx} saved Sucessfully`
                            : state?.req_cd_ctx ? `Request ID : ${state?.req_cd_ctx} saved Sucessfully`: null
                        // : mutation.error && "Something went wrong!"
                        : mutation.isError && (
                            <Alert
                              severity={mutation.error?.severity ?? "error"}
                              errorMsg={mutation.error?.error_msg ?? "Something went to wrong.."}
                              errorDetail={mutation.error?.error_detail}
                              color="error"
                            />
                          )
            }
        onClickButton={async (rows, buttonNames, ...others) => {
            // console.log(rows, "kjefeiwqf", buttonNames)
            if(buttonNames === "Yes") {
                setShouldUpdate(true)
                const {updated_tab_format, update_type} = await handleUpdatectx({
                    COMP_CD: authState?.companyID ?? ""
                })
                if(typeof updated_tab_format === "object") {
                    // console.log(update_type, "asdqwezxc weoifhwoehfiwoehfwef", typeof updated_tab_format, updated_tab_format)
                    if (Object.keys(updated_tab_format)?.length === 0) {
                        setAlertOnUpdate(true)
                        abortUpdate()
                    } else if(Object.keys(updated_tab_format)?.length>0) {
                        const payload = {
                          COMP_CD: authState?.companyID ?? "",
                          updated_tab_format: updated_tab_format,
                          update_type: update_type,
                          CUSTOMER_ID: state?.customerIDctx ?? "",
                          REQ_CD: state?.req_cd_ctx ?? "",
                          REQ_FLAG: state?.customerIDctx ? "E" : "F",
                          SAVE_FLAG: state?.customerIDctx
                            ? ""
                            : update_type == "save_as_draft"
                            ? "D"
                            : update_type == "full_save"
                            ? "F"
                            : "",
                          IsNewRow: !state?.req_cd_ctx ? true : false,
                        };
                        mutation.mutate(payload);
                    }
                }
                // mutation.mutate({
                //     COMP_CD: authState?.companyID ?? "",
                //     // event: e ,
                // })
            } else if (buttonNames === "No" || buttonNames === "Ok") {
                abortUpdate()
            }
        }}
        buttonNames={(shouldUpdate && !mutation.isLoading) ? ["Ok"] : ["Yes", "No"]}
        rows={[]}
        loading={{Yes: mutation.isLoading}}
        // loading={{ Yes: getData?.isLoading, No: false }}
        open={open}
    />
}