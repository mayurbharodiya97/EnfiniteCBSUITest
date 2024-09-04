import { AppBar, Button, Dialog, Grid, Paper } from "@mui/material";
import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "pages_audit/auth";
import { useMutation, useQuery } from "react-query";
import { Route, Routes, useNavigate } from "react-router-dom";
import { AtmEntryMetaData } from "./metaData/atmEntryMetadata";
import { useTranslation } from "react-i18next";
import { AtmEntryMetaData602 } from "./atmEntryMetadata";
import * as API from "./api";
import { atmGridMetaData } from "./metaData/atmEntryGridMetadata";
import { CardDetails } from "./cardDetails/cardDetails";
import JointDetails from "../DailyTransaction/TRNHeaderTabs/JointDetails";
import Draggable from "react-draggable";
import PhotoSignWithHistory from "components/custom/photoSignWithHistory/photoSignWithHistory";
import { atmentrymetadata } from "./metaData/atmEntryMetadata2";
import { CardPrinting } from "./cardPrinting";
import { RetrieveData } from "./retrieveData/retrieveData";
import { t } from "i18next";
import { gridClasses } from "@mui/system";
import {
  LoaderPaperComponent,
  ClearCacheProvider,
  RemarksAPIWrapper,
  FormWrapper,
  MetaDataType,
  usePopupContext,
  Alert,
  GridWrapper,
  GridMetaDataType,
  ActionTypes,
  SubmitFnType,
} from "@acuteinfo/common-base";

