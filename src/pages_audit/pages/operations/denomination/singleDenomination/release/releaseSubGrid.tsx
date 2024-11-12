import {
  ActionTypes,
  Alert,
  GridMetaDataType,
  GridWrapper,
  queryClient,
  usePopupContext,
} from "@acuteinfo/common-base";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import * as API from "../api";
import { useMutation, useQuery } from "react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { format, parse } from "date-fns";
import { enqueueSnackbar } from "notistack";
import { releaseSubGridMetaData } from "./metadata";
import { Dialog } from "@mui/material";

const releaseSubActions: ActionTypes[] = [
  {
    actionName: "cancle",
    actionLabel: "Cancel",
    multiple: false,
    rowDoubleClick: false,
    alwaysAvailable: true,
  },
];

const releaseAction = {
  actionName: "release",
  actionLabel: "Release",
  multiple: true,
  rowDoubleClick: true,
  alwaysAvailable: true,
};

const ReleaseSubGrid = ({ handleRlsSubClose, refetchMainGrid }) => {
  const [releaseSubData, setReleaseSubData] = useState<any>([]);
  const [releaseSubAction, setReleaseSubAction] =
    useState<any>(releaseSubActions);
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const { state: stateData }: any = useLocation();
  const releaseSubRef = useRef<any>(null);

  const reqObject = {
    ENTERED_BRANCH_CD: stateData?.ENTERED_BRANCH_CD,
    ENTERED_COMP_CD: stateData?.ENTERED_COMP_CD,
    MCT_TRAN_CD: stateData?.MCT_TRAN_CD,
  };

  const { data, isLoading, isFetching, refetch, error, isError } = useQuery<
    any,
    any
  >(["releaseSubData", { ...reqObject }], () =>
    API?.getReleaseSubGridData({ ...reqObject })
  );

  useEffect(() => {
    if (data?.length > 0) {
      setReleaseSubData(data);
    }
  }, [data]);

  const releaseRecords: any = useMutation(API?.releaseRecords, {
    onSuccess: async (data: any, variables?: any) => {
      if (data?.length > 0) {
        const getBtnName = async (msgObj) => {
          let btnNm = await MessageBox(msgObj);
          return { btnNm, msgObj };
        };
        const handleMessages = async (status, message) => {
          if (status === "999") {
            await getBtnName({
              messageTitle: "ValidationFailed",
              message,
              icon: "ERROR",
            });
          } else if (status === "99") {
            const { btnNm } = await getBtnName({
              messageTitle: "Confirmation",
              message,
              buttonNames: ["Yes", "No"],
              icon: "CONFIRM",
            });

            if (btnNm === "No") {
              return;
            }
          } else if (status === "9") {
            await getBtnName({
              messageTitle: "Alert",
              message,
              icon: "WARNING",
            });
          } else if (status === "0") {
            await getBtnName({
              messageTitle: "Success",
              message,
              icon: "SUCCESS",
            });
          }
        };
        for (let i = 0; i < data?.length; i++) {
          const status: any = data?.[i]?.O_STATUS;
          const message = data?.[i]?.O_MESSAGE;

          setTimeout(() => {
            handleMessages(status, message);
          }, 50);
        }
        CloseMessageBox();
        handleRlsSubClose();
        refetchMainGrid();
      }
    },
    onError: (error: any, variables?: any) => {
      CloseMessageBox();
      // enqueueSnackbar(error?.error_msg, {
      //   variant: "error",
      // });
    },
  });

  const rlsSubCurrentAction = useCallback(
    async (data) => {
      const row = data?.rows;
      if (data?.name === "cancle") {
        handleRlsSubClose();
      } else if (data?.name === "release") {
        const gridData = releaseSubRef?.current?.cleanData?.();
        if (gridData?.some((record) => record?.DELETE_FLAG === "Y")) {
          const msgBoxRes = await MessageBox({
            messageTitle: "Confirmation",
            message: `Are you sure to release Reference No.${
              gridData?.[0]?.MCT_TRAN_CD ?? ""
            }?`,
            defFocusBtnName: "Yes",
            icon: "CONFIRM",
            buttonNames: ["Yes", "No"],
            loadingBtnName: ["Yes"],
          });

          if (msgBoxRes === "Yes") {
            // const parsedDate = parse(
            //   gridData?.[0]?.TRAN_DT,
            //   "yyyy/MM/dd",
            //   new Date()
            // );
            // const formattedDate = format(parsedDate, "dd/MMM/yyyy");
            const parsedDate = parse(
              gridData?.[0]?.TRAN_DT,
              "yyyy-MM-dd HH:mm:ss.S",
              new Date()
            );

            // Format the parsed date to your desired format
            const formattedDate = format(parsedDate, "dd/MMM/yyyy");
            const requestPara = {
              TRAN_DT: formattedDate ?? "",
              ENTERED_COMP_CD: gridData?.[0]?.ENTERED_COMP_CD ?? "",
              ENTERED_BRANCH_CD: gridData?.[0]?.ENTERED_BRANCH_CD ?? "",
              SCREEN_REF: "TRN/041",
              TRANSACTION_DTL: gridData
                ?.map((record) => {
                  return {
                    DAILY_TRN_CD: record?.DAILY_TRN_CD ?? "",
                    MCT_TRAN_CD: record?.MCT_TRAN_CD ?? "",
                    DELETE_FLAG: record?.DELETE_FLAG ?? "",
                  };
                })
                ?.filter((record) => record?.DELETE_FLAG === "Y"),
            };
            releaseRecords?.mutate(requestPara);
          } else {
            CloseMessageBox();
          }
        } else {
          enqueueSnackbar("Minimum one row should be selected", {
            variant: "error",
          });
        }
      }
    },
    [releaseSubAction]
  );

  useEffect(() => {
    // console.log(releaseSubData, "console.log");
    // if (releaseSubData?.length > 0) {
    //   const conditionBoolean = releaseSubData?.some(
    //     (item) => item?.DELETE_FLAG === "Y"
    //   );
    //   console.log(conditionBoolean, "conditionBoolean");
    //   const newAction = releaseSubAction;
    //   if (Boolean(conditionBoolean)) {
    //     // if (newAction?.some((item) => item?.actionName !== "release")) {
    //     //   newAction?.push({
    //     //     actionName: "release",
    //     //     actionLabel: "Release",
    //     //     multiple: true,
    //     //     rowDoubleClick: true,
    //     //     alwaysAvailable: true,
    //     //   });
    //     // }
    //     // console.log(newAction, "newAction");
    //     // setReleaseSubAction((pre) => {
    //     //   console.log(pre, "pre");
    //     //   // if (pre?.some((item) => item?.actionName !== "release")) {
    //     //   //   return [
    //     //   //     ...pre,
    //     //   //     {
    //     //   //       actionName: "release",
    //     //   //       actionLabel: "Release",
    //     //   //       multiple: true,
    //     //   //       rowDoubleClick: true,
    //     //   //       alwaysAvailable: true,
    //     //   //     },
    //     //   //   ];
    //     //   // } else {
    //     //   //   return pre;
    //     //   // }
    //     // });

    //     setReleaseSubAction([...releaseSubAction, releaseAction]);
    //   } else {
    //     setReleaseSubAction(releaseSubAction);
    //     // newAction?.pop();
    //     // setReleaseSubAction([
    //     //   {
    //     //     actionName: "cancle",
    //     //     actionLabel: "Cancel",
    //     //     multiple: false,
    //     //     rowDoubleClick: false,
    //     //     alwaysAvailable: true,
    //     //   },
    //     // ]);
    //   }
    //   // setReleaseSubAction(newAction);
    // }

    const conditionBoolean = releaseSubData?.some(
      (item) => item?.DELETE_FLAG === "Y"
    );
    if (conditionBoolean) {
      setReleaseSubAction((prevActions) => {
        const isReleaseActionPresent = prevActions.some(
          (action) => action.actionName === "release"
        );

        if (!isReleaseActionPresent) {
          return [...prevActions, releaseAction];
        }
        return prevActions;
      });
    } else {
      setReleaseSubAction(releaseSubActions);
    }
  }, [releaseSubData]);

  useEffect(() => {
    return () => {
      queryClient.removeQueries(["releaseSubData", { ...reqObject }]);
    };
  }, []);

  return (
    <Dialog open={true} maxWidth={"xl"}>
      <>
        {isError ? (
          <Fragment>
            <Alert
              severity={error?.severity ?? "error"}
              errorMsg={error?.error_msg ?? "Error"}
              errorDetail={error?.error_detail ?? ""}
            />
          </Fragment>
        ) : releaseRecords?.isError ? (
          <Fragment>
            <Alert
              severity={releaseRecords?.error?.severity ?? "error"}
              errorMsg={releaseRecords?.error?.error_msg ?? "Error"}
              errorDetail={releaseRecords?.error?.error_detail ?? ""}
            />
          </Fragment>
        ) : null}
        <GridWrapper
          key={`releaseGridMetaData` + releaseSubAction}
          finalMetaData={releaseSubGridMetaData as GridMetaDataType}
          data={releaseSubData ?? []}
          loading={isLoading || isFetching}
          setData={setReleaseSubData}
          actions={releaseSubAction}
          setAction={rlsSubCurrentAction}
          hideHeader={false}
          controlsAtBottom={true}
          ref={releaseSubRef}
        />
      </>
    </Dialog>
  );
};

export default ReleaseSubGrid;
