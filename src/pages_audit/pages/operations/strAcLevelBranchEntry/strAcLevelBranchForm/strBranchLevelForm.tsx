import { FC, useState } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Dialog from "@mui/material/Dialog";
import { GradientButton } from "components/styledComponent/button";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { SubmitFnType } from "packages/form";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { strLevelBranchEditFormMetaData } from "./metadata";
import { utilFunction } from "components/utils";
import { useMutation } from "react-query";
import * as API from "../api";
import { enqueueSnackbar } from "notistack";
import { usePopupContext } from "components/custom/popupContext";
import { StrMarkAsPerSuspiciousGrid } from "./suspiciousTransactionGrid";


export const StrBranchLevelForm: FC<{
    onClose?: any
    rowsData?: any
    isDataChangedRef?: any
}> = ({
    onClose, rowsData, isDataChangedRef
}) => {
        const { MessageBox, CloseMessageBox } = usePopupContext();
        const [suspiciousTran, IsSuspiciousTran] = useState<any>(false)
        const { t } = useTranslation();

        const updateBranhcDetailData: any = useMutation(API.updateBranhcDetailData, {
            onError: (error: any) => {
                let errorMsg = "Unknown Error occured";
                if (typeof error === "object") {
                    errorMsg = error?.error_msg ?? errorMsg;
                }
                enqueueSnackbar(errorMsg, {
                    variant: "error",
                });
                CloseMessageBox()
            },

            onSuccess: (data) => {
                enqueueSnackbar(data, {
                    variant: "success",
                });
                CloseMessageBox()
                isDataChangedRef.current = true
                onClose()
            },
        });



        const onSubmitHandler: SubmitFnType = async (
            data: any,
            displayData,
            endSubmit,
            setFieldError,
            actionFlag
        ) => {
            // @ts-ignore
            endSubmit(true);
            let upd: any = utilFunction.transformDetailsData(data, rowsData ?? {});
            if (upd?._UPDATEDCOLUMNS?.length > 0) {
                const buttonName = await MessageBox({
                    messageTitle: t("Confirmation"),
                    message: t("ProceedGen"),
                    buttonNames: ["No", "Yes"],
                    loadingBtnName: ["Yes"],
                });
                if (buttonName === "Yes") {
                    updateBranhcDetailData.mutate({
                        ...data,
                        ...upd,
                        _isNewRow: false,
                        ENTERED_BRANCH_CD: rowsData?.ENTERED_BRANCH_CD,
                        ENTERED_COMP_CD: rowsData?.ENTERED_COMP_CD,
                        TRAN_CD: rowsData?.TRAN_CD,
                        SR_CD: rowsData?.SR_CD,
                    });
                }
            }
        };

        return (
            <>
                <>
                    <FormWrapper
                        key={`strBranchLevelForm`}
                        metaData={strLevelBranchEditFormMetaData as unknown as MetaDataType}
                        initialValues={rowsData ?? {}}
                        onSubmitHandler={onSubmitHandler}
                        formStyle={{
                            background: "white",
                        }}
                        setDataOnFieldChange={(action, payload) => {
                            if (action === "IS_VISIBLE") {
                                if (payload === "Y") {
                                    IsSuspiciousTran(true)

                                }
                            }
                        }}
                    >
                        {({ isSubmitting, handleSubmit }) => (
                            <>
                                <GradientButton onClick={onClose}>{t("Close")}</GradientButton>
                                <GradientButton
                                    onClick={(event) => {
                                        handleSubmit(event, "Save");
                                    }}
                                    disabled={isSubmitting}
                                    //endIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                                    color={"primary"}
                                >
                                  { t("SaveClose")}
                                </GradientButton>
                            </>
                        )}
                    </FormWrapper>
                </>
                {
                    suspiciousTran ?
                        <>
                            <StrMarkAsPerSuspiciousGrid
                                onClose={() => {
                                    IsSuspiciousTran(false)
                                }}
                                rowsData={rowsData}
                            />
                        </> : null
                }
            </>
        );
    };

export const StrBranchLevelFormWrapper = ({
    onClose, isDataChangedRef
}) => {
    const { state: rows } = useLocation();

    return (
        <Dialog
            open={true}
            PaperProps={{
                style: {
                    width: "100%",
                },
            }}
            maxWidth="md"
        >
            <StrBranchLevelForm onClose={onClose} rowsData={rows?.[0]?.data} isDataChangedRef={isDataChangedRef} />
        </Dialog>
    );
};
