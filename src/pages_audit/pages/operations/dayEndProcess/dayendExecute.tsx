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
import { LoadingTextAnimation } from "components/common/loader";
import { enqueueSnackbar } from "notistack";

const actions: ActionTypes[] = [
  {
    actionName: "close",
    actionLabel: "Close",
    multiple: undefined,
    alwaysAvailable: true,
  },
];

export const DayendExecute = ({ open, close }) => {
  const { authState } = useContext(AuthContext);
  const [openReport, setOpenReport] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [gridData, setGridData] = useState([]);
  const [reqData, setReqData] = useState({});
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const navigate = useNavigate();

  const handleAction = useCallback(
    async (data) => {
      if (data?.name === "close") {
        close();
      } else {
        navigate(data?.name, { state: data?.rows });
      }
    },
    [navigate, close]
  );
  const executeEodMutation = useMutation(
    API.executeChecksums,

    {
      onError: (error: any) => {
        let errorMsg = "Unknownerroroccured";
        if (typeof error === "object") {
          errorMsg = error?.error_msg ?? errorMsg;
        }
        enqueueSnackbar(errorMsg, {
          variant: "error",
        });
        CloseMessageBox();
      },
      onSuccess: (data) => {
        enqueueSnackbar("insertSuccessfully", {
          variant: "success",
        });

        CloseMessageBox();
      },
    }
  );
  const checkSumsDataMutation = useMutation(
    API.getCheckSums,

    {
      onError: (error: any) => {
        let errorMsg = "Unknownerroroccured";
        if (typeof error === "object") {
          errorMsg = error?.error_msg ?? errorMsg;
        }
        enqueueSnackbar(errorMsg, {
          variant: "error",
        });
        CloseMessageBox();
      },
      onSuccess: async (data) => {
        setGridData(data);
        // If 'data' is already the RESPONSE array, you can use it directly.
        // Otherwise, extract it from the first element if 'data' is wrapped in an array.
        const responses = Array.isArray(data) ? data : data;

        // Filter the responses to get objects where MENDETORY is "Y"
        const mandatoryResponses = responses.filter(
          (item) => item.MENDETORY === "Y"
        );
        const payload: any = {
          FLAG: "D",
          SCREEN_REF: "TRN/399",
          FOR_BRANCH: "099 ",
          EOD_EOS_FLG: reqData[0]?.EOD_EOS_FLG,
          CHKSM_TYPE: mandatoryResponses[0]?.CHKSM_TYPE,
          SR_CD: mandatoryResponses[0]?.SR_CD,
          MENDETORY: mandatoryResponses[0]?.MENDETORY,
          EOD_VER_ID: mandatoryResponses[0]?.EOD_VER_ID,
        };
        executeEodMutation.mutate({
          ...payload,
        });
        // Log the mandatory responses to the console
        console.log("Mandatory responses:", mandatoryResponses);

        // If you need to perform any additional actions with the mandatoryResponses, you can do so here.
      },
    }
  );
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
        FLAG: "D",
      }),
    {
      onSuccess: async (data) => {
        const responseData = Array.isArray(data) ? data[0] : {};

        const responses = Array.isArray(responseData?.V_MSG)
          ? responseData.V_MSG
          : [responseData?.V_MSG];
        for (const response of responses) {
          const status = response.O_STATUS; // Use O_STATUS
          const message = response.O_MESSAGE; // Use O_MESSAGE

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
              break; // Exit loop if user selects "No"
            }
            if (buttonName === "Yes") {
              checkSumsDataMutation.mutate({
                FLAG: "C",
                SCREEN_REF: "TRN/399",
                FOR_BRANCH: data[0]?.BRANCH_LIST[0],
                EOD_EOS_FLG: data[0]?.EOD_EOS_FLG,
              });
              enqueueSnackbar("Success", {
                variant: "success",
              });
              CloseMessageBox();
            }
          } else {
            // Handle other statuses if necessary
          }
        }

        console.log("Data validated successfully:", data);
      },

      onError: (error) => {},
    }
  );
  useEffect(() => {
    setReqData(validatedData);
  }, [validatedData]);

  const docUrlMutation = useMutation(API.getDocUrl, {
    onError: async (error) => {
      await MessageBox({
        //@ts-ignore
        message: error?.error_msg,
        messageTitle: "Error",
        buttonNames: ["Ok"],
      });
    },
    onSuccess: (data) => {
      window.open(`/cbsenfinity/${data[0]?.DOC_URL}`, "_blank");
    },
  });

  const reportMutation = useMutation(API.getpendingtrnReport, {
    onError: async (error) => {
      await MessageBox({
        //@ts-ignore
        message: error?.error_msg,
        messageTitle: "Error",
        buttonNames: ["Ok"],
      });
    },
    onSuccess: (data) => {
      setRowData(data);
      setOpenReport(true);
    },
  });

  useEffect(() => {
    return () => {
      queryClient.removeQueries(["getValidateEod"]);
    };
  }, []);

  return (
    <>
      <ClearCacheProvider>
        <Dialog open={open} fullScreen maxWidth="xl">
          {validateError && (
            <Alert
              severity="error"
              //@ts-ignore
              errorMsg={
                //@ts-ignore
                validateErrorDetails?.error_msg ?? "Something went wrong"
              }
              //@ts-ignore
              errorDetail={validateErrorDetails?.error_detail}
              color="error"
            />
          )}

          {"gridDataLoading" ? (
            <GridWrapper
              key={"pendingtrns"}
              finalMetaData={verifyDayendChecksumsMetaData as GridMetaDataType}
              data={gridData}
              setData={() => null}
              actions={actions}
              onClickActionEvent={(index, id, currentData) => {
                if (id === "REPORT") {
                  // reportMutation.mutate(reportPayload);
                }
                if (id === "OPEN") {
                  // docUrlMutation.mutate(docUrlPayload);
                }
              }}
              // loading={gridDataLoading || validateLoading || checksumsLoading}
              ReportExportButton={true}
              setAction={handleAction}
            />
          ) : (
            <LoadingTextAnimation />
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
    </>
  );
};
