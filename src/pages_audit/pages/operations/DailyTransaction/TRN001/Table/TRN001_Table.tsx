import { useCallback, useEffect, useRef, useState } from "react";
import { useMutation } from "react-query";
import { TRN001_TableMetaData } from "./gridMetadata";
import GridWrapper from "components/dataTableStatic";
import { Alert } from "components/common/alert";
import { ActionTypes, GridMetaDataType } from "components/dataTable/types";
import * as trn1Api from "../api";
import * as CommonApi from "../../TRNCommon/api";
import { useSnackbar } from "notistack";

import { AuthContext } from "pages_audit/auth";
import { AccDetailContext } from "pages_audit/auth";
import { useContext } from "react";
import LinearProgress from "@mui/material/LinearProgress";

const actions: ActionTypes[] = [
  {
    actionName: "view-detail",
    actionLabel: "View Detail",
    multiple: false,
    rowDoubleClick: true,
  },
  {
    actionName: "Delete",
    actionLabel: "Delete",
    multiple: false,
    rowDoubleClick: false,
    // alwaysAvailable: true,
  },
];

export const TRN001_Table = ({ updatedRows }) => {
  const { enqueueSnackbar } = useSnackbar();
  const myGridRef = useRef<any>(null);

  const { authState } = useContext(AuthContext);
  const { tempStore, setTempStore } = useContext(AccDetailContext);

  const [rows, setRows] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  let objData = {
    COMP_CD: authState?.companyID,
    BRANCH_CD: authState?.user?.branchCode,
  };

  useEffect(() => {
    console.log(rows, "trn1 table rows");
  }, [rows]);

  useEffect(() => {
    if (updatedRows?.length > 0) {
      setRows(updatedRows);
    } else {
      getTRN001List.mutate(objData);
    }
  }, [updatedRows, tempStore]);

  // api define=============================================
  const getTRN001List = useMutation(trn1Api.getTRN001List, {
    onSuccess: (data) => {
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
  const deleteScrollByVoucher = useMutation(CommonApi.deleteScrollByVoucherNo, {
    onSuccess: (data) => {
      setLoading(false);
      getTRN001List.mutate(objData);
      enqueueSnackbar("Scroll Deleted", {
        variant: "success",
      });
    },
    onError: (error: any) => {
      setLoading(false);
      enqueueSnackbar(error?.error_msg, {
        variant: "error",
      });
    },
  });
  //-----------------------------

  const setCurrentAction = useCallback((data) => {
    let row = data.rows[0]?.data;
    setLoading(true);
    console.log(row, "row");
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

    if (data.name === "Delete") {
      let obj = {
        TRAN_CD: row?.TRAN_CD,
        ENTERED_COMP_CD: row?.COMP_CD,
        ENTERED_BRANCH_CD: row?.BRANCH_CD,
      };
      deleteScrollByVoucher.mutate(obj);
    }
  }, []);

  return (
    <>
      {loading && <LinearProgress color="secondary" />}
      <GridWrapper
        key={`TRN001_TableMetaData`}
        finalMetaData={TRN001_TableMetaData as GridMetaDataType}
        data={rows}
        setData={() => null}
        loading={getTRN001List.isLoading}
        refetchData={() => {}}
        ref={myGridRef}
        actions={actions}
        setAction={setCurrentAction}
      />
    </>
  );
};
