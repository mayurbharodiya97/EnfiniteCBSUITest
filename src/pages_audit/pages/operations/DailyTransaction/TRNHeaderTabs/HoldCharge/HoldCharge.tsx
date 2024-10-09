import { Fragment, useCallback, useRef, useState } from "react";
import { useQuery } from "react-query";
import { HoldChargeGridMetaData } from "./gridMetadata";
import {
  ActionTypes,
  Alert,
  GridMetaDataType,
  GridWrapper,
  usePopupContext,
} from "@acuteinfo/common-base";
import * as API from "./api";

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
  const myGridRef = useRef<any>(null);
  const [rows, setRows] = useState([]);
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const oldRowsDataRef = useRef<any>([]);
  const { data, isLoading, isFetching, refetch, error, isError } = useQuery<
    any,
    any
  >(["getHoldChargeList", { reqData }], () => API.getHoldChargeList(reqData), {
    onSuccess: (data) => {
      setRows(data);
      oldRowsDataRef.current = data;
    },
  });

  const setCurrentAction = useCallback(async (data) => {
    if (data?.name === "proceed") {
      const oldRows = oldRowsDataRef?.current;
      const updatedRows = myGridRef.current?.cleanData(true);
      const paidChanges = updatedRows
        .filter((updatedRow, index) => {
          const oldRow = oldRows?.[index];
          return oldRow && oldRow.PAID !== updatedRow.PAID;
        })
        .map((updatedRow) => ({
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
