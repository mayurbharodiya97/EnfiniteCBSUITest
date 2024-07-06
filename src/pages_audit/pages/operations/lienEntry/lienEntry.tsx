import {
  AppBar,
  Box,
  Button,
  Container,
  Grid,
  LinearProgress,
  Tab,
  Tabs,
} from "@mui/material";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { GridWrapper } from "components/dataTableStatic/gridWrapper";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { usePopupContext } from "components/custom/popupContext";
import { Route, Routes, useNavigate } from "react-router-dom";
import { GridMetaDataType } from "components/dataTableStatic";
import { LienGridMetaData } from "./lienEntryGridMetaData";
import { LienEntryMetadata } from "./lienEntryMetadata";
import { ActionTypes } from "components/dataTable";
import { Alert } from "components/common/alert";
import { AuthContext } from "pages_audit/auth";
import { SubmitFnType } from "packages/form";
import { enqueueSnackbar } from "notistack";
import { ExpireLien } from "./expireLien/expireLien";
import { useMutation } from "react-query";
import { ClearCacheProvider, queryClient } from "cache";
import * as API from "./api";
import { LinearProgressBarSpacer } from "components/dataTable/linerProgressBarSpacer";
import { useTranslation } from "react-i18next";

const LienEntryCustom = () => {
  const actions: ActionTypes[] = [
    {
      actionName: "expire-lien",
      actionLabel: "Expire Lien",
      multiple: false,
      rowDoubleClick: true,
    },
  ];

  const { authState } = useContext(AuthContext);
  const [isData, setIsData] = useState({
    isVisible: false,
    value: "tab1",
    closeAlert: true,
  });
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const { t } = useTranslation();
  const myMasterRef = useRef<any>(null);
  const navigate = useNavigate();

  const getLienDetail: any = useMutation("lienGridDetail", API.lienGridDetail, {
    onError: () => {
      setIsData((old) => ({ ...old, closeAlert: true }));
    },
  });

  const validateInsertData: any = useMutation(API.validateInsert, {
    onSuccess(data, variables) {
      async function validData() {
        let apiReq = {
          ...variables,
          SCREEN_REF: "ETRN/652",
          _isNewRow: true,
        };

        if (Array.isArray(data) && data?.length > 0) {
          const btnName = async (buttonNames, msg, msgTitle, loadBtnNm) => {
            return await MessageBox({
              messageTitle: msgTitle,
              message: msg,
              buttonNames: buttonNames,
              loadingBtnName: [loadBtnNm],
            });
          };

          let messages = { "999": [], "99": [], "9": [], "0": [] };
          let status = { "999": false, "99": false, "9": false, "0": false };

          data.forEach((item) => {
            if (messages[item.O_STATUS] !== undefined) {
              messages[item.O_STATUS].push(`⁕ ${item?.O_MESSAGE}`);
              status[item.O_STATUS] = true;
            }
          });

          let concatenatedMessages = {};
          for (let key in messages) {
            concatenatedMessages[key] = messages[key].join("\n");
          }
          if (status["999"]) {
            btnName(
              ["Ok"],
              concatenatedMessages["999"],
              "ValidationFailed",
              ""
            );
          } else if (status["99"]) {
            let buttonName = await btnName(
              ["Yes", "No"],
              concatenatedMessages["99"],
              "DoYouContinueWithRecord",
              ""
            );
            if (buttonName === "Yes" && status["9"]) {
              btnName(
                ["Ok"],
                concatenatedMessages["9"],
                "ValidationAlert",
                "Yes"
              );
            } else if (buttonName === "Yes") {
              crudLienData.mutate(apiReq);
            }
          } else if (status["9"]) {
            btnName(["Ok"], concatenatedMessages["9"], "ValidationAlert", "");
          } else if (status["0"]) {
            let buttonName = await btnName(
              ["Yes", "No"],
              "AreYouSureToProceed",
              "ValidationSuccessfull",
              "Yes"
            );
            if (buttonName === "Yes") {
              crudLienData.mutate(apiReq);
            }
          }
        }
      }
      validData();
    },
    onError() {
      setIsData((old) => ({ ...old, closeAlert: true }));
    },
  });

  const crudLienData: any = useMutation("crudLien", API.crudLien, {
    onSuccess: (data) => {
      if (data?.[0]?.O_STATUS && data?.[0]?.O_STATUS !== "0") {
        MessageBox({
          messageTitle: "validationAlert",
          message: data?.[0]?.O_MESSAGE,
          defFocusBtnName: "Yes",
        });
      } else {
        CloseMessageBox();
        enqueueSnackbar(t("insertSuccessfully"), { variant: "success" });
        myMasterRef?.current?.handleFormReset({ preventDefault: () => {} });
        setIsData((old) => ({ ...old, isVisible: false }));
      }
    },
    onError: () => {
      CloseMessageBox();
      setIsData((old) => ({ ...old, closeAlert: true }));
    },
  });

  useEffect(() => {
    return () => {
      queryClient.removeQueries(["lienGridDetail"]);
      queryClient.removeQueries(["crudLien"]);
    };
  }, []);

  const onSubmitHandler: SubmitFnType = async (
    data: any,
    displayData,
    endSubmit
  ) => {
    validateInsertData.mutate(data);

    //@ts-ignore
    endSubmit(true);
  };

  const setCurrentAction = useCallback(
    async (data) => {
      if (data?.rows?.[0]?.data?.CONFIRMED !== "Y") {
        MessageBox({
          messageTitle: "Alert",
          message: "LienEntryNotConfirmed",
        });
      } else if (data?.rows?.[0]?.data?.LIEN_STATUS === "E") {
        MessageBox({
          messageTitle: "Alert",
          message: "LienEntryExpired",
        });
      } else if (data?.rows?.[0]?.data?.LIEN_STATUS === "A") {
        let res = await MessageBox({
          messageTitle: "confirmation",
          message: "LienExpireMsg",
          buttonNames: ["Yes", "No"],
        });
        if (res === "Yes") {
          navigate(data?.name, {
            state: data?.rows,
          });
        }
      }
    },
    [navigate]
  );

  return (
    <>
      <Box sx={{ width: "100%" }}>
        <Tabs
          value={isData.value}
          sx={{ ml: "25px" }}
          onChange={(event, newValue) => {
            setIsData((old) => ({
              ...old,
              value: newValue,
              closeAlert: false,
            }));
            getLienDetail.data = [];
            if (newValue === "tab2") {
              //API calling for Grid-Details on tab-change, and account number and name set to inside the header of Grid-details
              myMasterRef?.current?.getFieldData().then((res) => {
                if (res?.ACCT_CD && res?.ACCT_TYPE && res?.BRANCH_CD) {
                  LienGridMetaData.gridConfig.subGridLabel = `\u00A0\u00A0 ${(
                    authState?.companyID +
                    res?.BRANCH_CD +
                    res?.ACCT_TYPE +
                    res?.ACCT_CD?.padStart(6, "0")?.padEnd(20, " ")
                  ).replace(/\s/g, "")} -  ${res?.ACCT_NM}`;

                  const RequestPara = {
                    COMP_CD: authState?.companyID,
                    ACCT_CD: res?.ACCT_CD?.padStart(6, "0")?.padEnd(20, " "),
                    ACCT_TYPE: res?.ACCT_TYPE,
                    BRANCH_CD: res?.BRANCH_CD,
                  };
                  getLienDetail.mutate(RequestPara);
                }
              });
            }
          }}
          textColor="secondary"
          indicatorColor="secondary"
          aria-label="secondary tabs example"
        >
          <Tab value="tab1" label={t("LienEntry")} />
          {isData.isVisible && <Tab value="tab2" label={t("LienDetail")} />}
        </Tabs>
      </Box>

      <Container>
        <Grid
          sx={{
            backgroundColor: "var(--theme-color2)",
            padding: "0px",
            borderRadius: "10px",
            boxShadow:
              "rgba(136, 165, 191, 0.48) 6px 2px 16px 0px, rgba(255, 255, 255, 0.8) -6px -2px 16px 0px;",
          }}
        >
          {validateInsertData.isLoading ? (
            <LinearProgress color="secondary" />
          ) : (getLienDetail?.isError && isData.closeAlert) ||
            (crudLienData?.isError && isData.closeAlert) ||
            (validateInsertData?.isError && isData.closeAlert) ? (
            <div style={{ paddingRight: "10px", paddingLeft: "10px" }}>
              <AppBar position="relative" color="primary">
                <Alert
                  severity="error"
                  errorMsg={
                    getLienDetail?.error?.error_msg ??
                    crudLienData?.error?.error_msg ??
                    validateInsertData?.error?.error_msg ??
                    "Unknow Error"
                  }
                  errorDetail={
                    getLienDetail?.error?.error_detail ??
                    crudLienData?.error?.error_detail ??
                    validateInsertData?.error?.error_detail ??
                    ""
                  }
                  color="error"
                />
              </AppBar>
            </div>
          ) : (
            <LinearProgressBarSpacer />
          )}

          <div
            style={{ display: isData.value === "tab1" ? "inherit" : "none" }}
          >
            <FormWrapper
              key={"lien-Entry"}
              metaData={(LienEntryMetadata as MetaDataType) ?? {}}
              initialValues={{}}
              onSubmitHandler={onSubmitHandler}
              ref={myMasterRef}
              formState={{ MessageBox: MessageBox }}
              setDataOnFieldChange={(action, payload) => {
                if (action === "IS_VISIBLE") {
                  setIsData((old) => ({
                    ...old,
                    isVisible: payload?.IS_VISIBLE,
                  }));
                }
              }}
            >
              {({ isSubmitting, handleSubmit }) => (
                <>
                  <Button
                    onClick={(event) => {
                      handleSubmit(event, "Save");
                    }}
                    // disabled={isSubmitting}
                    //endIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                    color={"primary"}
                  >
                    {t("Save")}
                  </Button>
                </>
              )}
            </FormWrapper>
          </div>

          <div
            style={{ display: isData.value === "tab2" ? "inherit" : "none" }}
          >
            <GridWrapper
              key={`LienGrid-MetaData`}
              finalMetaData={LienGridMetaData as GridMetaDataType}
              data={getLienDetail.data ?? []}
              setData={() => {}}
              loading={getLienDetail.isLoading}
              actions={actions}
              setAction={setCurrentAction}
              // refetchData={() => {}}
              // ref={myGridQuickRef}
            />
            <Routes>
              <Route
                path="expire-lien/*"
                element={
                  <ExpireLien
                    navigate={navigate}
                    getLienDetail={getLienDetail}
                  />
                }
              />
            </Routes>
          </div>
        </Grid>
      </Container>
    </>
  );
};

export const LienEntry = () => {
  return (
    <ClearCacheProvider>
      <LienEntryCustom />
    </ClearCacheProvider>
  );
};
