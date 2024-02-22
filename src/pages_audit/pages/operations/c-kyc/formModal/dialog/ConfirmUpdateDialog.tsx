import { CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { GradientButton } from 'components/styledComponent/button';
import { AuthContext } from 'pages_audit/auth';
import * as React from 'react';
import { useMutation } from 'react-query';
import { CkycContext } from '../../CkycContext';

export const ConfirmUpdateDialog = ({open, onClose, mutationFormDTL,
    // isLoading, setIsLoading, data, mt
}) => {
    const [shouldUpdate, setShouldUpdate] = React.useState(false)
    const { authState } = React.useContext(AuthContext);
    const {state, handleUpdatectx, handleFormDataonSavectx, handleModifiedColsctx, onFinalUpdatectx, handleCurrFormctx} = React.useContext(CkycContext);


    const mutation: any = useMutation(handleUpdatectx, {
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
                COMP_CD: authState?.companyID ?? "",
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


    return <Dialog open={open} maxWidth="sm"
        PaperProps={{
            style: {
                minWidth: "40%",
                width: "40%",
            }
        }}
    >
        <DialogTitle
            sx={{
                background: "var(--theme-color3)",
                color: "var(--theme-color2)",
                letterSpacing: "1.3px",
                margin: "10px",
                boxShadow:
                "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;",
                fontWeight: 500,
                borderRadius: "inherit",
                minWidth: "450px",
                py: 1,
            }}
            id="responsive-dialog-title"
        >
            Confirmation
            {/* {isLoading ? "Updating..." : "Updated Successfully"} */}
            {/* {"Updating..."} */}
        </DialogTitle>
        <DialogContent>
            <DialogContentText
                sx={{ fontSize: "19px", display: "flex" }}
            >
                {
                !shouldUpdate 
                    ? "Are you sure you want to apply changes and update ?"
                    : mutation.isLoading
                        ? "Updating..."
                        : mutation.data 
                            ? "Your Changes applied successfully.."
                            : mutation.error && "Something went wrong!"
                }
                {/* {isLoading ? "Please Wait.. Your Data is getting updated.." : "Data Updated Successfully."}                 */}
                {/* <HelpIcon color="secondary" fontSize="large" /> */}
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            {!shouldUpdate && <GradientButton
                autoFocus
                onClick={(e) => {
                    setShouldUpdate(true)
                    mutation.mutate({
                        COMP_CD: authState?.companyID ?? "",
                        event: e 
                    })
                }}
            >
                Yes
            </GradientButton>}
            {!shouldUpdate && <GradientButton
                autoFocus
                onClick={abortUpdate}
            >
                No
            </GradientButton>}
            {shouldUpdate && <GradientButton
                autoFocus
                disabled={mutation.isLoading}
                onClick={abortUpdate}
                endIcon={
                    mutation.isLoading ? <CircularProgress size={20} /> : null
                }
            >
                OK
            </GradientButton>}
        </DialogActions>
    </Dialog>
}