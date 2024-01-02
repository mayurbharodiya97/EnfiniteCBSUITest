//UI
import LinearProgress from "@mui/material/LinearProgress";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import { Button, Card } from "@mui/material";

//logic
import { useSnackbar } from "notistack";
import { format } from "date-fns";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useMutation } from "react-query";
import { TRN002_TableMetaData } from "./gridMetadata";
import GridWrapper from "components/dataTableStatic";
import { ActionTypes, GridMetaDataType } from "components/dataTable/types";
import * as API from "./api";
import * as API2 from "../TRN001_footer/api";
import { AuthContext } from "pages_audit/auth";
import { AccDetailContext } from "pages_audit/auth";
import { useContext } from "react";
import BaseFooter from "../TRN001_footer/BaseFooter";
import "./TRN002_Table.css";
const actions: ActionTypes[] = [
  {
    actionName: "view-detail",
    actionLabel: "View Detail",
    multiple: false,
    rowDoubleClick: true,
    // alwaysAvailable: true,
  },
  {
    actionName: "view",
    actionLabel: "Confirm",
    actionIcon: "detail",
    multiple: false,
    rowDoubleClick: true,
  },
];

export const TRN002_Table = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { authState } = useContext(AuthContext);
  const { tempStore, setTempStore } = useContext(AccDetailContext);
  const [rows, setRows] = useState([]);
  const [rows2, setRows2] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log(loading, "loading Table");
  }, [loading]);

  useEffect(() => {
    handleGetTRN002List();
  }, []);

  useEffect(() => {
    console.log(rows, "rows");
    console.log(rows2, "rows2");
  }, [rows, rows2]);

  // api define ========================================================================
  const getTRN002List = useMutation(API.getTRN002List, {
    onSuccess: (data) => {
      //data.sort((a, b) => new Date(a.ENTERED_DATE) - new Date(b.ENTERED_DATE));
      let arr = data.filter((a) => a.CONFIRMED == "0");
      setRows2(arr);
      setRows(data);
    },
    onError: (error) => {
      setLoading(false);
    },
  });

  const getAccInfo = useMutation(API2.getAccInfo, {
    onSuccess: (data) => {
      setLoading(false);
      setTempStore({ ...tempStore, accInfo: data });
    },
    onError: (error) => {
      setLoading(false);
    },
  });

  const confirmScroll = useMutation(API.confirmScroll, {
    onSuccess: (data) => {
      enqueueSnackbar("Record Confirm", {
        variant: "success",
      });
      handleGetTRN002List();
    },
    onError: (error) => {
      console.log(error, "error");

      // error?.error_msg
      enqueueSnackbar("You can not confirm your own posted transaction", {
        variant: "error",
      });
    },
  });
  // function define  ======================================================================
  const handleGetTRN002List = () => {
    let data = {
      COMP_CD: authState?.companyID,
      BRANCH_CD: authState?.user?.branchCode,
    };
    getTRN002List.mutate(data);
  };

  const setCurrentAction = useCallback((data) => {
    let row = data.rows[0]?.data;

    if (data.name === "view-detail") {
      setLoading(true);

      let obj = {
        COMP_CD: row?.COMP_CD,
        BRANCH_CD: row?.BRANCH_CD,
        ACCT_TYPE: row?.ACCT_TYPE,
        ACCT_CD: row?.ACCT_CD,
        authState: authState,
      };
      getAccInfo.mutate(obj);
    }

    if (data.name === "view") {
      if (row.CONFIRMED == "0") {
        confirmScroll.mutate(row);
      } else {
        enqueueSnackbar("Scroll Already Confirmed", {
          variant: "error",
        });
      }
    }
  }, []);
  const handleUpdateRows = (data) => {
    setRows2(data);
  };

  const handleViewAll = () => {
    let arr = [...rows];
    setRows2(arr);
  };
  const handleRefresh = () => {
    handleGetTRN002List();
  };

  return (
    <>
      <Card
        sx={{
          boxShadow: "0px 1px 4px -1px #999999",
          borderRadius: "5px",
          padding: "8px",
          margin: "4px",
        }}
      >
        {loading && <LinearProgress color="secondary" />}
        <GridWrapper
          key={`TRN002_TableMetaData`}
          finalMetaData={TRN002_TableMetaData as GridMetaDataType}
          data={rows2}
          setData={() => null}
          // loading={getAccInfo.isLoading}
          refetchData={() => {}}
          // ref={myGridRef}
          actions={actions}
          setAction={setCurrentAction}
        />
      </Card>

      <BaseFooter
        rows={rows2}
        handleUpdateRows={handleUpdateRows}
        handleViewAll={handleViewAll}
        handleRefresh={handleRefresh}
      />
    </>
  );
};
