import { Fragment, useRef, useState } from "react";
import { useQuery } from "react-query";
import { SIDetailGridMetaData } from "./gridMetadata";
import * as API from "./api";
import { AuthContext } from "pages_audit/auth";
import { AccDetailContext } from "pages_audit/auth";
import { useContext } from "react";
import { Grid } from "@mui/material";

import { Alert, GridWrapper, GridMetaDataType } from "@acuteinfo/common-base";

export const SIDetail = ({ reqData }) => {
  const myGridRef = useRef<any>(null);
  const { authState } = useContext(AuthContext);
  const { tempStore, setTempStore } = useContext(AccDetailContext);
  const [rows, setRows] = useState([]);

  // api define
  // const getSIDetailList = useMutation(API.getSIDetailList, {
  //   onSuccess: (data) => {
  //     console.log(data, " getSIDetailList detailssss");
  //     setRows(data);
  //   },
  //   onError: (error) => {},
  // });

  // useEffect(() => {
  //   tempStore?.accInfo?.ACCT_CD && getSIDetailList.mutate(tempStore.accInfo);
  // }, [tempStore]);
  const { data, isLoading, isFetching, refetch, error, isError } = useQuery<
    any,
    any
  >(["getSIDetailList", { reqData }], () => API.getSIDetailList(reqData));

  return (
    <div style={{ padding: "8px" }}>
      {" "}
      {isError ? (
        <Fragment>
          <div style={{ width: "100%", paddingTop: "10px" }}>
            <Alert
              severity={error?.severity ?? "error"}
              errorMsg={error?.error_msg ?? "Error"}
              errorDetail={error?.error_detail ?? ""}
            />
          </div>
        </Fragment>
      ) : null}
      <GridWrapper
        key={`SIDetailGridMetaData`}
        finalMetaData={SIDetailGridMetaData as GridMetaDataType}
        loading={isLoading || isFetching}
        data={data ?? []}
        setData={() => null}
        // refetchData={() => {}}
        ref={myGridRef}
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
