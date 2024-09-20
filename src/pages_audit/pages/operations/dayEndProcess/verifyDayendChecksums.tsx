import { useCallback, useContext, useEffect, useRef, useState } from "react";
import * as API from "./api";
import { ClearCacheProvider, queryClient } from "cache";
import { useMutation, useQuery } from "react-query";
import GridWrapper, { GridMetaDataType } from "components/dataTableStatic";
import {
  verifyDayendChecksumsMetaData,
  executeChecksumsReportMetaData,
} from "./gridMetadata";
import { ActionTypes } from "components/dataTable";
import { useNavigate } from "react-router-dom";
import { ViewEodReport } from "./viewEodReport";
import { usePopupContext } from "components/custom/popupContext";
import { Chip, Dialog, Paper, Typography } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { LoaderPaperComponent } from "components/common/loaderPaper";
import { AuthContext } from "pages_audit/auth";
import LoaderImg from "./Loader.gif";
import { GradientButton } from "components/styledComponent/button";
import { t } from "i18next";
import Typograhpy from "components/common/typograhpy";

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

const actions: ActionTypes[] = [
  {
    actionName: "close",
    actionLabel: "Close",
    alwaysAvailable: true,
    multiple: undefined,
  },
];

export const VerifyDayendChecksums = ({
  open,
  close,
  flag,
}: {
  open: boolean;
  close: () => void;
  flag: string;
}) => {
  const { authState } = useContext(AuthContext);
  const [openReport, setOpenReport] = useState(false);
  const [docData, setDocData] = useState<any>({});
  const [openedWindow, setOpenedWindow] = useState<Window | null>(null);
  const warningCountRef = useRef(0);
  const [currentSRCD, setCurrentSRCD] = useState<string | null>(null);
  const [rowData, setRowData] = useState<any[]>([]);
  const [gridData, setGridData] = useState<Item[]>([]);
  const [reqData, setReqData] = useState<any>({});
  const [currentData, setCurrentData] = useState<any>({});
  const [loopStart, setLoopStart] = useState<any>(false);
  const [warningsObj, setWarningsObj] = useState({});
  // const { authState, logout } = useContext(AuthContext);
  const warningsObjRef = useRef<any>({});
  const npaCalckref = useRef<any>();
  const mewSessionref = useRef<any>();
  warningsObjRef.current = warningsObj;
  const [switchBranchPara, setSwitchBranchPara] = useState<any>(true);
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const currentBranch = useRef<any>(null);
  const navigate = useNavigate();
  const gridRef = useRef<HTMLDivElement | null>(null);

  // State to track processed batch count
  const [batchCount, setBatchCount] = useState<number>(0);

  const handleAction = useCallback(
    async (data: any) => {
      if (data?.name === "close") {
        close();
      } else {
        navigate(data?.name, { state: data?.rows });
      }
    },
    [navigate, close]
  );
  console.log(mewSessionref?.current);
  console.log(npaCalckref?.current);

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
          gridData[0]?.TITLE.slice(21),
        ],
      }));
    }
  }, [warningCountRef.current]);

  useEffect(() => {
    warningsObjRef.current = warningsObj;
  }, [warningsObj]);

  const processRecord = async (
    record: Item,
    index: number
  ): Promise<string> => {
    const startTime = new Date();
    setCurrentSRCD(record.SR_CD ?? null);

    // Update grid data to reflect processing start
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
      // Execute API call
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

      // Update grid data based on response
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

      // Check for stopping conditions
      if (
        flag === "D" &&
        response[0]?.CLR === "E" &&
        response[0]?.EXIT_YN === "Y"
      ) {
        // Show message if conditions are met
        await MessageBox({
          messageTitle: "Error",
          message: response[0]?.MESSAGE || "Unknown error occurred",
          icon: "ERROR",
          buttonNames: ["Ok"],
        });
        CloseMessageBox(); // Ensure the message box is closed
        setLoopStart(true);
        return "stop"; // Signal to stop processing
      }

      if (flag === "C" && response[0]?.MESSAGE !== "") {
        // Handle message box response if FLAG is "C"
        const buttonName = await MessageBox({
          messageTitle: "Error",
          message: response[0]?.MESSAGE,
          icon: "ERROR",
          buttonNames: ["Ok"],
        });

        if (buttonName !== "Ok") {
          return "stop"; // Stop processing if button clicked is not "Ok"
        }
      }
      if (response[0]?.CLR === "W") {
        warningCountRef.current += 1;
      }
      // Update batch count every 13 records processed
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
      if (result === "stop") {
        await API.updateEodRunningStatus({
          COMP_CD: authState?.companyID,
          BRANCH_CD: authState?.user?.branchCode,
          FLAG: "N",
        });
        return false;
      }
    }
    return true;
  };
  const DoEodMutation = useMutation(API.doEod, {
    onError: (error: any) => {},
    onSuccess: async (data) => {
      for (const response of data[0] ?? []) {
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
            buttonNames: ["Yes", "No"],
            defFocusBtnName: "Yes",
          });
          if (buttonName === "No") {
            break;
          }
        } else if (response?.O_STATUS === "0") {
          console.log("day has been ended");
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

      if (flag === "C" && allRecordsProcessed) {
        await MessageBox({
          messageTitle: "Success",
          message: "EOD CheckSum completed successfully.",
          buttonNames: ["Ok"],
          icon: "SUCCESS",
        });
      }

      if (flag === "D" && allRecordsProcessed) {
        const mandatoryPassedCount = data.filter(
          (item) => item.CLR === "Y" && item.MENDETORY === "Y"
        ).length;
        // await MessageBox({
        //   messageTitle: "Processing Complete",
        //   message: ` Warnings: ${warningCountRef.current}. Branch: ${currentBranch.current}`,
        //   icon: "WARNING",
        //   buttonNames: ["Ok"],
        // });
        if (mandatoryPassedCount === 0) {
          await MessageBox({
            messageTitle: "Validation Failed.",
            message:
              "At least one Mandatory CheckSum should be completed successfully.\nSorry for the inconvenience.",
            buttonNames: ["Ok"],
            icon: "ERROR",
          });
        }
      }
      setSwitchBranchPara(true);

      const sessionDtl = await API.getSessionDtl({
        COMP_CD: authState?.companyID,
        BRANCH_CD: authState?.user?.branchCode,
        BASE_BRANCH_CD: authState?.baseCompanyID,
        BASE_COMP_CD: authState?.user?.baseBranchCode,
        WORKING_DATE: authState?.workingDate,
      });
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
              // const branchList = ["002 ", "003 "];
              const branchList = data[0]?.BRANCH_LIST;
              if (branchList.length > 0) {
                if (switchBranchPara) {
                  for (const branch of branchList) {
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
                }
                // Prepare the message to display
                let message = "";
                // for (const [branch, warnings] of Object.entries(warningsObj)) {
                //   console.log("branch", branch + warnings);

                //   message += `Branch: ${branch} Warning= ${warnings}.\n`;
                // }

                for (let key in warningsObjRef.current) {
                  message += `Branch: ${warningsObjRef.current[key][1]} Warning= ${warningsObjRef.current[key][0]}.\n`;
                }

                const confirmation = await MessageBox({
                  messageTitle: "EOD CheckSum having Warning(s).",
                  message: `${message}\nAre you sure to Continue?`,
                  icon: "WARNING",
                  buttonNames: ["Yes", "No"],
                });
                if (confirmation === "Yes") {
                  const sessionDtl = await API.getSessionDtl({
                    COMP_CD: authState?.companyID,
                    BRANCH_CD: authState?.user?.branchCode,
                    BASE_BRANCH_CD: authState?.baseCompanyID,
                    BASE_COMP_CD: authState?.user?.baseBranchCode,
                    WORKING_DATE: authState?.workingDate,
                  });
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
                        buttonNames: ["Yes", "No"],
                        // defFocusBtnName: "Yes",
                      });
                      if (buttonName === "Yes") {
                        if (response?.O_COLUMN_NM === "AUTO_NPA") {
                          npaCalckref.current = "Y";
                        } else {
                          console.log("condition true");

                          npaCalckref.current = "N";
                        }

                        if (response?.O_COLUMN_NM === "NEW_SESSION") {
                          mewSessionref.current = sessionDtl[0]?.NEW_SESSION;
                          console.log(
                            "condition true",
                            sessionDtl[0]?.NEW_SESSION
                          );
                        } else {
                          mewSessionref.current =
                            sessionDtl[0]?.DEFAULT_SESSION;
                        }
                        if (flag === "D") {
                          DoEodMutation.mutate({
                            FLAG: flag,
                            SCREEN_REF: "TRN/399",
                            NPA_CALC: npaCalckref?.current,
                            NEW_SESSION: mewSessionref?.current,
                          });
                        }
                      } else if (buttonName === "No") {
                        npaCalckref.current = "N";
                        if (response?.O_COLUMN_NM === "NEW_SESSION") {
                          mewSessionref.current =
                            sessionDtl[0]?.DEFAULT_SESSION;
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

                  // if (sessionDtl) {
                  //   await API.doEod({
                  //     FLAG: flag,
                  //     SCREEN_REF: "TRN/399",
                  //     NPA_CALC: "",
                  //     NEW_SESSION: "NEW_SESSION",
                  //   });
                  // }
                }
              }
              CloseMessageBox();
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

  const docurlMutation = useMutation(API.getDocUrl, {
    onError: async (error: any) => {
      await MessageBox({
        message: error?.error_msg,
        messageTitle: "Error",
        buttonNames: ["Ok"],
      });
    },
    onSuccess: async (data) => {
      setDocData(data);
      const url = `/cbsenfinity/${data[0]?.DOCUMENT_URL}`;
      const newWindow = window.open(url, "_blank");
      if (newWindow) {
        setOpenedWindow(newWindow);
        newWindow.focus();
        queryClient.removeQueries(["getDocUrl"]);
      }
    },
  });

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
      `${gridData[0]?.TITLE} Version Id: ${gridData[0]?.EOD_VER_ID}`
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

  return (
    <ClearCacheProvider>
      <Dialog
        open={open}
        fullWidth
        maxWidth="xl"
        style={{ height: "100%" }}
        PaperProps={{
          style: { width: "87%", padding: "7px" },
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
              actions={actions}
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
                } else if (id === "OPEN") {
                  docurlMutation.mutate({
                    BASE_COMP: authState?.baseCompanyID,
                    BASE_BRANCH: authState?.user?.baseBranchCode,
                    DOC_CD: currentData?.DOCU_CD,
                  });
                }
              }}
              setAction={handleAction}
              onlySingleSelectionAllow={false}
              defaultSelectedRowId={currentSRCD ?? null}
            />
            <Paper sx={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <Chip
                  label="Success"
                  color="default"
                  style={{
                    backgroundColor: "rgb(130, 224, 170)",
                    color: "white",
                  }}
                />
                <Chip
                  label="In Process"
                  color="default"
                  style={{
                    backgroundColor: "rgb(40, 180, 99)",
                    color: "white",
                  }}
                />
                <Chip
                  label="Warning"
                  color="default"
                  style={{
                    backgroundColor: "rgb(244, 208, 63)",
                    color: "white",
                  }}
                />
                <Chip
                  label="Error"
                  color="default"
                  style={{
                    backgroundColor: "rgb(241, 148, 138)",
                    color: "white",
                  }}
                />
              </div>
              <div>
                <Typography
                  component="span"
                  variant="subtitle2"
                  style={{ whiteSpace: "nowrap" }}
                >
                  {" Checksum Executed. Doing DayEnd or Handover"}
                </Typography>

                {loopStart && (
                  <GradientButton
                    onClick={() => {
                      setGridData([]);
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
              </div>
            </Paper>
          </>
        ) : (
          <div style={{ width: "100%" }}>
            <LoaderPaperComponent />
          </div>
        )}
        {docurlMutation.isLoading && (
          <Dialog
            open={docurlMutation.isLoading}
            PaperProps={{
              style: { width: "60%", overflow: "auto" },
            }}
            maxWidth="lg"
          >
            <LoaderPaperComponent />
          </Dialog>
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
