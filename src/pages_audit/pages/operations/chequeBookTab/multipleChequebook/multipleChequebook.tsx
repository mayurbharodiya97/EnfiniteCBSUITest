import { Dialog } from "@mui/material";
import { GridWrapper } from "components/dataTableStatic/gridWrapper";
import React, { useCallback, useEffect } from "react";
import { multipleChequebookGridData } from "./multipleChequebookMetadata";
import { GridMetaDataType } from "components/dataTableStatic";
import { ActionTypes } from "components/dataTable";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

export const MultipleChequebook = ({ navigate, insertData }) => {
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
  const setCurrentAction = useCallback(
    (data) => {
      if (data.name === "save") {
        insertData(rows);
      } else {
        navigate(".");
      }
    },
    [navigate]
  );

  useEffect(() => {
    multipleChequebookGridData.gridConfig.footerNote = `${t("TotalCheque")} : ${
      rows?.[0]?.CHEQUE_BK_TOTAL * rows?.[0]?.CHEQUE_TOTAL
    }  \u00A0\u00A0  ${t("TotalCharge")} : ₹
        ${(rows?.[0]?.CHEQUE_BK_TOTAL * rows?.[0]?.AMOUNT).toFixed(2)}     `;
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
          data={rows ?? []}
          setData={() => {}}
          actions={ChequeBKPopUpAction}
          setAction={setCurrentAction}
        />
      </Dialog>
    </>
  );
};
