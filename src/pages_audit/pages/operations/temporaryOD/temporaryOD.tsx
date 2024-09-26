import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
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
import {
  tempODGridTodayMetaData,
  tempODGridHistoryMetaData,
} from "./temporaryGridMetaData";
import { temporaryODentryMetadata } from "./tempODentryMetadata";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "pages_audit/auth";
import { enqueueSnackbar } from "notistack";
import { useMutation } from "react-query";
import { cloneDeep } from "lodash";
import { format } from "date-fns";
import * as API from "./api";
import { LinearProgressBarSpacer } from "components/common/custom/linerProgressBarSpacer";
import { useTranslation } from "react-i18next";

import {
  ActionTypes,
  Alert,
  MasterDetailsMetaData,
  usePopupContext,
  GridMetaDataType,
  MasterDetailsForm,
  GridWrapper,
} from "@acuteinfo/common-base";

export const TemporaryOD = () => {
  const [isData, setIsData] = useState({
    isVisible: false,
    value: "tab1",
    closeAlert: true,
  });
  const { authState } = useContext(AuthContext);
  const { MessageBox } = usePopupContext();
  const myRef = useRef<any>(null);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const actions: ActionTypes[] = [
    {
      actionName: "add",
      actionLabel: "Add",
      multiple: false,
      rowDoubleClick: false,
      alwaysAvailable: true,
    },
  ];

  const temporaryODDetail: any = useMutation(
    "lienGridDetail",
    API.temporaryODdetails,
    {
      onError: () => {
        setIsData((old) => ({ ...old, closeAlert: true }));
      },
    }
  );

  const crudTempOD: any = useMutation("crudTemoraryOD", API.crudTemoraryOD, {
    onSuccess: (data, variables) => {
      if (Boolean(variables?._isNewRow)) {
        setIsData((old) => ({ ...old, isVisible: false }));
        myRef?.current?.handleFormReset();
        enqueueSnackbar(t("insertSuccessfully"), { variant: "success" });
      } else if (!Boolean(variables?.isNewRow)) {
        enqueueSnackbar(t("ForceExpSuccessfully"), { variant: "success" });
        temporaryODDetail.mutate({
          COMP_CD: authState?.companyID,
          BRANCH_CD: variables?.BRANCH_CD,
          ACCT_TYPE: variables?.ACCT_TYPE,
          ACCT_CD: variables?.ACCT_CD,
          FLAG: "H",
          ASON_DT: authState?.workingDate,
        });
      }
    },
    onError: () => {
      setIsData((old) => ({ ...old, closeAlert: true }));
    },
  });

  const onSubmitHandler = ({ data, displayData, endSubmit }) => {
    data?.DETAILS_DATA?.isNewRow?.forEach((rows) => {
      return (rows.SUBMIT = Boolean(rows.SUBMIT) ? "Y" : "N");
    });
    let Apireq = {
      _isNewRow: true,
      BRANCH_CD: data?.BRANCH_CD,
      ACCT_TYPE: data?.ACCT_TYPE,
      ACCT_CD: data?.ACCT_CD,
      CODE: data?.CODE,
      FLAG: Boolean(data?.FLAG) ? "Y" : "N",
      FROM_EFF_DATE: format(new Date(data?.FROM_EFF_DATE), "dd-MMM-yyyy"),
      TO_EFF_DATE: format(new Date(data?.TO_EFF_DATE), "dd-MMM-yyyy"),
      AMOUNT_UPTO: data?.AMOUNT_UPTO,
      DETAILS_DATA: data?.DETAILS_DATA,
    };
    crudTempOD.mutate(Apireq);

    //@ts-ignore
    endSubmit(true);
  };

  const setCurrentAction = useCallback(
    async (data) => {
      if (data.name === "add") {
        let gridData = await myRef?.current?.GetGirdData?.();
        const hasDuplicateTemplateCd = (data) => {
          const templateCdSet = new Set();
          for (const item of data) {
            if (templateCdSet.has(item.TEMPLATE_CD)) {
              return true;
            }
            templateCdSet.add(item.TEMPLATE_CD);
          }
          return false;
        };
        const duplicateExists = hasDuplicateTemplateCd(gridData);
        if (!Boolean(duplicateExists)) {
          myRef.current?.addNewRow(true, {
            VALID_UPTO: authState?.workingDate,
          });
        }
      }
    },
    [navigate]
  );

  // let metadata: MasterDetailsMetaData = {} as MasterDetailsMetaData;
  let metadata = cloneDeep(temporaryODentryMetadata) as MasterDetailsMetaData;

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
            temporaryODDetail.data = [];

            const handleTabChange = (metaData, flag) => {
              myRef?.current?.getFieldData().then((res) => {
                if (res?.ACCT_CD && res?.ACCT_TYPE && res?.BRANCH_CD) {
                  metaData.gridConfig.subGridLabel = `\u00A0\u00A0 ${(
                    authState?.companyID +
                    res?.BRANCH_CD +
                    res?.ACCT_TYPE +
                    res?.ACCT_CD
                  ).replace(/\s/g, "")}`;

                  let Apireq = {
                    COMP_CD: authState?.companyID,
                    BRANCH_CD: res?.BRANCH_CD,
                    ACCT_TYPE: res?.ACCT_TYPE,
                    ACCT_CD: res?.ACCT_CD,
                    FLAG: flag,
                    ASON_DT: authState?.workingDate,
                  };
                  temporaryODDetail.mutate(Apireq);
                }
              });
            };

            if (newValue === "tab2") {
              handleTabChange(tempODGridTodayMetaData, "T");
            } else if (newValue === "tab3") {
              handleTabChange(tempODGridHistoryMetaData, "H");
            }
          }}
          textColor="secondary"
          indicatorColor="secondary"
          aria-label="secondary tabs example"
        >
          <Tab value="tab1" label={t("TemporaryODEntry")} />
          {isData.isVisible && <Tab value="tab2" label={t("TodaysDetail")} />}
          {isData.isVisible && <Tab value="tab3" label={t("HistoryDetail")} />}
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
          {crudTempOD?.isLoading ? (
            <LinearProgress color="secondary" />
          ) : (temporaryODDetail?.isError && isData.closeAlert) ||
            (crudTempOD?.isError && isData.closeAlert) ? (
            <div style={{ paddingRight: "10px", paddingLeft: "10px" }}>
              <AppBar position="relative" color="primary">
                <Alert
                  severity="error"
                  errorMsg={
                    temporaryODDetail?.error?.error_msg ??
                    crudTempOD?.error?.error_msg ??
                    "Unknow Error"
                  }
                  errorDetail={
                    temporaryODDetail?.error?.error_detail ??
                    crudTempOD?.error?.error_detail ??
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
            <MasterDetailsForm
              key={"temporaryODentry"}
              metaData={metadata}
              initialData={{}}
              onSubmitData={onSubmitHandler}
              isNewRow={false}
              onClickActionEvent={() => {}}
              formState={{ MessageBox: MessageBox }}
              setDataOnFieldChange={(action, payload) => {
                if (action === "IS_VISIBLE") {
                  setIsData((old) => ({
                    ...old,
                    isVisible: payload.IS_VISIBLE,
                  }));
                }
              }}
              actions={actions}
              handelActionEvent={setCurrentAction}
              isDetailRowRequire={false}
              ref={myRef}
              formStyle={{
                background: "white",
                height: "23vh",
                overflowY: "auto",
                overflowX: "hidden",
              }}
            >
              {({ isSubmitting, handleSubmit }) => {
                return (
                  <>
                    <Button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      // endIcon={
                      //   isSubmitting ? <CircularProgress size={20} /> : null
                      // }
                      color={"primary"}
                    >
                      {t("Save")}
                    </Button>
                  </>
                );
              }}
            </MasterDetailsForm>
          </div>
          <div
            style={{ display: isData.value === "tab2" ? "inherit" : "none" }}
          >
            <>
              <GridWrapper
                key={`tempODGrid-Today-data` + temporaryODDetail.isSuccess}
                finalMetaData={tempODGridTodayMetaData as GridMetaDataType}
                data={temporaryODDetail.data ?? []}
                setData={() => {}}
                loading={temporaryODDetail.isLoading}
              />
            </>
          </div>
          <div
            style={{ display: isData.value === "tab3" ? "inherit" : "none" }}
          >
            <>
              <GridWrapper
                key={`tempODGrid-History-Data` + temporaryODDetail.isSuccess}
                finalMetaData={tempODGridHistoryMetaData as GridMetaDataType}
                data={temporaryODDetail.data ?? []}
                setData={() => {}}
                loading={temporaryODDetail.isLoading}
                onClickActionEvent={async (index, id, data) => {
                  let res = await MessageBox({
                    messageTitle: "confirmation",
                    message: "AreYouSureToForceExp",
                    buttonNames: ["Yes", "No"],
                  });
                  if (res === "Yes") {
                    let Apireq = {
                      isNewRow: false,
                      COMP_CD: data?.COMP_CD,
                      BRANCH_CD: data?.BRANCH_CD,
                      ACCT_TYPE: data?.ACCT_TYPE,
                      ACCT_CD: data?.ACCT_CD,
                      SR_CD: data?.SR_CD,
                    };
                    crudTempOD.mutate(Apireq);
                  }
                }}
              />
            </>
          </div>
        </Grid>
      </Container>
    </>
  );
};
