import { useCallback, useEffect, useRef, useState } from "react";
import { useMutation } from "react-query";
import { TRN002_TableMetaData } from "./gridMetadata";
import GridWrapper from "components/dataTableStatic";
import { ActionTypes, GridMetaDataType } from "components/dataTable/types";
import * as API from "./api";
import * as API2 from "../../TRN001_footer/api";
import { AuthContext } from "pages_audit/auth";
import { useContext } from "react";
import LinearProgress from "@mui/material/LinearProgress";

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

export const TRN002_Table = ({ handleConfirm }) => {
  const myGridRef = useRef<any>(null);
  const { authState } = useContext(AuthContext);
  const { tempStore, setTempStore } = useContext(AuthContext);
  const [rows, setRows] = useState([]);
  const [rows2, setRows2] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log(loading, "loading Table");
  }, [loading]);

  useEffect(() => {
    getList();
  }, []);

  const getList = () => {
    let data = {
      COMP_CD: authState?.companyID,
      BRANCH_CD: authState?.user?.branchCode,
    };
    getTRN002List.mutate(data);
  };

  // api define
  const getTRN002List = useMutation(API.getTRN002List, {
    onSuccess: (data) => {
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
    let row = data.rows[0]?.data;

    if (data.name === "view-detail") {
      setLoading(true);
      console.log(row, "roww viewdetail");

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
      console.log(row, "roww view");
      handleConfirm(row);
    }
  }, []);

  const handleRefreshF2 = () => {};

  return (
    <>
      {loading && <LinearProgress color="secondary" />}
      <GridWrapper
        key={`TRN002_TableMetaData`}
        finalMetaData={TRN002_TableMetaData as GridMetaDataType}
        data={rows2}
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
