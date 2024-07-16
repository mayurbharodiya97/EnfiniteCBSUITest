import { Dialog } from "@mui/material";
import { GridWrapper } from "components/dataTableStatic/gridWrapper";
import React, { useCallback, useEffect, useState } from "react";
import { multipleChequebookGridData } from "./multipleChequebookMetadata";
import { GridMetaDataType } from "components/dataTableStatic";
import { ActionTypes } from "components/dataTable";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

export const MultipleChequebook = ({ navigate, validateInsertData }) => {
  const ChequeBKPopUpAction: ActionTypes[] = [
    {
      actionName: "save",
      actionLabel: "Save",
      multiple: false,
      rowDoubleClick: false,
      alwaysAvailable: true,
    },
    {
      actionName: "close",
      actionLabel: "Close",
      multiple: false,
      rowDoubleClick: false,
      alwaysAvailable: true,
    },
  ];

  const { t } = useTranslation();
  const { state: rows }: any = useLocation();
  const [gridData, setGridData] = useState<any>([]);
  const setCurrentAction = useCallback(
    (data) => {
      if (data.name === "save") {
        validateInsertData.mutate({
          BRANCH_CD: rows?.BRANCH_CD,
          ACCT_TYPE: rows?.ACCT_TYPE,
          ACCT_CD: rows?.ACCT_CD,
          AMOUNT: rows?.AMOUNT,
          SERVICE_TAX: rows?.SERVICE_TAX,
          CHEQUE_FROM: rows?.CHEQUE_FROM,
          CHEQUE_TO: rows?.CHEQUE_TO,
          AUTO_CHQBK_FLAG: rows?.AUTO_CHQBK_FLAG,
          SR_CD: rows?.SR_CD,
          STATUS: rows?.STATUS,
          SCREEN_REF: "TRN/045",
        });
        navigate(".");
      } else {
        navigate(".");
      }
    },
    [navigate]
  );

  useEffect(() => {
    // calculation for multiple chequebook
    let newArray: any = [];
    if (rows.NO_OF_CHQBK > 1 && rows?.CHEQUE_TO) {
      for (
        let i = rows.CHEQUE_FROM;
        i <= rows.CHEQUE_FROM + (rows.NO_OF_CHQBK - 1) * rows?.CHEQUE_TOTAL;
        i += rows?.CHEQUE_TOTAL
      ) {
        newArray.push({
          ...rows,
          CHEQUE_FROM: i,
          CHEQUE_TO: i + rows?.CHEQUE_TOTAL - 1,
        });
      }
    }
    setGridData(newArray);

    // sum of all service-charge
    multipleChequebookGridData.gridConfig.footerNote = `${t("TotalCheque")} : ${
      rows?.NO_OF_CHQBK * rows?.CHEQUE_TOTAL
    }  \u00A0\u00A0  ${t("TotalCharge")} : ₹
        ${(rows?.NO_OF_CHQBK * rows?.AMOUNT).toFixed(2)}     `;
  }, [rows]);

  return (
    <>
      <Dialog
        open={true}
        fullWidth={true}
        PaperProps={{
          style: {
            maxWidth: "644px",
            padding: "5px",
          },
        }}
      >
        <GridWrapper
          key={`multiple-ChequebookGridData`}
          finalMetaData={multipleChequebookGridData as GridMetaDataType}
          data={gridData ?? []}
          setData={() => {}}
          actions={ChequeBKPopUpAction}
          setAction={setCurrentAction}
        />
      </Dialog>
    </>
  );
};
