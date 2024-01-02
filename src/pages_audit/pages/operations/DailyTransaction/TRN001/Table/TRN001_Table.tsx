import { useCallback, useEffect, useRef, useState } from "react";
import { useMutation } from "react-query";
import { TRN001_TableMetaData } from "./gridMetadata";
import GridWrapper from "components/dataTableStatic";
import { Alert } from "components/common/alert";
import { ActionTypes, GridMetaDataType } from "components/dataTable/types";
import * as API from "./api";
import * as API2 from "../api";
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
];

export const TRN001_Table = () => {
  const { authState } = useContext(AuthContext);
  const { tempStore, setTempStore } = useContext(AccDetailContext);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const myGridRef = useRef<any>(null);

  useEffect(() => {
    console.log(loading, "loading Table");
  }, [loading]);
  useEffect(() => {
    console.log(rows, "rows rows");
  }, [rows]);
  console.log(tempStore, "queryRows");
  useEffect(() => {
    if (tempStore?.queryRows?.length > 0) {
      setRows(tempStore.queryRows);
    } else {
      let data = {
        COMP_CD: authState?.companyID,
        BRANCH_CD: authState?.user?.branchCode,
      };
      getTRN001List.mutate(data);
    }
  }, []);

  // api define
  const getTRN001List = useMutation(API.getTRN001List, {
    onSuccess: (data) => {
      setLoading(false);
      console.log(data, "001 table list");
      setRows(data);
    },
    onError: (error) => {
      setLoading(false);
    },
  });

  const getAccInfo = useMutation(API2.getAccInfo, {
    onSuccess: (data) => {
      console.log(data, "accInfo");
      setLoading(false);
      setTempStore({ ...tempStore, accInfo: data });
    },
    onError: (error) => {
      setLoading(false);
    },
  });

  //-----------------------------

  const setCurrentAction = useCallback((data) => {
    setLoading(true);
    let row = data.rows[0]?.data;
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
  }, []);

  return (
    <>
      {loading && <LinearProgress color="secondary" />}
      <GridWrapper
        key={`TRN001_TableMetaData`}
        finalMetaData={TRN001_TableMetaData as GridMetaDataType}
        data={rows}
        setData={() => null}
        // loading={getAccInfo.isLoading}
        refetchData={() => {}}
        ref={myGridRef}
        actions={actions}
        setAction={setCurrentAction}
      />
    </>
  );
};
