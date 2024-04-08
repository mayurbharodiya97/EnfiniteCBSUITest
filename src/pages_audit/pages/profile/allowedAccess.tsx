import { Grid } from "@mui/material";
import { GridMetaDataType } from "components/dataTableStatic";
import { GridWrapper } from "components/dataTableStatic/gridWrapper";
import React, { useContext } from "react";
import * as API from "./api";
import { useQuery } from "react-query";
import { AuthContext } from "pages_audit/auth";
import { userAccessbranch, userAccesstype } from "./metaData";

export const AllowedAccess = () => {
  const { authState } = useContext(AuthContext);

  const userAccessBranch = useQuery<any, any, any>(["GETUSERACESSBRNCH"], () =>
    API.getUserAccessBranch({ userID: authState?.user?.id })
  );
  const userAccessType = useQuery<any, any, any>(["GETUSERACESSTYPE"], () =>
    API.getUserAccessType({ userID: authState?.user?.id })
  );
  return (
    <>
      <Grid
        sx={{
          display: "flex",
          justifyContent: "space-between",
          gap: 3,
          p: 2,
        }}
      >
        <Grid
          container
          sx={{
            boxShadow:
              "rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset",
          }}
        >
          <GridWrapper
            key={`userAccessbranch`}
            finalMetaData={userAccessbranch as GridMetaDataType}
            data={userAccessBranch.data || []}
            setData={() => null}
            headerToolbarStyle={{
              background: "var(--theme-color2)",
              color: "black",
              fontSize: "20px",
            }}
            //loading={result.isLoading}
            // actions={[]}
            // setAction={() => {}}
            // refetchData={() => {}}
            // ref={myGridRef}
          />
        </Grid>
        <Grid
          container
          sx={{
            boxShadow:
              "rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset",
          }}
        >
          <GridWrapper
            key={`userAccesstype`}
            finalMetaData={userAccesstype as GridMetaDataType}
            data={userAccessType.data || []}
            setData={() => null}
            headerToolbarStyle={{
              background: "var(--theme-color2)",
              color: "black",
              fontSize: "20px",
            }}
            //loading={result.isLoading}
            // actions={[]}
            // setAction={() => {}}
            // refetchData={() => {}}
            // ref={myGridRef}
          />
        </Grid>
      </Grid>
    </>
  );
};
