import { AppBar, Button } from "@mui/material";
import React, { useContext, useEffect, useRef, useState } from "react";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { t } from "i18next";
import { Route, Routes, useNavigate } from "react-router-dom";
import { RetrieveCfmData } from "../confirm/retrieveCfmData/retrieveCfmData";
import { impsCfmMetaData } from "./impsConfirmMetadata";
import { useMutation } from "react-query";
import { confirmIMPSdata, getImpsDetails } from "../api";
import { AuthContext } from "pages_audit/auth";
import { DayLimit } from "../dayLimit/dayLimit";
import {
  ActionTypes,
  Alert,
  MasterDetailsForm,
  MasterDetailsMetaData,
  usePopupContext,
} from "@acuteinfo/common-base";
import PhotoSignWithHistory from "components/common/custom/photoSignWithHistory/photoSignWithHistory";
import { enqueueSnackbar } from "notistack";
const ImpsConfirmation = () => {
  const actions: ActionTypes[] = [
    {
      actionName: "daylimit-form",
      actionLabel: "Add",
      multiple: false,
      rowDoubleClick: true,
      alwaysAvailable: false,
    },
  ];
  const navigate = useNavigate();
  const [retrieveData, setRetrieveData] = useState<any>();
  const [filteredData, setFilteredData] = useState<any>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const myRef = useRef<any>(null);

  const confirmIMPS: any = useMutation("confirmIMPSdata", confirmIMPSdata, {
    onSuccess: (data, variables) => {
      CloseMessageBox();

      if (data?.[0]?.STATUS === "999") {
        MessageBox({
          messageTitle: "InvalidConfirmation",
          message: data?.message || data?.[0]?.MESSAGE,
          icon: "ERROR",
        });
      } else {
        const updateConfirmation = (data) => {
          data.map((old) => {
            if (old?.TRAN_CD === variables?.TRAN_CD) {
              return { ...old, CONFIRMED: variables?._isConfrimed ? "Y" : "N" };
            }
            return old;
          });
        };

        setFilteredData(updateConfirmation);
        setRetrieveData(updateConfirmation);

        enqueueSnackbar(
          t(
            variables?._isConfrimed ? "DataConfirmMessage" : "DataRejectMessage"
          ),
          { variant: "success" }
        );
      }
    },
    onError() {
      CloseMessageBox();
    },
  });

  const confirmation = async (flag) => {
    let buttonName = await MessageBox({
      messageTitle: t("confirmation"),
      message:
        flag === "C" ? t("AreYouSureToConfirm") : t("AreYouSureToReject"),
      defFocusBtnName: "Yes",
      buttonNames: ["Yes", "No"],
      loadingBtnName: ["Yes"],
      icon: "WARNING",
    });
    if (buttonName === "Yes") {
      let apiReq = {
        _isConfrimed: flag === "C" ? true : false,
        ENTERED_BRANCH_CD: retrieveData?.[currentIndex]?.ENTERED_BRANCH_CD,
        ENTERED_COMP_CD: retrieveData?.[currentIndex]?.ENTERED_COMP_CD,
        TRAN_CD: retrieveData?.[currentIndex]?.TRAN_CD,
      };
      confirmIMPS.mutate(apiReq);
    }
  };

  const accountList: any = useMutation("getImpsDetails", getImpsDetails, {
    onSuccess: (data) => {
      myRef.current?.setGridData(data ?? []);
    },
  });
  useEffect(() => {
    if (retrieveData?.length) {
      accountList.mutate({
        ENT_COMP_CD: retrieveData?.[currentIndex]?.ENTERED_COMP_CD,
        ENT_BRANCH_CD: retrieveData?.[currentIndex]?.ENTERED_BRANCH_CD,
        TRAN_CD: retrieveData?.[currentIndex]?.TRAN_CD,
      });
    }
  }, [retrieveData, currentIndex]);

  const changeIndex = (direction) => {
    setCurrentIndex((prevIndex) => {
      if (direction === "next") {
        return prevIndex === retrieveData?.length - 1 ? 0 : prevIndex + 1;
      } else {
        return prevIndex === 0 ? retrieveData?.length - 1 : prevIndex - 1;
      }
    });
  };
  useEffect(() => {
    navigate("retrieve-cfm-form");
  }, []);

  const filerData = (flag) => {
    if (flag === "REFRESH") {
      let refreshData = retrieveData?.filter(
        (item) => item.CONFIRMED !== "Y" && item.CONFIRMED !== "R"
      );
      setRetrieveData(refreshData);
    } else if (flag === "VIEW_ALL") {
      setRetrieveData(filteredData);
    }
  };
  return (
    <>
      {accountList?.isError ||
        (confirmIMPS?.isError && (
          <AppBar position="relative" color="primary">
            <Alert
              severity="error"
              errorMsg={
                accountList?.error?.error_msg ??
                confirmIMPS?.error?.error_msg ??
                "Unknow Error"
              }
              errorDetail={
                accountList?.error?.error_detail ??
                confirmIMPS?.error?.error_detail ??
                ""
              }
              color="error"
            />
          </AppBar>
        ))}

      <MasterDetailsForm
        key={"imps-cfm-form" + retrieveData + currentIndex}
        metaData={impsCfmMetaData as MasterDetailsMetaData}
        initialData={{
          ...retrieveData?.[currentIndex],
          TOTAL:
            retrieveData?.length &&
            `\u00A0 ${currentIndex + 1} of ${retrieveData?.length}`,
          // DETAILS_DATA: myRef.current?.GetGirdData(),
        }}
        displayMode={"view"}
        isDetailRowRequire={false}
        onSubmitData={() => {}}
        isLoading={accountList?.isLoading || accountList?.isFetching}
        actions={actions}
        handelActionEvent={(data) => {
          if (data?.name === "daylimit-form") {
            navigate(data?.name, {
              state: { ...data?.rows?.[0]?.data, FLAG: "C" },
            });
          }
        }}
        formStyle={{
          background: "white",
          height: "calc(100vh - 537px)",
          overflowY: "auto",
          overflowX: "hidden",
        }}
        ref={myRef}
      >
        {({ isSubmitting, handleSubmit }) => {
          return (
            <>
              {retrieveData?.length > 0 && (
                <>
                  <Button
                    startIcon={<ArrowBackIosNewIcon />}
                    disabled={1 === currentIndex + 1 || accountList?.isLoading}
                    onClick={() => changeIndex("previous")}
                    color={"primary"}
                  >
                    {t("Prev")}
                  </Button>
                  <Button
                    endIcon={<ArrowForwardIosIcon />}
                    disabled={
                      currentIndex + 1 === retrieveData?.length ||
                      accountList?.isLoading
                    }
                    onClick={() => changeIndex("next")}
                    color={"primary"}
                  >
                    {t("Next")}
                  </Button>
                  <Button
                    disabled={
                      accountList?.isLoading ||
                      retrieveData?.[currentIndex]?.CONFIRMED !== "N"
                    }
                    onClick={() => {
                      confirmation("C");
                    }}
                    color="primary"
                  >
                    {t("Confirm")}
                  </Button>
                  <Button
                    disabled={
                      accountList?.isLoading ||
                      retrieveData?.[currentIndex]?.CONFIRMED !== "N"
                    }
                    onClick={() => {
                      confirmation("R");
                    }}
                    color="primary"
                  >
                    {t("Reject")}
                  </Button>
                  <Button disabled={accountList?.isLoading} color={"primary"}>
                    View Changes
                  </Button>
                  <Button
                    disabled={accountList?.isLoading}
                    onClick={() => filerData("VIEW_ALL")}
                    color="primary"
                  >
                    {t("View All")}
                  </Button>
                  <Button
                    disabled={accountList?.isLoading}
                    onClick={() => filerData("REFRESH")}
                    color="primary"
                  >
                    {t("Refresh")}
                  </Button>
                  <Button
                    disabled={accountList?.isLoading}
                    color="primary"
                    onClick={() => navigate("photo-sign")}
                  >
                    {t("PhotoSign")}
                  </Button>
                </>
              )}
              <Button
                disabled={accountList?.isLoading}
                onClick={() => navigate("retrieve-cfm-form")}
                color={"primary"}
              >
                {t("Retrieve")}
              </Button>
            </>
          );
        }}
      </MasterDetailsForm>
      <Routes>
        <Route
          path="photo-sign/*"
          element={
            <PhotoSignWithHistory
              data={retrieveData?.[currentIndex] ?? {}}
              onClose={() => navigate(".")}
              screenRef={"MST/844"}
            />
          }
        />
        <Route
          path="retrieve-cfm-form/*"
          element={
            <RetrieveCfmData
              onClose={() => navigate(".")}
              navigate={navigate}
              setRetrieveData={setRetrieveData}
              setFilteredData={setFilteredData}
            />
          }
        />
        <Route
          path="daylimit-form/*"
          element={<DayLimit navigate={navigate} />}
        />
      </Routes>
    </>
  );
};

export default ImpsConfirmation;
