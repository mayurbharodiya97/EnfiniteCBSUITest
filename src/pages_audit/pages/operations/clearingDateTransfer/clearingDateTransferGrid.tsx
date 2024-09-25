import {
  useRef,
  useCallback,
  useContext,
  Fragment,
  useState,
  useEffect,
} from "react";

import { Alert, MetaDataType } from "@acuteinfo/common-base";
import { ActionTypes } from "@acuteinfo/common-base";
import { useMutation } from "react-query";
import * as API from "./api";
import { AuthContext } from "pages_audit/auth";
import { SubmitFnType } from "@acuteinfo/common-base";
import { format } from "date-fns";
import { ClearCacheProvider, queryClient } from "@acuteinfo/common-base";
import { AppBar, Theme, Toolbar, Typography } from "@mui/material";
import {
  RetrieveFormConfigMetaData,
  branchClearingDateTransferGridMetaData,
  clearingDateTransferGridMetaData,
  slipClearingDateTransferGridMetaData,
} from "./girdMetadata";
import { makeStyles } from "@mui/styles";
import { useSnackbar } from "notistack";
import { t } from "i18next";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import {
  GridWrapper,
  FormWrapper,
  usePopupContext,
  GradientButton,
} from "@acuteinfo/common-base";
import getDynamicLabel from "components/common/custom/getDynamicLabel";
const useTypeStyles = makeStyles((theme: Theme) => ({
  root: {
    paddingLeft: theme.spacing(1.5),
    paddingRight: theme.spacing(1.5),
    background: "var(--theme-color5)",
  },
  title: {
    flex: "1 1 100%",
    color: "var(--white)",
    letterSpacing: "1px",
    fontSize: "1.5rem",
  },
  refreshiconhover: {},
}));
const actions: ActionTypes[] = [
  {
    actionName: "transfer",
    actionLabel: t("Transfer"),
    multiple: true,
    rowDoubleClick: false,
    alwaysAvailable: true,
    shouldExclude: (rows) => {
      let exclude = false;
      for (let i = 0; i < rows.length; i++) {
        if (rows[i].data?.CNT < 0) {
          exclude = true;
          break;
        }
      }
      return exclude;
    },
  },
];

