import { ClearCacheProvider, queryClient } from "cache";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { GradientButton } from "components/styledComponent/button";
import { extractMetaData } from "components/utils";
import {
  FC,
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import {
  DualConfHistoryGridMetaData,
  RtgsOrderingBranchConfirmFormMetaData,
  RtgsOrderingHOConfirmFormMetaData,
  rtgBenDetailConfirmFormMetaData,
} from "./ConfirmationMetadata";
import * as API from "./api";
import { ActionTypes } from "components/dataTable";
import { useMutation, useQueries, useQuery } from "react-query";
import { AuthContext } from "pages_audit/auth";
import { LoaderPaperComponent } from "components/common/loaderPaper";
import { Alert } from "components/common/alert";
import {
  AppBar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Theme,
  Toolbar,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import GridWrapper from "components/dataTableStatic";
import KeyboardDoubleArrowRightOutlinedIcon from "@mui/icons-material/KeyboardDoubleArrowRightOutlined";
import KeyboardDoubleArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardDoubleArrowLeftOutlined";
import { PopupMessageAPIWrapper } from "components/custom/popupMessage";
import { useSnackbar } from "notistack";
import { usePopupContext } from "components/custom/popupContext";
import { format } from "date-fns";
import { useLocation } from "react-router-dom";
import { ChequeSignImage } from "../../inwardClearing/inwardClearingForm/chequeSignImage";
import { RemarksAPIWrapper } from "components/custom/Remarks";
import { Box } from "@mui/system";
import { OTPModel } from "pages_audit/auth/otpPopup";
import { useTranslation } from "react-i18next";
import { verifyOTP } from "pages_audit/auth/api";
import { useStyles } from "pages_audit/auth/style";
import { rtgsVerifyOTP } from "./api";

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
    actionName: "close",
    actionLabel: "Close",
    multiple: undefined,
    rowDoubleClick: false,
    alwaysAvailable: true,
  },
];

