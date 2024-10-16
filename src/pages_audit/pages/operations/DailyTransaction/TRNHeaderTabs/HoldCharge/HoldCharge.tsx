import {
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useMutation, useQuery } from "react-query";
import { HoldChargeGridMetaData } from "./gridMetadata";
import {
  ActionTypes,
  Alert,
  GridMetaDataType,
  GridWrapper,
  queryClient,
  usePopupContext,
} from "@acuteinfo/common-base";
import * as API from "./api";
import { AuthContext } from "pages_audit/auth";
import i18n from "components/multiLanguage/languagesConfiguration";

const actions: ActionTypes[] = [
  {
    actionName: "proceed",
    actionLabel: "Proceed",
    multiple: undefined,
    rowDoubleClick: false,
    alwaysAvailable: true,
  },
];
export const HoldCharge = ({ reqData }) => {
  const { authState } = useContext(AuthContext);
  const myGridRef = useRef<any>(null);
  const [rows, setRows] = useState([]);
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const oldRowsDataRef = useRef<any>([]);
  const PreviousRowsDataRef = useRef<any>([]);
  const previousRow = useRef<any>({});
  const { data, isLoading, isFetching, refetch, error, isError } = useQuery<
    any,
    any
  >(["getHoldChargeList", { reqData }], () => API.getHoldChargeList(reqData), {
    onSuccess: (data) => {
      setRows(data);
      oldRowsDataRef.current = data;
      PreviousRowsDataRef.current = data;
    },
  });
  const validateHoldCharge = useMutation(API.validateHoldCharge, {
    onError: async (error: any) => {
      const btnName = await MessageBox({
        messageTitle: "ValidationFailed",
        message: error?.error_msg ?? "",
        icon: "ERROR",
      });
      CloseMessageBox();
    },
    onSuccess: async (data) => {
      let updatedRows = [...rows];
      for (let i = 0; i < data.length; i++) {
        if (data[i]?.O_STATUS === "999") {
          const btnName = await MessageBox({
            messageTitle: "ValidationFailed",
            message: data[i]?.O_MESSAGE,
            icon: "ERROR",
          });
          if (btnName === "Ok") {
            const rowIndex: any = previousRow.current?.index;

            if (rowIndex !== undefined && rowIndex !== null) {
              const rowToUpdate: any = updatedRows.find(
                (row: any) => row.index === rowIndex
              );

              if (rowToUpdate) {
                // Reset the 'PAID' value to the value in previousRow.current
                rowToUpdate.PAID = previousRow.current?.PAID;

                // Update the state with the modified rows
                setRows(updatedRows);
              }
            }
          }
        } else if (data[i]?.O_STATUS === "99") {
          const btnName = await MessageBox({
            messageTitle: "Confirmation",
            message: data[i]?.O_MESSAGE,
            buttonNames: ["Yes", "No"],
          });
          if (btnName === "No") {
            break;
          }
        } else if (data[i]?.O_STATUS === "9") {
          const btnName = await MessageBox({
            messageTitle: "Alert",
            message: data[i]?.O_MESSAGE,
            icon: "WARNING",
          });
        } else if (data[i]?.O_STATUS === "0") {
        }
      }
    },
  });

  const setCurrentAction = useCallback(async (data) => {
    if (data?.name === "proceed") {
      const updatedRows = myGridRef.current?.cleanData(true);
      const filteredRows = updatedRows?.filter((row) => row.PAID !== "N");
      const paidChanges = filteredRows.map((updatedRow) => ({
        amount: parseFloat(updatedRow.AMOUNT).toFixed(2),
        remarks: updatedRow.REMARKS,
        paid:
          updatedRow.PAID === "Y"
            ? "Paid"
            : updatedRow.PAID === "N"
            ? "Unpaid"
            : updatedRow.PAID === "W"
            ? "Waive"
            : updatedRow.PAID,
      }));

      if (paidChanges.length > 0) {
        const message = paidChanges
          .map(
            (change, index) =>
              `${change.amount} ${change.remarks} ${change.paid}`
          )
          .join("\n");

        const btnName = await MessageBox({
          message: `Are you sure to apply/waive following transactions? \n\n${message} `,
          messageTitle: "Confirmation",
          buttonNames: ["Yes", "No"],
          loadingBtnName: ["Yes"],
        });
        if (btnName === "Yes") {
        }
      }
    }
  }, []);

  useEffect(() => {
    const previousRows = PreviousRowsDataRef?.current;
    rows.forEach((currentRow: any, index) => {
      if (previousRow?.current?.PAID !== currentRow?.PAID) {
        previousRow.current = previousRows[index];
        validateHoldCharge.mutate({
          A_COMP_CD: currentRow?.COMP_CD ?? "",
          A_BRANCH_CD: currentRow?.BRANCH_CD ?? "",
          A_ACCT_TYPE: currentRow?.ACCT_TYPE ?? "",
          A_ACCT_CD: currentRow?.ACCT_CD ?? "",
          A_PAID: currentRow?.PAID ?? "",
          A_AMOUNT: currentRow?.AMOUNT ?? "",
          A_STATUS: reqData?.STATUS ?? "",
          A_NPA_CD: reqData?.NPA_CD ?? "",
          A_GD_DATE: authState?.workingDate ?? "",
          A_USER: authState?.user?.id ?? "",
          A_USER_LEVEL: authState?.role ?? "",
          A_SCREEN_REF: reqData?.SCREEN_REF ?? "",
          A_LANG: i18n.resolvedLanguage,
        });
      }
    });
    PreviousRowsDataRef.current = rows;
  }, [rows]);

  useEffect(() => {
    const keysToRemove = ["getHoldChargeList"].map((key) => [
      key,
      authState?.user?.branchCode,
    ]);
    return () => {
      keysToRemove?.forEach((key) => queryClient?.removeQueries(key));
    };
  }, []);

  return (
    <>
      {isError ? (
        <Fragment>
          <div style={{ width: "100%", paddingTop: "10px" }}>
            <Alert
              severity={error?.severity ?? "error"}
              errorMsg={error?.error_msg ?? "Error"}
              errorDetail={error?.error_detail ?? ""}
            />
          </div>
        </Fragment>
      ) : null}
      <GridWrapper
        key={`HoldChargeGridMetaData` + rows?.length}
        finalMetaData={HoldChargeGridMetaData as GridMetaDataType}
        data={rows ?? []}
        setData={setRows}
        loading={isLoading || isFetching}
        actions={actions}
        setAction={setCurrentAction}
        refetchData={() => refetch()}
        ref={myGridRef}
      />
    </>
  );
};
