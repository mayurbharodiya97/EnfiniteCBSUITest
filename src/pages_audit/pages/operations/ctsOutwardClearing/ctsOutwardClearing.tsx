import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQueries, useQuery } from "react-query";
import {
  ChequeDetailFormMetaData,
  CtsOutwardClearingMetadata,
  SlipDetailFormMetaData,
} from "./metaData";
import { Alert } from "components/common/alert";
import { ClearCacheProvider, queryClient } from "cache";
import * as API from "./api";
import { FormWrapper } from "components/dyanmicForm/formWrapper";
import { useContext } from "react";
import { InitialValuesType, SubmitFnType } from "packages/form";
import {
  Toolbar,
  Typography,
  AppBar,
  Theme,
  Grid,
  Tabs,
  Tab,
  Container,
  TextField,
} from "@mui/material";
import { AuthContext } from "pages_audit/auth";
import { makeStyles } from "@mui/styles";
import { useSnackbar } from "notistack";
import { ClearingBankMaster } from "./clearingBankMaster";
import { PopupMessageAPIWrapper } from "components/custom/popupMessage";
import { useStyles } from "pages_audit/common/tabStyles";
import { MetaDataType } from "components/dyanmicForm";
import { getAccountName } from "./api";
const useTypeStyles = makeStyles((theme: Theme) => ({
  root: {
    paddingLeft: theme.spacing(1.5),
    paddingRight: theme.spacing(1.5),
    background: "var(--theme-color5)",
  },
  title: {
    flex: "1 1 100%",
    color: "var(--theme-color2)",
    letterSpacing: "1px",
    fontSize: "1.5rem",
  },
  refreshiconhover: {},
}));
const CtsOutwardClearing = ({ zoneTranType }) => {
  const { authState } = useContext(AuthContext);
  const isErrorFuncRef = useRef<any>(null);
  const [zoneData, setZoneData] = useState<any>({});
  const formDataRef = useRef<any>({});
  const [isBankAdding, setisBankAdding] = useState<any>(false);
  const { enqueueSnackbar } = useSnackbar();
  const myRef = useRef<any>(null);
  const mySlipRef = useRef<any>(null);
  const myChequeRef = useRef<any>(null);
  const headerClasses = useTypeStyles();
  const [isOpenSave, setIsOpenSave] = useState(false);
  const [isOpenProcced, setIsOpenProcced] = useState(false);
  const [currentTab, setCurrentTab] = useState("slipdetail");
  const [totalAmountSlipCheque, setTotalAmountSlipCheque] = useState(
    Number(formDataRef.current.AMOUNT)
  );

  const tabClasses = useStyles();
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery<
    any,
    any
  >(["TemporaryData"], () => API.TemporaryData());

  const result = useQueries([
    {
      queryKey: ["getBussinessDate"],
      queryFn: () =>
        API.getBussinessDate({
          companyID: authState?.companyID ?? "",
          branchID: authState?.user?.branchCode ?? "",
        }),
    },
  ]);

  const [initValues, setInitValues] = useState<any>({
    chequeDetails: [
      {
        CHEQUE_DATE: new Date(result?.[0]?.data?.[0]?.DATE ?? "") ?? new Date(),
      },
    ],
  });

  console.log("initValues", initValues);
  // const handleKeyPress = () => {
  //   let initVal = initValues.chequeDetails ?? [];
  //   let latestRow = initVal[0];
  //   let lastRow = initVal[1];
  //   latestRow = {
  //     ...latestRow,
  //     ...{
  //       DESCRIPTION: lastRow?.DESCRIPTION ?? "",
  //       AMOUNT: lastRow?.AMOUNT ?? "",
  //     },
  //   };

  //   initVal[0] = { ...latestRow };
  //   setInitValues((old) => ({
  //     ...old,
  //     chequeDetails: [...initVal],
  //   }));
  // };
  const mutation: any = useMutation("getAccountName", getAccountName, {
    onSuccess: (data) => {},
    onError: (error: any) => {},
  });
  const mutationBank = useMutation(API.clearingBankMasterConfigDML, {
    onError: (error: any) => {
      let errorMsg = "Unknown Error occured";
      if (typeof error === "object") {
        errorMsg = error?.error_msg ?? errorMsg;
      }
      if (isErrorFuncRef.current == null) {
        enqueueSnackbar(errorMsg, {
          variant: "error",
        });
      } else {
        isErrorFuncRef.current?.endSubmit(
          false,
          errorMsg,
          error?.error_detail ?? ""
        );
      }
      onActionCancel();
    },
    onSuccess: (data) => {
      enqueueSnackbar(data, {
        variant: "success",
      });

      // onClose();
    },
  });
  const mutationOutward = useMutation(API.outwardClearingConfigDML, {
    onError: (error: any) => {
      let errorMsg = "Unknown Error occured";
      if (typeof error === "object") {
        errorMsg = error?.error_msg ?? errorMsg;
      }
      if (isErrorFuncRef.current == null) {
        enqueueSnackbar(errorMsg, {
          variant: "error",
        });
      } else {
        isErrorFuncRef.current?.endSubmit(
          false,
          errorMsg,
          error?.error_detail ?? ""
        );
      }
      onActionCancel();
    },
    onSuccess: (data) => {
      enqueueSnackbar(data, {
        variant: "success",
      });

      setCurrentTab("slipdetail");
      onActionCancel();
    },
  });
  useEffect(() => {
    return () => {
      queryClient.removeQueries(["getAccountName"]);
      queryClient.removeQueries(["getBussinessDate"]);
      queryClient.removeQueries(["outwardClearingConfigDML"]);
    };
  }, []);
  useEffect(() => {
    setTotalAmountSlipCheque(formDataRef.current.AMOUNT ?? "0.00");
  }, [formDataRef.current.AMOUNT]);
  useEffect(() => {
    if (
      (result && !result?.[0].isLoading) ||
      (formDataRef.current && formDataRef.current.length)
    ) {
      let init = initValues.chequeDetails;

      init[0] = {
        CHEQUE_DATE: new Date(result?.[0]?.data?.[0]?.DATE ?? ""),
        ECS_USER_NO: mutationOutward.isSuccess
          ? ""
          : formDataRef.current?.ACCT_NAME ?? "",
        ECS_SEQ_NO: mutationOutward.isSuccess
          ? ""
          : formDataRef.current?.ACCT_CD ?? "",
      };
      setInitValues((old) => ({
        chequeDetails: [...init],
      }));
    }
  }, [formDataRef.current, mutationOutward.isSuccess, setInitValues]);

  const onChangeProductType = (
    fieldKey,
    field,
    dependentFieldsState,
    formState
  ) => {
    console.log(
      "wkeukuhfiduwehgw",
      fieldKey,
      field,
      dependentFieldsState,
      formState
    );
    if (
      fieldKey === "chequeDetails[0].BANK_CD" &&
      field?.error === "Bank code Not Found."
    ) {
      setIsOpenSave(true);
    } else {
      setIsOpenSave(false);
    }
    return "";
  };

  const handleChangeTab = (_, currentTab) => {
    setCurrentTab(currentTab);
  };
  const onPopupYes = (rows) => {
    mutationOutward.mutate(rows);
  };
  const onActionCancel = () => {
    setIsOpenProcced(false);
  };
  const ClickEventManage = () => {
    let event: any = { preventDefault: () => {} };
    mySlipRef?.current?.handleSubmit(event, "BUTTON_CLICK");
    myRef?.current?.handleSubmit(event, "BUTTON_CLICK");
    mySlipRef?.current?.handleSubmit(event, "AC_NAME");
    myChequeRef?.current?.handleSubmit(event, "AMOUNT");
  };

  const onSubmitHandler: SubmitFnType = async (
    data: any,
    displayData,
    endSubmit,
    setFieldError,
    value,
    event
  ) => {
    //@ts-ignore
    endSubmit(true);
    data = {
      ...data,
      COMP_CD: authState?.companyID ?? "",
      BRANCH_CD: authState?.user?.branchCode ?? "",
      ENTERED_COMP_CD: authState?.companyID ?? "",
      ENTERED_BRANCH_CD: authState?.user?.branchCode ?? "",
      _isNewRow: true,
      REQUEST_CD: "",
      TRAN_TYPE: zoneTranType ?? "",
      endSubmit,
      setFieldError,
    };
    if (value === "BUTTON_CLICK") {
      setZoneData(data);
    }
  };

  const onSubmitHandlerSlip: SubmitFnType = async (
    data: any,
    displayData,
    endSubmit,
    setFieldError,
    value,
    event
  ) => {
    //@ts-ignore

    endSubmit(true);
    data = {
      ...data,
      PROCESSED: "N",
      SKIP_ENTRY: "N",
      COMP_CD: authState?.companyID ?? "",
      _isNewRow: true,
    };
    let Apireq = {
      COMP_CD: authState?.companyID,
      ACCT_CD: data?.ACCT_CD.padStart(6, "0").padEnd(20, " "),
      ACCT_TYPE: data?.ACCT_TYPE,
      BRANCH_CD: data?.BRANCH_CD,
    };

    if (value === "AC_NAME") {
      mutation.mutate({ Apireq });
    }
    if (value === "BUTTON_CLICK") {
      formDataRef.current = data;
    }
  };

  const onSubmitHandlerCheuq: SubmitFnType = async (
    data: any,
    displayData,
    endSubmit,
    setFieldError,
    value
  ) => {
    //@ts-ignore
    endSubmit(true, "Please enter any value");
    let totalAmount = 0;
    data.chequeDetails.forEach((element) => {
      if (
        element.AMOUNT !== undefined &&
        element.AMOUNT !== "" &&
        element.AMOUNT
      ) {
        totalAmount += Number(element.AMOUNT);
      }
    });
    // slip and cheque total minus
    setTotalAmountSlipCheque(totalAmount - formDataRef.current.AMOUNT);
    if (value === "AMOUNT") {
      // Compare the totals
      let initVal = data.chequeDetails;
      if (
        !formDataRef.current.AMOUNT ||
        formDataRef.current.AMOUNT.length === 0
      ) {
        // Do not add a new row if AMOUNT is not present or has a length of 0
        return;
      }
      if (totalAmount === 0) {
        return;
      }
      if (
        Number(totalAmount) === Number(formDataRef.current.AMOUNT) ||
        Number(totalAmount) > Number(formDataRef.current.AMOUNT)
      ) {
        // Totals don't match, add a new rows
        setIsOpenProcced(true);
        isErrorFuncRef.current = {
          DAILY_CLEARING: {
            ...zoneData,
          },
          DETAILS_DATA: {
            isNewRow: [
              {
                ...data.chequeDetails[0],
                PROCESSED: "N",
                REASON: "N",
                COMP_CD: authState?.companyID ?? "",
                BRANCH_CD: authState?.user?.branchCode ?? "",
                _isNewRow: true,
              },
            ],
            isUpdatedRow: [],
            isDeleteRow: [],
          },
          ...formDataRef.current,
          endSubmit,
          setFieldError,
        };
        console.log("isErrorFuncRef.current", isErrorFuncRef.current);
        // return;
      } else {
        initVal.unshift({
          CHEQUE_DATE: new Date(result?.[0]?.data?.[0]?.DATE ?? ""),
        });
        setInitValues((old) => ({
          ...old,
          chequeDetails: [...initVal],
        }));
      }
    }
  };

  if (CtsOutwardClearingMetadata?.fields?.[1]) {
    CtsOutwardClearingMetadata.fields[1].requestProps = zoneTranType ?? "";
  }

  if (ChequeDetailFormMetaData.fields[0]._fields[3]) {
    ChequeDetailFormMetaData.fields[0]._fields[3].maxDate = new Date(
      result?.[0]?.data?.[0]?.DATE ?? ""
    );
  }

  const updatedMetaData = {
    ...SlipDetailFormMetaData,
    fields: SlipDetailFormMetaData.fields[0]._fields.map((field) => {
      if (field.name === "BRANCH_CD") {
        return {
          ...field,
          defaultValue: authState?.user?.branchCode ?? "",
        };
      } else if (field.name === "COMP_CD") {
        return {
          ...field,
          defaultValue: authState?.companyID ?? "",
        };
      }

      return field;
    }),
  };

  return (
    <>
      <AppBar position="relative" color="secondary">
        <Toolbar variant="dense">
          <Typography
            className={headerClasses.title}
            color="inherit"
            variant={"h6"}
            component="div"
          >
            CTS O/W Clearing
          </Typography>
        </Toolbar>
      </AppBar>
      <FormWrapper
        key={"CtsoutwardForm" + result?.[0]?.data?.[0]?.DATE}
        metaData={CtsOutwardClearingMetadata}
        // loading={getData.isLoading}
        // hideHeader={true}
        initialValues={{
          ...zoneData,
          TRAN_DT: new Date(result?.[0]?.data?.[0]?.DATE ?? new Date()),
          ENTERED_BY: authState?.user?.name ?? "",
        }}
        ref={myRef}
        onSubmitHandler={onSubmitHandler}
        hideHeader={true}
        //@ts-ignore
        displayMode={"new"}
        formStyle={{
          background: "white",
          width: "100%",
          padding: "10px",
        }}
      ></FormWrapper>

      <div style={{ padding: "08px" }}>
        <Tabs
          textColor="secondary"
          indicatorColor="secondary"
          aria-label="secondary tabs example"
          value={currentTab}
          onChange={handleChangeTab}
        >
          <Tab label="Slip Detail" value="slipdetail" id="0" />
          <Tab label="Cheque Detail" value="chequedetail" id="1" />
        </Tabs>

        {currentTab === "slipdetail" ? (
          <>
            <div
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  let target: any = e?.target;
                  if (
                    (target?.name ?? "") ===
                    updatedMetaData.form.name + "/AMOUNT"
                    // +
                    //   updatedMetaData.fields[0].name +
                    //   "[0].AMOUNT"
                  ) {
                    ClickEventManage();

                    setCurrentTab("chequedetail");
                  }
                }
                if (e.key === "Enter") {
                  let target: any = e?.target;
                  if (
                    (target?.name ?? "") ===
                    updatedMetaData.form.name + "/ACCT_CD"
                    // +
                    //   updatedMetaData.fields[0].name +
                    //   "[0].AMOUNT"
                  ) {
                    ClickEventManage();
                  }
                }
              }}
            >
              <FormWrapper
                key={
                  "SlipDetailFormMetaData" + Boolean(mutation?.isSuccess)
                    ? mutation?.data
                    : ""
                }
                metaData={updatedMetaData as MetaDataType}
                // displayMode={formMode}
                onSubmitHandler={onSubmitHandlerSlip}
                initialValues={
                  mutationOutward.isSuccess
                    ? {}
                    : {
                        ...formDataRef.current,
                        ACCT_NAME: mutation?.data?.[0].ACCT_NAME,
                        TRAN_BAL: mutation?.data?.[0].TRAN_BAL,
                      }
                }
                hideHeader={true}
                formStyle={{
                  background: "white",
                }}
                ref={mySlipRef}
              />
              <Container>
                <Toolbar
                  sx={{
                    background: "var(--theme-color5)",
                    minHeight: "40px !important",
                    fontSize: "15px",
                    color: "white",
                    display: "flex",
                    height: "40px",
                    justifyContent: "space-between",
                  }}
                >
                  <div
                    style={{
                      border: "1px solid #BABABA",
                      borderRadius: "5px",
                      padding: "5px",
                      width: "18%",
                    }}
                  >{`user: ${authState?.user?.name ?? ""} `}</div>
                  <div
                    style={{
                      border: "1px solid #BABABA",
                      borderRadius: "5px",
                      margin: "10px",
                      padding: "5px",
                      width: "30%",
                    }}
                  >{`Total : ${formDataRef.current?.AMOUNT ?? "0.00"} `}</div>
                </Toolbar>
              </Container>
            </div>
          </>
        ) : currentTab === "chequedetail" ? (
          <>
            <div
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  // myRef?.current?.click?.();
                  let target: any = e?.target;

                  if (
                    (target?.name ?? "") ===
                    ChequeDetailFormMetaData.form.name +
                      "/" +
                      ChequeDetailFormMetaData.fields[0].name +
                      "[0].AMOUNT"
                  ) {
                    ClickEventManage();
                    ChequeDetailFormMetaData.fields[0].isRemoveButton = false;
                  }
                }

                // else if (e.key === "F11") {
                //   e.preventDefault();
                //   handleKeyPress();
                // }
              }}
            >
              <>
                {mutationOutward?.isError || mutationOutward?.isError ? (
                  <div style={{ paddingRight: "10px", paddingLeft: "10px" }}>
                    <AppBar position="relative" color="primary">
                      <Alert
                        severity="error"
                        errorMsg={
                          mutationOutward?.error?.error_msg ??
                          mutationOutward?.error?.error_msg ??
                          "Unknow Error"
                        }
                        errorDetail={
                          mutationOutward?.error?.error_detail ??
                          mutationOutward?.error?.error_detail ??
                          ""
                        }
                        color="error"
                      />
                    </AppBar>
                  </div>
                ) : mutationOutward?.data?.length < 1 &&
                  Boolean(mutationOutward?.isSuccess) ? (
                  <div style={{ paddingRight: "10px", paddingLeft: "10px" }}>
                    <AppBar position="relative" color="primary">
                      <Alert
                        errorMsg="No data found"
                        errorDetail="No any data found"
                        severity="error"
                      />
                    </AppBar>
                  </div>
                ) : null}
              </>{" "}
              <div
                style={{
                  display: "flex",
                  justifyContent: "end",
                }}
              >
                <Toolbar
                  sx={{
                    background: "var(--theme-color5)",
                    fontSize: "20px",
                    color: "white",
                    border: "1px solid #BABABA",
                    borderRadius: "5px",
                    width: "25%",
                    minHeight: "30px !important ",
                  }}
                >
                  {`Total Amount: ${totalAmountSlipCheque ?? ""} `}
                </Toolbar>
              </div>
              <FormWrapper
                key={`ChequeDetailFormMetaData11${formDataRef.current}${initValues}${initValues.chequeDetails.length}${setInitValues}`}
                metaData={ChequeDetailFormMetaData as MetaDataType}
                // displayMode={formMode}
                onSubmitHandler={onSubmitHandlerCheuq}
                initialValues={initValues ?? ({} as InitialValuesType)}
                hideHeader={true}
                formStyle={{
                  background: "white",
                  height: "60%",
                }}
                ref={myChequeRef}
                onFormDataChange={onChangeProductType}

                // onFormButtonClickHandel={(fieldID, dependentFields) => {
                //   console.log("fieldID", fieldID, dependentFields);
                //   setIsOpenSave(true);
                // }}
              />
              <Container>
                <Toolbar
                  sx={{
                    background: "var(--theme-color5)",
                    minHeight: "40px !important",
                    fontSize: "15px",
                    color: "white",
                    display: "flex",
                    height: "40px",
                    justifyContent: "space-between",
                  }}
                >
                  <div
                    style={{
                      border: "1px solid #BABABA",
                      borderRadius: "5px",
                      padding: "5px",
                      width: "40%",
                    }}
                  >{`Press F11 to carry forward values. :  `}</div>
                  <div
                    style={{
                      border: "1px solid #BABABA",
                      borderRadius: "5px",
                      margin: "10px",
                      padding: "5px",
                      width: "30%",
                    }}
                  >{`Total :  "0.00"} `}</div>
                </Toolbar>
              </Container>
            </div>
          </>
        ) : null}
        {isOpenSave ? (
          <PopupMessageAPIWrapper
            MessageTitle="Confirmation"
            Message="Are You sure To Add Bank?"
            onActionYes={() => setisBankAdding(true)}
            onActionNo={() => setIsOpenSave(false)}
            rows={{}}
            open={isOpenSave}
            // loading={mutation.isLoading}
          />
        ) : null}
        {isBankAdding ? (
          <ClearingBankMaster
            isOpen={isBankAdding}
            onClose={() => {
              setisBankAdding(false);
              setIsOpenSave(false);
            }}
          />
        ) : null}
        {isOpenProcced ? (
          <PopupMessageAPIWrapper
            MessageTitle="Confirmation"
            Message=" Procced ?"
            onActionYes={(rowVal) => onPopupYes(rowVal)}
            onActionNo={() => onActionCancel()}
            rows={isErrorFuncRef.current}
            open={isOpenProcced}
            loading={mutationOutward.isLoading}
          />
        ) : null}
      </div>
    </>
  );
};
export const CtsOutwardClearingForm = ({ zoneTranType }) => {
  return (
    <ClearCacheProvider>
      <CtsOutwardClearing zoneTranType={zoneTranType} />
    </ClearCacheProvider>
  );
};
