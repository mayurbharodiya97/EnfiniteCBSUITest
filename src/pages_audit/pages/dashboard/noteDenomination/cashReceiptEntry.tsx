import {
  Box,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow /*TextField*/,
  Slide,
  CircularProgress,
  Tooltip,
  Dialog,
  LinearProgress,
  // TextField,
} from "@mui/material";
import { Typography } from "@mui/material";
import * as API from "./api";
import { useMutation } from "react-query";
import { GradientButton } from "components/styledComponent/button";
import {
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  PopupMessageAPIWrapper,
  PopupRequestWrapper,
} from "components/custom/popupMessage";
import { AuthContext } from "pages_audit/auth";
import { AccDetailContext } from "pages_audit/auth";
import { useStyles, StyledTableCell } from "./style";
import { TextField } from "components/styledComponent";
import { CustomPropertiesConfigurationContext } from "components/propertiesconfiguration/customPropertiesConfig";
import getCurrencySymbol from "components/custom/getCurrencySymbol";
import {
  FilterFormMetaType,
  FormComponentView,
} from "components/formcomponent";
import {
  DenominationScreenMetaData,
  denoViewTrnGridMetaData,
} from "./metadata";
import { UpdateRequestDataVisibleColumn } from "components/utils";
import { formatCurrency } from "components/tableCellComponents/currencyRowCellRenderer";
import { Button } from "reactstrap";
import { getAcctInqStatement } from "pages_audit/acct_Inquiry/api";
import AccDetails from "pages_audit/pages/operations/DailyTransaction/TRNHeaderTabs/AccountDetails";
import { Alert } from "components/common/alert";
import GridWrapper from "components/dataTableStatic";
import { ActionTypes, GridMetaDataType } from "components/dataTable/types";
import DenoTable from "./denoTable";
import DualPartTable from "./dualPartTable";
import { isValidDate } from "components/utils/utilFunctions/function";
import { format } from "date-fns";
import SingleDeno from "./singleDeno";

