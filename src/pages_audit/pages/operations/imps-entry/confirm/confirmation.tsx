import { AppBar, Button } from "@mui/material";
import React, { useContext, useEffect, useRef, useState } from "react";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { t } from "i18next";
import { Route, Routes, useNavigate } from "react-router-dom";
import { RetrieveCfmData } from "../confirm/retrieveCfmData/retrieveCfmData";
import { impsCfmMetaData } from "./impsConfirmMetadata";
import { useMutation } from "react-query";
import { getImpsDetails } from "../api";
import { AuthContext } from "pages_audit/auth";
import { DayLimit } from "../dayLimit/dayLimit";
import {
  ActionTypes,
  Alert,
  MasterDetailsForm,
  MasterDetailsMetaData,
} from "@acuteinfo/common-base";
import PhotoSignWithHistory from "components/common/custom/photoSignWithHistory/photoSignWithHistory";
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const { authState } = useContext(AuthContext);
  const myRef = useRef<any>(null);

  const accountList: any = useMutation("getImpsDetails", getImpsDetails, {
    onSuccess: (data) => {
      console.log("<<<imps", data);
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

  const onSubmitHandler = async ({ data, displayData, endSubmit }) => {
    //@ts-ignore
    endSubmit(true);
  };

  return (
    <>
      {accountList?.isError && (
        <AppBar position="relative" color="primary">
          <Alert
            severity="error"
            errorMsg={accountList?.error?.error_msg ?? "Unknow Error"}
            errorDetail={accountList?.error?.error_detail ?? ""}
            color="error"
          />
        </AppBar>
      )}

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
        onSubmitData={onSubmitHandler}
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
                  <Button disabled={accountList?.isLoading} color="primary">
                    {t("Confirm")}
                  </Button>
                  <Button disabled={accountList?.isLoading} color="primary">
                    {t("Reject")}
                  </Button>
                  <Button disabled={accountList?.isLoading} color={"primary"}>
                    View Changes
                  </Button>
                  <Button disabled={accountList?.isLoading} color="primary">
                    {t("View All")}
                  </Button>
                  <Button disabled={accountList?.isLoading} color="primary">
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