const initialState = {
  OtpuserMessage: "",
  otpmodelClose: false,
  loading: false,
  otploading: false,
  isError: false,
  transactionID: "",
  comapanyCD: "",
  branchCD: "",
  username: "",
  otpValidFor: 60,
  recieveOtp: "",
  sentDate: "dd/mm/yyyy",
  contactUser: ""
  // Add other initial state properties
};
const reducer = (state, action) => {
  switch (action.type) {
    case "inititateOTPVerification": {
      return {
        ...state,
        loading: true,
        isError: false,
        isOTPError: false,
      };
    }
    case "OTPVerificationComplate": {
      return {
        ...state,
        loading: false,
        otploading: false,
        OtpuserMessage: "",
      };
    }
    case "OTPVerificationFailed":
      return {
        ...state,
        loading: false,
        otploading: false,
        OtpuserMessage: action.payload.error,
        otpmodelClose: action.payload.otpmodelclose,
      };
    case "OTPResendSuccess":
      return {
        ...state,
        transactionID: action.payload.transactionID,
      };
    // Other cases
    case "getNewOtpSuccessful": {
      return {
        ...state,
        transactionID: action?.payload?.transactionID,
        recieveOtp: action?.payload?.recieveOtp,
        comapanyCD: action?.payload?.comapanyCD,
        branchCD: action?.payload?.branchCD,
        username: action?.payload?.username,
        OtpuserMessage: "",
        otpmodelClose: false,
        otpValidFor: action?.payload?.otpValidFor,
        sentDate: action?.payload?.sentDate,
        contactUser: action?.payload?.contactUser,
      };
    }
    default:
      return state;
  }
};
const RtgsBranchHoConfirmationForm: FC<{
  flag: any;
  formMode?: any;
  rowsData?: any;
  onClose?: any;
  isDataChangedRef?: any;
  handlePrev?: any;
  handleNext?: any;
  currentIndex?: number;
  totalData?: number;
}> = ({
  flag,
  formMode,
  rowsData,
  onClose,
  isDataChangedRef,
  handlePrev,
  handleNext,
  currentIndex,
  totalData,
}) => {
    const { authState } = useContext(AuthContext);
    const headerClasses = useTypeStyles();
    const { enqueueSnackbar } = useSnackbar();
    const { MessageBox, CloseMessageBox } = usePopupContext();
    const [isDeleteRemark, SetDeleteRemark] = useState(false);
    const [isConfHistory, setIsConfHistory] = useState(false);
    const [loginState, dispatch] = useReducer(reducer, initialState);
    const [isOTP, setIsOTP] = useState(false); // Assuming isOTP is a state to show/hide OTP dialog
    const otpResendRef = useRef(0);
    const { t } = useTranslation();
    const classes = useStyles();

    console.log("authState", authState)

    const setCurrentAction = useCallback((data) => {
      if (data.name === "close") {
        setIsConfHistory(false);
      }
    }, []);
    const result: any = useQueries([
      {
        queryKey: ["getRtgsBranchConfirmOrderingData", rowsData?.BRANCH_TRAN_CD],
        queryFn: () =>
          API.getRtgsBranchConfirmOrderingData({
            ENT_BRANCH_CD: authState?.user?.branchCode,
            COMP_CD: rowsData?.COMP_CD ?? "",
            BRANCH_CD: rowsData?.BRANCH_CD ?? "",
            BRANCH_TRAN_CD: rowsData?.BRANCH_TRAN_CD ?? "",
            FLAG_RTGSC: ""
          }),
      },
      {
        queryKey: ["getRtgsBenDetailBranchConfirmData", rowsData?.TRAN_CD],
        queryFn: () => API.getRtgsBenDetailBranchConfirmData({
          COMP_CD: rowsData?.COMP_CD ?? "",
          BRANCH_CD: rowsData?.BRANCH_CD ?? "",
          TRAN_CD: rowsData?.TRAN_CD
        }),
      },
    ]);
    let errorMsg = `${result[1].error?.error_msg}` || `${result[0].error?.error_msg}`;
    errorMsg = Boolean(errorMsg.trim()) ? errorMsg : "Unknown error occured";
    //@ts-ignore
    let error_detail = `${result[1]?.error?.error_detail}` || `${result[0]?.error?.error_detail}`;


    useEffect(() => {
      return () => {
        queryClient.removeQueries(["getRtgsBranchConfirmOrderingData"]);
        queryClient.removeQueries(["getRtgsBenDetailBranchConfirmData"]);
      };
    }, []);

    const confHistory: any = useMutation(
      "getConfirmHistoryData",
      API.getConfirmHistoryData,
      {
        onSuccess: (data) => { },
        onError: (error: any) => { },
      }
    );
    const getGenerateOtp: any = useMutation(
      "getGenerateOtp",
      API.getGenerateOtp,
      {
        onSuccess: (data) => {
          dispatch({
            type: "getNewOtpSuccessful",
            payload: {
              comapanyCD: authState?.companyID,
              branchCD: authState?.user?.branchCode,
              transactionID: data?.[0]?.TRAN_CD,
              username: authState?.user?.name,
              otpValidFor: result[0]?.data?.acBalanceData?.OTP_VALID_SEC,
              recieveOtp: data?.[0]?.OTP,
              sentDate: data?.[0]?.SENT_DATE,
              contactUser: result[0]?.data?.hdrData?.CONTACT_INFO,
            },
          })
          setIsOTP(true)
        },
        onError: (error: any) => { },
      }
    );

    const boConfirmation: any = useMutation(
      "getRtgsBranchConfirmtion",
      API.getRtgsBranchConfirmtion,
      {
        onSuccess: (data) => {
          enqueueSnackbar(data, {
            variant: "success",
          });
          isDataChangedRef.current = true;
          onClose();
          CloseMessageBox();
        },
        onError: (error: any) => {
          CloseMessageBox();
        },
      }
    );
    const hoConfirmation: any = useMutation(
      "rtgsHoConfirmtionAndDelete",
      API.rtgsHoConfirmtionAndDelete,
      {
        onSuccess: (data) => {
          enqueueSnackbar(data, {
            variant: "success",
          });
          isDataChangedRef.current = true;
          onClose();
          CloseMessageBox();
        },
        onError: (error: any) => {
          CloseMessageBox();
        },
      }
    );
    const deleteBrMutation = useMutation("delteRtgsBranchConfirm", API.delteRtgsBranchConfirm, {
      onError: (error: any) => {
        let errorMsg = "Unknown Error occured";
        if (typeof error === "object") {
          errorMsg = error?.error_msg ?? errorMsg;
        }
        enqueueSnackbar(errorMsg, {
          variant: "error",
        });
        CloseMessageBox();
        SetDeleteRemark(false);
      },
      onSuccess: (data) => {
        // isDataChangedRef.current = true;
        enqueueSnackbar("Records successfully deleted", {
          variant: "success",
        });
        isDataChangedRef.current = true;
        onClose();
        CloseMessageBox();
        SetDeleteRemark(false);
      },
    });
    const deleteHoMutation = useMutation("rtgsHoConfirmtionAndDelete", API.rtgsHoConfirmtionAndDelete, {
      onError: (error: any) => {
        let errorMsg = "Unknown Error occured";
        if (typeof error === "object") {
          errorMsg = error?.error_msg ?? errorMsg;
        }
        enqueueSnackbar(errorMsg, {
          variant: "error",
        });
        CloseMessageBox();
        SetDeleteRemark(false);
      },
      onSuccess: (data) => {
        // isDataChangedRef.current = true;
        enqueueSnackbar("Records successfully deleted", {
          variant: "success",
        });
        isDataChangedRef.current = true;
        onClose();
        CloseMessageBox();
        SetDeleteRemark(false);
      },
    });
    const VerifyOTP = async (OTPNumber) => {
      if (Boolean(OTPNumber) && OTPNumber.toString().length === 6) {
        dispatch({ type: "inititateOTPVerification" });
        const { status, data, message } = await rtgsVerifyOTP(
          loginState?.transactionID,
          loginState?.recieveOtp,
          OTPNumber,
          loginState?.otpValidFor,
          loginState?.sentDate
        );
        if (status === "0") {
          // Check the A_STATUS value and take action accordingly
          console.log(data, data?.A_STATUS.trim())

          switch (data?.A_STATUS.trim()) {
            case "E":
              dispatch({
                type: "OTPVerificationFailed",
                payload: { error: data?.A_REMARKS, otpmodelclose: false },
              });
              break;
            case "T":
              dispatch({
                type: "OTPVerificationFailed",
                payload: { error: data?.A_REMARKS, otpmodelclose: false },
              });
              break;
            case "S":
              dispatch({ type: "OTPVerificationComplete" });
              // Call the other API or perform the necessary action
              hoConfirmation.mutate({
                _isDeleteRow: false,
                ENTERED_COMP_CD: data?.hdrData?.ENTERED_COMP_CD,
                ENTERED_BRANCH_CD: data?.hdrData?.ENTERED_BRANCH_CD,
                TRAN_CD: data?.hdrData?.TRAN_CD,
              });
              break;

            case "F":
              dispatch({
                type: "OTPVerificationFailed",
                payload: { error: data?.A_REMARKS, otpmodelclose: false },
              });
              break;
          }
        } else if (status === "999") {
          dispatch({
            type: "OTPVerificationFailed",
            payload: { error: message, otpmodelclose: true },
          });
          CloseMessageBox()
        } else {
          dispatch({
            type: "OTPVerificationFailed",
            payload: { error: message, otpmodelclose: false },
          });
        }
      } else {
        dispatch({
          type: "OTPVerificationFailed",
          payload: { error: "Please enter a 6 digit OTP number" },
        });
      }
    };

    useEffect(() => {
      if (loginState.otpmodelClose) {
        setIsOTP(false);
      }
    }, [loginState.otpmodelClose]);
    useEffect(() => {
      const handleKeyDown = async (event) => {
        if (event.ctrlKey && (event.key === "D" || event.key === "d")) {
          event.preventDefault();
          if (rowsData?.CONFIRMED === "Y" && authState?.role < "2") {
            await MessageBox({
              messageTitle: "Validation Failed..",
              message: "Cannot Delete Confirmed Transaction",
              buttonNames: ["Ok"],
            });
          } else if (
            !(
              format(new Date(rowsData?.TRAN_DT), "dd/MMM/yyyy") ===
              format(new Date(authState?.workingDate), "dd/MMM/yyyy")
            )
          ) {
            await MessageBox({
              messageTitle: "Validation Failed..",
              message: "Cannot Delete Back Dated Entry",
              buttonNames: ["Ok"],
            });
          } else {
            SetDeleteRemark(true);
          }
        }
      };
      document.addEventListener("keydown", handleKeyDown);
    }, []);
    // if (flag === "BO") {
    //   CTSOutwardClearingConfirmMetaData.form.label = "RTGS Branch Confirmation";
    // } else if (flag === "HO") {
    //   CTSOutwardClearingConfirmMetaData.form.label = "Inward Return Confirmation";
    // } 

    const shouldHideButton =
      flag === "BO" ? rowsData?.BR_CONFIRMED === "Y" ||
        rowsData?.BR_CONFIRMED === "T" :
        rowsData?.HO_CONFIRMED === "Y" ||
        rowsData?.HO_CONFIRMED === "T" ||
        result[0]?.data?.hdrData?.PI_ACKN_INDICATOR === "Y"

    console.log("ac", rowsData?.ENTERED_BY, rowsData?.VERIFIED_BY)

    return (
      <Fragment>
        <>
          <Dialog
            open={true}
            PaperProps={{
              style: {
                width: "100%",
              },
            }}
            maxWidth="lg"
          >
            <AppBar
              position="static"
              sx={{
                height: "auto",
                background: "var(--theme-color5)",
                margin: "10px",
                width: "auto",
              }}
            >
              <Toolbar>
                <Typography
                  variant="h6"
                  style={{ flexGrow: 1 }}
                  sx={{
                    fontWeight: 700,
                    color: "var(--theme-color2)",
                    fontSize: "1.2rem",
                  }}
                >
                  {flag === "BO"
                    ? "RTGS Branch Confirmation"
                    : flag === "HO"
                      ? "RTGS HO Confirmation"
                      : null}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: "wrap" }}>
                  <>
                    {!shouldHideButton && (
                      <GradientButton
                        onClick={async () => {
                          if (rowsData?.BR_CONFIRMED === "T") {
                            await MessageBox({
                              messageTitle: "Validation Failed..",
                              message: "Branch Rejected Transaction Not Allow to Confirmed",
                              buttonNames: ["Ok"],
                            });
                          } else if (rowsData?.BR_CONFIRMED !== "Y" && flag === "HO") {
                            await MessageBox({
                              messageTitle: "Validation Failed..",
                              message: "Branch Confirmation Pending Transaction not allowed to Confirm",
                              buttonNames: ["Ok"],
                            })
                          }
                          else if (rowsData?.HO_CONFIRMED === "Y") {
                            await MessageBox({
                              messageTitle: "Validation Failed..",
                              message: "Transation already Confirmed",
                              buttonNames: ["Ok"],
                            })
                          } else if (rowsData?.HO_CONFIRMED === "T") {
                            await MessageBox({
                              messageTitle: "Validation Failed..",
                              message: "Rejected Transaction Not Allow to Confirm",
                              buttonNames: ["Ok"],
                            })
                          } else if (
                            !(
                              format(
                                new Date(rowsData?.TRAN_DT),
                                "dd/MMM/yyyy"
                              ) ===
                              format(
                                new Date(authState?.workingDate),
                                "dd/MMM/yyyy"
                              )
                            )
                          ) {
                            await MessageBox({
                              messageTitle: "Validation Failed..",
                              message: "Cannot Confirm Back Dated Entry",
                              buttonNames: ["Ok"],
                            });
                          } else if (authState?.user?.id === rowsData?.ENTERED_BY) {
                            await MessageBox({
                              messageTitle: "Validation Failed..",
                              message: "You can not confirm your own posted transaction",
                              buttonNames: ["Ok"],
                            });
                          } else if (rowsData?.VERIFIED_BY === authState?.user?.id) {
                            await MessageBox({
                              messageTitle: "Validation Failed..",
                              message: "You can't Confirm your own Branch confirmation",
                              buttonNames: ["Ok"],
                            });
                          } else {
                            const buttonName = await MessageBox({
                              messageTitle: "Confirmation",
                              message: "Do you want to allow the Transaction?",
                              buttonNames: ["No", "Yes"],
                              loadingBtnName: ["Yes"],
                            });
                            if (buttonName === "Yes") {
                              if (flag === "BO") {
                                boConfirmation.mutate({
                                  ENTERED_COMP_CD: result[0]?.data?.hdrData?.ENTERED_COMP_CD,
                                  ENTERED_BRANCH_CD: result[0]?.data?.hdrData?.ENTERED_BRANCH_CD,
                                  TRAN_CD: result[0]?.data?.hdrData?.TRAN_CD,
                                  ACCT_TYPE: result[0]?.data?.hdrData?.ACCT_TYPE,
                                  ACCT_CD: result[0]?.data?.hdrData?.ACCT_CD,
                                  AMOUNT: result[0]?.data?.hdrData?.AMOUNT,
                                  COMP_CD: result[0]?.data?.hdrData?.COMP_CD,
                                  BRANCH_CD: result[0]?.data?.hdrData?.BRANCH_CD,
                                  TRN_DT: result[0]?.data?.hdrData?.TRAN_DT,
                                  SCREEN_REF: "MST/553",
                                });
                              } else if (result[0]?.data?.acBalanceData?.RTGS_HO_CONFIRM_OTP === "Y" && flag === "HO") {
                                getGenerateOtp.mutate({
                                  TRN_TYPE: "RN_HO_CONF",
                                  CONTACT2: result[0]?.data?.hdrData?.CONTACT_INFO,
                                  VALID_UPTO: result[0]?.data?.acBalanceData?.OTP_VALID_SEC,
                                  COMP_CD: authState?.companyID,
                                  BRANCH_CD: authState?.user?.branchCode,
                                  USER_ID: authState?.user?.name
                                })

                              } else {
                                hoConfirmation.mutate({
                                  _isDeleteRow: false,
                                  ENTERED_COMP_CD: result[0]?.data?.hdrData?.ENTERED_COMP_CD,
                                  ENTERED_BRANCH_CD: result[0]?.data?.hdrData?.ENTERED_BRANCH_CD,
                                  TRAN_CD: result[0]?.data?.hdrData?.TRAN_CD,
                                })
                              }
                            }
                          }
                        }
                        }
                      >
                        Confirm
                      </GradientButton>
                    )}
                  </>
                  {!shouldHideButton && (
                    <GradientButton
                      onClick={async () => {
                        if (
                          rowsData?.HO_CONFIRMED === "Y"
                        ) {
                          await MessageBox({
                            messageTitle: "Validation Failed..",
                            message: " You Can't Delete/Reject HO Confirmed Transaction",
                            buttonNames: ["Ok"],
                          });
                        } else if (rowsData?.HO_CONFIRMED === "T" || rowsData?.BR_CONFIRMED === "T") {
                          await MessageBox({
                            messageTitle: "Validation Failed..",
                            message: "Transaction Already Rejected",
                            buttonNames: ["Ok"],
                          });
                        } else if (flag === "BO" ? rowsData?.BR_CONFIRMED === "Y" : rowsData?.HO_CONFIRMED === "Y") {
                          await MessageBox({
                            messageTitle: "Validation Failed..",
                            message: flag === "BO" ? "You Can't Delete Confirmed Transaction" : "You Can't Reject Entry Already Confirmed by HO",
                            buttonNames: ["Ok"],
                          });
                        }
                        else if (
                          !(
                            format(
                              new Date(rowsData?.TRAN_DT),
                              "dd/MMM/yyyy"
                            ) ===
                            format(
                              new Date(authState?.workingDate),
                              "dd/MMM/yyyy"
                            )
                          )
                        ) {
                          await MessageBox({
                            messageTitle: "Validation Failed..",
                            message: "Cannot Delete Back Dated Entry",
                            buttonNames: ["Ok"],
                          });
                        } else {
                          if (flag === "BO") {
                            SetDeleteRemark(true);
                          } else {
                            const buttonName = await MessageBox({
                              messageTitle: "Confirmation",
                              message: "Do You Want to reject this transaction?",
                              buttonNames: ["No", "Yes"],
                              defFocusBtnName: "Yes",
                              loadingBtnName: ["Yes"],
                            });
                            if (buttonName === "Yes") {
                              deleteHoMutation.mutate({
                                _isDeleteRow: true,
                                ENTERED_COMP_CD: result[0]?.data?.hdrData?.ENTERED_COMP_CD,
                                ENTERED_BRANCH_CD: result[0]?.data?.hdrData?.ENTERED_BRANCH_CD,
                                TRAN_CD: result[0]?.data?.hdrData?.TRAN_CD,
                              });
                            }
                          }
                        }
                      }}
                    >
                      Remove
                    </GradientButton>
                  )}
                  <GradientButton
                    onClick={() => {
                      if (currentIndex && currentIndex !== totalData)
                        handleNext();
                    }}
                  >
                    Move Forward
                  </GradientButton>
                  <GradientButton
                    onClick={() => {
                      if (currentIndex && currentIndex !== totalData)
                        handlePrev();
                    }}
                  >
                    Previous
                  </GradientButton>
                  {/* {flag === "R" &&
                    data?.[0]?.CHEQUE_DETAIL?.[0]?.CP_TRAN_CD ===
                    undefined && ( */}
                  <>
                    <GradientButton
                      onClick={() => {
                        // mutation.mutate({
                        //   COMP_CD: data?.[0]?.COMP_CD,
                        //   ENTERED_COMP_CD: data?.[0]?.ENTERED_COMP_CD,
                        //   ENTERED_BRANCH_CD: data?.[0]?.ENTERED_BRANCH_CD,
                        //   BRANCH_CD: data?.[0]?.BRANCH_CD,
                        //   ACCT_TYPE: data?.[0]?.ACCT_TYPE,
                        //   ACCT_CD: data?.[0]?.ACCT_CD,
                        //   DAILY_TRN_CD: "",
                        //   TRAN_CD:
                        //     data?.[0]?.CHEQUE_DETAIL?.[0]?.CP_TRAN_CD,
                        //   TRAN_DT: data?.[0]?.TRAN_DT,
                        //   TRAN_FLAG: "E",
                        //   WITH_SIGN: "Y",
                        //   ENTERED_BY: data?.[0]?.ENTERED_BY,
                        // });

                      }}
                    >
                      Sign View
                    </GradientButton>
                  </>
                  {flag === "BO" && result[0]?.data?.hdrData?.TRAN_CONF === "Y" ?
                    <GradientButton
                      onClick={() => {
                        confHistory.mutate({
                          ENTERED_COMP_CD: result[0]?.data?.hdrData?.ENTERED_COMP_CD,
                          ENTERED_BRANCH_CD: result[0]?.data?.hdrData?.ENTERED_BRANCH_CD,
                          TRAN_DT: result[0]?.data?.hdrData?.TRAN_DT,
                          TRAN_CD: result[0]?.data?.hdrData?.TRAN_CD,
                          SCREEN_REF: "RTGS_NEFT",
                        });
                        setIsConfHistory(true);
                      }}
                    >
                      Conf.History
                    </GradientButton>
                    : null
                  }
                  {
                    result[0]?.data?.hdrData?.VIEW_MEMO === "Y" ?
                      <GradientButton
                        onClick={() => {
                          // confHistory.mutate({
                          //   ENTERED_COMP_CD: data?.[0]?.ENTERED_COMP_CD,
                          //   ENTERED_BRANCH_CD: data?.[0]?.ENTERED_BRANCH_CD,
                          //   TRAN_DT: data?.[0]?.TRAN_DT,
                          //   TRAN_CD: data?.[0]?.TRAN_CD,
                          //   SCREEN_REF: "OW_CLG",
                          // });
                        }}
                      >
                        View Memo
                      </GradientButton> : null
                  }
                  <GradientButton
                    onClick={() => {
                      onClose();
                    }}
                  >
                    Close
                  </GradientButton>
                </Box>
              </Toolbar>
            </AppBar>
            <DialogContent sx={{ padding: "0px" }}>
              {result?.[0]?.isLoading || result?.[1]?.isLoading ? (
                <LoaderPaperComponent />
              ) : result[1].isError || result[0]?.isError ? (
                <>
                  <div
                    style={{
                      paddingRight: "10px",
                      paddingLeft: "10px",
                      height: 100,
                      paddingTop: 10,
                    }}
                  >
                    <AppBar position="relative" color="primary">
                      <Alert
                        severity="error"
                        errorMsg={errorMsg}
                        errorDetail={error_detail ?? ""}
                      />
                    </AppBar>
                  </div>
                </>
              ) : (
                <>
                  <FormWrapper
                    key={"rtgsOrderingConfirm"}
                    metaData={
                      extractMetaData(
                        flag === "BO" ?
                          RtgsOrderingBranchConfirmFormMetaData
                          : RtgsOrderingHOConfirmFormMetaData,
                        formMode
                      ) as MetaDataType
                    }
                    initialValues={{
                      ...(flag === "BO" ?
                        { ...result[0]?.data?.hdrData } :
                        { ...result[0]?.data?.hdrData, ...result[0]?.data?.acBalanceData }
                      ),
                      ENTERED_BY: "Enter by " + result[0]?.data?.hdrData?.ENTERED_BY,
                      VERIFIED_BY: "Br.Confirmed by " + result[0]?.data?.hdrData?.VERIFIED_BY
                    }}
                    onSubmitHandler={{}}
                    //@ts-ignore
                    displayMode={formMode}
                    hideHeader={true}
                    formStyle={{
                      background: "white",
                      width: "100%",
                    }}
                  />
                  <FormWrapper
                    key={`rtgBenDetailConfirm` + formMode}
                    metaData={
                      extractMetaData(
                        flag === "BO"
                          ? rtgBenDetailConfirmFormMetaData
                          : flag === "HO"
                            ? rtgBenDetailConfirmFormMetaData
                            : rtgBenDetailConfirmFormMetaData,
                        formMode
                      ) as MetaDataType
                    }
                    displayMode={formMode}
                    onSubmitHandler={{}}
                    initialValues={{
                      beneficiaryAcDetails: result?.[1]?.data,
                    }}
                    hideHeader={true}
                    containerstyle={{ padding: "0px !important" }}
                    formStyle={{
                      height: "65%",
                    }}
                  />
                  {isDeleteRemark && (
                    <RemarksAPIWrapper
                      TitleText={
                        "Enter Removal Remarks For RTGS BRANCH CONFIRMATION (MST/553)"
                      }
                      onActionNo={() => SetDeleteRemark(false)}
                      onActionYes={async (val, rows) => {
                        const buttonName = await MessageBox({
                          messageTitle: "Confirmation",
                          message: "Do You Want to delete this row?",
                          buttonNames: ["No", "Yes"],
                          defFocusBtnName: "Yes",
                          loadingBtnName: ["Yes"],
                        });
                        if (buttonName === "Yes") {
                          deleteBrMutation.mutate({
                            COMP_CD: result[0]?.data?.hdrData?.COMP_CD,
                            ENTERED_COMP_CD: result[0]?.data?.hdrData?.ENTERED_COMP_CD,
                            ENTERED_BRANCH_CD:
                              result[0]?.data?.hdrData?.ENTERED_BRANCH_CD,
                            TRAN_CD: result[0]?.data?.hdrData?.TRAN_CD,
                            ENTERED_BY: result[0]?.data?.hdrData?.ENTERED_BY,
                            BRANCH_CD:
                              result[0]?.data?.hdrData?.BRANCH_CD,
                            ACCT_TYPE: result[0]?.data?.hdrData?.ACCT_TYPE,
                            ACCT_CD: result[0]?.data?.hdrData?.ACCT_CD,
                            AMOUNT: result[0]?.data?.hdrData?.AMOUNT,
                            TRAN_DT: result[0]?.data?.hdrData?.TRAN_DT,
                            SLIP_NO: result[0]?.data?.hdrData?.SLIP_NO,
                            HO_CONFIRMED: result[0]?.data?.hdrData?.HO_CONFIRMED,
                            BR_CONFIRMED: result[0]?.data?.hdrData?.BR_CONFIRMED,
                            USER_DEF_REMARKS: val
                              ? val
                              : "WRONG ENTRY FROM RTGS BRANCH CONFIRMATION (MST/553)",

                            ACTIVITY_TYPE: "RTGS/NEFT Outward Confirmation",
                            DETAILS_DATA: {
                              isNewRow: [],
                              isDeleteRow: [
                                ...result?.[1]?.data
                              ],
                              isUpdatedRow: [],
                            },
                            _isDeleteRow: true,
                          });
                        }
                      }}
                      isEntertoSubmit={true}
                      AcceptbuttonLabelText="Ok"
                      CanceltbuttonLabelText="Cancel"
                      open={isDeleteRemark}
                      defaultValue={"WRONG ENTRY FROM RTGS BRANCH CONFIRMATION (MST/553)"
                      }
                      rows={undefined}
                    />
                  )}

                  {/* <>
                    {isChequeSign ? (
                      <>
                        <Dialog
                          fullWidth
                          maxWidth="md"
                          open={true} // Assuming this is controlled by a state
                          onKeyUp={(event) => {
                            if (event.key === "Escape") {
                              onClose();
                            }
                          }}
                          key="chequeSignDialog"
                          PaperProps={{
                            style: {
                              width: "100%",
                              // height: "78%",
                              // height: "70%",
                            },
                          }}
                        >
                          <AppBar position="relative" color="secondary">
                            <Toolbar
                              className={headerClasses.root}
                              variant={"dense"}
                            >
                              <Typography
                                className={headerClasses.title}
                                color="inherit"
                                variant={"h6"}
                                component="div"
                              >
                                Inward Return Confirmation
                              </Typography>
                              <GradientButton
                                onClick={() => {
                                  setIsChequeSign(false);
                                }}
                              >
                                Close
                              </GradientButton>
                            </Toolbar>
                          </AppBar>

                          {mutation.isLoading ? (
                            <LoaderPaperComponent />
                          ) : mutation.isError ? (
                            <Alert
                              severity="error"
                              errorMsg={
                                mutation.error?.error_msg ?? "Unknown error occured"
                              }
                              errorDetail={mutation.error?.error_detail ?? ""}
                            />
                          ) : (
                            <div style={{ paddingTop: 10 }}>
                              <ChequeSignImage
                                imgData={mutation?.data}
                              // isVisibleSign={isVisibleSign}
                              />
                            </div>
                          )}
                        </Dialog>
                      </>
                    ) : null}
                  </> */}


                  <>
                    {isOTP ? (
                      <>
                        <Dialog
                          fullWidth
                          maxWidth="sm"
                          open={true} // Assuming this is controlled by a state
                          onKeyUp={(event) => {
                            if (event.key === "Escape") {
                              onClose();
                            }
                          }}
                          key="rtgsConfirmDialog"
                          PaperProps={{
                            style: {
                              width: "36%",
                              // height: "78%",
                              // height: "70%",
                            },
                          }}
                        >
                          <AppBar
                            position="static"
                            sx={{
                              height: "auto",
                              background: "var(--theme-color5)",
                              margin: "10px",
                              width: "auto",
                            }}
                          >
                            <Toolbar>
                              <Typography
                                variant="h6"
                                style={{ flexGrow: 1 }}
                                sx={{
                                  fontWeight: 700,
                                  color: "var(--theme-color2)",
                                  fontSize: "1.2rem",
                                }}
                              >
                                RTGS HO Confirmation
                              </Typography>
                              <Box sx={{ display: 'flex', gap: 1, flexWrap: "wrap" }}>
                                <>

                                  {/* <GradientButton
                                    onClick={() => {
                                      setIsOTP(false)
                                      CloseMessageBox();
                                    }}
                                  >
                                    Close
                                  </GradientButton> */}
                                </>
                              </Box>
                            </Toolbar>
                          </AppBar>
                          <OTPModel
                            classes={classes} // Pass actual classes if needed
                            open={isOTP}
                            handleClose={() => {
                              setIsOTP(false)
                            }}
                            loginState={loginState}
                            VerifyOTP={VerifyOTP}
                            OTPError={loginState.OtpuserMessage}
                            setOTPError={(error) => {
                              dispatch({
                                type: "OTPVerificationFailed",
                                payload: { error: error, otpmodelclose: false },
                              });
                            }}
                            previousStep={() => {
                              setIsOTP(false)
                              CloseMessageBox()
                            }}
                            resendFlag="RN_HO_CONF"
                            marginCondition={"0"}
                          />
                        </Dialog>
                      </>
                    ) : null}
                  </>
                  <>
                    {isConfHistory ? (
                      <>
                        <Dialog
                          fullWidth
                          maxWidth="md"
                          open={true} // Assuming this is controlled by a state
                          onKeyUp={(event) => {
                            if (event.key === "Escape") {
                              onClose();
                            }
                          }}
                          key="rtgsConfirmDialog"
                          PaperProps={{
                            style: {
                              width: "100%",
                              // height: "78%",
                              // height: "70%",
                            },
                          }}
                        >
                          <GridWrapper
                            key={"rtgsBrOrHoConfirmGrid"}
                            finalMetaData={DualConfHistoryGridMetaData}
                            data={confHistory?.data ?? []}
                            setData={() => null}
                            loading={
                              confHistory.isLoading || confHistory.isFetching
                            }
                            actions={actions}
                            setAction={setCurrentAction}
                          />
                        </Dialog>
                      </>
                    ) : null}
                  </>
                </>
              )}
            </DialogContent>
          </Dialog>
        </>
        {/* )} */}
      </Fragment >
    );
  };

export const CtsOutwardClearingConfirmFormWrapper = ({
  flag,
  handleDialogClose,
  isDataChangedRef,
  handlePrev,
  handleNext,
  currentIndexRef,
  totalData,
}) => {
  const { state: rows } = useLocation();
  currentIndexRef.current = rows?.index;

  return (
    <ClearCacheProvider>
      <RtgsBranchHoConfirmationForm
        flag={flag}
        formMode={rows?.formMode}
        rowsData={rows?.gridData}
        onClose={handleDialogClose}
        handlePrev={handlePrev}
        handleNext={handleNext}
        currentIndex={rows.index}
        isDataChangedRef={isDataChangedRef}
        totalData={totalData}
      />
    </ClearCacheProvider>
  );
};