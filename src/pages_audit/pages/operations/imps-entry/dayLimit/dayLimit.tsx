import { AppBar, Button, Dialog, LinearProgress } from "@mui/material";
import { dayLimitFormMetaData } from "./dayLimitFormMetadata";
import { t } from "i18next";
import { useLocation } from "react-router-dom";
import { useQuery } from "react-query";
import { dayLimitData } from "../api";
import {
  Alert,
  FormWrapper,
  MetaDataType,
  SubmitFnType,
  usePopupContext,
} from "@acuteinfo/common-base";
import { LinearProgressBarSpacer } from "components/common/custom/linerProgressBarSpacer";

export const DayLimit = ({ navigate }) => {
  const { state: rows }: any = useLocation();
  const { MessageBox } = usePopupContext();

  const { data, isError, isSuccess, error, isLoading } = useQuery<any, any>(
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
            TRAN_CD: rows?.TRAN_CD,
            SR_CD: rows?.SR_CD,
            ENTERED_BRANCH_CD: rows?.ENTERED_BRANCH_CD,
          },
        ],
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
          {isLoading ? (
            <LinearProgress color="secondary" />
          ) : isError ? (
            <div style={{ paddingRight: "10px", paddingLeft: "10px" }}>
              <AppBar position="relative" color="primary">
                <Alert
                  severity="error"
                  errorMsg={error?.error_msg ?? "Unknow Error"}
                  errorDetail={error?.error_detail ?? ""}
                  color="error"
                />
              </AppBar>
            </div>
          ) : (
            <LinearProgressBarSpacer />
          )}

          <FormWrapper
            key={`day-limit-Form` + isSuccess}
            metaData={dayLimitFormMetaData as MetaDataType}
            initialValues={data?.[0] ?? {}}
            displayMode={data?.[0]?.READ_ONLY === "Y" ? "view" : null}
            onSubmitHandler={onSubmitHandler}
            formState={{ MessageBox: MessageBox }}
            formStyle={{
              background: "white",
            }}
          >
            {({ isSubmitting, handleSubmit }) => (
              <>
                {data?.[0]?.READ_ONLY !== "Y" && (
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
                )}

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
