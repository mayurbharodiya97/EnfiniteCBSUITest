import { forwardRef, useContext, useEffect, useRef, useState } from "react";
import { FixDepositDetailFormMetadata } from "./metaData/fdDetailMetaData";
import { FDContext } from "../context/fdContext";
import { useLocation } from "react-router-dom";
import * as API from "../api";
import {
  extractMetaData,
  usePopupContext,
  GradientButton,
  InitialValuesType,
  utilFunction,
  SubmitFnType,
  MetaDataType,
  FormWrapper,
  LoaderPaperComponent,
  queryClient,
} from "@acuteinfo/common-base";
import { CircularProgress } from "@mui/material";
import { useMutation, useQuery } from "react-query";
import { useTranslation } from "react-i18next";
import { enqueueSnackbar } from "notistack";
import { AuthContext } from "pages_audit/auth";
import { format } from "date-fns";
export const FDDetailForm = forwardRef<any, any>(
  (
    {
      defaultView,
      handleDialogClose,
      screenFlag,
      detailsFormSubmitHandler,
      isDataChangedRef,
      openDepositForRenew,
      handleCloseDepositForRenew,
    },
    ref: any
  ) => {
    const {
      FDState,
      updateFDDetailsFormData,
      setActiveStep,
      updateSourceAcctFormData,
    } = useContext(FDContext);
    const { authState } = useContext(AuthContext);
    let currentPath = useLocation().pathname;
    const { t } = useTranslation();
    const [fdDtlRefresh, setFdDtlRefresh] = useState(0);
    const { MessageBox, CloseMessageBox } = usePopupContext();
    const { state: rows }: any = useLocation();
    const finalSubmitDataRef = useRef<any>(null);

    //Api for get para details
    const {
      data: paraDtlData,
      isLoading: paraDtlDataIsLoading,
      isFetching: paraDtlDataIsFetching,
      isError: paraDtlDataIsError,
      error: paraDtlDataError,
      refetch: paraDtlDataRefetch,
    } = useQuery<any, any>(
      ["getFDParaDetail", authState?.user?.branchCode],
      () =>
        API.getFDParaDetail({
          COMP_CD: authState?.companyID ?? "",
          BRANCH_CD: FDState?.retrieveFormData?.BRANCH_CD ?? "",
          ACCT_TYPE: FDState?.retrieveFormData?.ACCT_TYPE ?? "",
          SCREEN_REF: "RPT/401",
        }),
      { enabled: Boolean(openDepositForRenew) || defaultView === "new" }
    );

    //Api for get tenor default value and dropdown value
    const {
      data: tenorData,
      isLoading: tenorDataIsLoading,
      isFetching: tenorDataIsFetching,
      isError: tenorDataIsError,
      error: tenorDataError,
      refetch: tenorDataRefetch,
    } = useQuery<any, any>(
      ["getPeriodDDWData", authState?.user?.branchCode],
      () =>
        API.getPeriodDDWData({
          COMP_CD: authState?.companyID ?? "",
          BRANCH_CD: FDState?.retrieveFormData?.BRANCH_CD ?? "",
          ACCT_TYPE: FDState?.retrieveFormData?.ACCT_TYPE ?? "",
          SCREEN_REF: "RPT/401",
        }),
      {
        enabled:
          Boolean(paraDtlData) &&
          (defaultView === "new" || Boolean(openDepositForRenew)),
      }
    );

    //Api for get Mature instruction default value and dropdown value
    const {
      data: matureInstData,
      isLoading: matureInstDataIsLoading,
      isFetching: matureInstDataIsFetching,
      isError: matureInstDataIsError,
      error: matureInstDataError,
      refetch: matureInstDataRefetch,
    } = useQuery<any, any>(
      ["getMatureInstDDWData", authState?.user?.branchCode],
      () =>
        API.getMatureInstDDWData({
          COMP_CD: authState?.companyID ?? "",
          BASE_BRANCH_CD: authState?.user?.baseBranchCode ?? "",
          ACCT_TYPE: FDState?.retrieveFormData?.ACCT_TYPE ?? "",
        }),
      {
        enabled:
          Boolean(paraDtlData) &&
          Boolean(tenorData) &&
          (defaultView === "new" || Boolean(openDepositForRenew)),

        onSuccess: (data) => {
          updateFDDetailsFormData([
            {
              ACCT_TYPE: FDState?.retrieveFormData?.ACCT_TYPE ?? "",
              BRANCH_CD: FDState?.retrieveFormData?.BRANCH_CD ?? "",
              ACCT_CD: FDState?.retrieveFormData?.ACCT_CD ?? "",
              FD_NO_DISABLED: paraDtlData?.[0]?.FD_NO_DISABLED ?? "",
              INT_RATE_DISABLED: paraDtlData?.[0]?.INT_RATE_DISABLED ?? "",
              MATURITY_AMT_DISABLED:
                paraDtlData?.[0]?.MATURITY_AMT_DISABLED ?? "",
              TERM_CD_DISABLED: paraDtlData?.[0]?.TERM_CD_DISABLED ?? "",
              TRAN_DT_DISABLED: paraDtlData?.[0]?.TRAN_DT_DISABLED ?? "",
              FD_NO: paraDtlData?.[0]?.FD_NO ?? "",
              TERM_CD: paraDtlData?.[0]?.TERM_CD ?? "",
              SPL_AMT: paraDtlData?.[0]?.SPL_AMT ?? "",
              DOUBLE_TRAN: paraDtlData?.[0]?.DOUBLE_TRAN ?? "",
              COMP_CD: authState?.companyID ?? "",
              PERIOD_CD: tenorData?.[0]?.defaultVal ?? "",
              MATURE_INST: data?.[0]?.defaultVal ?? "",
              CATEG_CD: FDState?.acctNoData?.ACCT_CD ?? "",
              AGG_DEP_CUSTID: FDState?.acctNoData?.ACCT_CD ?? "",
              DEP_FAC: FDState?.acctNoData?.ACCT_CD ?? "",
            },
          ]);
        },
      }
    );

    //Api for get FD renew data
    const {
      data: renewData,
      isLoading: renewDataLoading,
      isFetching: renewDataisFetching,
      isError: renewDataisError,
      error: renewDataError,
      refetch: renewDataRefetch,
    } = useQuery<any, any>(
      ["getFDRenewData", authState?.user?.branchCode],
      () =>
        API.getFDRenewData({
          COMP_CD: authState?.companyID ?? "",
          BRANCH_CD: rows?.[0]?.data?.BRANCH_CD ?? "",
          ACCT_TYPE: rows?.[0]?.data?.ACCT_TYPE ?? "",
          SCREEN_REF: "RPT/401",
          CATEG_CD: FDState?.fdPaymentData.CATEG_CD ?? "",
          PAID_DT: FDState?.fdSavedPaymentData?.PAID_DT ?? "",
          PAID_FD_MAT_DT: rows?.[0]?.data?.MATURITY_DT
            ? format(new Date(rows?.[0]?.data?.MATURITY_DT), "dd/MMM/yyyy")
            : "",
          PERIOD_CD: rows?.[0]?.data?.PERIOD_CD ?? "",
          PERIOD_NO: rows?.[0]?.data?.PERIOD_NO ?? "",
          PRINCIPAL_AMT:
            Number(
              FDState?.fdSavedPaymentData?.TRANSFER_TOTAL_FOR_NEXT_FORM ?? 0
            ) - Number(FDState?.renewTrnsFormData?.RENEW_AMT ?? 0),
          WORKING_DATE: authState?.workingDate ?? "",
        }),
      { enabled: Boolean(paraDtlData) && Boolean(openDepositForRenew) }
    );

    //Api for get Maturity amount and Monthly int
    const {
      data: maturityAmtData,
      isLoading: maturityAmtDataLoading,
      isFetching: maturityAmtDataisFetching,
      isError: maturityAmtDataisError,
      error: maturityAmtDataError,
      refetch: maturityAmtDataRefetch,
    } = useQuery<any, any>(
      ["getFDRenewMaturityAmt", authState?.user?.branchCode],
      () =>
        API.getFDRenewMaturityAmt({
          COMP_CD: authState?.companyID ?? "",
          BRANCH_CD: rows?.[0]?.data?.BRANCH_CD ?? "",
          ACCT_TYPE: rows?.[0]?.data?.ACCT_TYPE ?? "",
          ACCT_CD: rows?.[0]?.data?.ACCT_CD ?? "",
          CATEG_CD: FDState?.fdPaymentData.CATEG_CD ?? "",
          TRAN_DT: renewData?.[0]?.TRAN_DT
            ? format(new Date(renewData?.TRAN_DT), "dd/MMM/yyyy")
            : "",
          TRSF_AMT: Number(
            FDState?.fdSavedPaymentData?.TRANSFER_TOTAL_FOR_NEXT_FORM ?? 0
          ),
          PERIOD_CD: rows?.[0]?.data?.PERIOD_CD ?? "",
          PERIOD_NO: rows?.[0]?.data?.PERIOD_NO ?? "",
          MATURITY_DT: renewData?.[0]?.MATURITY_DT
            ? format(new Date(renewData?.[0]?.MATURITY_DT), "dd/MMM/yyyy")
            : "",
          PRE_INT_FLAG: "N",
          PRINCIPAL_AMT: Number(
            FDState?.fdSavedPaymentData?.TRANSFER_TOTAL_FOR_NEXT_FORM ?? 0
          ),
          TERM_CD: paraDtlData?.[0]?.TERM_CD ?? "",
          INT_RATE: renewData?.[0]?.INT_RATE ?? "",
        }),
      { enabled: Boolean(paraDtlData) && Boolean(openDepositForRenew) }
    );

    //Mutation for Validate and Update FD details
    const validAndUpdateFDDtlMutation = useMutation(API.validAndUpdateFDDtl, {
      onError: async (error: any) => {
        let errorMsg = "Unknownerroroccured";
        if (typeof error === "object") {
          errorMsg = error?.error_msg ?? errorMsg;
        }
        await MessageBox({
          messageTitle: "Error",
          message: errorMsg ?? "",
          icon: "ERROR",
        });
        CloseMessageBox();
      },
      onSuccess: (data) => {
        isDataChangedRef.current = true;
        enqueueSnackbar(t("DataUpdatedSuccessfully"), {
          variant: "success",
        });
        CloseMessageBox();
        handleDialogClose();
      },
    });

    //Mutation for save FD Lien details
    const saveFDLienEntryDtlMutation = useMutation(API.saveFDLienEntryDtl, {
      onError: async (error: any) => {
        let errorMsg = "Unknownerroroccured";
        if (typeof error === "object") {
          errorMsg = error?.error_msg ?? errorMsg;
        }
        await MessageBox({
          messageTitle: "Error",
          message: errorMsg ?? "",
          icon: "ERROR",
        });
        CloseMessageBox();
      },
      onSuccess: () => {
        isDataChangedRef.current = true;
        enqueueSnackbar(t("DataUpdatedSuccessfully"), {
          variant: "success",
        });
        CloseMessageBox();
        handleDialogClose();
      },
    });

    const onSubmitHandler: SubmitFnType = async (
      data: any,
      displayData,
      endSubmit,
      setFieldError,
      actionFlag
    ) => {
      endSubmit(true);
      let newData = {
        CR_BRANCH_CD: data?.FDDTL?.[0]?.CR_BRANCH_CD ?? "",
        CR_ACCT_TYPE: data?.FDDTL?.[0]?.CR_ACCT_TYPE ?? "",
        CR_ACCT_CD:
          utilFunction.getPadAccountNumber(
            data?.FDDTL?.[0]?.CR_ACCT_CD,
            data?.FDDTL?.[0]?.CR_ACCT_TYPE
          ) ?? "",
        CR_ACCT_NM: data?.FDDTL?.[0]?.CR_ACCT_NM ?? "",
        MATURE_INST: data?.FDDTL?.[0]?.MATURE_INST ?? "",
        FD_NO: data?.FDDTL?.[0]?.FD_NO ?? "",
        BRANCH_CD: data?.FDDTL?.[0]?.BRANCH_CD ?? "",
        ACCT_TYPE: data?.FDDTL?.[0]?.ACCT_TYPE ?? "",
        ACCT_CD:
          utilFunction.getPadAccountNumber(
            data?.FDDTL?.[0]?.ACCT_CD,
            data?.FDDTL?.[0]?.ACCT_TYPE
          ) ?? "",
        NOMINEE_NM: data?.FDDTL?.[0]?.NOMINEE_NM ?? "",
        FD_REMARK: data?.FDDTL?.[0]?.FD_REMARK ?? "",
      };

      let oldData = {
        ...rows?.[0]?.data,
      };
      let upd = utilFunction.transformDetailsData(newData, oldData);

      if (defaultView === "view" && screenFlag !== "openLienForm") {
        finalSubmitDataRef.current = {
          data: {
            ...newData,
            ...upd,
            IsNewRow: defaultView === "new" ? true : false,
            SCREEN_REF: "RPT/401",
            COMP_CD: authState?.companyID ?? "",
            PAYMENT_TYPE: rows?.[0]?.data?.INT_PAYMENT_MODE ?? "",
            ...(Number(FDState.acctNoData.DEP_FAC) > 0
              ? { UNIT_AMOUNT: rows?.[0]?.data?.UNIT_AMOUNT ?? "" }
              : {}),
          },
        };

        if (finalSubmitDataRef.current?.data?._UPDATEDCOLUMNS.length === 0) {
          return {};
        } else {
          const btnName = await MessageBox({
            messageTitle: "Confirmation",
            message: "Proceed?",
            buttonNames: ["Yes", "No"],
            loadingBtnName: ["Yes"],
            icon: "CONFIRM",
          });
          if (btnName === "Yes") {
            validAndUpdateFDDtlMutation.mutate({
              ...finalSubmitDataRef.current?.data,
            });
          }
        }
      } else {
        saveFDLienEntryDtlMutation?.mutate({
          ...data?.FDDTL?.[0],
          LIEN_FLAG: rows?.[0]?.data?.LEAN_FLAG === "N" ? "Y" : "N",
          LIEN_PARA: FDState?.checkAllowFDPayApiData?.LIEN_PARA ?? "",
          SCREEN_REF: "RPT/401",
          COMP_CD: authState?.companyID ?? "",
        });
      }
    };

    //Mutation for Validate new FD details
    const validateFDDetailsMutationForRenew = useMutation(
      API.validateFDDetails,
      {
        onError: async (error: any) => {
          let errorMsg = "Unknownerroroccured";
          if (typeof error === "object") {
            errorMsg = error?.error_msg ?? errorMsg;
          }
          await MessageBox({
            messageTitle: "Error",
            message: errorMsg ?? "",
            icon: "ERROR",
          });
          CloseMessageBox();
        },
        onSuccess: () => {},
      }
    );

    //Mutation for Save FD renew and deposit details
    const saveFDRenewDepositDtlMutation = useMutation(
      API.saveFDRenewDepositDtl,
      {
        onError: async (error: any) => {
          let errorMsg = "Unknownerroroccured";
          if (typeof error === "object") {
            errorMsg = error?.error_msg ?? errorMsg;
          }
          await MessageBox({
            messageTitle: "Error",
            message: errorMsg ?? "",
            icon: "ERROR",
          });
          CloseMessageBox();
        },
        onSuccess: async (data) => {
          for (const response of data ?? []) {
            if (response?.O_STATUS === "999") {
              await MessageBox({
                messageTitle: response?.O_MSG_TITLE?.length
                  ? response?.O_MSG_TITLE
                  : "ValidationFailed",
                message: response?.O_MESSAGE ?? "",
                icon: "ERROR",
              });
            } else if (response?.O_STATUS === "9") {
              await MessageBox({
                messageTitle: response?.O_MSG_TITLE?.length
                  ? response?.O_MSG_TITLE
                  : "Alert",
                message: response?.O_MESSAGE ?? "",
                icon: "WARNING",
              });
            } else if (response?.O_STATUS === "99") {
              const buttonName = await MessageBox({
                messageTitle: response?.O_MSG_TITLE?.length
                  ? response?.O_MSG_TITLE
                  : "Confirmation",
                message: response?.O_MESSAGE ?? "",
                buttonNames: ["Yes", "No"],
                defFocusBtnName: "Yes",
                icon: "CONFIRM",
              });
            } else if (response?.O_STATUS === "0") {
              const buttonName = await MessageBox({
                messageTitle: response?.O_MSG_TITLE?.length
                  ? response?.O_MSG_TITLE
                  : "Voucher(s) Confirmation",
                message: response?.VOUCHER_MSG ?? "",
                buttonNames: ["Ok"],
              });
              if (buttonName === "Ok") {
                isDataChangedRef.current = true;
                CloseMessageBox();
                handleDialogClose();
                updateSourceAcctFormData([
                  {
                    ACCT_NAME: "",
                  },
                ]);
              }
            }
          }
          CloseMessageBox();
          isDataChangedRef.current = true;
          CloseMessageBox();
          handleDialogClose();
          updateSourceAcctFormData([
            {
              ACCT_NAME: "",
            },
          ]);
        },
      }
    );

    // Detail form submit handler for renew
    const renewDetailsSubmitHandler: SubmitFnType = async (
      data: any,
      displayData,
      endSubmit,
      setFieldError,
      actionFlag
    ) => {
      endSubmit(true);

      const newData = data?.FDDTL?.map((obj) => ({
        ...obj,
        TRAN_DT: obj.TRAN_DT
          ? format(new Date(obj.TRAN_DT), "dd/MMM/yyyy")
          : "",
        MATURITY_DT: obj.MATURITY_DT
          ? format(new Date(obj.MATURITY_DT), "dd/MMM/yyyy")
          : "",
      }));

      if (Boolean(data?.FDDTL?.length)) {
        updateFDDetailsFormData([...newData]);
        updateSourceAcctFormData([
          {
            ACCT_NAME: "",
          },
        ]);
        const dataArray = Array.isArray(data?.FDDTL) ? data?.FDDTL : [];
        if (dataArray?.length > 0) {
          if (
            !Boolean(data?.TOTAL_FD_AMOUNT) ||
            parseFloat(data?.TOTAL_FD_AMOUNT ?? 0) <= 0
          ) {
            MessageBox({
              messageTitle: t("ValidationFailed"),
              message: "Total amount can't be Zero/Negative.",
              icon: "ERROR",
            });
          } else {
            await validateFDDetailsMutationForRenew.mutate(
              {
                FD_DETAIL_DATA: [...newData],
                SCREEN_REF: "RPT/401",
              },
              {
                onSuccess: async (data) => {
                  for (const response of data ?? []) {
                    if (response?.O_STATUS === "999") {
                      await MessageBox({
                        messageTitle: response?.O_MSG_TITLE?.length
                          ? response?.O_MSG_TITLE
                          : "ValidationFailed",
                        message: response?.O_MESSAGE ?? "",
                        icon: "ERROR",
                      });
                    } else if (response?.O_STATUS === "9") {
                      await MessageBox({
                        messageTitle: response?.O_MSG_TITLE?.length
                          ? response?.O_MSG_TITLE
                          : "Alert",
                        message: response?.O_MESSAGE ?? "",
                        icon: "WARNING",
                      });
                    } else if (response?.O_STATUS === "99") {
                      const buttonName = await MessageBox({
                        messageTitle: response?.O_MSG_TITLE?.length
                          ? response?.O_MSG_TITLE
                          : "Confirmation",
                        message: response?.O_MESSAGE ?? "",
                        buttonNames: ["Yes", "No"],
                        defFocusBtnName: "Yes",
                        icon: "CONFIRM",
                      });
                      if (buttonName === "No") {
                        break;
                      }
                    } else if (response?.O_STATUS === "0") {
                      saveFDRenewDepositDtlMutation.mutate({
                        FD_DETAIL_DATA: [...newData],
                        ...FDState?.renewDataForDeposit,
                        TRANSACTION_DTL: [],
                      });
                    }
                  }
                },
              }
            );
          }
        }
      } else {
        MessageBox({
          messageTitle: t("ValidationFailed"),
          message: "At least one row is required.",
          icon: "ERROR",
        });
      }
    };

    useEffect(() => {
      let label = utilFunction.getDynamicLabel(
        currentPath,
        authState?.menulistdata,
        true
      );
      const label2 = `${label} of A/c No.: ${
        FDState?.retrieveFormData?.BRANCH_CD?.trim() ?? ""
      }-${FDState?.retrieveFormData?.ACCT_TYPE?.trim() ?? ""}-${
        FDState?.retrieveFormData?.ACCT_CD?.trim() ?? ""
      } ${FDState?.retrieveFormData?.ACCT_NM?.trim() ?? ""}`;
      FixDepositDetailFormMetadata.form.label = Boolean(openDepositForRenew)
        ? "Renew Deposit Details"
        : label2;
    }, []);

    useEffect(() => {
      if (defaultView === "view" || Boolean(openDepositForRenew)) {
        FixDepositDetailFormMetadata.fields[6].isDisplayCount = false;
        FixDepositDetailFormMetadata.fields[6].isRemoveButton = false;
        FixDepositDetailFormMetadata.fields[6].isScreenStyle = false;
        FixDepositDetailFormMetadata.fields[3].GridProps = {
          xs: 0,
          sm: 0,
          md: 0,
          lg: 0,
          xl: 0,
        };
        FixDepositDetailFormMetadata.fields[3].shouldExclude = () => true;
      } else {
        FixDepositDetailFormMetadata.fields[6].isDisplayCount = true;
        FixDepositDetailFormMetadata.fields[6].isRemoveButton = true;
        FixDepositDetailFormMetadata.fields[6].isScreenStyle = true;
        FixDepositDetailFormMetadata.fields[3].GridProps = {
          xs: 2.2,
          sm: 2,
          md: 1.8,
          lg: 1,
          xl: 1,
        };
        FixDepositDetailFormMetadata.fields[3].shouldExclude = () => false;
      }
    }, []);

    useEffect(() => {
      return () => {
        queryClient.removeQueries([
          "getFDRenewData",
          authState?.user?.branchCode,
        ]);
        queryClient.removeQueries([
          "getMatureInstDDWData",
          authState?.user?.branchCode,
        ]);
        queryClient.removeQueries([
          "getPeriodDDWData",
          authState?.user?.branchCode,
        ]);
        queryClient.removeQueries([
          "getFDParaDetail",
          authState?.user?.branchCode,
        ]);
        queryClient.removeQueries([
          "getFDRenewMaturityAmt",
          authState?.user?.branchCode,
        ]);
      };
    }, []);

    return (
      <>
        {defaultView === "view" ? (
          <FormWrapper
            key={"FixDepositDetail" + defaultView}
            metaData={
              extractMetaData(
                FixDepositDetailFormMetadata,
                defaultView
              ) as MetaDataType
            }
            initialValues={
              {
                FDDTL: [
                  {
                    ...rows?.[0]?.data,
                    LEAN_COMP_CD: authState?.companyID ?? "",
                  },
                ],
              } as InitialValuesType
            }
            onSubmitHandler={onSubmitHandler}
            formStyle={{
              background: "white",
              paddingTop: "0px",
              border: "1px solid var(--theme-color4)",
              borderRadius: "10px",
            }}
            ref={ref}
            formState={{
              MessageBox: MessageBox,
              docCD: "RPT/401",
              defaultView: defaultView,
              screenFlag: screenFlag,
              workingDate: authState?.workingDate ?? "",
            }}
          >
            {({ isSubmitting, handleSubmit }) => (
              <>
                <GradientButton
                  onClick={(event) => {
                    handleSubmit(event, "Save");
                  }}
                  disabled={isSubmitting}
                  endIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                  color={"primary"}
                >
                  {t("Save")}
                </GradientButton>
                <GradientButton onClick={handleDialogClose} color={"primary"}>
                  {t("Close")}
                </GradientButton>
              </>
            )}
          </FormWrapper>
        ) : Boolean(openDepositForRenew) ? (
          !Boolean(renewData) && !Boolean(maturityAmtData) ? (
            <LoaderPaperComponent />
          ) : (
            <FormWrapper
              key={"FixDepositDetail" + defaultView}
              metaData={
                extractMetaData(
                  FixDepositDetailFormMetadata,
                  defaultView
                ) as MetaDataType
              }
              initialValues={
                {
                  FDDTL: [
                    {
                      ...rows?.[0]?.data,
                      ...paraDtlData?.[0],
                      ACCT_TYPE: rows?.[0]?.data?.ACCT_TYPE ?? "",
                      BRANCH_CD: rows?.[0]?.data?.BRANCH_CD ?? "",
                      ACCT_CD: rows?.[0]?.data?.ACCT_CD ?? "",
                      TRAN_DT: renewData?.[0]?.TRAN_DT ?? "",
                      MATURITY_DT: renewData?.[0]?.MATURITY_DT ?? "",
                      INT_RATE: renewData?.[0]?.INT_RATE ?? "",
                      MATURITY_AMT: maturityAmtData?.MATURITY_AMT ?? "",
                      TRSF_AMT: FDState?.renewTrnsFormData.RENEW_AMT ?? "",
                      PERIOD_CD: tenorData?.[0]?.defaultVal ?? "",
                      MATURE_INST: matureInstData?.[0]?.defaultVal ?? "",
                      CASH_AMT: "",
                    },
                  ],
                } as InitialValuesType
              }
              onSubmitHandler={renewDetailsSubmitHandler}
              formStyle={{
                background: "white",
                paddingTop: "0px",
                border: "1px solid var(--theme-color4)",
                borderRadius: "10px",
              }}
              ref={ref}
              formState={{
                MessageBox: MessageBox,
                docCD: "RPT/401",
                defaultView: defaultView,
                screenFlag: screenFlag,
                workingDate: authState?.workingDate ?? "",
                openDepositForRenew: openDepositForRenew,
                matureInstDDWData: matureInstData,
                tenorDDWData: tenorData,
              }}
            />
          )
        ) : matureInstDataIsLoading ||
          tenorDataIsLoading ||
          paraDtlDataIsLoading ? (
          <LoaderPaperComponent />
        ) : (
          <FormWrapper
            key={"FixDepositDetail" + defaultView + fdDtlRefresh}
            metaData={
              extractMetaData(
                FixDepositDetailFormMetadata,
                defaultView
              ) as MetaDataType
            }
            initialValues={
              {
                ...FDState?.fdDetailFormData,
                DOUBLE_FAC: FDState?.fdParaDetailData?.DOUBLE_FAC ?? "",
                TRAN_CD: FDState?.fdParaDetailData?.DOUBLE_TRAN ?? "",
              } as InitialValuesType
            }
            onSubmitHandler={detailsFormSubmitHandler}
            hideHeader={true}
            onFormButtonClickHandel={async (id) => {
              if (id === "ADDNEWROW") {
                const data = await ref?.current?.getFieldData();
                const dataArray = Array.isArray(data?.FDDTL) ? data?.FDDTL : [];

                if (dataArray?.length === 0) {
                  updateFDDetailsFormData([
                    {
                      ACCT_NAME: "",
                    },
                  ]);
                  setFdDtlRefresh((prevVal) => prevVal + 1);
                } else if (
                  parseFloat(data?.TOTAL_FD_AMOUNT) > 0 &&
                  dataArray?.length > 0
                ) {
                  for (let i = 0; i < dataArray?.length; i++) {
                    const item = dataArray[0];
                    if (
                      !Boolean(item.BRANCH_CD.trim()) ||
                      !Boolean(item.ACCT_TYPE.trim()) ||
                      !Boolean(item.ACCT_CD.trim()) ||
                      !Boolean(item.TRAN_DT.trim()) ||
                      !Boolean(item.PERIOD_CD.trim()) ||
                      !Boolean(item.PERIOD_NO.trim()) ||
                      !Boolean(item.INT_RATE.trim()) ||
                      !Boolean(item.TERM_CD.trim()) ||
                      !Boolean(item.MATURITY_AMT.trim()) ||
                      parseFloat(data?.TOTAL_FD_AMOUNT) <= 0
                    ) {
                      return await MessageBox({
                        messageTitle: t("ValidationFailed"),
                        message: "Required value missing.",
                        icon: "ERROR",
                      });
                    } else {
                      updateFDDetailsFormData([
                        {
                          ...data?.FDDTL?.[0],
                          FD_NO: Number(data?.FDDTL?.[0]?.FD_NO) + 1,
                        },
                        ...data?.FDDTL,
                      ]);
                      setFdDtlRefresh((prevVal) => prevVal + 1);
                    }
                  }
                }
              }
            }}
            formStyle={{
              background: "white",
              paddingTop: "0px",
              border: "1px solid var(--theme-color4)",
              borderRadius: "10px",
            }}
            ref={ref}
            formState={{
              MessageBox: MessageBox,
              docCD: "RPT/401",
              defaultView: defaultView,
              workingDate: authState?.workingDate ?? "",
              matureInstDDWData: matureInstData,
              tenorDDWData: tenorData,
            }}
          />
        )}
      </>
    );
  }
);
