import { Button, Dialog } from "@mui/material";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { SubmitFnType } from "packages/form";
import { dayLimitFormMetaData } from "./dayLimitFormMetadata";
import { t } from "i18next";
import { useLocation } from "react-router-dom";
import { useContext, useEffect } from "react";
import { AuthContext } from "pages_audit/auth";
import { useQuery } from "react-query";
import { dayLimitData } from "../api";

export const DayLimit = ({ navigate }) => {
  const { state: rows }: any = useLocation();

  const { authState } = useContext(AuthContext);
  console.log("<<<rows", rows);

  // delete rows["FULL_ACCT_NO_NM"];
  // delete rows["IFT_LIMIT_SPACER"];
  // delete rows["RTGS_LIMIT_SPACER"];
  // delete rows["NEFT_LIMIT_SPACER"];
  // delete rows["OWN_ACT_LIMIT_SPACER"];
  // delete rows["JOINT_DETAILS"];
  // delete rows["PHOTO_SIGN"];
  // delete rows["BBPS_LIMIT_SPACER"];
  // delete rows["PG_TRN_LIMIT_SPACER"];
  // delete rows["IMPS_LIMIT_SPACER"];
  // delete rows["IMPS_LIMIT_SPACER2"];

  const { isError, error, isLoading } = useQuery<any, any>(
    ["daylimit"],
    () =>
      dayLimitData({
        DTL_ROW: [
          {
            REG_DATE: rows?.REG_DATE,
            BRANCH_CD: rows?.BRANCH_CD,
            ACCT_TYPE: rows?.ACCT_TYPE,
            ACCT_CD: rows?.ACCT_CD,
            ACCT_NM: rows?.ACCT_NM,
            IFT: rows?.IFT === true ? "Y" : "N",
            RTGS: rows?.RTGS === true ? "Y" : "N",
            NEFT: rows?.NEFT === true ? "Y" : "N",
            OWN_ACT: rows?.OWN_ACT === true ? "Y" : "N",
            BBPS: rows?.BBPS === true ? "Y" : "N",
            PG_TRN: rows?.PG_TRN === true ? "Y" : "N",
            IMPS: rows?.IMPS === true ? "Y" : "N",
            PERDAY_BBPS_LIMIT: rows?.PERDAY_BBPS_LIMIT ?? "",
            PERDAY_NEFT_LIMIT: rows?.PERDAY_NEFT_LIMIT ?? "",
            PERDAY_RTGS_LIMIT: rows?.PERDAY_RTGS_LIMIT ?? "",
            PERDAY_IFT_LIMIT: rows?.PERDAY_IFT_LIMIT ?? "",
            PERDAY_OWN_LIMIT: rows?.PERDAY_OWN_LIMIT ?? "",
            PERDAY_P2A_LIMIT: rows?.PERDAY_P2A_LIMIT ?? "",
            PERDAY_P2P_LIMIT: rows?.PERDAY_P2P_LIMIT ?? "",
            PERDAY_PG_AMT: rows?.PERDAY_PG_AMT ?? "",
          },
        ],
        TRAN_CD: rows?.TRAN_CD,
        SR_CD: rows?.SR_CD,
        ENTERED_BRANCH_CD: rows?.ENTERED_BRANCH_CD,
        SCREEN_REF: "MST/843",
      }),
    {
      enabled: !!rows?.TRAN_CD,
      onSuccess(data) {},
    }
  );

  const onSubmitHandler: SubmitFnType = async (
    data: any,
    displayData,
    endSubmit
  ) => {
    endSubmit(true);
  };

  return (
    <>
      <>
        <Dialog
          open={true}
          fullWidth={true}
          PaperProps={{
            style: {
              maxWidth: "1300px",
              padding: "5px",
            },
          }}
        >
          <FormWrapper
            key={`day-limit-Form`}
            metaData={dayLimitFormMetaData as MetaDataType}
            initialValues={{}}
            onSubmitHandler={onSubmitHandler}
            formStyle={{
              background: "white",
            }}
            subHeaderLable={`\u00A0\u00A0\u00A0   ${(
              authState?.companyID +
              rows?.BRANCH_CD +
              rows?.ACCT_TYPE +
              rows?.ACCT_CD
            ).replace(/\s/g, "")} -  ${rows?.ACCT_NM}`}
          >
            {({ isSubmitting, handleSubmit }) => (
              <>
                <Button
                  color={"primary"}
                  // onClick={(event) =>
                  //   formRef?.current?.handleSubmit(event, "BUTTON_CLICK")
                  // }
                  // endIcon={
                  //   mutation?.isLoading ? <CircularProgress size={20} /> : null
                  // }
                >
                  {t("Save")}
                </Button>
                <Button onClick={() => navigate(".")} color={"primary"}>
                  {t("Close")}
                </Button>
              </>
            )}
          </FormWrapper>
        </Dialog>
      </>
    </>
  );
};