import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const AtmEntryCustom = ({ parameter }) => {
  const actions: ActionTypes[] = [
    {
      actionName: "card-details",
      actionLabel: "Add",
      multiple: false,
      rowDoubleClick: true,
      alwaysAvailable: true,
    },
  ];

  const [isData, setIsData] = useState<any>({
    cardData: {},
    gridData: [],
    isVisible: false,
    isOpenCard: false,
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [formMode, setFormMode] = useState<any>("add");
  const [retrieveData, setRetrieveData] = useState<any>();
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const formRef = useRef<any>(null);
  const navigate = useNavigate();
  const { authState } = useContext(AuthContext);

  let newMetadata: any =
    parameter?.PARA_602 === "Y"
      ? AtmEntryMetaData
      : parameter?.PARA_602 === "N"
      ? atmentrymetadata
      : {};

  const cardDetails: any = useMutation(
    "getATMcardDetails",
    () =>
      API.getATMcardDetails({
        A_COMP_CD: authState?.companyID,
        A_BRANCH_CD: authState?.user?.branchCode,
        A_TRAN_CD: retrieveData?.[currentIndex]?.TRAN_CD,
      }),
    {
      onSuccess(data) {
        let newData;
        if (Array.isArray(data) && data?.length > 0) {
          newData = data.map((item) => {
            return {
              ...item,
              EDIT_STATUS: retrieveData?.[currentIndex]?.EDIT_STATUS,
            };
          });
        }
        setIsData((old) => ({ ...old, gridData: newData }));
      },
    }
  );

  const changeIndex = (direction) => {
    setCurrentIndex((prevIndex) => {
      if (direction === "next") {
        return prevIndex === retrieveData.length - 1 ? 0 : prevIndex + 1;
      } else {
        return prevIndex === 0 ? retrieveData.length - 1 : prevIndex - 1;
      }
    });
  };

  useEffect(() => {
    if (retrieveData?.length) {
      setIsData((old) => ({ ...old, cardData: retrieveData?.[currentIndex] }));
      cardDetails.mutate();
    }
  }, [retrieveData, currentIndex]);

  const onSubmitHandler: SubmitFnType = async (
    data: any,
    displayData: any,
    endSubmit,
    setFieldError
  ) => {
    endSubmit(true);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "s" && event.ctrlKey) {
        event.preventDefault();
        formRef?.current?.handleSubmit({ preventDefault: () => {} }, "Save");
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
  return (
    <>
      <Grid container>
        <FormWrapper
          key={"atm-reg-entry" + currentIndex + formMode}
          metaData={newMetadata as MetaDataType}
          displayMode={formMode}
          initialValues={
            formMode === "view" || formMode === "edit"
              ? {
                  ...retrieveData?.[currentIndex],
                  TOTAL: `\u00A0 ${currentIndex + 1} of ${
                    retrieveData?.length
                  }`,
                }
              : {
                  PARA_602: parameter?.PARA_602,
                  PARA_946: parameter?.PARA_946,
                  PARA_311: parameter?.PARA_311,
                }
          }
          onSubmitHandler={onSubmitHandler}
          ref={formRef}
          formStyle={{
            background: "white",
            height: "calc(100vh - 403px)",
            overflowY: "auto",
            overflowX: "hidden",
          }}
          formState={{ MessageBox: MessageBox, auth: authState }}
          onFormButtonClickHandel={() => {
            if (!isData?.isOpenCard) {
              setIsData((old) => ({ ...old, isOpenCard: true }));
            }
          }}
          setDataOnFieldChange={(action, payload) => {
            if (action === "RES_DATA") {
              setIsData((old) => ({
                ...old,
                cardData: payload?.validateData,
                isVisible: payload?.isVisible,
              }));
            }
          }}
        >
          {({ isSubmitting, handleSubmit }) => (
            <>
              {formMode === "view" && retrieveData?.length > 0 && (
                <>
                  <Button
                    startIcon={<ArrowBackIosNewIcon />}
                    disabled={1 === currentIndex + 1}
                    onClick={() => changeIndex("previous")}
                    color={"primary"}
                  >
                    {t("Prev")}
                  </Button>
                  <Button
                    endIcon={<ArrowForwardIosIcon />}
                    disabled={currentIndex + 1 === retrieveData.length}
                    onClick={() => changeIndex("next")}
                    color={"primary"}
                  >
                    {t("Next")}
                  </Button>
                </>
              )}
              {retrieveData?.length > 0 && (
                <>
                  <Button
                    onClick={() =>
                      setFormMode(formMode === "edit" ? "view" : "edit")
                    }
                    color={"primary"}
                  >
                    {formMode === "edit" ? t("View") : t("Edit")}
                  </Button>
                  <Button
                    onClick={() => {
                      setFormMode("add");
                      setRetrieveData(null);
                      setIsData((old) => ({
                        ...old,
                        cardData: {},
                        gridData: [],
                      }));
                    }}
                    color={"primary"}
                  >
                    {t("New")}
                  </Button>
                </>
              )}
              <Button
                onClick={() => navigate("retrieve-form")}
                color={"primary"}
              >
                {t("Retrieve")}
              </Button>

              {isData?.isVisible && (
                <>
                  <Button
                    onClick={() => navigate("joint-details")}
                    color={"primary"}
                  >
                    {t("JointDetails")}
                  </Button>
                  <Button
                    color="primary"
                    onClick={() => navigate("photo-sign")}
                  >
                    {t("PhotoSign")}
                  </Button>
                </>
              )}
              <Button
                color={"primary"}
                // onClick={(event) =>
                //   formRef?.current?.handleSubmit(event, "BUTTON_CLICK")
                // }
                // endIcon={
                //   mutation?.isLoading ? <CircularProgress size={20} /> : null
                // }
              >
                {t("Save")}
              </Button>
            </>
          )}
        </FormWrapper>
        <Grid px={"10px"} container>
          {cardDetails?.isError && (
            <AppBar position="relative" color="primary">
              <Alert
                severity="error"
                errorMsg={
                  cardDetails?.error?.error_msg ?? t("UnknownErrorOccured")
                }
                errorDetail={cardDetails?.error?.error_detail ?? ""}
                color="error"
              />
            </AppBar>
          )}
          <GridWrapper
            key={`atmGridData` + isData?.gridData}
            finalMetaData={atmGridMetaData as GridMetaDataType}
            data={isData?.gridData ?? []}
            loading={cardDetails?.isLoading || cardDetails?.isFetching}
            setData={() => null}
            actions={actions}
            setAction={(data) => {
              if (data?.name === "card-details") {
                navigate(data?.name, {
                  state: {
                    rows: data?.rows,
                    retrieveData: retrieveData?.[currentIndex],
                  },
                });
              }
            }}
            onClickActionEvent={(index, id, data) => {
              setIsData((old) => {
                let deleteData = old?.gridData.filter((item) => item !== data);
                return { ...old, gridData: deleteData };
              });
            }}
          />
        </Grid>
      </Grid>

      {isData?.isOpenCard && (
        <CardPrinting cardData={isData.cardData} setIsData={setIsData} />
      )}

      <Routes>
        <Route
          path="card-details/*"
          element={
            <CardDetails
              navigate={navigate}
              setIsData={setIsData}
              parameter={parameter}
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
      </Routes>
    </>
  );
};

export const AtmEntry = () => {
  const { authState } = useContext(AuthContext);
  const { data, isLoading, isSuccess, isError, error } = useQuery<any, any>(
    ["GETATMREGPARA"],
    () =>
      API.getParameter({
        A_ENT_BRANCH: authState?.user?.branchCode,
        A_ENT_COMP: authState?.companyID,
      })
  );

  return (
    <ClearCacheProvider>
      {isLoading ? (
        <LoaderPaperComponent />
      ) : isError ? (
        <AppBar position="relative" color="primary">
          <Alert
            severity="error"
            errorMsg={error?.error_msg ?? t("UnknownErrorOccured")}
            errorDetail={error?.error_detail ?? ""}
            color="error"
          />
        </AppBar>
      ) : isSuccess ? (
        <AtmEntryCustom parameter={data?.[0]} />
      ) : null}
    </ClearCacheProvider>
  );
};
