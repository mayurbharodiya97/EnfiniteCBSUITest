import { AppBar, Button, Dialog, LinearProgress } from "@mui/material";
import { dayLimitFormMetaData } from "./dayLimitFormMetadata";
import { t } from "i18next";
import { useLocation } from "react-router-dom";
import { useMutation, useQuery } from "react-query";
import { crudDayLimitDataIMPS, dayLimitData } from "../api";
import { useEffect } from "react";
import {
  Alert,
  SubmitFnType,
  usePopupContext,
  FormWrapper,
  MetaDataType,
  ClearCacheProvider,
  utilFunction,
} from "@acuteinfo/common-base";
import { LinearProgressBarSpacer } from "components/common/custom/linerProgressBarSpacer";
import { enqueueSnackbar } from "notistack";

const DayLimitCustom = ({ navigate }) => {
  const { state: rows }: any = useLocation();
  const { MessageBox, CloseMessageBox } = usePopupContext();

  const dailyLimitData: any = useMutation("validateDeleteData", dayLimitData);
  const crudDayLimit: any = useMutation(
    "validateDeleteData",
    crudDayLimitDataIMPS,
    {
      onSuccess(data, variables) {
        console.log("<<<varia", variables);
        CloseMessageBox();
        navigate(".");
        if (variables?._isNewRow) {
          navigate(".");
          enqueueSnackbar(t("RecordInsertedMsg"), { variant: "success" });
        } else if (variables?._isDeleteRow) {
          enqueueSnackbar(t("RecordRemovedMsg"), { variant: "success" });
        } else if (variables?._isUpdateRow) {
          enqueueSnackbar(t("RecordUpdatedMsg"), { variant: "success" });
        }
      },
      onError() {
        CloseMessageBox();
      },
    }
  );

  useEffect(() => {
    return () => {
      dailyLimitData.mutate({
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
      });
    };
  }, []);

  const onSubmitHandler: SubmitFnType = async (
    data: any,
    displayData,
    endSubmit
  ) => {
    console.log("<<<day", data, rows, dailyLimitData?.data?.[0]);
    endSubmit(true);
    let rowDataLength = Object.keys(rows)?.length !== 0;
    delete data?.COMMON;
    delete data?.FLAG;

    let upd: any = rowDataLength
      ? utilFunction.transformDetailsData(
          data ?? {},
          dailyLimitData?.data?.[0] ?? {}
        )
      : null;

    console.log("<<<upd", upd);

    let apiReq = {
      ...data,
      ...upd,
    };
    // If the value is a boolean, convert it to "Y" for true and "N" for false
    Object.keys(apiReq).forEach((key) => {
      if (typeof apiReq[key] === "boolean") {
        apiReq[key] = apiReq[key] ? "Y" : "N";
      } else if (typeof apiReq[key] === "object" && apiReq[key] !== null) {
        Object.keys(apiReq[key]).forEach((nestedKey) => {
          if (typeof apiReq[key][nestedKey] === "boolean") {
            apiReq[key][nestedKey] = apiReq[key][nestedKey] ? "Y" : "N";
          }
        });
      }
    });
    console.log("<<<apireq", apiReq);
    let buttonName = await MessageBox({
      messageTitle: "confirmation",
      message: "Do You Want Save Changes ?",
      defFocusBtnName: "Yes",
      buttonNames: ["Yes", "No"],
      loadingBtnName: ["Yes"],
      icon: "INFO",
    });
    if (buttonName === "Yes") {
      crudDayLimit.mutate({
        ...apiReq,
        _isNewRow: rowDataLength ? false : true,
        _isDeleteRow: false,
        _isUpdateRow: rowDataLength ? true : false,
      });
    }
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
          {dailyLimitData?.isLoading || crudDayLimit?.isLoading ? (
            <LinearProgress color="secondary" />
          ) : dailyLimitData?.isError || crudDayLimit?.isError ? (
            <div style={{ paddingRight: "10px", paddingLeft: "10px" }}>
              <AppBar position="relative" color="primary">
                <Alert
                  severity="error"
                  errorMsg={
                    dailyLimitData?.error?.error_msg ??
                    crudDayLimit?.error?.error_msg ??
                    "Unknow Error"
                  }
                  errorDetail={
                    dailyLimitData?.error?.error_detail ??
                    crudDayLimit?.error?.error_detail ??
                    ""
                  }
                  color="error"
                />
              </AppBar>
            </div>
          ) : (
            <LinearProgressBarSpacer />
          )}

          <FormWrapper
            key={`day-limit-Form` + dailyLimitData?.isSuccess}
            metaData={dayLimitFormMetaData as MetaDataType}
            initialValues={dailyLimitData?.data?.[0] ?? {}}
            displayMode={
              dailyLimitData?.data?.[0]?.READ_ONLY === "Y" ||
              rows?.FLAG === "C" ||
              dailyLimitData?.isLoading
                ? "view"
                : null
            }
            onSubmitHandler={onSubmitHandler}
            formState={{ MessageBox: MessageBox }}
            formStyle={{
              background: "white",
            }}
          >
            {({ isSubmitting, handleSubmit }) => (
              <>
                {dailyLimitData?.data?.[0]?.READ_ONLY !== "Y" ||
                rows?.FLAG === "C" ? (
                  <Button
                    color={"primary"}
                    onClick={(event) => handleSubmit(event, "BUTTON_CLICK")}
                    disabled={isSubmitting}
                  >
                    {t("Save")}
                  </Button>
                ) : null}

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

export const DayLimit = ({ navigate }) => {
  return (
    <ClearCacheProvider>
      <DayLimitCustom navigate={navigate} />
    </ClearCacheProvider>
  );
};
