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
import * as trn2Api from "./api";
import * as CommonApi from "../TRNCommon/api";
import { AuthContext } from "pages_audit/auth";
import { AccDetailContext } from "pages_audit/auth";
import { useContext } from "react";

import "./Trn002.css";
import DailyTransTabs from "../TRNHeaderTabs";
import CommonFooter from "../TRNCommon/CommonFooter";
const actions: ActionTypes[] = [
  {
    actionName: "view-detail",
    actionLabel: "View Detail",
    multiple: false,
    rowDoubleClick: true,
    // alwaysAvailable: true,
  },
  {
    actionName: "Delete",
    actionLabel: "Delete",
    multiple: false,
    rowDoubleClick: true,
  },
  {
    actionName: "view",
    actionLabel: "Confirm",
    actionIcon: "detail",
    multiple: false,
    rowDoubleClick: true,
  },
];

export const Trn002 = () => {
  const { authState } = useContext(AuthContext);
  const { tempStore, setTempStore } = useContext<any>(AccDetailContext);
  const myGridRef = useRef<any>(null);

  const [rows, setRows] = useState<any>([]);
  const [rows2, setRows2] = useState<any>([]);
  const [tabsData, setTabsData] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  const { enqueueSnackbar } = useSnackbar();
  let dataObj = {
    COMP_CD: authState?.companyID,
    BRANCH_CD: authState?.user?.branchCode,
  };

  useEffect(() => {
    handleGetTRN002List();
    setTempStore({ ...tempStore, accInfo: {} });
  }, []);

  // api define ========================================================================
  const getTRN002List = useMutation(trn2Api.getTRN002List, {
    onSuccess: (data) => {
      //data.sort((a, b) => new Date(a.ENTERED_DATE) - new Date(b.ENTERED_DATE));
      let arr = data.filter((a) => a.CONFIRMED == "0");
      setRows2(arr);
      setRows(data);
    },
    onError: (error) => {},
  });

  const getAccInfo = useMutation(CommonApi.getAccDetails, {
    onSuccess: (data) => {
      setLoading(false);
      setTempStore({ ...tempStore, accInfo: data });
    },
    onError: (error) => {
      setLoading(false);
    },
  });

  const confirmScroll = useMutation(trn2Api.confirmScroll, {
    onSuccess: (data) => {
      setLoading(false);
      enqueueSnackbar("Record Confirm", {
        variant: "success",
      });
      handleGetTRN002List();
    },
    onError: (error: any) => {
      setLoading(false);
      enqueueSnackbar(error?.error_msg, {
        variant: "error",
      });
    },
  });
  const deleteScrollByVoucher = useMutation(CommonApi.deleteScrollByVoucherNo, {
    onSuccess: (data) => {
      setLoading(false);
      enqueueSnackbar("Scroll Deleted", {
        variant: "success",
      });
      handleGetTRN002List();
    },
    onError: (error: any) => {
      setLoading(false);
      enqueueSnackbar(error?.error_msg, {
        variant: "error",
      });
    },
  });
  // function define  ======================================================================
  const handleGetTRN002List = () => {
    getTRN002List.mutate(dataObj);
  };

  const setCurrentAction = useCallback((data) => {
    let row = data.rows[0]?.data;
    setLoading(true);
    if (data.name === "view-detail") {
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
        setLoading(false);
        enqueueSnackbar("Scroll Already Confirmed", {
          variant: "error",
        });
      }
    }

    if (data.name === "Delete") {
      let obj = {
        TRAN_CD: row?.TRAN_CD,
        ENTERED_COMP_CD: row?.COMP_CD,
        ENTERED_BRANCH_CD: row?.BRANCH_CD,
      };
      deleteScrollByVoucher.mutate(obj);
    }
  }, []);

  const handleViewAll = () => {
    let arr = [...rows];
    setRows2(arr);
  };
  const handleUpdateRows = (data) => {
    setRows2(data);
  };
  return (
    <>
      <DailyTransTabs
        heading=" Confirmation (F2) (TRN/002)"
        tabsData={tabsData}
      />

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
          loading={getTRN002List.isLoading}
          ref={myGridRef}
          refetchData={() => {}}
          actions={actions}
          setAction={setCurrentAction}
        />
      </Card>

      <CommonFooter
        viewOnly={true}
        handleUpdateRows={handleUpdateRows}
        handleViewAll={handleViewAll}
        handleRefresh={() => handleGetTRN002List()}
      />
    </>
  );
};
