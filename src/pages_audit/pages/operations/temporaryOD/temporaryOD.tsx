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
import { GridWrapper } from "components/dataTableStatic/gridWrapper";
import {
  tempODGridTodayMetaData,
  tempODGridHistoryMetaData,
} from "./temporaryGridMetaData";
import { temporaryODentryMetadata } from "./tempODentryMetadata";
import { usePopupContext } from "components/custom/popupContext";
import { GridMetaDataType } from "components/dataTableStatic";
import { MasterDetailsForm } from "components/formcomponent";
import { ActionTypes } from "components/dataTable";
import { Alert } from "components/common/alert";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "pages_audit/auth";
import { enqueueSnackbar } from "notistack";
import { useMutation } from "react-query";
import { cloneDeep } from "lodash";
import { format } from "date-fns";
import * as API from "./api";
import { MasterDetailsMetaData } from "components/formcomponent/masterDetails/types";
import { LinearProgressBarSpacer } from "components/dataTable/linerProgressBarSpacer";

export const TemporaryOD = () => {
  const [gridDetailData, setGridDetailData] = useState<any>([]);
  const [refreshForm, setRefreshForm] = useState<any>(0);
  const [closeAlert, setCloseAlert] = useState<any>(true);
  const [isVisible, setIsVisible] = useState<any>(false);
  const { authState } = useContext(AuthContext);
  const [value, setValue] = useState("tab1");
  const { MessageBox } = usePopupContext();
  const myRef = useRef<any>(null);
  const navigate = useNavigate();

  const actions: ActionTypes[] = [
    {
      actionName: "documents",
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
      onSuccess: (data) => {
        setGridDetailData(data);
      },
      onError: (error: any) => {
        setCloseAlert(true);
      },
    }
  );

  const crudTempOD: any = useMutation("crudTemoraryOD", API.crudTemoraryOD, {
    onSuccess: (data, variables) => {
      if (Boolean(variables?._isNewRow)) {
        enqueueSnackbar("Data insert successfully", { variant: "success" });
        setRefreshForm((old) => old + 1);
      } else if (!Boolean(variables?.isNewRow)) {
        enqueueSnackbar("Force-Expire successfully", { variant: "success" });
        temporaryODDetail.mutate({
          COMP_CD: authState?.companyID,
          BRANCH_CD: variables?.BRANCH_CD,
          ACCT_TYPE: variables?.ACCT_TYPE,
          ACCT_CD: variables?.ACCT_CD,
          FLAG: "Y",
          ASON_DT: authState?.workingDate,
        });
      }
    },
    onError: (error: any) => {
      setCloseAlert(true);
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
      if (data.name === "documents") {
        myRef.current?.addNewRow(true, { VALID_UPTO: authState?.workingDate });
      }
    },
    [navigate]
  );

  let metadata: MasterDetailsMetaData = {} as MasterDetailsMetaData;
  metadata = cloneDeep(temporaryODentryMetadata) as MasterDetailsMetaData;

  return (
    <>
      <Box sx={{ width: "100%" }}>
        <Tabs
          value={value}
          sx={{ ml: "25px" }}
          onChange={(event, newValue) => {
            setValue(newValue);
            setGridDetailData([]);
            setCloseAlert(false);

            const handleTabChange = (metaData, flag) => {
              myRef?.current?.getFieldData().then((res) => {
                if (res?.ACCT_CD && res?.ACCT_TYPE && res?.BRANCH_CD) {
                  metaData.gridConfig.gridLabel = `Temporary-OD ${
                    flag === "T" ? "Today" : "History"
                  } Detail \u00A0\u00A0 ${(
                    authState?.companyID +
                    res?.BRANCH_CD +
                    res?.ACCT_TYPE +
                    res?.ACCT_CD?.padStart(6, "0")?.padEnd(20, " ")
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
          <Tab value="tab1" label="Temporary-OD Entry" />
          {isVisible && <Tab value="tab2" label="Today(s) Detail" />}
          {isVisible && <Tab value="tab3" label="History Detail" />}
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
          ) : (temporaryODDetail?.isError && closeAlert) ||
            (crudTempOD?.isError && closeAlert) ? (
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
          <div style={{ display: value === "tab1" ? "inherit" : "none" }}>
            <MasterDetailsForm
              key={"temporaryODentry" + refreshForm}
              metaData={metadata}
              initialData={{}}
              onSubmitData={onSubmitHandler}
              isNewRow={false}
              onClickActionEvent={(index, id, data) => {}}
              formState={{ MessageBox: MessageBox }}
              setDataOnFieldChange={(action, payload) => {
                console.log("<<<act", action, payload);
                if (action === "IS_VISIBLE") {
                  setIsVisible(payload.IS_VISIBLE);
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
                      Save
                    </Button>
                  </>
                );
              }}
            </MasterDetailsForm>
          </div>
          <div style={{ display: value === "tab2" ? "inherit" : "none" }}>
            <>
              <GridWrapper
                key={`tempODGrid-Today-data` + temporaryODDetail.isSuccess}
                finalMetaData={tempODGridTodayMetaData as GridMetaDataType}
                data={gridDetailData ?? []}
                setData={() => {}}
                loading={temporaryODDetail.isLoading}
              />
            </>
          </div>
          <div style={{ display: value === "tab3" ? "inherit" : "none" }}>
            <>
              <GridWrapper
                key={`tempODGrid-History-Data` + temporaryODDetail.isSuccess}
                finalMetaData={tempODGridHistoryMetaData as GridMetaDataType}
                data={gridDetailData ?? []}
                setData={() => {}}
                loading={temporaryODDetail.isLoading}
                onClickActionEvent={async (index, id, data) => {
                  let res = await MessageBox({
                    messageTitle: "Confirmation",
                    message: "Are you sure to force expire ?",
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
