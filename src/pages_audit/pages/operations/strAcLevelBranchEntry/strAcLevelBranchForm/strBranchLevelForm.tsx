import { FC, useContext } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Dialog from "@mui/material/Dialog";
import { GradientButton } from "components/styledComponent/button";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { SubmitFnType } from "packages/form";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { strLevelBranchEditFormMetaData } from "./metadata";

export const ChequeReturnPostForm: FC<{
    onClose?: any
    data?: any
}> = ({
    onClose, data
}) => {

        const { t } = useTranslation();

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
                        initialValues={data}
                        // initialValues={{
                        //   ...inwardGridData,
                        //   RANGE_DATE: result?.[1]?.data?.[0]?.RANGE_DATE ?? "",
                        //   TRAN_DATE: result?.[1]?.data?.[0]?.TRAN_DATE ?? "",
                        // }}
                        onSubmitHandler={onSubmitHandler}
                        formStyle={{
                            background: "white",
                        }}
                    >
                        {({ isSubmitting, handleSubmit }) => (
                            <>
                                <GradientButton
                                    onClick={onClose}
                                >{t("Close")}</GradientButton>
                            </>
                        )}
                    </FormWrapper>
                </>

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
