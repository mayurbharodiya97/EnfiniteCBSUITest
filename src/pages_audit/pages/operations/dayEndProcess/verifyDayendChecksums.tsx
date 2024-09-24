import { useCallback, useContext, useEffect, useRef, useState } from "react";
import * as API from "./api";
import { ClearCacheProvider, queryClient } from "cache";
import { useMutation, useQuery } from "react-query";
import GridWrapper, { GridMetaDataType } from "components/dataTableStatic";
import {
  verifyDayendChecksumsMetaData,
  executeChecksumsReportMetaData,
} from "./gridMetadata";
import { useNavigate } from "react-router-dom";
import { ViewEodReport } from "./viewEodReport";
import { usePopupContext } from "components/custom/popupContext";
import {
  Chip,
  CircularProgress,
  Dialog,
  Paper,
  Typography,
} from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { LoaderPaperComponent } from "components/common/loaderPaper";
import { AuthContext } from "pages_audit/auth";
import LoaderImg from "./Loader.gif";
import { GradientButton } from "components/styledComponent/button";
import { t } from "i18next";
import { LoadingTextAnimation } from "components/common/loader";

interface Item {
  CHKSM_TYPE?: string;
  SR_CD?: string;
  MENDETORY?: string;
  EOD_VER_ID?: string;
  CLR?: string;
  PROCESS?: any;
  ED_TIME: string;
  ST_TIME: string;
}