const ClearingDateTransferGrid = () => {
  const headerClasses = useTypeStyles();
  const { authState } = useContext(AuthContext);
  const formRef = useRef<any>(null);
  const gridRef = useRef<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [isFlag, setIsFlag] = useState<any>();
  const [isAmount, setIsAmount] = useState<any>();
  const { enqueueSnackbar } = useSnackbar();
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const { t } = useTranslation();
  let currentPath = useLocation().pathname;

  const mutation: any = useMutation(
    "getRetrievalClearingData",
    API.getRetrievalClearingData,
    {
      onSuccess: (data) => {},
      onError: (error: any) => {
        let errorMsg = "Unknown Error occured";
        if (typeof error === "object") {
          errorMsg = error?.error_msg ?? errorMsg;
        }
        enqueueSnackbar(errorMsg, {
          variant: "error",
        });
      },
    }
  );
  const slipMutation: any = useMutation(
    "slipGetRetrievalClearingData",
    API.slipGetRetrievalClearingData,
    {
      onSuccess: (data) => {},
      onError: (error: any) => {
        let errorMsg = "Unknown Error occured";
        if (typeof error === "object") {
          errorMsg = error?.error_msg ?? errorMsg;
        }
        enqueueSnackbar(errorMsg, {
          variant: "error",
        });
      },
    }
  );
  const transferDateMutation: any = useMutation(
    "transferDateClearingData",
    API.transferDateClearingData,
    {
      onSuccess: async (data) => {
        for (let i = 0; i < data?.length; i++) {
          if (data[i]?.O_STATUS === "999") {
            const buttonName = await MessageBox({
              messageTitle: t("ValidationFailed"),
              message: data[i]?.O_MESSAGE,
            });
          } else if (data[i]?.O_STATUS === "99") {
            const buttonName = await MessageBox({
              messageTitle: t("Confirmation"),
              message: data[i]?.O_MESSAGE,
            });
          } else if (data[i]?.O_STATUS === "9") {
            const buttonName = await MessageBox({
              messageTitle: t("Alert"),
              message: data[i]?.O_MESSAGE,
            });
          } else if (data[i]?.O_STATUS === "0") {
            enqueueSnackbar(t("RecordSavedSuccessfully"), {
              variant: "success",
            });
            CloseMessageBox();
            slipMutation.mutate(formData);
            mutation.mutate(formData);
          }
        }
      },
      onError: (error: any) => {
        let errorMsg = "Unknown Error occured";
        if (typeof error === "object") {
          errorMsg = error?.error_msg ?? errorMsg;
        }
        enqueueSnackbar(errorMsg, {
          variant: "error",
        });
        CloseMessageBox();
      },
    }
  );
  const setCurrentAction = useCallback(async (data) => {
    if (data?.name === "transfer") {
      const DTL_CLOB = data?.rows?.map((item) => {
        const bankCode = item.data?.BANK_CD?.trim();
        const tranCode = item.data?.TRAN_CD?.trim();
        return {
          BANK_CD: bankCode,
          TRAN_CD: tranCode,
        };
      });
      const totalCount = data.rows.reduce(
        (acc, row) => acc + parseInt(row.data.CNT),
        0
      );
      formRef.current.getFieldData().then(async (res) => {
        const buttonName = await MessageBox({
          messageTitle: t("Confirmation"),
          message:
            t("AreYouSuretransfer") +
            " " +
            format(new Date(res?.FR_TRAN_DT), "dd/MMM/yyyy") +
            " / " +
            res?.FR_ZONE +
            t("ClearingTodateZone") +
            " " +
            format(new Date(res?.TO_TRAN_DT), "dd/MMM/yyyy") +
            " / " +
            res?.TO_ZONE,
          buttonNames: ["No", "Yes"],
          defFocusBtnName: "Yes",
          loadingBtnName: ["Yes"],
        });
        if (buttonName === "Yes") {
          const button = await MessageBox({
            messageTitle: t("Confirmation"),
            message:
              t("ThereAre") +
              " " +
              totalCount +
              " " +
              t("ChequeAvailableforClearingDateTransferAreYouSureContinue"),
            buttonNames: ["Cancel", "Ok"],
            defFocusBtnName: "Ok",
            loadingBtnName: ["Ok"],
          });
          if (button === "Ok") {
            transferDateMutation.mutate({
              CLG_FLAG: res?.FLAG,
              FR_TRAN_DT: format(new Date(res?.FR_TRAN_DT), "dd/MMM/yyyy"),
              TO_TRAN_DT: format(new Date(res?.TO_TRAN_DT), "dd/MMM/yyyy"),
              FR_ZONE: res?.FR_ZONE,
              TO_ZONE: res?.TO_ZONE,
              TRAN_TYPE: "S",
              DTL_CLOB: DTL_CLOB,
              SCREEN_REF: "RPT/1188",
            });
          }
        }
      });
    }
  }, []);

  const onSubmitHandler: SubmitFnType = async (
    data: any,
    displayData,
    endSubmit,
    setFieldError,
    actionFlag
  ) => {
    delete data["RETRIEVE"];
    if (data?.FLAG === "S") {
      data = {
        CLEARING_DT: format(new Date(data["FR_TRAN_DT"]), "dd/MMM/yyyy"),
        ZONE: data["FR_ZONE"],
        COMP_CD: authState.companyID,
        BRANCH_CD: authState.user.branchCode,
        FLAG: data?.FLAG,
      };
      slipMutation.mutate(data);
      endSubmit(true);
    } else {
      data = {
        CLEARING_DT: format(new Date(data["FR_TRAN_DT"]), "dd/MMM/yyyy"),
        ZONE: data["FR_ZONE"],
        COMP_CD: authState.companyID,
        BRANCH_CD: authState.user.branchCode,
        FLAG: data?.FLAG,
      };
      mutation.mutate(data);
      endSubmit(true);
    }
    setFormData(data);
  };
  // if (clearingDateTransferGridMetaData) {
  //   if (isFlag === "B") {
  //     clearingDateTransferGridMetaData.gridConfig.allowRowSelection = true;
  //   } else {
  //     clearingDateTransferGridMetaData.gridConfig.allowRowSelection = false;
  //   }
  // }

  return (
    <Fragment>
      <>
        <AppBar
          position="relative"
          color="secondary"
          style={{ marginBottom: "5px" }}
        >
          <Toolbar className={headerClasses.root} variant={"dense"}>
            <Typography
              className={headerClasses.title}
              color="inherit"
              variant={"h6"}
              component="div"
            >
              {getDynamicLabel(currentPath, authState?.menulistdata, true)}
            </Typography>
            <>
              {isFlag === "N" ? (
                <>
                  <GradientButton
                    onClick={async () => {
                      const cleanedData = gridRef.current?.cleanData?.();
                      const totalCount = cleanedData.reduce(
                        (acc, row) => acc + parseInt(row?.CNT),
                        0
                      );
                      formRef.current.getFieldData().then(async (res) => {
                        const buttonName = await MessageBox({
                          messageTitle: t("Confirmation"),
                          message:
                            t("AreYouSuretransfer") +
                            " " +
                            format(new Date(res?.FR_TRAN_DT), "dd/MMM/yyyy") +
                            " / " +
                            res?.FR_ZONE +
                            t("ClearingTodateZone") +
                            " " +
                            format(new Date(res?.TO_TRAN_DT), "dd/MMM/yyyy") +
                            " / " +
                            res?.TO_ZONE,
                          buttonNames: ["No", "Yes"],
                          defFocusBtnName: "Yes",
                          loadingBtnName: ["Yes"],
                        });
                        if (buttonName === "Yes") {
                          const button = await MessageBox({
                            messageTitle: t("Confirmation"),
                            message:
                              t("ThereAre") +
                              " " +
                              totalCount +
                              " " +
                              t(
                                "ChequeAvailableforClearingDateTransferAreYouSureContinue"
                              ),
                            buttonNames: ["Cancel", "Ok"],
                            defFocusBtnName: "Ok",
                            loadingBtnName: ["Ok"],
                          });
                          if (button === "Ok") {
                            transferDateMutation.mutate({
                              CLG_FLAG: res?.FLAG,
                              FR_TRAN_DT: format(
                                new Date(res?.FR_TRAN_DT),
                                "dd/MMM/yyyy"
                              ),
                              TO_TRAN_DT: format(
                                new Date(res?.TO_TRAN_DT),
                                "dd/MMM/yyyy"
                              ),
                              FR_ZONE: res?.FR_ZONE,
                              TO_ZONE: res?.TO_ZONE,
                              TRAN_TYPE: "S",
                              DTL_CLOB: [],
                              SCREEN_REF: "RPT/1188",
                            });
                          }
                        }
                      });
                    }}
                  >
                    {t("Transfer")}
                  </GradientButton>
                </>
              ) : null}
            </>
          </Toolbar>
        </AppBar>
        <FormWrapper
          key={`retrieveForm`}
          metaData={RetrieveFormConfigMetaData as MetaDataType}
          initialValues={{
            FR_TRAN_DT: authState?.workingDate,
            TO_TRAN_DT: authState?.workingDate,
          }}
          onSubmitHandler={onSubmitHandler}
          formStyle={{
            background: "white",
          }}
          onFormButtonClickHandel={(id) => {
            let event: any = { preventDefault: () => {} };
            // if (mutation?.isLoading) {
            if (id === "RETRIEVE") {
              formRef?.current?.handleSubmit(event, "RETRIEVE");
            }
          }}
          formState={{ ZONE_TRAN_TYPE: "S" }}
          setDataOnFieldChange={(action, payload) => {
            setIsFlag(payload);
          }}
          hideHeader={true}
          ref={formRef}
        />
        <Fragment>
          {mutation.isError && (
            <Alert
              severity="error"
              errorMsg={
                mutation.error?.error_msg ?? "Something went to wrong.."
              }
              errorDetail={mutation.error?.error_detail}
              color="error"
            />
          )}
          {/* {mutation?.data ? ( */}
          <GridWrapper
            key={"clearingDateTransferGrid" + isFlag}
            finalMetaData={
              isFlag === "S"
                ? slipClearingDateTransferGridMetaData
                : isFlag === "B"
                ? branchClearingDateTransferGridMetaData
                : clearingDateTransferGridMetaData
            }
            data={
              isFlag === "S" ? slipMutation?.data ?? [] : mutation?.data ?? []
            }
            setData={() => null}
            loading={
              isFlag === "S"
                ? slipMutation?.isLoading || slipMutation?.isFetching
                : mutation.isLoading || mutation.isFetching
            }
            actions={actions}
            setAction={setCurrentAction}
            ref={gridRef}
          />
        </Fragment>
      </>
    </Fragment>
  );
};
export const ClearingDateTransferGridWrapper = () => {
  return (
    <ClearCacheProvider>
      <ClearingDateTransferGrid />
    </ClearCacheProvider>
  );
};
