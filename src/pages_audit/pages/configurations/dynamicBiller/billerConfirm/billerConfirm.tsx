import { useRef, useCallback, useState } from "react";
import { BillerConfirmGridMetaData } from "./gridMetadata";
import GridWrapper from "components/dataTableStatic";
import { ActionTypes } from "components/dataTable";
import { useLocation, useNavigate } from "react-router-dom";
import { GridMetaDataType } from "components/dataTable/types";
import { Dialog } from "@mui/material";
import BillerDetailRefresh from "../refreshBillerData/billerDetailRefresh/billerDetailRefresh";
import { Transition } from "pages_audit/common";
import { makeStyles } from "@mui/styles";

export const useDialogStyles = makeStyles({
  topScrollPaper: {
    alignItems: "center",
  },
  topPaperScrollBody: {
    verticalAlign: "top",
  },
  title: {
    flex: "1 1 100%",
    color: "var(--white)",
    letterSpacing: "1px",
    fontSize: "1.5rem",
  },
});

const actions: ActionTypes[] = [
  {
    actionName: "close",
    actionLabel: "Close",
    multiple: undefined,
    rowDoubleClick: false,
    alwaysAvailable: true,
  },
  {
    actionName: "view-detail",
    actionLabel: "View Detail",
    multiple: false,
    rowDoubleClick: true,
  },
];

export const DynamicBillerConfirmGrid = ({ onCloseDialog }) => {
  const myGridRef = useRef<any>(null);
  const classes = useDialogStyles();
  const { state: rows }: any = useLocation();
  const [rowData, setRowData] = useState({});
  const [isOpenFields, setIsOpenFields] = useState(false);
  const navigate = useNavigate();
  const setCurrentAction = useCallback(
    (data) => {
      setRowData(data?.rows);
      if (data.name === "close") {
        onCloseDialog();
      } else if (data.name === "view-detail") {
        setIsOpenFields(true);
      } else {
        navigate(data?.name, {
          state: data?.rows,
        });
      }
    },
    [navigate]
  );

  const onCloseFieldDialog = () => {
    setIsOpenFields(false);
  };

  return (
    <Dialog
      open={true}
      //@ts-ignore
      TransitionComponent={Transition}
      PaperProps={{
        style: {
          width: "100%",
          minHeight: "80vh",
          height: "90vh",
        },
      }}
      maxWidth="lg"
      classes={{
        scrollPaper: classes.topScrollPaper,
        paperScrollBody: classes.topPaperScrollBody,
      }}
    >
      <div style={{ padding: "10px" }}>
        <GridWrapper
          key={`BillerConfirmGrid`}
          finalMetaData={BillerConfirmGridMetaData as GridMetaDataType}
          data={rows?.[0]?.data?.DETAILS ?? []}
          setData={() => null}
          loading={false}
          actions={actions}
          setAction={setCurrentAction}
          ref={myGridRef}
        />
        {isOpenFields ? (
          <BillerDetailRefresh
            open={isOpenFields}
            closeDialog={() => onCloseFieldDialog()}
            billerData={rowData?.[0]?.data}
          />
        ) : null}
      </div>
    </Dialog>
  );
};
