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
import { Chip, Dialog, Paper } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { LoaderPaperComponent } from "components/common/loaderPaper";
import { AuthContext } from "pages_audit/auth";
import LoaderImg from "./Loader.gif";
import { GradientButton } from "components/styledComponent/button";
import { t } from "i18next";

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
  const [rowData, setRowData] = useState<any[]>([]);
  const [gridData, setGridData] = useState<Item[]>([]);
  const [reqData, setReqData] = useState<any>({});
  const [currentData, setCurrentData] = useState<any>({});
  const [loopStart, setLoopStart] = useState<any>(false);
  const [switchBranchPara, setSwitchBranchPara] = useState<any>(true);
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const currentBranch = useRef<any>(null);
  const navigate = useNavigate();
  const gridRef = useRef<HTMLDivElement | null>(null);
  console.log(currentBranch.current);

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

      // Function to format time
      const formatTime = (date: Date): string => {
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const seconds = String(date.getSeconds()).padStart(2, "0");
        return `${hours}:${minutes}:${seconds}`;
      };

      // Function to process each record
      const processRecord = async (
        record: Item,
        index: number
      ): Promise<string> => {
        const startTime = new Date();

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
        } catch (error) {
          enqueueSnackbar("Error executing EOD for record", {
            variant: "error",
          });
        }

        return "continue"; // Continue the process if no stop condition is met
      };

      // Process each record and respect the stop condition
      const processRecords = async (records: Item[]) => {
        console.log(records);

        for (let i = 0; i < records.length; i++) {
          const result = await processRecord(records[i], i);
          console.log(result);

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

      // Execute the record processing
      const allRecordsProcessed = await processRecords(data);

      // Show success message only if flag is "C" and all records were processed successfully
      if (flag === "C" && allRecordsProcessed) {
        await MessageBox({
          messageTitle: "Success",
          message: "EOD CheckSum completed successfully.",
          buttonNames: ["Ok"],
          icon: "SUCCESS",
        });
      }

      // Check if mandatory checks passed only if all records were processed successfully
      if (flag === "D" && allRecordsProcessed) {
        const mandatoryPassedCount = data.filter(
          (item) => item.CLR === "Y" && item.MENDETORY === "Y"
        ).length;

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

      // Execute getSessionDtl API call after processing records and handling mandatory checks
      const sessionDtl = await API.getSessionDtl({
        COMP_CD: authState?.companyID,
        BRANCH_CD: authState?.user?.branchCode,
        BASE_BRANCH_CD: authState?.baseCompanyID,
        BASE_COMP_CD: authState?.user?.baseBranchCode,
        WORKING_DATE: authState?.workingDate,
      }); // Ensure this API call is correctly defined in your API module
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
              const branchList = ["002 ", "003 ", "004 "]; // Placeholder for actual branch list
              if (branchList.length > 0) {
                if (switchBranchPara) {
                  // Sequential processing of branches
                  for (const branch of branchList) {
                    console.log("branch", branch);
                    currentBranch.current = branch;

                    // Create a function to process each branch sequentially
                    const processBranch = async (branch: string) => {
                      await checkSumsDataMutation.mutateAsync({
                        FLAG: flag,
                        SCREEN_REF: "TRN/399",
                        FOR_BRANCH: branch,
                        EOD_EOS_FLG: data[0]?.EOD_EOS_FLG,
                      });
                      // Proceed to the next branch
                    };

                    // Process the current branch
                    await processBranch(branch);
                  }
                }
              }
              CloseMessageBox();
            }
          }
        }
      },
      onError: (error) => {
        console.error("Error validating data:", error);
      },
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
      gridData[0]?.TITLE
    : "Day Ebd Process";
  verifyDayendChecksumsMetaData.gridConfig.gridLabel = label;

  const updateData = (gridData: Item[] = []): Item[] => {
    return gridData.map((item) => ({
      ...item,
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
        maxWidth="lg"
        style={{ height: "100%" }}
        PaperProps={{
          style: { width: "80%", padding: "7px" },
        }}
      >
        {gridData.length > 0 ? (
          <>
            <GridWrapper
              ref={gridRef}
              key={`verifyDayendChecksumsMetaData` + label}
              finalMetaData={verifyDayendChecksumsMetaData as GridMetaDataType}
              data={updateData(gridData)}
              setData={() => null}
              actions={actions}
              onClickActionEvent={(index, id, currentData) => {
                if (id === "REPORT") {
                  setCurrentData(currentData);
                  reportMutation.mutate({
                    COMP_CD: authState?.companyID,
                    BRANCH_CD: reqData[0]?.BRANCH_LIST[0],
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
                {loopStart && (
                  <GradientButton
                    onClick={(event) => {
                      // restartLoop();
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
