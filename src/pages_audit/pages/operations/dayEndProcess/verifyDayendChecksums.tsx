import { AuthContext } from "pages_audit/auth";
import { useCallback, useContext, useEffect, useState } from "react";
import * as API from "./api";
import { ClearCacheProvider, queryClient } from "cache";
import { useMutation, useQuery } from "react-query";
import GridWrapper, { GridMetaDataType } from "components/dataTableStatic";
import {
  verifyDayendChecksumsMetaData,
  dayEndErroeLogMetaData,
} from "./gridMetadata";
import { ActionTypes } from "components/dataTable";
import { useNavigate } from "react-router-dom";
import { ViewEodReport } from "./viewEodReport";
import { usePopupContext } from "components/custom/popupContext";
import { Alert } from "components/common/alert";
import { Dialog } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { LoaderPaperComponent } from "components/common/loaderPaper";

// Define TypeScript interfaces
interface Item {
  CHKSM_TYPE?: string;
  SR_CD?: string;
  MENDETORY?: string;
  EOD_VER_ID?: string;
  CLR?: string;
  // other properties if any
}

interface ApiResponse {
  CLR?: string;
}

// Define actions for GridWrapper component
const actions: ActionTypes[] = [
  {
    actionName: "close",
    actionLabel: "Close",
    multiple: undefined,
    alwaysAvailable: true,
  },
];

