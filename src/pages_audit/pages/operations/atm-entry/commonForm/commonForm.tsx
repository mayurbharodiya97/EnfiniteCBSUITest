import {
  AppBar,
  Button,
  CircularProgress,
  Dialog,
  LinearProgress,
  Paper,
} from "@mui/material";
import React, { useContext, useEffect, useRef, useState } from "react";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { t } from "i18next";
import { Route, Routes, useNavigate } from "react-router-dom";
import Draggable from "react-draggable";
import PhotoSignWithHistory from "components/custom/photoSignWithHistory/photoSignWithHistory";
import { useMutation } from "react-query";
import { AuthContext } from "pages_audit/auth";
import { commonFormMetaData } from "./commonFormMetadata";
import { CardPrinting } from "../cardPrinting";
import { RetrieveCfmData } from "../confirm/retrieveCfmData/retrieveCfmData";
import JointDetails from "../../DailyTransaction/TRNHeaderTabs/JointDetails";
import {
  confirmData,
  crudData,
  getATMcardDetails,
  validateInsertData,
} from "../api";
import { format } from "date-fns";
import { CardDetails } from "../cardDetails/cardDetails";
import { RetrieveData } from "../retrieveData/retrieveData";
import { AtmEntryMetaData } from "./metaData/atmEntryMetadata";
import { atmentrymetadata } from "./metaData/atmEntryMetadata2";
import { enqueueSnackbar } from "notistack";
import { LinearProgressBarSpacer } from "components/common/custom/linerProgressBarSpacer";
import {
  ActionTypes,
  Alert,
  MasterDetailsForm,
  MasterDetailsMetaData,
  usePopupContext,
} from "@acuteinfo/common-base";
const CommonForm = (props) => {
  const actions: ActionTypes[] = [
    {
      actionName: "card-details",
      actionLabel: "Add",
      multiple: false,
      rowDoubleClick: true,
      alwaysAvailable: true,
    },
    {
      actionName: "delete-details",
      actionLabel: "Delete",
      multiple: false,
      rowDoubleClick: false,
      alwaysAvailable: false,
      shouldExclude: (data) => {
        if (
          data?.[0]?.data?.EDIT_STATUS &&
          data?.[0]?.data?.EDIT_STATUS === "N"
        ) {
          return true;
        } else {
          if (
            data?.[0]?.data?.ALLOW_DELETE &&
            data?.[0]?.data?.ALLOW_DELETE !== "Y"
          ) {
            return true;
          } else {
            return false;
          }
        }
      },
    },
  ];

  const navigate = useNavigate();
  let { parameter, FLAG } = props;
  const [isData, setIsData] = useState<any>({
    cardData: {},
    isVisible: false,
    isOpenCard: false,
    closeAlert: true,
    uniqueNo: 0,
  });

  const [retrieveData, setRetrieveData] = useState<any>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [formMode, setFormMode] = useState<any>("add");
  const myRef = useRef<any>(null);
  const { authState } = useContext(AuthContext);
  const { MessageBox, CloseMessageBox } = usePopupContext();

  const masterCommonFormMetaData = {
    ...commonFormMetaData,
    masterForm: {
      ...commonFormMetaData.masterForm,
      fields:
        parameter?.PARA_602 === "Y" || FLAG === "C"
          ? AtmEntryMetaData.fields
          : parameter?.PARA_602 === "N"
          ? atmentrymetadata.fields
          : [],
    },
  };

  const cardDetails: any = useMutation(
    "getATMcardDetails",
    () =>
      getATMcardDetails({
        A_COMP_CD: authState?.companyID,
        A_BRANCH_CD: authState?.user?.branchCode,
        A_TRAN_CD: retrieveData?.[currentIndex]?.TRAN_CD,
      }),
    {
      onSuccess(data) {
        let newData: any = [];
        if (Array.isArray(data) && data?.length > 0) {
          newData = data.map((item) => {
            return {
              ...item,
              EDIT_STATUS: retrieveData?.[currentIndex]?.EDIT_STATUS,
              ID_SR_NO: item?.SR_CD,
            };
          });
        }
        myRef.current?.setGridData(newData);
      },
      onError() {
        setIsData((old) => ({
          ...old,
          closeAlert: true,
        }));
      },
    }
  );

  const atmConfirmation: any = useMutation("confirmData", confirmData, {
    onSuccess(data, variables) {
      CloseMessageBox();
      if (Boolean(variables?._isConfrimed)) {
        enqueueSnackbar(t("DataConfirmMessage"), { variant: "success" });
      } else if (!Boolean(variables?._isConfrimed)) {
        enqueueSnackbar(t("DataRejectMessage"), { variant: "success" });
      }
      setRetrieveData((old) => {
        return old.filter((item) => item?.TRAN_CD !== variables?.TRAN_CD);
      });
    },
    onError() {
      setIsData((old) => ({
        ...old,
        closeAlert: true,
      }));
    },
  });

  const confirmedData = async ({ flag }) => {
    let buttonName = await MessageBox({
      messageTitle: "Confirmation",
      message: "Are you sure to proceed",
      buttonNames: ["Yes", "No"],
      loadingBtnName: ["Yes"],
    });
    if (buttonName === "Yes") {
      atmConfirmation.mutate({
        _isConfrimed: flag === "cfm" ? true : flag === "rj" ? false : "",
        ENTERED_BRANCH_CD: retrieveData?.[currentIndex]?.ENTERED_BRANCH_CD,
        ENTERED_COMP_CD: retrieveData?.[currentIndex]?.ENTERED_COMP_CD,
        TRAN_CD: retrieveData?.[currentIndex]?.TRAN_CD,
      });
    }
  };

  const validateInsert: any = useMutation(
    "validateInsertData",
    validateInsertData,
    {
      onError() {
        setIsData((old) => ({ ...old, closeAlert: true }));
      },
    }
  );

  const crudAtmData: any = useMutation("crudData", crudData, {
    onSuccess(data, variables) {
      if (variables?._isNewRow) {
        setIsData((old) => ({ ...old, isVisible: false }));
        myRef?.current?.handleFormReset({ preventDefault: () => {} });
        enqueueSnackbar(t("RecordInsertedMsg"), { variant: "success" });
      } else if (variables?.DETAILS_DATA?.isNewRow?.length) {
        enqueueSnackbar(t("RecordInsertedMsg"), { variant: "success" });
      } else if (variables?._isUpdateRow) {
        enqueueSnackbar(t("RecordUpdatedMsg"), { variant: "success" });
      }
      CloseMessageBox();
    },
    onError(error) {
      CloseMessageBox();
      setIsData((old) => ({ ...old, closeAlert: true }));
    },
  });

  const changeIndex = (direction) => {
    setCurrentIndex((prevIndex) => {
      if (direction === "next") {
        return prevIndex === retrieveData?.length - 1 ? 0 : prevIndex + 1;
      } else {
        return prevIndex === 0 ? retrieveData?.length - 1 : prevIndex - 1;
      }
    });
  };

  const onSubmitHandler = async ({ data, endSubmit }) => {
    console.log("<<<osubbbb", data);
    let insertdata = {
      ...data,
      _isDeleteRow: false,
      _isUpdateRow: data?._isNewRow ? false : true,
      SMS_ALERT: data?.SMS_ALERT === true ? "Y" : "N",
    };

    let result = myRef?.current?.GetGirdData?.();
    let gridData =
      result?.length > 0
        ? result.map((item) => {
            return {
              ...item,
              REQ_DT: item?.REQ_DT
                ? format(new Date(item?.REQ_DT), "dd/MMM/yyyy")
                : "",
              ISSUE_DT: item?.ISSUE_DT
                ? format(new Date(item?.ISSUE_DT), "dd/MMM/yyyy")
                : "",
              EXPIRE_DT: item?.EXPIRE_DT
                ? format(new Date(item?.EXPIRE_DT), "dd/MMM/yyyy")
                : "",
              DEACTIVE_DT: item?.DEACTIVE_DT
                ? format(new Date(item?.DEACTIVE_DT), "dd/MMM/yyyy")
                : "",
            };
          })
        : [];

    let apiReq = {
      CUSTOMER_ID: data?.CUSTOMER_ID,
      ACCT_NM: data?.ACCT_NM,
      ACCT_CD: data?.ACCT_CD,
      SB_ACCT_CD: data?.SB_ACCT_CD ?? "",
      CA_ACCT_CD: data?.CA_ACCT_CD ?? "",
      CC_ACCT_CD: data?.CC_ACCT_CD ?? "",
      PARA_601: parameter?.PARA_601,
      PARA_602: parameter?.PARA_602,
      PARA_604: parameter?.PARA_604,
      PARA_100: parameter?.PARA_100,
      PARA_336: parameter?.PARA_336,
      ENTRY_FLAG: retrieveData?.length ? "M" : "F",
      SCREEN_REF: "MST/846",
      DTL_DATA: gridData,
    };
    validateInsert.mutate(apiReq, {
      onSuccess: async (data) => {
        //@ts-ignore
        endSubmit(true);
        const messagebox = async (msgTitle, msg, buttonNames, status) => {
          let buttonName = await MessageBox({
            messageTitle: msgTitle,
            message: msg,
            buttonNames: buttonNames,
            loadingBtnName: ["Yes"],
          });
          return { buttonName, status };
        };
        if (data?.length) {
          for (let i = 0; i < data?.length; i++) {
            let btnName = await messagebox(
              data[i]?.O_STATUS === "999"
                ? "validation fail"
                : data[i]?.O_STATUS === "0"
                ? "Confirmation"
                : "ALert message",
              data[i]?.O_STATUS === "0"
                ? "Are you sure to proceed"
                : data[i]?.O_MESSAGE,

              data[i]?.O_STATUS === "99" || data[i]?.O_STATUS === "0"
                ? ["Yes", "No"]
                : ["Ok"],
              data[i]?.O_STATUS
            );
            if (btnName.buttonName === "No") {
              return;
            } else if (btnName.buttonName === "Yes" || btnName.status === "0") {
              crudAtmData.mutate(insertdata);
            }
          }
        }
      },
      onError() {
        //@ts-ignore
        endSubmit(true);
      },
    });
  };

  const filterData: any = async ({ flag }) => {
    // if (flag === "all") {
    //   if (Array.isArray(rows) && rows?.length) {
    //     setRetrieveData(rows);
    //   }
    // } else if (flag === "refresh") {
    //   if (Array.isArray(rowsData) && rowsData?.length) {
    //     let refreshData = rowsData.filter(
    //       (item) => item?.data?.CONFIRMED === "N"
    //     );
    //     setRetrieveData(refreshData);
    //   }
    // }
  };

  useEffect(() => {
    if (retrieveData?.length) {
      setIsData((old) => ({ ...old, cardData: retrieveData?.[currentIndex] }));
      cardDetails.mutate();
    }
  }, [retrieveData, currentIndex]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "s" && event.ctrlKey) {
        event.preventDefault();
        // formRef?.current?.handleSubmit({ preventDefault: () => {} }, "Save");
      } else if (event.key === "r" && event.ctrlKey) {
        event.preventDefault();
        navigate("retrieve-form");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const deleteData: any = async ({ FLAG, DATA }) => {
    const formdata = await myRef?.current?.getFieldData();
    const gridData = await myRef?.current?.GetGirdData();

    let buttonName = await MessageBox({
      messageTitle: "Confirmation",
      message: "Are you sure to proceed",
      buttonNames: ["Yes", "No"],
      loadingBtnName: ["Yes"],
    });

    if (buttonName === "Yes") {
      let apiReq = {
        _isNewRow: false,
        _isDeleteRow: FLAG === "R" ? false : true,
        _isUpdateRow: false,
        ENTERED_BRANCH_CD: formdata?.ENTERED_BRANCH_CD,
        ENTERED_COMP_CD: formdata?.ENTERED_COMP_CD,
        TRAN_CD: formdata?.TRAN_CD,
        CONFIRMED: formdata?.CONFIRMED,
        DETAILS_DATA: {
          isNewRow: [],
          isDeleteRow:
            FLAG === "R" ? [DATA] : FLAG === "M" ? gridData ?? [] : [],
          isUpdatedRow: [],
        },
      };

      crudAtmData.mutate(apiReq, {
        onSuccess(data, variables) {
          CloseMessageBox();

          if (variables?._isDeleteRow) {
            // setIsData((old) => ({ ...old, isVisible: false }));

            setFormMode("add");
            setRetrieveData(null);
            myRef.current?.setGridData();
            setIsData(() => {});
            // setIsData((old) => ({
            //   ...old,
            //   closeAlert: false,
            //   cardData: {},
            // }));
            myRef?.current?.handleFormReset({ preventDefault: () => {} });
            enqueueSnackbar(t("RecordRemovedMsg"), { variant: "success" });
          } else if (variables?.DETAILS_DATA?.isDeleteRow?.length) {
            enqueueSnackbar(t("RecordRemovedMsg"), { variant: "success" });
            cardDetails.mutate({
              A_COMP_CD: authState?.companyID,
              A_BRANCH_CD: authState?.user?.branchCode,
              A_TRAN_CD: retrieveData?.[currentIndex]?.TRAN_CD,
            });
          }
        },
      });
    }
  };

  return (
    <>
      {validateInsert?.isLoading ? (
        <LinearProgress color="secondary" />
      ) : (validateInsert?.isError && isData.closeAlert) ||
        (crudAtmData?.isError && isData.closeAlert) ||
        (atmConfirmation?.isError && atmConfirmation.closeAlert) ||
        (cardDetails?.isError && isData.closeAlert) ? (
        <AppBar position="relative" color="primary">
          <Alert
            severity="error"
            errorMsg={
              validateInsert?.error?.error_msg ??
              crudAtmData?.error?.error_msg ??
              atmConfirmation?.error?.error_msg ??
              cardDetails?.error?.error_msg ??
              "Unknow Error"
            }
            errorDetail={
              validateInsert?.error?.error_detail ??
              crudAtmData?.error?.error_detail ??
              atmConfirmation?.error?.error_detail ??
              cardDetails?.error?.error_detail ??
              ""
            }
            color="error"
          />
        </AppBar>
      ) : (
        <LinearProgressBarSpacer />
      )}
      <MasterDetailsForm
        key={
          "atm-form" + formMode + retrieveData + currentIndex + isData?.uniqueNo
        }
        metaData={masterCommonFormMetaData as MasterDetailsMetaData}
        isNewRow={formMode === "add" ? true : false}
        initialData={{
          _isNewRow: formMode === "add" ? true : false,
          ...retrieveData?.[currentIndex],
          TOTAL:
            retrieveData?.length &&
            `\u00A0 ${currentIndex + 1} of ${retrieveData?.length}`,
          DETAILS_DATA: formMode === "add" ? [] : myRef.current?.GetGirdData(),
        }}
        formState={{
          MessageBox: MessageBox,
          parameter: {
            ...parameter,
            FORM_MODE: formMode,
            USER_ROLE: authState?.role,
          },
        }}
        displayMode={FLAG === "C" ? "view" : formMode}
        isDetailRowRequire={false}
        onSubmitData={onSubmitHandler}
        setDataOnFieldChange={(action, payload) => {
          if (action === "RES_DATA") {
            setIsData((old) => ({
              ...old,
              cardData: payload?.validateData,
              isVisible: payload?.isVisible,
            }));
          }
        }}
        onFormButtonClickHandel={() => {
          if (!isData?.isOpenCard) {
            setIsData((old) => ({ ...old, isOpenCard: true }));
          }
        }}
        actions={FLAG === "C" ? [] : actions}
        handelActionEvent={(data) => {
          if (data?.name === "card-details") {
            navigate(data?.name, {
              state: {
                rows: data?.rows,
                retrieveData: retrieveData?.[currentIndex],
              },
            });
          } else if (data?.name === "delete-details") {
            if (
              data?.rows?.[0]?.data?.TRAN_CD &&
              !data?.rows?.[0]?.data?.ID_NO
            ) {
              deleteData({ FLAG: "R", DATA: data?.rows?.[0]?.data });
            } else {
              myRef.current?.setGridData((old) => {
                let deleteData = old?.filter(
                  (item) => item !== data?.rows?.[0]?.data
                );
                return deleteData;
              });
            }
          }
        }}
        // onClickActionEvent={(index, id, data) => {
        // if (data?.TRAN_CD && !data?.ID_NO) {
        //   deleteData({ FLAG: "R", DATA: data });
        // } else {
        //   myRef.current?.setGridData((old) => {
        //     let deleteData = old?.filter((item) => item !== data);
        //     return [deleteData];
        //   });
        // }
        // }}
        isLoading={cardDetails?.isLoading || cardDetails?.isFetching}
        formStyle={{
          background: "white",
          height: "calc(100vh - 403px)",
          overflowY: "auto",
          overflowX: "hidden",
        }}
        ref={myRef}
      >
        {({ isSubmitting, handleSubmit }) => {
          return (
            <>
              <Button
                sx={{
                  display:
                    formMode === "view" && retrieveData?.length > 0
                      ? "inline-flex"
                      : "none",
                }}
                startIcon={<ArrowBackIosNewIcon />}
                disabled={
                  1 === currentIndex + 1 ||
                  cardDetails?.isLoading ||
                  cardDetails?.isFetching ||
                  validateInsert?.isLoading
                }
                onClick={() => changeIndex("previous")}
                color={"primary"}
              >
                {t("Prev")}
              </Button>
              <Button
                sx={{
                  display:
                    formMode === "view" && retrieveData?.length > 0
                      ? "inline-flex"
                      : "none",
                }}
                endIcon={<ArrowForwardIosIcon />}
                disabled={
                  currentIndex + 1 === retrieveData?.length ||
                  cardDetails?.isLoading ||
                  cardDetails?.isFetching ||
                  validateInsert?.isLoading
                }
                onClick={() => changeIndex("next")}
                color={"primary"}
              >
                {t("Next")}
              </Button>

              <Button
                sx={{
                  display:
                    FLAG === "C" && retrieveData?.length > 0
                      ? "inline-flex"
                      : "none",
                }}
                disabled={validateInsert?.isLoading}
                color="primary"
                onClick={() => confirmedData({ flag: "cfm" })}
              >
                {t("Confirm")}
              </Button>
              <Button
                sx={{
                  display:
                    FLAG === "C" && retrieveData?.length > 0
                      ? "inline-flex"
                      : "none",
                }}
                disabled={validateInsert?.isLoading}
                color="primary"
                onClick={() => confirmedData({ flag: "rj" })}
              >
                {t("Reject")}
              </Button>
              <Button
                sx={{
                  display:
                    FLAG !== "C" && retrieveData?.length > 0
                      ? "inline-flex"
                      : "none",
                }}
                onClick={() =>
                  setFormMode(formMode === "edit" ? "view" : "edit")
                }
                disabled={validateInsert?.isLoading}
                color={"primary"}
              >
                {formMode === "edit" ? t("View") : t("Edit")}
              </Button>
              <Button
                sx={{
                  display:
                    FLAG !== "C" && retrieveData?.length > 0
                      ? "inline-flex"
                      : "none",
                }}
                onClick={() => {
                  setFormMode("add");
                  setRetrieveData(null);
                  myRef.current?.setGridData();
                  setIsData((old) => ({
                    ...old,
                    closeAlert: false,
                    cardData: {},
                  }));
                }}
                disabled={validateInsert?.isLoading}
                color={"primary"}
              >
                {t("New")}
              </Button>
              <Button
                sx={{
                  display:
                    FLAG === "C" && retrieveData?.length > 0
                      ? "inline-flex"
                      : "none",
                }}
                disabled={validateInsert?.isLoading}
                color={"primary"}
              >
                View Changes
              </Button>
              <Button
                sx={{
                  display:
                    FLAG === "C" && retrieveData?.length > 0
                      ? "inline-flex"
                      : "none",
                }}
                onClick={() => filterData({ flag: "all" })}
                disabled={validateInsert?.isLoading}
                color="primary"
              >
                {t("View All")}
              </Button>
              <Button
                sx={{
                  display:
                    FLAG === "C" && retrieveData?.length > 0
                      ? "inline-flex"
                      : "none",
                }}
                onClick={() => filterData({ flag: "refresh" })}
                disabled={validateInsert?.isLoading}
                color="primary"
              >
                {t("Refresh")}
              </Button>

              <Button
                sx={{
                  display:
                    isData?.isVisible || retrieveData?.length
                      ? "inline-flex"
                      : "none",
                }}
                onClick={() => navigate("joint-details")}
                disabled={validateInsert?.isLoading}
                color={"primary"}
              >
                {t("JointDetails")}
              </Button>
              <Button
                sx={{
                  display:
                    isData?.isVisible || retrieveData?.length
                      ? "inline-flex"
                      : "none",
                }}
                color="primary"
                disabled={validateInsert?.isLoading}
                onClick={() => navigate("photo-sign")}
              >
                {t("PhotoSign")}
              </Button>

              <Button
                sx={{
                  display:
                    FLAG !== "C" && retrieveData?.length > 0
                      ? "inline-flex"
                      : "none",
                }}
                onClick={() => deleteData({ FLAG: "M" })}
                disabled={validateInsert?.isLoading}
                color={"primary"}
              >
                {t("Delete")}
              </Button>
              <Button
                // sx={{ display: FLAG !== "C" ? "inline-flex" : "none" }}
                onClick={() =>
                  navigate(FLAG === "C" ? "retrieve-cfm-form" : "retrieve-form")
                }
                disabled={validateInsert?.isLoading}
                color={"primary"}
              >
                {t("Retrieve")}
              </Button>
              <Button
                sx={{
                  display: FLAG !== "C" ? "inline-flex" : "none",
                }}
                color={"primary"}
                onClick={(event) => handleSubmit(event, "BUTTON_CLICK")}
                disabled={validateInsert?.isLoading}
                // endIcon={
                //   mutation?.isLoading ? <CircularProgress size={20} /> : null
                // }
              >
                {t("Save")}
              </Button>
            </>
          );
        }}
      </MasterDetailsForm>
      <Routes>
        <Route
          path="card-details/*"
          element={
            <CardDetails
              navigate={navigate}
              parameter={parameter}
              myRef={myRef}
            />
          }
        />
        <Route
          path="retrieve-form/*"
          element={
            <RetrieveData
              navigate={navigate}
              parameter={parameter}
              setFormMode={setFormMode}
              setRetrieveData={setRetrieveData}
              setIsData={setIsData}
              myRef={myRef}
            />
          }
        />
        <Route
          path="photo-sign/*"
          element={
            <PhotoSignWithHistory
              data={isData?.cardData ?? {}}
              onClose={() => navigate(".")}
              screenRef={"MST/846"}
            />
          }
        />
        <Route
          path="joint-details/*"
          element={
            <Dialog
              open={true}
              fullWidth={true}
              PaperProps={{
                style: {
                  maxWidth: "1130px",
                  padding: "5px",
                },
              }}
              PaperComponent={(props) => (
                <Draggable
                  handle="#draggable-dialog-title"
                  cancel={'[class*="MuiDialogContent-root"]'}
                >
                  <Paper {...props} />
                </Draggable>
              )}
            >
              <div id="draggable-dialog-title">
                <JointDetails
                  reqData={{
                    COMP_CD: isData?.cardData?.COMP_CD,
                    BRANCH_CD: isData?.cardData?.BRANCH_CD,
                    ACCT_TYPE: isData?.cardData?.ACCT_TYPE,
                    ACCT_CD: isData?.cardData?.ACCT_CD,
                    BTN_FLAG: "Y",
                  }}
                />
              </div>
            </Dialog>
          }
        />
        <Route
          path="retrieve-cfm-form/*"
          element={
            <RetrieveCfmData
              onClose={() => navigate(".")}
              navigate={navigate}
              setRetrieveData={setRetrieveData}
              setFormMode={setFormMode}
            />
          }
        />
      </Routes>
      {isData?.isOpenCard && (
        <CardPrinting cardData={isData.cardData} setIsData={setIsData} />
      )}
    </>
  );
};

export default CommonForm;
