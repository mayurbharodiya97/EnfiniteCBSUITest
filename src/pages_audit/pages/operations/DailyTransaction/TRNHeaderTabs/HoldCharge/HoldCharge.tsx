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
import { useTranslation } from "react-i18next";

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
  const [prevPaidValues, setPrevPaidValues] = useState<any>([]);
  const { t } = useTranslation();
  const { data, isLoading, isFetching, refetch, error, isError } = useQuery<
    any,
    any
  >(["getHoldChargeList", { reqData }], () => API.getHoldChargeList(reqData), {
    onSuccess: (data) => {},
  });
  useEffect(() => {
    if (data?.length > 0) {
      setRows(data);
      oldRowsDataRef.current = data;
      PreviousRowsDataRef.current = data;
    }
  }, [data]);
  const validateHoldCharge = useMutation(API.validateHoldCharge, {
    onError: async (error: any) => {
      let updatedRows = [...rows];
      const rowIndex: any = previousRow.current?.index;
      if (rowIndex !== undefined && rowIndex !== null) {
        const rowToUpdate: any = updatedRows.find(
          (row: any) => row.index === rowIndex
        );

        if (rowToUpdate) {
          // Update the state with the modified rows
          rowToUpdate.PAID = previousRow.current?.PAID;
          setRows(updatedRows);
        }
      }

      CloseMessageBox();
    },
    onSuccess: async (data: any) => {
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
          const rowIndex: any = previousRow.current?.index;
          if (rowIndex !== undefined && rowIndex !== null) {
            const rowToUpdate: any = updatedRows.find(
              (row: any) => row.index === rowIndex
            );
            if (rowToUpdate) {
              // Update the state with the modified rows
              setRows(updatedRows);
            }
          }
        }
      }
    },
  });
  const proceedHoldCharges = useMutation(API.proceedHoldCharges, {
    onError: async (error: any) => {
      const btnName = await MessageBox({
        messageTitle: "ValidationFailed",
        message: error?.error_msg ?? "",
        icon: "ERROR",
      });
      CloseMessageBox();
    },
    onSuccess: async (data) => {
      CloseMessageBox();
      refetch();
    },
  });

  const setCurrentAction = useCallback(async (data) => {
    if (data?.name === "proceed") {
      const updatedRows = myGridRef.current?.cleanData(true);
      const paidUpdatedRows = updatedRows?.filter((row) => row.PAID !== "N");
      const paidChanges = paidUpdatedRows.map((updatedRow) => ({
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
        const reqPara = paidUpdatedRows?.map((row) => ({
          ENTERED_COMP_CD: row?.ENTERED_COMP_CD ?? "",
          ENTERED_BRANCH_CD: row?.ENTERED_BRANCH_CD ?? "",
          TRAN_CD: row?.TRAN_CD ?? "",
          SR_CD: row?.SR_CD ?? "",
          PAID: row?.PAID ?? "",
        }));

        const btnName = await MessageBox({
          message: `Are you sure to apply/waive following transactions? \n\n${message} `,
          messageTitle: "Confirmation",
          buttonNames: ["Yes", "No"],
          loadingBtnName: ["Yes"],
        });
        if (btnName === "Yes") {
          proceedHoldCharges.mutate({
            DETAILS_DATA: {
              isNewRow: reqPara,
              isDeleteRow: [],
              isUpdatedRow: [],
            },
          });
        }
      }
    }
  }, []);

  useEffect(() => {
    const currentPaidValues = rows?.map((row: any) => row?.PAID);
    const isPaidChanged = currentPaidValues?.some(
      (paid, index) => paid !== prevPaidValues[index] && paid !== "N"
    );
    if (!isPaidChanged) {
      return;
    }
    const previousRows = PreviousRowsDataRef?.current;
    let lastUpdatedRowIndex = -1; // Variable to track the index of the last updated row

    rows.forEach((currentRow: any, index) => {
      if (previousRows[index]?.PAID !== currentRow?.PAID) {
        lastUpdatedRowIndex = index;
      }
    });

    if (lastUpdatedRowIndex !== -1) {
      previousRow.current = previousRows[lastUpdatedRowIndex];
    }

    const filteredRows = previousRows.filter(
      (prevRow: any) => prevRow.TRAN_CD === previousRow?.current?.TRAN_CD
    );

    filteredRows.forEach((filteredRow: any) => {
      validateHoldCharge.mutate({
        A_COMP_CD: filteredRow?.COMP_CD ?? "",
        A_BRANCH_CD: filteredRow?.BRANCH_CD ?? "",
        A_ACCT_TYPE: filteredRow?.ACCT_TYPE ?? "",
        A_ACCT_CD: filteredRow?.ACCT_CD ?? "",
        A_PAID: filteredRow?.PAID ?? "",
        A_AMOUNT: filteredRow?.AMOUNT ?? "",
        A_STATUS: reqData?.STATUS ?? "",
        A_NPA_CD: reqData?.NPA_CD ?? "",
        A_GD_DATE: authState?.workingDate ?? "",
        A_USER: authState?.user?.id ?? "",
        A_USER_LEVEL: authState?.role ?? "",
        A_SCREEN_REF: reqData?.SCREEN_REF ?? "",
        A_LANG: i18n.resolvedLanguage,
      });

      setRows((prevRows: any) =>
        prevRows.map((row: any) => {
          return row.TRAN_CD === filteredRow.TRAN_CD
            ? {
                ...row,
                FLAG: "Y",
              }
            : row;
        })
      );
    });
    setPrevPaidValues(currentPaidValues);
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
      {(isError || validateHoldCharge?.error) && (
        <Alert
          severity="error"
          errorMsg={
            error?.error_msg ||
            validateHoldCharge?.error?.error_msg ||
            t("Somethingwenttowrong")
          }
          errorDetail={
            error?.error_detail || validateHoldCharge?.error?.error_detail || ""
          }
          color="error"
        />
      )}

      <GridWrapper
        key={
          `HoldChargeGridMetaData` +
          rows?.length +
          validateHoldCharge?.isLoading +
          validateHoldCharge?.isSuccess
        }
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