export const VerifyDayendChecksums = ({
  open,
  close,
}: {
  open: boolean;
  close: () => void;
}) => {
  const { authState } = useContext(AuthContext);
  const [openReport, setOpenReport] = useState(false);
  const [rowData, setRowData] = useState<any[]>([]);
  const [gridData, setGridData] = useState<Item[]>([]);
  const [reqData, setReqData] = useState<any>({});
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const navigate = useNavigate();

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

  // Process array of items and add CLR from API response
  const processArray = async (data: Item[]): Promise<void> => {
    const results: (Item & { CLR?: string })[] = [...gridData]; // Initialize with existing gridData

    for (const item of data) {
      const reqPara = {
        FLAG: "C",
        SCREEN_REF: "TRN/399",
        FOR_BRANCH: "099 ",
        EOD_EOS_FLG: "E",
        CHKSM_TYPE: item?.CHKSM_TYPE,
        SR_CD: item?.SR_CD,
        MENDETORY: item?.MENDETORY,
        EOD_VER_ID: item?.EOD_VER_ID,
      };

      try {
        const response: ApiResponse = await API.executeChecksums(reqPara);
        if (response && response[0]?.MESSAGE !== "") {
          // Show the message box with the response message
          const buttonName = await MessageBox({
            messageTitle: "Validation Failed",
            message: response[0]?.MESSAGE,
            buttonNames: ["Ok"],
          });

          if (buttonName !== "Ok") {
            // If the user did not click "Ok", break the loop or handle accordingly
            break; // or continue; depending on your requirement
          }
        }

        // Continue with the item processing
        const updatedItem = { ...item, CLR: response[0]?.CLR };
        results.push(updatedItem);
        setGridData([...results]); // Update state immediately
      } catch (error) {
        console.error("Mutation failed:", error);
        results.push(item);
        setGridData([...results]); // Update state immediately
      }
    }
  };

  // Mutation to get checksum data
  const checkSumsDataMutation = useMutation(API.getCheckSums, {
    onError: (error: any) => {
      let errorMsg = "Unknown error occurred";
      if (typeof error === "object") {
        errorMsg = error?.error_msg ?? errorMsg;
      }
      enqueueSnackbar(errorMsg, { variant: "error" });
      CloseMessageBox();
    },
    onSuccess: async (data: Item[]) => {
      try {
        await processArray(data);
      } catch (error) {
        console.error("Error processing data:", error);
        enqueueSnackbar("Failed to update data", { variant: "error" });
      }
    },
  });

  // Mutation to execute checksums
  const executeEodMutation = useMutation(API.executeChecksums, {
    onError: (error: any) => {
      let errorMsg = "Unknown error occurred";
      if (typeof error === "object") {
        errorMsg = error?.error_msg ?? errorMsg;
      }
      enqueueSnackbar(errorMsg, { variant: "error" });
      CloseMessageBox();
    },
    onSuccess: () => {
      CloseMessageBox();
    },
  });

  // Query to validate EOD
  const {
    data: validatedData,
    isLoading: validateLoading,
    isError: validateError,
    error: validateErrorDetails,
    isSuccess: validateSuccess,
  } = useQuery(
    ["getValidateEod"],
    () =>
      API.getValidateEod({
        SCREEN_REF: "TRN/399",
        FLAG: "C",
      }),
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
              messageTitle: "Validation Failed",
              message: message,
              buttonNames: ["Ok"],
            });
            if (buttonName === "Ok") {
              close();
            }
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
            }
            if (buttonName === "Yes") {
              checkSumsDataMutation.mutate({
                FLAG: "C",
                SCREEN_REF: "TRN/399",
                FOR_BRANCH: data[0]?.BRANCH_LIST[0],
                EOD_EOS_FLG: data[0]?.EOD_EOS_FLG,
              });
              CloseMessageBox();
            }
          } else {
            // Handle other statuses if necessary
          }
        }
        console.log("Data validated successfully:", data);
      },
      onError: (error) => {
        console.error("Error validating data:", error);
      },
    }
  );

  useEffect(() => {
    setReqData(validatedData);
  }, [validatedData]);

  // Mutation to get document URL
  const docUrlMutation = useMutation(API.getDocUrl, {
    onError: async (error: any) => {
      await MessageBox({
        message: error?.error_msg ?? "Error occurred",
        messageTitle: "Error",
        buttonNames: ["Ok"],
      });
    },
    onSuccess: (data: any) => {
      window.open(`/cbsenfinity/${data[0]?.DOC_URL}`, "_blank");
    },
  });

  // Mutation to get pending transaction report
  const reportMutation = useMutation(API.getpendingtrnReport, {
    onError: async (error: any) => {
      await MessageBox({
        message: error?.error_msg ?? "Error occurred",
        messageTitle: "Error",
        buttonNames: ["Ok"],
      });
    },
    onSuccess: (data: any) => {
      setRowData(data);
      setOpenReport(true);
    },
  });
  let updateData = (data: Item[]): Item[] => {
    return data.map((item) => ({
      ...item,
      // Set row color based on DOC_STATUS
      _rowColor:
        item.CLR === "N"
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

  const updatedData = updateData(gridData);
  console.log(updatedData);

  // Update grid label based on gridData
  verifyDayendChecksumsMetaData.gridConfig.gridLabel =
    gridData.length > 0 //@ts-ignore
      ? `${gridData[0]?.TITLE} Version Id:${gridData[0]?.EOD_VER_ID}`
      : "Day End Process";

  useEffect(() => {
    return () => {
      queryClient.removeQueries(["getValidateEod"]);
    };
  }, []);

  return (
    <ClearCacheProvider>
      <Dialog
        open={open}
        fullWidth
        maxWidth="xl"
        style={{ height: "100%" }}
        PaperProps={{
          style: { width: "80%", padding: "7px" },
        }}
      >
        {validateError && (
          <Alert
            severity="error"
            //@ts-ignore
            errorMsg={validateErrorDetails?.error_msg ?? "Something went wrong"}
            //@ts-ignore
            errorDetail={validateErrorDetails?.error_detail}
            color="error"
          />
        )}

        {gridData.length > 0 ? (
          <GridWrapper
            key={"pendingtrns"}
            finalMetaData={verifyDayendChecksumsMetaData as GridMetaDataType}
            data={updatedData}
            setData={() => null}
            actions={actions}
            onClickActionEvent={(index, id, currentData) => {
              if (id === "REPORT") {
                // Uncomment and implement as needed
                // reportMutation.mutate(reportPayload);
              }
              if (id === "OPEN") {
                // Uncomment and implement as needed
                // docUrlMutation.mutate(docUrlPayload);
              }
            }}
            setAction={handleAction}
          />
        ) : (
          <div style={{ width: "100%" }}>
            <LoaderPaperComponent />
          </div>
        )}
        {openReport && (
          <ViewEodReport
            open={openReport}
            close={() => setOpenReport(false)}
            metaData={dayEndErroeLogMetaData}
            reportData={rowData}
            reportLabel={`EOD Error Log : ${authState?.workingDate} and Version ${rowData} User Defined Checksum`}
          />
        )}
      </Dialog>
    </ClearCacheProvider>
  );
};