export const VerifyDayendChecksums = ({
  open,
  close,
  flag,
  processFlag,
  isHOLoggined,
}: {
  open: boolean;
  close: () => void;
  flag: string;
  processFlag: string;
  isHOLoggined: boolean;
}) => {
  const { authState } = useContext(AuthContext);
  const [openReport, setOpenReport] = useState(false);
  const [sessionStart, setSessionStart] = useState<any>(false);
  const warningCountRef = useRef(0);
  const errCount = useRef(0);
  const [currentSRCD, setCurrentSRCD] = useState<string | null>(null);
  const [rowData, setRowData] = useState<any[]>([]);
  const [gridData, setGridData] = useState<Item[]>([]);
  const [reqData, setReqData] = useState<any>({});
  const [currentData, setCurrentData] = useState<any>({});
  const [loopStart, setLoopStart] = useState<any>(false);
  const [branchLoppStop, setBranchloopStop] = useState<any>(false);
  const [warningsObj, setWarningsObj] = useState({});
  const warningsObjRef = useRef<any>({});
  const npaCalckref = useRef<any>();
  const mewSessionref = useRef<any>();
  const resultRef = useRef<any>();
  warningsObjRef.current = warningsObj;
  const [switchBranchPara, setSwitchBranchPara] = useState<any>(true);
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const currentBranch = useRef<any>(null);
  const navigate = useNavigate();
  const gridRef = useRef<HTMLDivElement | null>(null);
  const { logout } = useContext(AuthContext);

  const [batchCount, setBatchCount] = useState<number>(0);

  const handleAction = useCallback(
    async (data: any) => {
      navigate(data?.name, { state: data?.rows });
    },
    [navigate, close]
  );

  const formatTime = (date: Date): string => {
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };
  useEffect(() => {
    if (currentBranch.current) {
      setWarningsObj((prevWarnings) => ({
        ...prevWarnings,

        [currentBranch.current]: [
          warningCountRef.current,
          //@ts-ignore
          gridData[0]?.BRANCH_NM,
        ],
      }));
    }
  }, [warningCountRef.current]);

  useEffect(() => {
    warningsObjRef.current = warningsObj;
  }, [warningsObj]);
  const startSession = () => {
    setSessionStart(true);
    sessionDtlMutation.mutate({
      COMP_CD: authState?.companyID,
      BRANCH_CD: authState?.user?.branchCode,
      BASE_BRANCH_CD: authState?.baseCompanyID,
      BASE_COMP_CD: authState?.user?.baseBranchCode,
      WORKING_DATE: authState?.workingDate,
    });
    setSessionStart(false);
  };
  const handleEodWarnings = async () => {
    if (flag === "D") {
      let message = "";

      for (let key in warningsObjRef.current) {
        message += `${warningsObjRef.current[key][1]} Warning= ${warningsObjRef.current[key][0]}.\n`;
      }

      const confirmation = await MessageBox({
        messageTitle: "EOD CheckSum having Warning(s).",
        message: `${message}\nAre you sure to Continue?`,
        icon: "WARNING",
        buttonNames: ["Yes", "No"],
      });
      if (confirmation === "Yes") {
        startSession();
      }
      if (confirmation === "No") {
        setLoopStart(true);
      }
    }
  };
  const updateEodRunningStatus = async () => {
    try {
      await API.updateEodRunningStatus({
        COMP_CD: authState?.companyID,
        BRANCH_CD: authState?.user?.branchCode,
        FLAG: "N",
      });
    } catch (error) {}
  };

  const processRecord = async (
    record: Item,
    index: number
  ): Promise<string> => {
    const startTime = new Date();
    setCurrentSRCD(record.SR_CD ?? null);

    setGridData((prevGridData) => {
      const updatedGridData = [...prevGridData];
      updatedGridData[index] = {
        ...updatedGridData[index],
        CLR: "P",
        PROCESS: LoaderImg,
        ST_TIME: formatTime(startTime),
        ED_TIME: "",
      };
      return updatedGridData;
    });

    try {
      const response = await API.executeChecksums({
        FLAG: flag,
        SCREEN_REF: "TRN/399",
        FOR_BRANCH: currentBranch.current,
        EOD_EOS_FLG: reqData[0]?.EOD_EOS_FLG,
        CHKSM_TYPE: record.CHKSM_TYPE,
        SR_CD: record.SR_CD,
        MENDETORY: record.MENDETORY,
        EOD_VER_ID: record.EOD_VER_ID,
      });

      const endTime = new Date();
      const elapsedTime = formatTime(endTime);

      if (response[0]?.CLR) {
        setGridData((prevGridData) => {
          const updatedGridData = [...prevGridData];
          updatedGridData[index] = {
            ...updatedGridData[index],
            CLR: response[0].CLR,
            PROCESS: "",
            ED_TIME: elapsedTime,
          };
          return updatedGridData;
        });
      }

      if (
        flag === "D" &&
        response[0]?.CLR === "E" &&
        record?.MENDETORY == "Y"
      ) {
        await MessageBox({
          messageTitle: "Error",
          message: response[0]?.MESSAGE,
          icon: "ERROR",
          buttonNames: ["Ok"],
        });
        CloseMessageBox();
        setLoopStart(true);
        setBranchloopStop(true);
        setSwitchBranchPara(false);
        return "stop";
      }

      if (flag === "C" && response[0]?.MESSAGE !== "") {
        const buttonName = await MessageBox({
          messageTitle: "Error",
          message: response[0]?.MESSAGE,
          icon: "ERROR",
          buttonNames: ["Ok"],
        });

        if (buttonName !== "Ok") {
          return "stop";
        }
      }
      if (
        flag === "D" &&
        isHOLoggined &&
        processFlag === t("DayEnd") &&
        response[0]?.CLR === "W"
      ) {
        const buttonName = await MessageBox({
          messageTitle: "Error",
          message: "Would you like to see warnings of this Checksum?",
          icon: "WARNING",
          buttonNames: ["Yes", "No"],
        });
        if (buttonName !== "No") {
          setLoopStart(true);
          return "stop";
        }
      }
      if (response[0]?.CLR === "W") {
        warningCountRef.current += 1;
      }
      if (response[0]?.CLR === "Y" && record.MENDETORY === "Y") {
        errCount.current += 1;
      }

      if (
        (index + 1) % 11 === 0 ||
        (index + 1) % 12 === 0 ||
        (index + 1) % 13 === 0 ||
        ((index + 1) % 20 === 0 || (index + 1) % 21) === 0
      ) {
        setBatchCount((prevCount) => prevCount + 1);
      }
    } catch (error) {
      enqueueSnackbar("Error executing EOD for record", {
        variant: "error",
      });
    }

    return "continue";
  };

  const processRecords = async (records: Item[]) => {
    for (let i = 0; i < records.length; i++) {
      const result = await processRecord(records[i], i);
      resultRef.current = result;
      if (result === "stop") {
        updateEodRunningStatus();
        return false;
      }
    }
    return true;
  };
  const DoEodMutation = useMutation(API.doEod, {
    onError: (error: any) => {},
    onSuccess: async (data) => {
      let btn99, returnVal;

      const getButtonName = async (obj) => {
        let btnName = await MessageBox(obj);
        return { btnName, obj };
      };

      for (let i = 0; i < data.length; i++) {
        if (data[i]?.O_STATUS === "999") {
          const { btnName, obj } = await getButtonName({
            messageTitle: t("ValidationFailed"),
            message: data[i]?.O_MESSAGE,
          });
          returnVal = "";
        } else if (data[i]?.O_STATUS === "99") {
          const { btnName, obj } = await getButtonName({
            messageTitle: t("Confirmation"),
            message: data[i]?.O_MESSAGE,
            buttonNames: ["Yes", "No"],
          });
          btn99 = btnName;
          if (btnName === "No") {
            returnVal = "";
          }
        } else if (data[i]?.O_STATUS === "9") {
          if (btn99 !== "No") {
            const { btnName, obj } = await getButtonName({
              messageTitle: t("Alert"),
              message: data[i]?.O_MESSAGE,
            });
          }
          returnVal = "";
        } else if (data[i]?.O_STATUS === "0") {
          const { btnName, obj } = await getButtonName({
            messageTitle: t("Confirmation"),
            message: data[i]?.O_MESSAGE,
            buttonNames: ["Ok"],
          });
          btn99 = btnName;
          if (btnName === "Ok") {
            logout();
          }
        }
      }
    },
  });
  const sessionDtlMutation = useMutation(API.getSessionDtl, {
    onError: (error: any) => {},
    onSuccess: async (sessionDtl) => {
      for (const response of sessionDtl[0]?.MSG ?? []) {
        if (response?.O_STATUS === "999") {
          await MessageBox({
            messageTitle: "ValidationFailed",
            message: response?.O_MESSAGE ?? "",
          });
        } else if (response?.O_STATUS === "9") {
          await MessageBox({
            messageTitle: "Alert",
            message: response?.O_MESSAGE ?? "",
          });
        } else if (response?.O_STATUS === "99") {
          const buttonName = await MessageBox({
            messageTitle: "Confirmation",
            message: response?.O_MESSAGE ?? "",
            buttonNames: [t("openNewSession"), t("DayEnd")],
          });
          if (buttonName === "openNewSession") {
            if (response?.O_COLUMN_NM === "AUTO_NPA") {
              npaCalckref.current = "Y";
            } else {
              npaCalckref.current = "N";
            }

            if (response?.O_COLUMN_NM === "NEW_SESSION") {
              mewSessionref.current = sessionDtl[0]?.NEW_SESSION;
            } else {
              mewSessionref.current = sessionDtl[0]?.DEFAULT_SESSION;
            }
            if (flag === "D") {
              DoEodMutation.mutate({
                FLAG: flag,
                SCREEN_REF: "TRN/399",
                NPA_CALC: npaCalckref?.current,
                NEW_SESSION: mewSessionref?.current,
              });
            }
          } else if (buttonName === "DayEnd") {
            npaCalckref.current = "N";
            if (response?.O_COLUMN_NM === "NEW_SESSION") {
              mewSessionref.current = sessionDtl[0]?.DEFAULT_SESSION;
            } else {
              mewSessionref.current = sessionDtl[0]?.NEW_SESSION;
            }
            if (flag === "D") {
              DoEodMutation.mutate({
                FLAG: flag,
                SCREEN_REF: "TRN/399",
                NPA_CALC: npaCalckref?.current,
                NEW_SESSION: mewSessionref?.current,
              });
            }
          }
        } else if (response?.O_STATUS === "0") {
          if (
            response?.O_COLUMN_NM !== "AUTO_NPA" &&
            response?.O_COLUMN_NM !== "NEW_SESSION"
          ) {
            npaCalckref.current = "N";
            mewSessionref.current = sessionDtl[0]?.DEFAULT_SESSION;
          }
          if (flag === "D") {
            DoEodMutation.mutate({
              FLAG: flag,
              SCREEN_REF: "TRN/399",
              NPA_CALC: npaCalckref?.current,
              NEW_SESSION: mewSessionref?.current,
            });
          }
        }
      }
    },
  });

  const checkSumsDataMutation = useMutation(API.getCheckSums, {
    onError: (error: any) => {
      const errorMsg =
        typeof error === "object"
          ? error?.error_msg || "Unknown error occurred"
          : "Unknown error occurred";
      enqueueSnackbar(errorMsg, { variant: "error" });
      CloseMessageBox();
    },
    onSuccess: async (data: Item[]) => {
      setGridData(data);
      const allRecordsProcessed = await processRecords(data);

      if (flag === "D" && allRecordsProcessed) {
        if (isHOLoggined === false) {
          handleEodWarnings();
        }
      }
      if (flag === "C" && allRecordsProcessed) {
        setSwitchBranchPara(true);
        setLoopStart(true);
        await MessageBox({
          messageTitle: "Success",
          message: "EOD CheckSum completed successfully.",
          buttonNames: ["Ok"],
          icon: "SUCCESS",
        });
      }

      if (flag === "D" && allRecordsProcessed) {
        if (errCount.current === 0) {
          updateEodRunningStatus();

          await MessageBox({
            messageTitle: "Validation Failed.",
            message:
              "At least one Mandatory CheckSum should be completed successfully.\nSorry for the inconvenience." +
              errCount.current,
            buttonNames: ["Ok"],
            icon: "ERROR",
          });
        }
      }
      if (branchLoppStop === false) {
        setSwitchBranchPara(true);
      } else setSwitchBranchPara(false);
    },
  });

  const {
    data: validatedData,
    isLoading: validateLoading,
    isError: validateError,
    error: validateErrorDetails,
    isSuccess: validateSuccess,
  } = useQuery(
    ["getValidateEod"],
    () => API.getValidateEod({ SCREEN_REF: "TRN/399", FLAG: flag }),
    {
      onSuccess: async (data: any) => {
        const responseData = Array.isArray(data) ? data[0] : {};
        const responses = Array.isArray(responseData?.V_MSG)
          ? responseData.V_MSG
          : [responseData?.V_MSG];

        for (const response of responses) {
          const status = response.O_STATUS;
          const message = response.O_MESSAGE;

          if (status === "999") {
            const buttonName = await MessageBox({
              messageTitle: "Error",
              message: message,
              icon: "ERROR",
              buttonNames: ["Ok"],
            });
            if (buttonName === "Ok") close();
          } else if (status === "9") {
            await MessageBox({
              messageTitle: "Alert",
              message: message,
            });
          } else if (status === "99") {
            const buttonName = await MessageBox({
              messageTitle: "Confirmation",
              message: message,
              buttonNames: ["Yes", "No"],
              defFocusBtnName: "Yes",
            });
            if (buttonName === "No") {
              CloseMessageBox();
              close();
            } else if (buttonName === "Yes") {
              const branchList = data[0]?.BRANCH_LIST;
              console.log(currentBranch.current, "BRANCH");

              if (branchList.length > 0) {
                if (switchBranchPara) {
                  setLoopStart(false);
                  for (const branch of branchList) {
                    if (resultRef.current === "stop") {
                      return false;
                    }
                    currentBranch.current = branch;
                    warningCountRef.current = 0;

                    const processBranch = async (branch: string) => {
                      await checkSumsDataMutation.mutateAsync({
                        FLAG: flag,
                        SCREEN_REF: "TRN/399",
                        FOR_BRANCH: branch,
                        EOD_EOS_FLG: data[0]?.EOD_EOS_FLG,
                      });
                    };

                    await processBranch(branch);
                  }
                  handleEodWarnings();
                }
              }
            }
          }
        }
      },
      onError: (error) => {},
    }
  );

  useEffect(() => {
    if (validatedData) {
      setReqData(validatedData);
    }
  }, [validatedData]);

  const reportMutation = useMutation(API.getDayEnderrLog, {
    onError: async (error: any) => {
      await MessageBox({
        message: error?.error_msg ?? "Error occurred",
        messageTitle: "Error",
        buttonNames: ["Ok"],
      });
    },
    onSuccess: async (data: any) => {
      setRowData(data);
    },
  });

  useEffect(() => {
    return () => {
      queryClient.removeQueries(["getValidateEod"]);
    };
  }, []);

  let label = gridData
    ? //@ts-ignore
      `${gridData[0]?.TITLE} ${gridData[0]?.EOD_VER_ID}`
    : "Day End Process";
  verifyDayendChecksumsMetaData.gridConfig.gridLabel = label;

  const updateData = (gridData: Item[] = []): Item[] => {
    return gridData.map((item, index) => ({
      ...item,
      INDEX: `${index}`,
      _rowColor:
        item?.CLR === "N"
          ? "rgb(255, 0, 0)"
          : item.CLR === "P"
          ? "rgb(40, 180, 99)"
          : item.CLR === "Y"
          ? "rgb(130, 224, 170)"
          : item.CLR === "W"
          ? "rgb(244, 208, 63)"
          : item.CLR === "E"
          ? "rgb(241, 148, 138)"
          : undefined,
    }));
  };
  let Records = gridData.length;
  return (
    <ClearCacheProvider>
      <Dialog
        open={open}
        fullWidth
        maxWidth="xl"
        style={{ height: "100%" }}
        PaperProps={{
          style: { width: "100%", padding: "7px" },
        }}
      >
        {gridData.length > 0 ? (
          <>
            <GridWrapper
              ref={gridRef}
              key={`verifyDayendChecksumsMetaData` + label + batchCount}
              finalMetaData={verifyDayendChecksumsMetaData as GridMetaDataType}
              data={updateData(gridData)}
              setData={() => null}
              actions={[]}
              hideActionBar={true}
              onClickActionEvent={(index, id, currentData) => {
                if (id === "REPORT") {
                  setCurrentData(currentData);
                  reportMutation.mutate({
                    COMP_CD: authState?.companyID,
                    BRANCH_CD: currentBranch.current,
                    TRAN_DT: authState?.workingDate,
                    VERSION: currentData?.EOD_VER_ID,
                    SR_CD: currentData?.SR_CD,
                  });
                  setOpenReport(true);
                }
              }}
              setAction={handleAction}
              onlySingleSelectionAllow={false}
              defaultSelectedRowId={currentSRCD ?? null}
            />
            <Paper
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "8px 10px 10px 8px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography
                  component="span"
                  variant="subtitle2"
                  style={{
                    whiteSpace: "nowrap",
                    paddingInline: "33px",
                  }}
                >
                  {t("TotalNoofrecords")}
                  {Records}
                </Typography>
                <div
                  style={{ display: "flex", gap: "4px", marginBottom: "1px" }}
                >
                  <Chip
                    label="Success"
                    variant="outlined"
                    color="default"
                    style={{
                      backgroundColor: "rgb(130, 224, 170)",
                      color: "white",
                    }}
                  />
                  <Chip
                    label="In Process"
                    color="default"
                    variant="outlined"
                    style={{
                      backgroundColor: "rgb(40, 180, 99)",
                      color: "white",
                    }}
                  />
                  <Chip
                    label="Warning"
                    color="default"
                    variant="outlined"
                    style={{
                      backgroundColor: "rgb(244, 208, 63)",
                      color: "white",
                    }}
                  />
                  <Chip
                    label="Error"
                    color="default"
                    variant="outlined"
                    style={{
                      backgroundColor: "rgb(241, 148, 138)",
                      color: "white",
                    }}
                  />
                </div>
                <div
                  style={{
                    whiteSpace: "nowrap",
                    paddingLeft: "33px",
                    display: "flex",
                    alignContent: "center",
                    justifyContent: "center",
                  }}
                >
                  {DoEodMutation?.isLoading || sessionDtlMutation?.isLoading
                    ? ` Checksum Executed. Doing ${processFlag} `
                    : ""}
                  {sessionDtlMutation.isLoading || DoEodMutation.isLoading ? (
                    <div style={{ marginLeft: "12px" }}>
                      <LoadingTextAnimation />
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              <div>
                {loopStart && flag === "D" && (
                  <GradientButton
                    onClick={() => {
                      setGridData([]);
                      resultRef.current = null;
                      checkSumsDataMutation.mutate({
                        FLAG: flag,
                        SCREEN_REF: "TRN/399",
                        FOR_BRANCH: currentBranch.current,
                        EOD_EOS_FLG: reqData[0]?.EOD_EOS_FLG,
                      });
                      setLoopStart(false);
                    }}
                    color={"primary"}
                  >
                    {t("start")}
                  </GradientButton>
                )}
                {loopStart && (
                  <GradientButton
                    onClick={() => {
                      close();
                    }}
                    color={"primary"}
                  >
                    {t("Close")}
                  </GradientButton>
                )}
              </div>
            </Paper>
          </>
        ) : (
          <div style={{ width: "100%" }}>
            <LoaderPaperComponent />
          </div>
        )}

        {openReport && (
          <ViewEodReport
            open={openReport}
            close={() => setOpenReport(false)}
            metaData={executeChecksumsReportMetaData}
            reportData={rowData}
            reportLabel={`EOD Error Log : ${authState?.workingDate} and Version :${currentData?.EOD_VER_ID} ${currentData?.DESCRIPTION}`}
            loading={reportMutation.isLoading}
          />
        )}
      </Dialog>
    </ClearCacheProvider>
  );
};
