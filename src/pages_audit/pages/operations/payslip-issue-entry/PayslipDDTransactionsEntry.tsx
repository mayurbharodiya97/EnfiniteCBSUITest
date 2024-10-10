import {
  AppBar,
  Box,
  Dialog,
  Grid,
  List,
  Paper,
  Toolbar,
  Typography,
} from "@mui/material";
import { t } from "i18next";
import { ListItemData } from "../inwardClearing/inwardClearing";
import {
  ActionTypes,
  GradientButton,
  GridMetaDataType,
  GridWrapper,
  queryClient,
} from "@acuteinfo/common-base";
import { DDtransactionsMetadata } from "./paySlipMetadata";
import { useCallback, useEffect, useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { RetrieveEntryGrid } from "./entries/entryGrid";
import { getDDtransactionScreenList } from "./api";
import { useQuery } from "react-query";
const actions: ActionTypes[] = [
  {
    actionName: "close",
    actionLabel: t("Close"),
    multiple: undefined,
    rowDoubleClick: false,
    alwaysAvailable: true,
  },
];
export const PayslipDDTransactionsEntry = () => {
  const navigate = useNavigate();
  const [componentTorender, setComponetToRender] = useState([]);
  const [screenOpen, setScreenOpen] = useState(false);

  const setCurrentAction = useCallback(async (data) => {
    if (data?.name === "close") {
      console.log("closed");

      navigate("/cbsenfinity/dashboard");
    }
  }, []);

  const close = () => {
    setScreenOpen(false);
  };
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery<
    any,
    any
  >(["getDDtransactionScreenList"], () =>
    getDDtransactionScreenList({ FLAG: "E" })
  );
  useEffect(() => {
    return () => {
      queryClient.removeQueries(["getDDtransactionScreenList"]);
    };
  }, []);

  return (
    <>
      <Dialog
        open={true}
        fullScreen
        PaperProps={{
          style: {
            width: "32%",
            height: "auto",
            overflow: "hidden",
          },
        }}
        maxWidth="md"
      >
        <Paper sx={{ p: 2 }}>
          <GridWrapper
            key={"DDtransactionsMetadata"}
            finalMetaData={DDtransactionsMetadata as GridMetaDataType}
            data={data ?? []}
            setData={() => null}
            actions={actions}
            loading={isLoading || isFetching}
            setAction={setCurrentAction}
            refetchData={null}
            onClickActionEvent={(index, id, currentData) => {
              if (id === "OPEN") {
                console.log(componentTorender);
                setComponetToRender([
                  //@ts-ignore
                  currentData?.DOC_CD, //@ts-ignore
                  currentData?.DOC_NM, //@ts-ignore
                  currentData?.SCREENREF, //@ts-ignore
                  currentData?.TRAN_TYPE, //@ts-ignore
                ]);
                setScreenOpen(true);
              }
            }}
            variant="contained"
          />
        </Paper>
        {screenOpen && (
          <RetrieveEntryGrid
            screenFlag={componentTorender[2]}
            open={screenOpen}
            close={close}
            headerLabel={`${componentTorender[1]} (${componentTorender[0]})`}
            apiReqFlag={componentTorender[0]}
            trans_type={componentTorender[3]}
          />
        )}
      </Dialog>
    </>
  );
};
