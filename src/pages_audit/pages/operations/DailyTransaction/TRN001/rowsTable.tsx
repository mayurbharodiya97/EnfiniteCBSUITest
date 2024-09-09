import {
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import {
  forwardRef,
  Fragment,
  useContext,
  useImperativeHandle,
  useRef,
} from "react";
import CancelIcon from "@mui/icons-material/Cancel";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { TRN001Context } from "./Trn001Reducer";
import { AuthContext } from "pages_audit/auth";
import { t } from "i18next";
import "./Trn001.css";
import useAutocompleteHandlers, {
  CustomeAutocomplete,
  CustomAmountField,
  DynFormHelperText,
  CustomTextField,
} from "./components";
import { CustomPropertiesConfigurationContext } from "components/propertiesconfiguration/customPropertiesConfig";
import { formatCurrency } from "components/tableCellComponents/currencyRowCellRenderer";
import getCurrencySymbol from "components/custom/getCurrencySymbol";

const RowsTable = forwardRef<any, any>(
  (
    {
      rows,
      queriesResult,
      handleAccTypeBlur,
      handleAccNoBlur,
      loadingStates,
      trxOptions2,
      trxOptions,
      handleTrx,
      getChqValidation,
      getDateValidation,
      viewOnly,
      handleDebit,
      handleDebitBlur,
      handleCredit,
      handleCreditBlur,
      setLoadingState,
      totalDebit,
      totalCredit,
      cardsData,
      tabsDetails,
      parametres,
      handleGetHeaderTabs,
      getCarousalCards,
      carousalCrdLastReq,
      setReqData,
      isTabsLoading,
      checkLoading,
      isCardsLoading,
      removeRow,
      handleScrollBlur,
    },
    ref
  ) => {
    const accInputRef = useRef<any>(null);
    const trxInputRef = useRef<any>(null);
    const cqDateInputRef = useRef<any>(null);
    const debitInputRef = useRef<any>(null);
    const {
      handleBranchChange,
      handleBranchBlur,
      handleAccTypeChange,
      handleAcctNoChange,
      handleTrxBlurCtx,
      handleScrollCtx,
      handleScrollBlurCtx,
      handleSdcCtx,
      handleSdcBlurCtx,
      handleRemarkCtx,
      handleRemarksBlurCtx,
      handleCNoCtx,
      handleCNoBlurCtx,
      handleDateCtx,
      handleDateBlurCtx,
    } = useContext(TRN001Context);
    const { authState } = useContext(AuthContext);
    const customParameter = useContext(CustomPropertiesConfigurationContext);

    const {
      commonDateFormat,
      dynamicAmountSymbol,
      currencyFormat,
      decimalCount,
    } = customParameter;

    const {
      handleHighlightChange: branchHighlightChange,
      handleKeyDown: branchKeyDown,
    } = useAutocompleteHandlers(handleBranchChange);
    const {
      handleHighlightChange: acctTypeHighlightChange,
      handleKeyDown: acctTypeKeyDown,
    } = useAutocompleteHandlers(handleAccTypeChange);
    const {
      handleHighlightChange: trxHighlightChange,
      handleKeyDown: trxKeyDown,
    } = useAutocompleteHandlers(handleTrx);
    const {
      handleHighlightChange: sdcHighlightChange,
      handleKeyDown: sdcKeyDown,
    } = useAutocompleteHandlers(handleSdcCtx);

    useImperativeHandle(ref, () => ({
      focusAcctInput: () => {
        if (accInputRef?.current) {
          accInputRef?.current?.focus();
        }
      },
      focusTrxInput: () => {
        if (trxInputRef?.current) {
          trxInputRef?.current?.focus();
        }
      },
      focusCqDateInput: () => {
        if (cqDateInputRef?.current) {
          cqDateInputRef?.current?.focus();
        }
      },
      focusDebitInput: () => {
        if (debitInputRef?.current) {
          debitInputRef?.current?.focus();
        }
      },
    }));

    const handleonFocus = (event) => {
      const input = event.target;
      if (input.value) {
        input.select();
      }
    };

    return (
      <>
        <TableContainer component={Paper}>
          <fieldset
            disabled={
              Boolean(isTabsLoading) ||
              Boolean(checkLoading) ||
              Boolean(isCardsLoading)
            }
            style={{ border: "none" }}
          >
            <Table aria-label="simple table" padding={"none"}>
              <>
                <caption>
                  <h3>
                    Total ( Debit:
                    {formatCurrency(
                      parseFloat(totalDebit || "0"),
                      getCurrencySymbol(dynamicAmountSymbol),
                      currencyFormat,
                      decimalCount
                    )}
                    | Credit:
                    {formatCurrency(
                      parseFloat(totalCredit || "0"),
                      getCurrencySymbol(dynamicAmountSymbol),
                      currencyFormat,
                      decimalCount
                    )}{" "}
                    )
                  </h3>
                </caption>
              </>

              <TableHead>
                <TableRow id="topHead">
                  <TableCell id="head">{t("Branch")}</TableCell>
                  <TableCell id="head">{t("AcctType")}</TableCell>
                  <TableCell id="head">{t("ACNo")}</TableCell>
                  <TableCell id="head">{t("Trx")}</TableCell>
                  <TableCell id="head">
                    {rows[0]?.trx?.code == "4" ? "Token" : t("Scroll")}
                  </TableCell>
                  <TableCell id="head">{t("SDC")}</TableCell>
                  <TableCell id="head">{t("Remarks")}</TableCell>
                  <TableCell id="head">{t("Chequeno")} </TableCell>
                  <TableCell id="head">Cheque Date</TableCell>
                  <TableCell id="head">{t("DebitAmount")}</TableCell>
                  <TableCell id="head">{t("CreditAmount")}</TableCell>{" "}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows?.map((row, index) => (
                  <TableRow
                    key={"dailyTrnRow" + row?.unqID}
                    onClick={() => {
                      if (
                        Boolean(authState?.companyID) &&
                        Boolean(row?.accType?.value) &&
                        Boolean(row?.branch?.value)
                      ) {
                        handleGetHeaderTabs({
                          COMP_CD: authState?.companyID ?? "",
                          ACCT_TYPE: row?.accType?.value ?? "",
                          BRANCH_CD: row?.branch?.value ?? "",
                        });
                        if (
                          Boolean(row?.accType?.info?.PARENT_TYPE) &&
                          Boolean(row?.accNo)
                        ) {
                          const currReq = {
                            COMP_CD: row?.branch?.info?.COMP_CD ?? "",
                            ACCT_TYPE: row?.accType?.value ?? "",
                            ACCT_CD: row?.accNo ?? "",
                            PARENT_TYPE: row?.accType?.info?.PARENT_TYPE ?? "",
                            PARENT_CODE: row?.accType?.info?.PARENT_CODE ?? "",
                            BRANCH_CD: row?.branch?.value ?? "",
                            SCREEN_REF: "ETRN/001",
                            unqID: row?.unqID,
                          };

                          if (
                            JSON?.stringify(carousalCrdLastReq?.current) !==
                            JSON?.stringify(currReq)
                          ) {
                            carousalCrdLastReq.current = currReq;
                            getCarousalCards?.mutate({ reqData: currReq });
                          }
                        }
                      }
                    }}
                  >
                    <Tooltip
                      disableInteractive={true}
                      title={
                        row?.branch?.label && (
                          <h3>{row?.branch?.info?.BRANCH_NM}</h3>
                        )
                      }
                    >
                      <TableCell style={{ verticalAlign: "baseline" }}>
                        <CustomeAutocomplete
                          value={row?.branch ?? ""}
                          options={queriesResult?.[0]?.data ?? []}
                          onChange={(event: any, value: any) =>
                            handleBranchChange({
                              updUnqId: row?.unqID,
                              branchVal: value,
                            })
                          }
                          onHighlightChange={(event, option, reason) =>
                            branchHighlightChange(event, option, reason)
                          }
                          popupIcon={null}
                          width="120px"
                          onBlur={() =>
                            handleBranchBlur({
                              updUnqId: row?.unqID,
                              chequeDate: authState?.workingDate,
                            })
                          }
                          onKeyDown={(event) =>
                            branchKeyDown(event, row?.unqID, "BRANCH_CD")
                          }
                          autoFocus={true}
                          isLoading={
                            queriesResult?.[0]?.isFetching ||
                            queriesResult?.[0]?.isLoading
                          }
                          errorMsg={row?.bugMsgBranchCode}
                        />
                      </TableCell>
                    </Tooltip>
                    <Tooltip
                      disableInteractive={true}
                      title={
                        row?.accType?.info?.TYPE_NM && (
                          <h3>{row?.accType?.info?.TYPE_NM}</h3>
                        )
                      }
                    >
                      <TableCell style={{ verticalAlign: "baseline" }}>
                        <CustomeAutocomplete
                          value={row?.accType ?? ""}
                          disabled={!Boolean(row?.branch?.value)}
                          options={queriesResult?.[1]?.data ?? []}
                          popupIcon={null}
                          onChange={(e, value) =>
                            handleAccTypeChange({ updUnqId: row?.unqID, value })
                          }
                          onHighlightChange={(event, option, reason) =>
                            acctTypeHighlightChange(event, option, reason)
                          }
                          width={"130px"}
                          onBlur={() => handleAccTypeBlur(row?.unqID)}
                          onKeyDown={(event) =>
                            acctTypeKeyDown(event, row?.unqID, "ACCT_TYPE")
                          }
                          isLoading={
                            queriesResult?.[1]?.isFetching ||
                            queriesResult?.[1]?.isLoading
                          }
                          errorMsg={row?.bugMsgAccType}
                        />
                      </TableCell>
                    </Tooltip>
                    <TableCell
                      sx={{ minWidth: 120 }}
                      style={{ verticalAlign: "baseline" }}
                    >
                      <CustomTextField
                        value={row?.accNo}
                        type="number"
                        onChange={(event) =>
                          handleAcctNoChange({
                            updUnqId: row?.unqID,
                            value: event?.target?.value,
                          })
                        }
                        disabled={!Boolean(row?.accType?.value)}
                        onBlur={() => handleAccNoBlur(row?.unqID)}
                        loadingState={loadingStates[row?.unqID]?.["ACCTNO"]}
                        inputRef={accInputRef}
                        errorMsg={row?.bugMsgAccNo}
                      />
                    </TableCell>
                    <Tooltip
                      disableInteractive={true}
                      title={
                        row?.trx?.label && (
                          <h3>{row?.trx?.info?.DESCRIPTION}</h3>
                        )
                      }
                    >
                      <TableCell style={{ verticalAlign: "baseline" }}>
                        <CustomeAutocomplete
                          value={row?.trx ?? ""}
                          disabled={
                            !Boolean(cardsData?.length > 0) ||
                            !Boolean(tabsDetails?.length > 0) ||
                            !Boolean(row?.accNo)
                          }
                          options={
                            row?.unqID !== 0
                              ? trxOptions2 ?? []
                              : trxOptions ?? []
                          }
                          onChange={(event, value) =>
                            handleTrx(event, value, row?.unqID)
                          }
                          onHighlightChange={(event, option, reason) =>
                            trxHighlightChange(event, option, reason)
                          }
                          popupIcon={null}
                          width={"75px"}
                          onBlur={(e) => {
                            if (Boolean(row?.acctNoFlag?.[row?.unqID]))
                              handleTrxBlurCtx({
                                updUnqId: row?.unqID,
                                chequeDate: authState?.workingDate,
                              });
                          }}
                          onKeyDown={(event) =>
                            trxKeyDown(event, row?.unqID, "TRX")
                          }
                          isLoading={
                            queriesResult?.[3]?.isFetching ||
                            queriesResult?.[3]?.isLoadings
                          }
                          errorMsg={row?.bugMsgTrx}
                          inputRef={trxInputRef}
                        />
                      </TableCell>
                    </Tooltip>
                    <TableCell
                      sx={{ minWidth: 60 }}
                      style={{ verticalAlign: "baseline" }}
                    >
                      <CustomTextField
                        value={row?.scroll}
                        type="number"
                        onChange={(event) =>
                          handleScrollCtx({
                            updUnqId: row?.unqID,
                            value: event?.target?.value,
                          })
                        }
                        onBlur={(event) =>
                          // handleScrollBlurCtx({ updUnqId: row?.unqID })
                          handleScrollBlur(event, row?.unqID)
                        }
                        errorMsg={row?.bugMsgScroll}
                        loadingState={loadingStates[row?.unqID]?.["TOKEN"]}
                      />
                    </TableCell>
                    <Tooltip
                      disableInteractive={true}
                      title={
                        row?.sdc?.label && (
                          <h3>{row?.sdc?.info?.DESCRIPTION}</h3>
                        )
                      }
                    >
                      <TableCell style={{ verticalAlign: "baseline" }}>
                        <CustomeAutocomplete
                          value={row?.sdc ?? ""}
                          disabled={
                            !Boolean(row?.trx?.code) ||
                            !Boolean(row?.branch?.value) ||
                            !Boolean(row?.accType?.value) ||
                            !Boolean(row?.accNo) ||
                            Boolean(parametres[0]?.DIS_SDC === "Y")
                          }
                          options={queriesResult?.[2]?.data ?? []}
                          onChange={(e, value) =>
                            handleSdcCtx({ updUnqId: row?.unqID, value })
                          }
                          onHighlightChange={(event, option, reason) =>
                            sdcHighlightChange(event, option, reason)
                          }
                          popupIcon={null}
                          onBlur={(event) =>
                            handleSdcBlurCtx({ updUnqId: row?.unqID })
                          }
                          onKeyDown={(event) =>
                            sdcKeyDown(event, row?.unqID, "SDC")
                          }
                          isLoading={
                            queriesResult?.[2]?.isFetching ||
                            queriesResult?.[2]?.isLoading
                          }
                          errorMsg={row?.bugMsgSdc}
                        />
                      </TableCell>
                    </Tooltip>
                    <TableCell
                      sx={{ minWidth: 130 }}
                      style={{ verticalAlign: "baseline" }}
                    >
                      <CustomTextField
                        value={row?.remark}
                        onChange={(event) =>
                          handleRemarkCtx({
                            updUnqId: row?.unqID,
                            value: event?.target?.value,
                          })
                        }
                        onBlur={() =>
                          handleRemarksBlurCtx({
                            updUnqId: row?.unqID,
                          })
                        }
                        disabled={
                          !Boolean(row?.sdc?.value) ||
                          !Boolean(row?.branch?.value) ||
                          !Boolean(row?.accType?.value) ||
                          !Boolean(row?.accNo)
                        }
                        errorMsg={row?.bugMsgRemarks}
                      />
                    </TableCell>
                    <TableCell
                      sx={{
                        minWidth: 90,
                      }}
                      style={{ verticalAlign: "baseline" }}
                    >
                      <CustomTextField
                        value={row?.cNo}
                        disabled={
                          Boolean(row?.isCredit) || !Boolean(row?.remark)
                        }
                        id="txtRight"
                        type="number"
                        onChange={(event) =>
                          handleCNoCtx({
                            updUnqId: row?.unqID,
                            value: event?.target?.value,
                          })
                        }
                        onBlur={(event) =>
                          handleCNoBlurCtx({
                            updUnqId: row?.unqID,
                            value: event?.target?.value,
                            mutationFn: getChqValidation,
                            setLoadingState,
                          })
                        }
                        loadingState={loadingStates[row?.unqID]?.["CHQNOVALID"]}
                        errorMsg={row?.bugMsgCNo}
                        alignment="left"
                      />
                    </TableCell>
                    <TableCell
                      sx={{ minWidth: 140, maxWidth: "auto" }}
                      style={{ verticalAlign: "baseline" }}
                    >
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          format={
                            Boolean(commonDateFormat)
                              ? commonDateFormat
                              : "dd/MM/yyyy"
                          }
                          disabled={
                            Boolean(row?.isCredit) || !Boolean(row?.cNo)
                          }
                          value={row?.date}
                          onChange={(event) =>
                            handleDateCtx({ updUnqId: row?.unqID, date: event })
                          }
                          slots={{ textField: TextField }}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              onBlur: (event) => {
                                //when call API on cheqNo of valida... so this API calling two(because of open msgBox in cheqNo) times so after cheqNo API make cheqNoFlag true f0r call this API
                                if (Boolean(row?.cheqNoFlag?.[row?.unqID])) {
                                  handleDateBlurCtx({
                                    updUnqId: row?.unqID,
                                    event,
                                    mutationFn: getDateValidation,
                                    setLoadingState,
                                  });
                                }
                              },
                              onFocus: (event) => {
                                handleonFocus(event);
                              },
                              inputProps: {
                                style: {
                                  height: "0.3em",
                                },
                              },
                              FormHelperTextProps: {
                                style: {
                                  display: "none",
                                },
                              },
                              sx: {
                                "& .MuiOutlinedInput-root": {
                                  "&.Mui-error": {
                                    "& fieldset": {
                                      borderColor: "inherit",
                                    },
                                  },
                                },
                              },
                              InputProps: {
                                endAdornment: (
                                  <Fragment>
                                    {Boolean(
                                      loadingStates[row?.unqID]?.["CHQDATE"]
                                    ) ? (
                                      <CircularProgress
                                        sx={{
                                          position: "absolute",
                                          right: "0.5rem",
                                        }}
                                        size={25}
                                        color="secondary"
                                        variant="indeterminate"
                                      />
                                    ) : null}
                                  </Fragment>
                                ),
                              },
                              variant: "outlined",
                            },
                          }}
                          inputRef={cqDateInputRef}
                        />
                      </LocalizationProvider>
                      {Boolean(row?.bugMsgDate) && (
                        <DynFormHelperText msg={row?.bugMsgDate} />
                      )}
                    </TableCell>
                    <TableCell
                      sx={{ minWidth: 120 }}
                      style={{ verticalAlign: "baseline" }}
                    >
                      <CustomAmountField
                        value={row?.debit}
                        disabled={
                          Boolean(row?.isCredit) ||
                          !Boolean(row?.cNo) ||
                          !Boolean(row?.date) ||
                          Boolean(viewOnly)
                        }
                        onChange={(event) => handleDebit(event, row?.unqID)}
                        onBlur={(event) => {
                          if (Boolean(row?.cheqDateFlag?.[row?.unqID])) {
                            handleDebitBlur(event, row?.unqID);
                          }
                        }}
                        inputRef={debitInputRef}
                        loadingState={
                          loadingStates[row?.unqID]?.["AMNTVALIDDR"]
                        }
                        errorMsg={row?.bugMsgDebit}
                        customParameter={customParameter}
                      />
                    </TableCell>
                    <TableCell
                      sx={{ minWidth: 120 }}
                      style={{ verticalAlign: "baseline" }}
                    >
                      <CustomAmountField
                        value={row?.credit}
                        disabled={
                          !Boolean(row?.isCredit) ||
                          Boolean(viewOnly) ||
                          !Boolean(row?.remark) ||
                          !Boolean(row?.branch?.value) ||
                          !Boolean(row?.accType?.value) ||
                          !Boolean(row?.accNo)
                        }
                        onChange={(event) => handleCredit(event, row?.unqID)}
                        onBlur={(event) => handleCreditBlur(event, row?.unqID)}
                        loadingState={
                          loadingStates[row?.unqID]?.["AMNTVALIDCR"]
                        }
                        errorMsg={row?.bugMsgCredit}
                        customParameter={customParameter}
                      />
                    </TableCell>
                    <TableCell style={{ border: "0px" }}>
                      {(row?.trx?.code === "3" || row?.trx?.code === "6") &&
                        !Boolean(row?.unqID === 0) && (
                          <button
                            className="clearBtn"
                            onClick={() => removeRow(row?.unqID)}
                          >
                            <CancelIcon />
                          </button>
                        )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </fieldset>
        </TableContainer>
      </>
    );
  }
);
export default RowsTable;
