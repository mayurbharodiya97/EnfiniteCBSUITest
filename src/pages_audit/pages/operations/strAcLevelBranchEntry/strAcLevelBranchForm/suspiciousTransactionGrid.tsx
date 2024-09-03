import { FC, useCallback,  useEffect, useRef, useState } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Dialog from "@mui/material/Dialog";
import { useTranslation } from "react-i18next";
import { suspiciousTransactionGridMetaData } from "./metadata";
import GridWrapper from "components/dataTableStatic";
import { ActionTypes } from "components/dataTable/types";
import { CreateDetailsRequestData } from "components/utils";
import { useMutation } from "react-query";
import * as API from "../api";
import { Alert } from "components/common/alert";
import { enqueueSnackbar } from "notistack";
import { usePopupContext } from "components/custom/popupContext";
import { format } from "date-fns";
import { t } from "i18next";

const actions: ActionTypes[] = [
    {
        actionName: "refresh",
        actionLabel: t("Refresh"),
        multiple: false,
        // rowDoubleClick: true,
        alwaysAvailable: true,
    },
    {
        actionName: "save-close",
        actionLabel: t("SaveClose"),
        multiple: false,
        // rowDoubleClick: true,
        alwaysAvailable: true,
    },
    {
        actionName: "close",
        actionLabel: t("Close"),
        multiple: false,
        // rowDoubleClick: true,
        alwaysAvailable: true,
    },

];
export const StrMarkAsPerSuspiciousGrid: FC<{
    onClose?: any
    rowsData?: any
}> = ({
    onClose, rowsData
}) => {
        const { MessageBox, CloseMessageBox } = usePopupContext();
        const { t } = useTranslation();
        const myGridRef = useRef<any>(null);
        const [girdData, setGridData] = useState<any>([]);
        const [operationType, setOperationType] = useState("");
        const oldDataRef = useRef<any>([])

        const getStrSuspiciousRequest = {
            ENTERED_BRANCH_CD: rowsData?.ENTERED_BRANCH_CD,
            ENTERED_COMP_CD: rowsData?.ENTERED_COMP_CD,
            TRAN_CD: rowsData?.TRAN_CD,
            SR_CD: rowsData?.SR_CD,
            COMP_CD: rowsData?.ACCT_COMP_CD,
            BRANCH_CD: rowsData?.ACCT_BRANCH_CD,
            ACCT_TYPE: rowsData?.ACCT_TYPE,
            ACCT_CD: rowsData?.ACCT_CD,
            FROM_DT: rowsData?.ACT_FROM_DT,
            REASON_SR_CD: rowsData?.REASON_SR_CD,
            REASON_TRAN_CD: rowsData?.REASON_TRAN_CD,
            TO_DT: rowsData?.ACT_TO_DT,
            SCREEN_REF: "TRN/1272"
        }
        const getStrSuspiciousTransactionData: any = useMutation("getStrSuspiciousTransactionData", API.getStrSuspiciousTransactionData, {
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
            onSuccess: (data, variable) => {
                setOperationType(variable?.OPERATION)
                if (variable?.OPERATION === "GET") {
                    oldDataRef.current = data
                }
                CloseMessageBox()
            },
        });
        useEffect(() => {
            getStrSuspiciousTransactionData.mutate({
                ...getStrSuspiciousRequest,
                OPERATION: "GET",
            })
        }, [])
        const susTransactionDetailDML: any = useMutation(API.susTransactionDetailDML, {
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
            },
        });

        const setCurrentAction = useCallback(async (data) => {
            if (data?.name === "close") {
                onClose()
            } else if (data.name === "save-close") {
                let { hasError, data: dataold } = await myGridRef.current?.validate();
                if (hasError === true) {
                    if (dataold) {
                        setGridData(dataold);
                    }
                } else {
                    let result = myGridRef?.current?.cleanData?.();
                    if (!Array.isArray(result)) {
                        result = [result];
                    }
                    result = result.map((item) => ({
                        ...item,
                        SUSPICIOUS_FLAG: Boolean(item?.SUSPICIOUS_FLAG) ? "Y" : "N",
                        ENTERED_BRANCH_CD: rowsData?.ENTERED_BRANCH_CD,
                        ENTERED_COMP_CD: rowsData?.ENTERED_COMP_CD,
                        TRAN_CD: rowsData?.TRAN_CD,
                        SR_CD: rowsData?.SR_CD,
                        ACCT_TYPE: rowsData?.ACCT_TYPE,
                        ACCT_CD: rowsData?.ACCT_CD,
                        BRANCH_CD: rowsData?.ACCT_BRANCH_CD,
                        COMP_CD: rowsData?.ACCT_COMP_CD,

                    }))
                    if (result.every(item => item.SUSPICIOUS_FLAG === "N")) {
                        await MessageBox({
                            message:t("AtleastOneRecordMustMarkedSuspicious"),
                            messageTitle: t("ValidationFailed"),
                        });
                        return
                    } else {
                        let finalResult = result.filter(
                            (one) =>
                                !(Boolean(one?._hidden) && Boolean(one?._isNewRow))
                        );

                        if (finalResult.length === 0) {
                            // setMode("view");
                        } else {
                            finalResult = CreateDetailsRequestData(finalResult);
                            // Check NEW_INSERT condition and push old data to finalResult.isDeleteRow
                            if (!finalResult.isDeleteRow) {
                                finalResult.isDeleteRow = [];
                            }
                            const hasNewInsert = result.some(item => item?.NEW_INSERT === "Y");
                            const oldData = oldDataRef.current.map((item) => ({
                                ...item,
                                SUSPICIOUS_FLAG: Boolean(item?.SUSPICIOUS_FLAG) ? "Y" : "N",
                                ENTERED_BRANCH_CD: rowsData?.ENTERED_BRANCH_CD,
                                ENTERED_COMP_CD: rowsData?.ENTERED_COMP_CD,
                                TRAN_CD: rowsData?.TRAN_CD,
                                SR_CD: rowsData?.SR_CD,
                                ACCT_TYPE: rowsData?.ACCT_TYPE,
                                ACCT_CD: rowsData?.ACCT_CD,
                                BRANCH_CD: rowsData?.ACCT_BRANCH_CD,
                                COMP_CD: rowsData?.ACCT_COMP_CD,

                            }))
                            if (hasNewInsert) {
                                finalResult.isDeleteRow.push(...oldData);
                            }
                            if (
                                finalResult?.isDeleteRow?.length === 0 &&
                                finalResult?.isNewRow?.length === 0 &&
                                finalResult?.isUpdatedRow?.length === 0
                            ) {
                                onClose()

                            } else {
                                finalResult["isUpdatedRow"] = finalResult?.isUpdatedRow?.map(
                                    (item) => {
                                        return {
                                            ...item,
                                            _OLDROWVALUE: {
                                                ...item?._OLDROWVALUE,
                                                SUSPICIOUS_FLAG: Boolean(item?._OLDROWVALUE?.SUSPICIOUS_FLAG) ? "Y" : "N",
                                            },
                                        };
                                    }
                                );
                                let reqData = {
                                    ENTERED_BRANCH_CD: rowsData?.ENTERED_BRANCH_CD,
                                    ENTERED_COMP_CD: rowsData?.ENTERED_COMP_CD,
                                    TRAN_CD: rowsData?.TRAN_CD,
                                    SR_CD: rowsData?.SR_CD,
                                    ACCT_TYPE: rowsData?.ACCT_TYPE,
                                    ACCT_CD: rowsData?.ACCT_CD,
                                    BRANCH_CD: rowsData?.ACCT_BRANCH_CD,
                                    COMP_CD: rowsData?.ACCT_COMP_CD,
                                    _UPDATEDCOLUMNS: [],
                                    _OLDROWVALUE: {},
                                    DETAILS_DATA: finalResult,
                                };
                                const btnName = await MessageBox({
                                    message: t("AreYouSaveThisRecord"),
                                    messageTitle: t("Confirmation"),
                                    buttonNames: ["Yes", "No"],
                                    loadingBtnName: ["Yes"],
                                });
                                if (btnName === "Yes") {
                                    susTransactionDetailDML.mutate({ ...reqData })
                                }
                            }
                        }
                    }
                }
            } else if (data.name === "refresh") {
                const btnName = await MessageBox({
                    message: t("AreYouSureRefreshTransactionDetails?"),
                    messageTitle: t("Confirmation"),
                    buttonNames: ["Yes", "No"],
                    loadingBtnName: ["Yes"],
                });
                if (btnName === "Yes") {
                    getStrSuspiciousTransactionData.mutate({
                        ...getStrSuspiciousRequest,
                        OPERATION: "GEN",
                    })
                }

            }
        }, []);
        useEffect(() => {

            if (Array.isArray(getStrSuspiciousTransactionData?.data)) {
                setGridData(getStrSuspiciousTransactionData?.data);
            } else {
                setGridData([]);
            }
        }, [getStrSuspiciousTransactionData?.data]);


        if (suspiciousTransactionGridMetaData) {
            suspiciousTransactionGridMetaData.gridConfig.gridLabel = t("SuspiciousTransaction") + " " + "for A/c" + "-" + rowsData?.ACCT_CD_NEW + " " + t("From") + " " + format(new Date(rowsData?.ACT_FROM_DT), "dd/MMM/yyyy") + " " + t("To") + " " + format(new Date(rowsData?.ACT_TO_DT), "dd/MMM/yyyy")
        }
        return (
            <>
                <Dialog
                    open={true}
                    PaperProps={{
                        style: {
                            width: "90%",
                        },
                    }}
                    maxWidth="lg"
                >
                    <>
                        {getStrSuspiciousTransactionData?.isError && (
                            <Alert
                                severity="error"
                                errorMsg={getStrSuspiciousTransactionData?.error?.error_msg ?? "Something went to wrong.."}
                                errorDetail={getStrSuspiciousTransactionData?.error?.error_detail}
                                color="error"
                            />
                        )}
                        <GridWrapper
                            key={"suspiciousTransactionGridMetaDataGrid"}
                            finalMetaData={suspiciousTransactionGridMetaData}
                            data={girdData ?? []}
                            setData={setGridData}
                            loading={getStrSuspiciousTransactionData?.isLoading}
                            actions={actions}
                            setAction={setCurrentAction}
                            ref={myGridRef}
                            refetchData={() => getStrSuspiciousTransactionData.mutate({
                                ...getStrSuspiciousRequest,
                                OPERATION: operationType,
                            })}
                        />
                    </>
                </Dialog>

            </>
        );
    };


