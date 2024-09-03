import { Button, CircularProgress, Dialog, Paper } from "@mui/material";
import { MasterDetailsForm } from "components/formcomponent";
import React, { useContext, useEffect, useState } from "react";
import { MasterDetailsMetaData } from "components/formcomponent/masterDetails/types";
import { atmConfirmMetaData } from "./confirmMetadata";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { t } from "i18next";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { RetrieveCfmData } from "./retrieveCfmData/retrieveCfmData";
import Draggable from "react-draggable";
import JointDetails from "../../DailyTransaction/TRNHeaderTabs/JointDetails";
import PhotoSignWithHistory from "components/custom/photoSignWithHistory/photoSignWithHistory";
import { CardPrinting } from "../cardPrinting";
import { ClearCacheProvider } from "cache";
import * as API from "../api";
import { useQuery } from "react-query";
import { AuthContext } from "pages_audit/auth";

const ConfirmationCustom = () => {
  const [isData, setIsData] = useState<any>({
    cardData: {},
    gridData: [],
    isOpenCard: false,
    uniqueNo: 0,
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  const { state: rows }: any = useLocation();
  const { authState } = useContext(AuthContext);
  const [rowsData, setRowsData] = useState<any>();

  console.log("<<<location", rowsData, rowsData?.[currentIndex]?.data?.TRAN_CD);

  const { isError, error, isFetching, isLoading, isSuccess, refetch } =
    useQuery<any, any>(
      ["getNotificationData"],
      () =>
        API.getATMcardDetails({
          A_COMP_CD: authState?.companyID,
          A_BRANCH_CD: authState?.user?.branchCode,
          A_TRAN_CD: rowsData?.[currentIndex]?.data?.TRAN_CD,
        }),
      {
        enabled: !!rowsData?.[currentIndex]?.data?.TRAN_CD,
        onSuccess(data) {
          setIsData((old) => ({
            ...old,
            gridData: data,
            uniqueNo: Date.now(),
          }));
        },
      }
    );

  const changeIndex = (direction) => {
    refetch();
    setCurrentIndex((prevIndex) => {
      if (direction === "next") {
        return prevIndex === rowsData.length - 1 ? 0 : prevIndex + 1;
      } else {
        return prevIndex === 0 ? rowsData.length - 1 : prevIndex - 1;
      }
    });
  };

  const filterData: any = async ({ flag, retrieveData, updateData }) => {
    console.log(
      "<<<flag, retrieveData, updateData",
      flag,
      retrieveData,
      updateData,
      rowsData
    );
    if (flag === "all") {
      if (Array.isArray(rows) && rows?.length) {
        setRowsData(rows);
      }
    } else if (flag === "refresh") {
      if (Array.isArray(rowsData) && rowsData?.length) {
        let refreshData = rowsData.filter(
          (item) => item?.data?.CONFIRMED === "N"
        );
        setRowsData(refreshData);
      }
    }
  };

  useEffect(() => {
    if (rowsData?.length) {
      setIsData((old) => ({
        ...old,
        cardData: rowsData?.[currentIndex]?.data,
      }));
    }
  }, [rowsData, currentIndex]);

  useEffect(() => {
    navigate("retrieve-form");
  }, []);

  const onSubmitHandler = ({ data, displayData, endSubmit, setFieldError }) => {
    //@ts-ignore
    endSubmit(true);
  };
  return (
    <>
      <MasterDetailsForm
        key={"atm-Confirmation" + rowsData + currentIndex + isData?.uniqueNo}
        metaData={atmConfirmMetaData as MasterDetailsMetaData}
        initialData={{
          ...rowsData?.[currentIndex]?.data,
          TOTAL: rowsData?.length
            ? `\u00A0 ${currentIndex + 1} of ${rowsData?.length}`
            : null,
          DETAILS_DATA: isData?.gridData,
        }}
        displayMode={"view"}
        isLoading={isLoading || isFetching}
        isError={isError}
        errorObj={error}
        onSubmitData={onSubmitHandler}
        onFormButtonClickHandel={() => {
          if (!isData?.isOpenCard) {
            setIsData((old) => ({ ...old, isOpenCard: true }));
          }
        }}
        formStyle={{
          background: "white",
          // height: "20vh",
          overflowY: "auto",
          overflowX: "hidden",
          padding: "5px",
        }}
      >
        {({ isSubmitting, handleSubmit }) => {
          return (
            <>
              <Button color="primary">{t("Confirm")}</Button>
              <Button color="primary">{t("Reject")}</Button>
              <Button
                onClick={() => filterData({ flag: "all" })}
                color="primary"
              >
                {t("View All")}
              </Button>
              <Button
                onClick={() => filterData({ flag: "refresh" })}
                color="primary"
              >
                {t("Refresh")}
              </Button>

              {rowsData?.length > 1 && (
                <>
                  <Button
                    startIcon={<ArrowBackIosNewIcon />}
                    disabled={1 === currentIndex + 1 || isLoading || isFetching}
                    onClick={() => changeIndex("previous")}
                    color={"primary"}
                  >
                    {t("Prev")}
                  </Button>
                  <Button
                    endIcon={<ArrowForwardIosIcon />}
                    disabled={
                      currentIndex + 1 === rowsData?.length ||
                      isLoading ||
                      isFetching
                    }
                    onClick={() => changeIndex("next")}
                    color={"primary"}
                  >
                    {t("Next")}
                  </Button>
                </>
              )}

              <Button
                onClick={() => navigate("joint-details")}
                color={"primary"}
              >
                {t("JointDetails")}
              </Button>
              <Button onClick={() => navigate("photo-sign")} color="primary">
                {t("PhotoSign")}
              </Button>
              <Button color={"primary"}>View Changes</Button>
              <Button
                onClick={() => navigate("retrieve-form")}
                color={"primary"}
              >
                {t("Retrieve")}
              </Button>
            </>
          );
        }}
      </MasterDetailsForm>

      {isData?.isOpenCard && (
        <CardPrinting cardData={isData.cardData} setIsData={setIsData} />
      )}
      <Routes>
        <Route
          path="retrieve-form/*"
          element={
            <RetrieveCfmData
              onClose={() => navigate(".")}
              navigate={navigate}
              setRowsData={setRowsData}
            />
          }
        />
        <Route
          path="photo-sign/*"
          element={
            <PhotoSignWithHistory
              data={{
                COMP_CD: "132 ",
                BRANCH_CD: "099 ",
                ACCT_TYPE: "301 ",
                ACCT_CD: "124536              ",
                BTN_FLAG: "Y",
              }}
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
                    COMP_CD: "132 ",
                    BRANCH_CD: "099 ",
                    ACCT_TYPE: "301 ",
                    ACCT_CD: "124536              ",
                    BTN_FLAG: "Y",
                  }}
                />
              </div>
            </Dialog>
          }
        />
      </Routes>
    </>
  );
};

const Confirmation = () => {
  return (
    <ClearCacheProvider>
      <ConfirmationCustom />
    </ClearCacheProvider>
  );
};
export default Confirmation;
