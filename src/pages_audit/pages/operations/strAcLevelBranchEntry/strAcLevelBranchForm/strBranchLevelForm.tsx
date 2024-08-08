import { FC, useCallback, useContext, useRef, useState } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Dialog from "@mui/material/Dialog";
import { GradientButton } from "components/styledComponent/button";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { SubmitFnType } from "packages/form";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { strLevelBranchEditFormMetaData, suspiciousTransactionGridMetaData } from "./metadata";
import GridWrapper from "components/dataTableStatic";
import { ActionTypes } from "components/dataTable/types";
import { CreateDetailsRequestData } from "components/utils";


const actions: ActionTypes[] = [
    {
        actionName: "refresh",
        actionLabel: "Refresh",
        multiple: false,
        // rowDoubleClick: true,
        alwaysAvailable: true,
    },
    {
        actionName: "save-close",
        actionLabel: "Save & Close",
        multiple: false,
        // rowDoubleClick: true,
        alwaysAvailable: true,
    },
    {
        actionName: "close",
        actionLabel: "Close",
        multiple: false,
        // rowDoubleClick: true,
        alwaysAvailable: true,
    },

];
export const ChequeReturnPostForm: FC<{
    onClose?: any
    data?: any
}> = ({
    onClose, data
}) => {
        const [suspiciousTran, IsSuspiciousTran] = useState<any>(false)
        const { t } = useTranslation();
        const myGridRef = useRef<any>(null);
        const [girdData, setGridData] = useState<any>([]);

        const setCurrentAction = useCallback(async (data) => {
            if (data?.name === "close") {
                IsSuspiciousTran(false);
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
                    let finalResult = result.filter(
                        (one) => !(Boolean(one?._hidden) && Boolean(one?._isNewRow))
                    );
                    if (finalResult.length === 0) {
                        // setMode("view");
                    } else {
                        finalResult = CreateDetailsRequestData(finalResult);
                        if (
                            finalResult?.isDeleteRow?.length === 0 &&
                            finalResult?.isNewRow?.length === 0 &&
                            finalResult?.isUpdatedRow?.length === 0
                        ) {

                        } else {
                            let reqData = {
                                _isNewRow: false,
                                _UPDATEDCOLUMNS: [],
                                _OLDROWVALUE: {},
                                DETAILS_DATA: finalResult,
                            };

                            // isSubmitDataRef.current = reqData;
                            // setIsOpenSave(true);
                        }
                    }
                }




            }
        }, []);
        const onSubmitHandler: SubmitFnType = async (
            data: any,
            displayData,
            endSubmit,
            setFieldErrors,
            actionFlag
        ) => {
            endSubmit(true);
        }

        return (
            <>
                <>
                    <FormWrapper
                        key={`strBranchLevelForm`}
                        metaData={strLevelBranchEditFormMetaData as unknown as MetaDataType}
                        initialValues={data ?? {}}
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
                                <GradientButton onClick={onClose}> Save & Close</GradientButton>
                            </>
                        )}
                    </FormWrapper>
                </>
                {
                    suspiciousTran ?
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
                                    {/* {isError && (
                                        <Alert
                                            severity="error"
                                            errorMsg={error?.error_msg ?? "Something went to wrong.."}
                                            errorDetail={error?.error_detail}
                                            color="error"
                                        />
                                    )} */}
                                    <GridWrapper
                                        key={"suspiciousTransactionGridMetaDataGrid"}
                                        finalMetaData={suspiciousTransactionGridMetaData}
                                        data={[]}
                                        setData={() => null}
                                        // loading={isLoading || isFetching}
                                        actions={actions}
                                        setAction={setCurrentAction}
                                    // ref={gridRef}
                                    // refetchData={() => refetch()}
                                    />

                                </>
                            </Dialog>
                        </> : null
                }
            </>
        );
    };

export const StrBranchLevelFormWrapper = ({
    onClose
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
            <ChequeReturnPostForm onClose={onClose} data={rows?.[0]?.data} />
        </Dialog>
    );
};
