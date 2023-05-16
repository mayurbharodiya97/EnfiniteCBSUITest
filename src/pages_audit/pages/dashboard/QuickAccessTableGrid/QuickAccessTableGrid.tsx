import GridWrapper from "components/dataTableStatic";
import { QuickAccessTableGridMetaData } from "./gridMetaData";
import { ActionTypes, GridMetaDataType } from "components/dataTable/types";
import { ClearCacheProvider } from "cache";

import React, { useCallback, useRef, useState } from "react";
import * as API from "../api";
import { useQuery } from "react-query";
import { Grid } from "@mui/material";
const actions: ActionTypes[] = [
  {
    actionName: "Recent",
    actionLabel: "Recent",
    multiple: undefined,
    rowDoubleClick: false,
    actionTextColor: "var(--theme-color3)",
    alwaysAvailable: true,
    actionBackground: "var(--theme-color2)",
  },
  {
    actionName: "Favorite",
    actionLabel: "Favorite",
    multiple: undefined,
    rowDoubleClick: true,
    actionTextColor: "var(--theme-color2)",
    actionBackground: "var(--theme-color3)",
    alwaysAvailable: true,
  },
];

const QuickAccessTableGrid = () => {
  const [colors, setColors] = useState<any>(false);
  const { data, isLoading, isFetching, refetch } = useQuery<any, any>(
    ["QuickAccessTableGridData"],
    () => API.QuickAccessTableGridData()
  );

  const setCurrentAction = useCallback((data) => {
    console.log(">>data", data);
    setColors(!colors);
  }, []);
  console.log(">>>COL>>OR", colors);

  // const ANY = (id) => {
  //   if (data.rows) {
  //     SetFavoriteItem([...favoriteItem, id]);
  //   }
  // };

  const gridRef = useRef();
  console.log("gridRef.current", gridRef.current);
  return (
    <>
      <Grid
        item
        lg={7}
        md={7}
        xl={7}
        xs={7}
        // style={
        //   {
        //     // backgroundColor: "white",
        //     //   display: "flex",
        //     //   justifyContent: "center",
        //   }
        // }
      >
        {" "}
        <GridWrapper
          key={`quickAccessGrid`}
          finalMetaData={QuickAccessTableGridMetaData as GridMetaDataType}
          data={data}
          setData={() => null}
          actions={actions}
          setAction={setCurrentAction}
          // controlsAtBottom={true}
          headerToolbarStyle={{
            borderTop: "2px solid var(--theme-color4)",
            borderLeft: "2px solid var(--theme-color4)",
            borderRight: "2px solid var(--theme-color4)",
            backgroundColor: "inherit",
            borderTopLeftRadius: "20px",

            borderTopRightRadius: "20px",
            color: "black",
          }}
        />
      </Grid>
    </>
  );
};

export const QuickAccessTableGridWrapper = () => {
  return (
    <ClearCacheProvider>
      <QuickAccessTableGrid />
    </ClearCacheProvider>
  );
};
