import { AddBranchGridMetaData } from "./gridMetaData";
import GridWrapper from "components/dataTableStatic";
import { ActionTypes, GridMetaDataType } from "components/dataTable/types";
import { Dialog } from "@mui/material";
import { useCallback } from "react";
import { gridData } from "./api";

const actions: ActionTypes[] = [
  {
    actionName: "ok",
    actionLabel: "Ok",
    multiple: undefined,
    rowDoubleClick: false,
    alwaysAvailable: true,
  },
  {
    actionName: "close",
    actionLabel: "Close",
    multiple: undefined,
    rowDoubleClick: false,
    alwaysAvailable: true,
  },
];

export const AddBranchGrid = ({ handleDialogClose }) => {
  const setCurrentAction = useCallback((data) => {
    if (data?.name === "close") {
      handleDialogClose();
    }
    if (data?.name === "ok") {
    }
  }, []);

  return (
    <Dialog
      maxWidth="lg"
      open={true}
      PaperProps={{
        style: {
          width: "auto",
          overflow: "auto",
          padding: "10px",
        },
      }}
    >
      <GridWrapper
        key={`addBranchGrid`}
        finalMetaData={AddBranchGridMetaData as GridMetaDataType}
        data={gridData ?? []}
        setData={() => null}
        actions={actions}
        setAction={setCurrentAction}
      />
    </Dialog>
  );
};