const CashReceiptEntry = () => {
  const [inputVal, setInputVal] = useState<any>({});
  const [displayError, setDisplayError] = useState<string[]>([]);
  const [multiplicationResult, setMultiplicationResult] = useState<any>([]);
  const [totalAmount, setTotalAmount] = useState<any>(0);
  const [confirmation, setConfirmation] = useState(false);
  const [displayTotal, setDisplayTotal] = useState<any>([]);
  const [totalInputAmount, setTotalInputAmount] = useState<any>(0);
  const [availNote, setAvailNote] = useState<any>([]);
  const customParameter = useContext(CustomPropertiesConfigurationContext);
  const [retData, setRetData] = useState<any>({});
  const [displayTable, setDisplayTable] = useState(false);
  const [balance, setBalance] = useState<any>([]);
  const [openDeno, setOpenDeno] = useState<boolean>(false);
  const [isDisableField, setIsDisableField] = useState<boolean>(false);
  const [openAccountDTL, setOpenAccountDTL] = useState<boolean>(false);
  const { dynamicAmountSymbol, currencyFormat, decimalCount } = customParameter;
  const authState: any = useContext(AuthContext);
  const formComponentViewRef = useRef<any>(null);
  const [referData, setReferData] = useState<any>();
  const [secondReferData, setSecondReferData] = useState<any>();
  const [thirdReferData, setthirdReferData] = useState<any>();
  const [formData, setFormData] = useState<any>({});
  const [viewTRN, setViewTRN] = useState<any>(false);
  const [manageOperator, setManageOperator] = useState<any>(false);
  const { tempStore, setTempStore } = useContext(AccDetailContext);
  // useEffect(() => {
  //   props?.map((item) => {
  //     if (item?.textField === "Y") {
  //       setForRemark(item?.value);
  //     }
  //   });
  // }, [props]);
  const getDefaultBranchCode = authState?.authState?.user?.branchCode;

  const updatedMetaData = {
    ...DenominationScreenMetaData,
    fields: DenominationScreenMetaData.fields.map((field) => {
      if (field.accessor === "BRANCH") {
        return {
          ...field,
          defaultValue: getDefaultBranchCode,
        };
      }
      // if (field?.accessor === "REMARK") {
      //   console.log(field, "field");
      //   console.log(DenominationScreenMetaData, "DenominationScreenMetaData");
      //   return {
      //     ...field,
      //     defaultValue: retData?.SDC,
      //   };
      // }
      return field;
    }),
  };

  useEffect(() => {
    //@ts-ignore
    window._CHANGE_OPERATOR_TYPE = (value, flag) => {
      if (flag === "TRN") {
        if (value === "S") {
          setManageOperator(true);
        } else {
          return setManageOperator(false);
        }
      }
    };
  }, []);

  // useEffect(() => {
  //   console.log("asdasdas", secondReferData, formComponentViewRef.current);
  // }, [secondReferData]);

  const getData: any = useMutation(API.CashReceiptEntrysData, {
    onSuccess: (response: any) => {
      setOpenDeno(false);
      setDisplayTable(true);
    },
    onError: (error: any) => {
      setDisplayTable(false);
    },
  });

  const manageOpenDenoYes = () => {
    setIsDisableField(true);
    getData.mutate({ a: "a", b: "b" });
  };

  const manageOpenDenoNo = () => {
    setOpenDeno(false);
  };

  const ClickEventManage = useCallback(
    (data, columnvisible) => {
      setOpenDeno(true);
      let retdata = UpdateRequestDataVisibleColumn(data, columnvisible);
      setRetData(retdata);
    },
    [getData]
  );

  const data: any = useMemo(() => {
    if (Array.isArray(getData.data)) {
      return [...getData.data];
    }
  }, [getData.data, retData]);

  const classes = useStyles();
  // const { data } = useQuery<any, any>(["CashReceiptEntrysData"], () =>
  //   API.CashReceiptEntrysData()
  // );
  const withdrawAmount: any = retData?.RECEIPT_PAYMENT;
  const upadatedFinalAmount: any = withdrawAmount - totalAmount;

  useEffect(() => {
    setAvailNote(
      data?.map((el) => {
        return el?.AVAIL_NOTE;
      })
    );
    setBalance(
      data?.map((el) => {
        return el?.TOTAL_AMNT;
      })
    );
  }, [data]);

  const handleChange = (value, index) => {
    //apply acceptable value validation in this
    if (value.startsWith("-")) {
      value = "-" + value.replace(/[^0-9]/g, "");
    } else {
      value = value.replace(/[^0-9]/g, "");
    }

    let updatedValue = { ...inputVal };
    updatedValue[index] = value;
    setInputVal(updatedValue);

    //setted multiplied values According to  index

    const multipliedValue: any =
      parseFloat(value) * parseFloat(data?.[index]?.NOTE);
    const updatedMultipliedValue = [...multiplicationResult];
    updatedMultipliedValue[index] = multipliedValue;
    setMultiplicationResult(updatedMultipliedValue);

    //***************************/

    //*********************//
  };

  const updateTotalAmount = (event, index) => {
    let value = event.target.value;
    let sum = 0;
    //get total of all multiplied values

    multiplicationResult?.forEach((item) => {
      if (!isNaN(item)) {
        sum += parseFloat(item);
      }
    });

    //for set error according to index
    const newDisplayErrors = [...displayError];

    newDisplayErrors[
      index
    ] = `Denomination ${data?.[index]?.NOTE} should be less than or equal to Total Amount`;

    //condition for if TRN is Receipt and values is -(negative) and greater then of TotalAmount(absolute(if have - or have + not affect))

    if (
      retData.TRN === "R" &&
      multiplicationResult[index] < 0 &&
      Math.abs(multiplicationResult[index]) > data[index]?.TOTAL_AMNT
    ) {
      setDisplayError(newDisplayErrors);

      //set multiplication is `0` when err0 is occurs according to index
      setMultiplicationResult((preVal) => {
        const updatedRslt = [...preVal];
        updatedRslt[index] = 0;
        return updatedRslt;
      });

      //for clear input whe error occur according to index
      const updatedInputVal = { ...inputVal };
      updatedInputVal[index] = "";
      setInputVal(updatedInputVal);
    }

    //condition for if TRN is Payment and values is +(positive) and greater then of TotalAmount
    else if (
      retData.TRN === "P" &&
      multiplicationResult[index] > 0 &&
      multiplicationResult[index] > data[index]?.TOTAL_AMNT
    ) {
      setDisplayError(newDisplayErrors);

      //set multiplication is `0` when err0 is occurs according to index
      setMultiplicationResult((preVal) => {
        const updatedRslt = [...preVal];
        updatedRslt[index] = 0;
        return updatedRslt;
      });

      //for clear input whe error occur according to index
      const updatedInputVal = { ...inputVal };
      updatedInputVal[index] = "";
      setInputVal(updatedInputVal);
    } else {
      newDisplayErrors[index] = "";
      setTotalAmount(sum);
      setDisplayError([]);
    }

    let calcAvailNotValue;
    let calcBalance;

    if (retData.TRN === "P") {
      if (value && data?.length > 0 && !isNaN(value) && value !== undefined) {
        calcAvailNotValue =
          parseFloat(data?.[index]?.AVAIL_NOTE) - parseFloat(value);
        calcBalance =
          parseFloat(data?.[index]?.TOTAL_AMNT) -
          parseFloat(multiplicationResult[index]);
      } else {
        calcAvailNotValue = parseFloat(data?.[index]?.AVAIL_NOTE);
        calcBalance = parseFloat(data?.[index]?.TOTAL_AMNT);
      }
    } else if (retData.TRN === "R") {
      if (value && data?.length > 0 && !isNaN(value) && value !== undefined) {
        calcAvailNotValue =
          parseFloat(data?.[index]?.AVAIL_NOTE) + parseFloat(value);
        calcBalance =
          parseFloat(data?.[index]?.TOTAL_AMNT) +
          parseFloat(multiplicationResult[index]);
      } else {
        calcAvailNotValue = parseFloat(data?.[index]?.AVAIL_NOTE);
        calcBalance = parseFloat(data?.[index]?.TOTAL_AMNT);
      }
    }

    const updatedCalcAvailNotes = [...(availNote || [])];
    updatedCalcAvailNotes[index] = calcAvailNotValue;
    setAvailNote(updatedCalcAvailNotes);

    const updatedBalance = [...(balance || [])];
    updatedBalance[index] = calcBalance;
    setBalance(updatedBalance);

    //if inputvalueTotal not working correctly so please move this part(between //**// ---- //**//) on handle change function and change inputVal ---->>updatedInputVal

    //for display total ammount of all inputs
    const newTotalInputAmount: any = Object.values(inputVal).reduce(
      (acc: any, val: any) => acc + (parseFloat(val) || 0),
      0
    );
    setTotalInputAmount(newTotalInputAmount);
  };

  useEffect(() => {
    if (upadatedFinalAmount === 0) {
      setConfirmation(true);
    } else {
      setConfirmation(false);
    }
  }, [upadatedFinalAmount]);

  const controlAction = (row, buttonName) => {
    if (buttonName === "Yes") {
      console.log("submitted");
    } else if (buttonName === "No") {
      setConfirmation(false);
    }
  };

  //for get total of column
  useEffect(() => {
    if (data && data.length > 0) {
      const initialTotal = {
        // NOTE_CNT: 0,
        AVAIL_NOTE: 0,
        TOTAL_AMNT: 0,
      };

      const newTotals = data.reduce((acc, item, index) => {
        let updatedAvailNote;
        if (availNote && availNote[index] !== undefined) {
          updatedAvailNote = availNote[index];
        } else {
          updatedAvailNote = parseFloat(data?.[index]?.AVAIL_NOTE);
        }
        let updatedBLNC;
        if (balance && balance[index] !== undefined) {
          updatedBLNC = balance[index];
        } else {
          updatedBLNC = parseFloat(data?.[index]?.TOTAL_AMNT);
        }
        return {
          // NOTE_CNT: acc.NOTE_CNT + parseFloat(item.NOTE_CNT),
          AVAIL_NOTE: acc.AVAIL_NOTE + parseFloat(updatedAvailNote),
          TOTAL_AMNT: acc.TOTAL_AMNT + parseFloat(updatedBLNC),
        };
      }, initialTotal);

      setDisplayTotal(newTotals);
    }
  }, [data, inputVal]);

  const handleKeyPress = (event, index) => {
    if (event.key === "Enter") {
      updateTotalAmount(event, index);
    }
  };

  const getRefData = () => {
    setReferData(formComponentViewRef.current);
  };

  const getMoreData: any = useMutation(API.getAcctDTL, {
    onSuccess: (response: any) => {
      setFormData({
        NAME: response?.[0]?.ACCT_NM,
        BALANCE: response?.[0]?.WIDTH_BAL,
        TRN: secondReferData?.columnVal?.TRN,
        BRANCH: secondReferData?.columnVal?.BRANCH,
        ACCOUNT_TYPE: secondReferData?.columnVal?.ACCOUNT_TYPE,
        ACCOUNT_NUMBER: secondReferData?.columnVal?.ACCOUNT_NUMBER,
        SDC: secondReferData?.columnVal?.SDC,
        REMARK: secondReferData?.columnVal?.REMARK,
        RECEIPT_PAYMENT: secondReferData?.columnVal?.RECEIPT_PAYMENT,
      });
    },
    onError: (error: any) => {
      console.log(error, "failed ---");
    },
  });

  // const ClickSecondButtonEventManage = () => {
  //   // console.log(formComponentViewRef?.current, "asasasdddad");
  //   // setSecondReferData(formComponentViewRef.current);
  //   // console.log(secondReferData, "kjdkskhdk");
  //   // getMoreData.mutate({
  //   //   // C: "C",
  //   //   // D: "D",
  //   //   ACCT_CD: secondReferData?.columnVal?.ACCOUNT_NUMBER ?? "003617",
  //   //   ACCT_TYPE: secondReferData?.columnVal?.ACCOUNT_TYPE ?? "101 ",
  //   //   BRANCH_CD: secondReferData?.columnVal?.BRANCH ?? "005 ",
  //   //   COMP_CD: "132 ",
  //   //   FULL_ACCT_NO: "",
  //   // });
  // };

  const ClickSecondButtonEventManage = () => {
    // Schedule the state update
    setSecondReferData(formComponentViewRef.current);
  };
  useEffect(() => {
    // This block will be executed after the state has been updated
    if (secondReferData) {
      // Now you can safely use secondReferData in other logic or functions
      getMoreData.mutate({
        ACCT_CD: secondReferData?.columnVal?.ACCOUNT_NUMBER ?? "",
        ACCT_TYPE: secondReferData?.columnVal?.ACCOUNT_TYPE ?? "",
        BRANCH_CD: secondReferData?.columnVal?.BRANCH ?? "",
        COMP_CD: authState?.authState?.companyID ?? "",
        FULL_ACCT_NO: "",
      });
    }
  }, [secondReferData]);

  const setThirdData = () => {
    setthirdReferData(formComponentViewRef.current);
    setOpenAccountDTL(true);
  };

  useEffect(() => {
    if (thirdReferData) {
      let reqPara = {
        COMP_CD: authState?.authState?.companyID ?? "",
        BRANCH_CD: thirdReferData?.columnVal?.BRANCH ?? "",
        ACCT_TYPE: thirdReferData?.columnVal?.ACCOUNT_TYPE ?? "",
        ACCT_CD: thirdReferData?.columnVal?.ACCOUNT_NUMBER ?? "",
        A_ASON_DT: format(
          // isValidDate(authState?.authState?.workingDate)
          //   ? authState?.authState?.workingDate
          //   :
          new Date(),
          "dd/MMM/yyyy"
        ),
        authState: authState ?? {},
      };
      getAccInfo.mutate(reqPara);
    }
  }, [thirdReferData]);

  useEffect(() => {
    if (
      referData !== undefined &&
      referData?.columnVal?.RECEIPT_PAYMENT &&
      parseFloat(referData?.columnVal?.RECEIPT_PAYMENT) > 0
    ) {
      let retdata = UpdateRequestDataVisibleColumn(referData?.columnVal, "");
      setRetData(retdata);
      setDisplayTable(true);
      manageOpenDenoYes();
    }
  }, [referData]);

  const closeAccountDTL = () => {
    setOpenAccountDTL(false);
  };

  // DenominationScreenMetaData?.fields?.map((field) => {
  //   console.log(field, "field>>>>>");
  //   if (field.accessor === "ACCOUNT_NUMBER") {
  //     <input
  //       key={field?.accessor}
  //       value={""}
  //       type="text"
  //       onKeyDown={(event) => handleTabPress(event)}
  //       placeholder="Acct no"
  //     ></input>;
  //   }
  // });

  const getAccInfo = useMutation(API.getAccInfoTeller, {
    onSuccess: (data) => {
      setTempStore({ ...tempStore, accInfo: data });
    },
    onError: (error) => {},
  });

  const handleViewDetails = () => {
    setViewTRN(true);
  };

  const actions: ActionTypes[] = [
    {
      actionName: "Close",
      actionLabel: "Close",
      multiple: false,
      rowDoubleClick: false,
      alwaysAvailable: true,
    },
  ];

  const setCurrentAction = useCallback((data) => {
    if (data?.name === "Close") {
      setViewTRN(false);
    }
  }, []);

  return (
    <>
      <Box padding={"0.5rem 1rem 0.5rem 1rem"}>
        <Box mb={1}>
          <Box
            height={"auto"}
            borderTop={"2px solid var(--theme-color6)"}
            borderRight={"2px solid var(--theme-color6)"}
            borderLeft={"2px solid var(--theme-color6)"}
            sx={{
              background: "var(--theme-color5)",
              borderTopRightRadius: "10px",
              borderTopLeftRadius: "10px",
              display: "flex",
              padding: "0 10px",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h5"
              sx={{
                padding: "10px",
                fontWeight: "500",
                color: "#ffffff",
                width: "fit-content",
              }}
            >
              {`${DenominationScreenMetaData?.gridConfig?.title} -
              ${authState?.authState?.user?.name} - (${authState?.authState?.roleName})`}
            </Typography>
            <Box display={"flex"}>
              {/* <GradientButton sx={{ height: "2.5rem" }}>Save </GradientButton>*/}
              <Tooltip title="View Transactions">
                <GradientButton
                  sx={{ height: "2.5rem" }}
                  onClick={handleViewDetails}
                  endIcon={
                    getData.isLoading ? <CircularProgress size={20} /> : null
                  }
                >
                  View Transactions
                </GradientButton>
              </Tooltip>
              <Tooltip title="Denomination">
                <GradientButton
                  sx={{ height: "2.5rem" }}
                  onClick={getRefData}
                  endIcon={
                    getData.isLoading ? <CircularProgress size={20} /> : null
                  }
                >
                  Denomination
                </GradientButton>
              </Tooltip>
              <Tooltip title="Reset">
                <GradientButton
                  onClick={() => {
                    setIsDisableField(false);
                    setDisplayTable(false);
                  }}
                  sx={{ height: "2.5rem" }}
                >
                  Reset
                </GradientButton>
              </Tooltip>
            </Box>
          </Box>
          {getMoreData.isLoading ? <LinearProgress color="secondary" /> : null}
          <FormComponentView
            key={"denomination" + formData + formData.NAME ?? ""}
            finalMetaData={updatedMetaData as FilterFormMetaType}
            onAction={ClickEventManage}
            loading={getData.isLoading || isDisableField}
            data={formData ?? {}}
            propStyles={{
              titleStyle: {},
              toolbarStyles: {
                // background: "transparent !important",
              },
              IconButtonStyle: "                  ",
              paperStyle: {
                backgroundColor: "white !important",
                borderBottomLeftRadius: "10px",
                borderBottomRightRadius: "10px",
                boxShadow: "rgba(226, 236, 249, 0.5) 0px 11px 70px",
                border: "2px solid var(--theme-color6)",
                overflow: "hidden",
                "& .MuiGrid-root": {
                  marginBottom: "-10px",
                  "& .css-1br77t0-MuiGrid-root>.MuiGrid-item": {
                    paddingTop: "0px !important",
                    // display: "none",
                  },
                },
                "& .ForwardRef(Button)-root-80": {
                  // display: "none",
                },
                "& .css-wh7pzv-MuiGrid-root": {
                  flexBasis: "13.666667%",
                },
              },
            }}
            ref={formComponentViewRef}
            submitSecondButtonName={"Acc DTL"}
            submitSecondAction={ClickSecondButtonEventManage}
            submitSecondButtonHide={false}
            // submitSecondLoading={openAccountDTL}
            firstSubmitButtonHide={true}
            displayStyle1={"none"}
            displayStyle2={"none"}
            submitThirdAction={setThirdData}
            submitThirdButtonName={"More Details"}
            submitThirdLoading={false}
            displayStyle3={"flex"}
          ></FormComponentView>
        </Box>
        {openAccountDTL ? (
          <Dialog
            open={openAccountDTL}
            maxWidth={"xl"}
            fullWidth
            onClose={closeAccountDTL}
            // style={{ height: "40vh" }}
          >
            <AccDetails />
          </Dialog>
        ) : null}

        <DenoTable
          displayTable={displayTable}
          data={data}
          isDisableField={isDisableField}
          inputVal={inputVal}
          handleChange={handleChange}
          handleKeyPress={handleKeyPress}
          updateTotalAmount={updateTotalAmount}
          displayError={displayError}
          multiplicationResult={multiplicationResult}
          availNote={availNote}
          balance={balance}
          totalInputAmount={totalInputAmount}
          totalAmount={totalAmount}
          displayTotal={displayTotal}
          upadatedFinalAmount={upadatedFinalAmount}
        />

        {Boolean(openDeno) ? (
          <PopupMessageAPIWrapper
            MessageTitle="Denomination confirmation"
            Message="Are you sure to open denomination"
            onActionYes={() => manageOpenDenoYes()}
            onActionNo={() => manageOpenDenoNo()}
            rows={[]}
            open={openDeno}
            loading={getData.isLoading}
          />
        ) : null}

        {Boolean(confirmation) ? (
          <PopupRequestWrapper
            MessageTitle={"Confirmation"}
            Message={"All Transaction are Completed Want to Proceed"}
            onClickButton={(rows, buttonNames) => {
              controlAction(rows, buttonNames);
            }}
            buttonNames={["Yes", "No"]}
            rows={[]}
            open={confirmation}
          />
        ) : null}

        {/* <DualPartTable /> */}

        {manageOperator ? <SingleDeno /> : null}

        {viewTRN ? (
          <Dialog open={viewTRN}>
            <GridWrapper
              key={`denoViewTrnGrid`}
              finalMetaData={denoViewTrnGridMetaData as GridMetaDataType}
              data={[]}
              setData={() => null}
              actions={actions}
              setAction={setCurrentAction}
              headerToolbarStyle={{
                backgroundColor: "var(theme-color5)",
              }}
              loading={false}
              // refetchData={() => refetch()}
            />
          </Dialog>
        ) : null}
      </Box>
    </>
  );
};

export default CashReceiptEntry;
