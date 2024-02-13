import { Fragment, useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { SIDetailGridMetaData } from "./gridMetadata";
import GridWrapper from "components/dataTableStatic";
import { Alert } from "components/common/alert";
import { GridMetaDataType } from "components/dataTable/types";
import { ClearCacheProvider, queryClient } from "cache";
import * as API from "./api";
import { FormWrapper } from "components/dyanmicForm/formWrapper";
import { AuthContext } from "pages_audit/auth";
import { AccDetailContext } from "pages_audit/auth";
import { useContext } from "react";
import { InitialValuesType, SubmitFnType } from "packages/form";
import { Grid } from "@mui/material";

export const SIDetail = () => {
  const myGridRef = useRef<any>(null);
  const { authState } = useContext(AuthContext);
  const { tempStore, setTempStore } = useContext(AccDetailContext);
  const [rows, setRows] = useState([]);

  // api define
  const getSIDetailList = useMutation(API.getSIDetailList, {
    onSuccess: (data) => {
      console.log(data, " getSIDetailList detailssss");
      setRows(data);
    },
    onError: (error) => {},
  });

  useEffect(() => {
    tempStore?.accInfo?.ACCT_CD && getSIDetailList.mutate(tempStore.accInfo);
  }, [tempStore]);

  return (
    <div style={{ padding: "8px" }}>
      <GridWrapper
        key={`SIDetailGridMetaData`}
        finalMetaData={SIDetailGridMetaData as GridMetaDataType}
        data={rows}
        setData={() => null}
        refetchData={() => {}}
        ref={myGridRef}
        loading={getSIDetailList.isLoading}
      />
      <Grid
        item
        xs={12}
        sm={12}
        sx={{
          position: "relative",
          top: "-3rem",
          display: "flex",
          justifyContent: "space-between",
          gap: "3rem",
          alignItems: "center",
        }}
      >
        <div></div>
        <div></div>

        <Grid item sx={{ display: "flex", gap: "1rem" }}>
          *Double click to view Schedule
        </Grid>
      </Grid>
    </div>
  );
};
