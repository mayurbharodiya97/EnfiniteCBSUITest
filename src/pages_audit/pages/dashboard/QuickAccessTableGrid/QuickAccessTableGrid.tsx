import GridWrapper from "components/dataTableStatic";
import { QuickAccessTableGridMetaData } from "./gridMetaData";
import { ActionTypes, GridMetaDataType } from "components/dataTable/types";
import { ClearCacheProvider } from "cache";
import { SearchBar } from "components/derived";

import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import * as API from "../api";
import { useQuery } from "react-query";
import {
  AppBar,
  Box,
  Grid,
  Theme,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { makeStyles, styled } from "@mui/styles";
import { GradientButton } from "components/styledComponent/button";
import { AuthContext } from "pages_audit/auth";
// const actions: ActionTypes[] = [
//   {
//     actionName: "Recent",******************
//     actionLabel: "Recent",
//     multiple: undefined,
//     rowDoubleClick: false,
//     actionTextColor: "var(--theme-color3)",
//     alwaysAvailable: true,
//     actionBackground: "var(--theme-color2)",
//   },
//   {
//     actionName: "Favourite",
//     actionLabel: "Favourite",
//     multiple: undefined,
//     rowDoubleClick: true,
//     actionTextColor: "var(--theme-color2)",
//     actionBackground: "var(--theme-color3)",
//     alwaysAvailable: true,
//   },
// ];

const useHeaderStyles = makeStyles((theme: Theme) => ({
  root: {
    paddingLeft: theme.spacing(1.5),
    paddingRight: theme.spacing(1.5),
    background: "var(--theme-color2)",
  },
  title: {
    flex: "1 1 100%",
    color: "var(--white)",
    letterSpacing: "1px",
    fontSize: "1.5rem",
  },
}));

const QuickAccessTableGrid = () => {
  const [apiData, setApiData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [activeButton, setActiveButton] = useState("Favourite");
  const headerClasses = useHeaderStyles();
  const { authState } = useContext(AuthContext);
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up(1256));
  const { data, isLoading, isFetching, refetch } = useQuery<any, any>(
    [
      "QuickAccessTableGridData",
      {
        COMP_CD: authState?.companyID ?? "",
        BASE_BRANCH_CD: authState?.user?.branchCode ?? "",
        GROUP_NAME: authState?.roleName ?? "",
        APP_TRAN_CD: "1",
        FLAG: activeButton ?? "",
      },
    ],
    () =>
      API.QuickAccessTableGridData({
        COMP_CD: authState?.companyID ?? "",

        BASE_BRANCH_CD: authState?.user?.branchCode ?? "",
        GROUP_NAME: authState?.roleName ?? "",
        APP_TRAN_CD: "1",
        FLAG: activeButton ?? "",
      })
  );

  console.log(">>activeButton<<??>><<", activeButton);

  const handleButtonClick = (buttonId) => {
    setActiveButton(buttonId);
  };

  useEffect(() => {
    if (data) {
      setApiData(data);
      setFilteredData(data);
    }
  }, [data]);

  const handleSearch = (e) => {
    if (e.target.value === "") {
      setApiData(filteredData);
    } else {
      const filtredValue = filteredData.filter(
        ({ DOC_NM, USER_DEFINE_CD, DOC_CD }) =>
          [DOC_NM, USER_DEFINE_CD, DOC_CD].some((info) =>
            info.toLowerCase().includes(e.target.value.toLowerCase())
          )
      );
      setApiData(filtredValue);
    }
  };

  return (
    <>
      {/* <AppBar
        position="relative"
        color="primary"
        style={{ marginBottom: "5px" }}
      > */}
      <Toolbar className={headerClasses.root} variant={"dense"}>
        <Typography
          className={headerClasses.title}
          color="secondary"
          variant={"h6"}
          component="div"
        >
          Quick Access
        </Typography>
        {matches && (
          <Box
            sx={{
              height: "48px",
              width: "51px",
              paddingRight: "91px",
              display: "flex",
              alignItems: "center",
            }}
          >
            {" "}
            <Typography
              style={{
                color: "var(--theme-color3)",
                transition: "all 0.5s ease-in-out",
              }}
              variant="subtitle1"
              component="h2"
            >
              {activeButton}
            </Typography>
          </Box>
        )}
        {matches && (
          <SearchBar onChange={handleSearch} placeholder={"Search..."} />
        )}{" "}
        <Box
          sx={{
            display: "flex",
            backgroundColor: "var(--theme-color4)",
            height: "39px",
            alignItems: "center",
            width: "100%",
            borderRadius: "12px",
            justifyContent: "center",
          }}
        >
          <GradientButton
            onClick={() => handleButtonClick("Recent")}
            style={{
              backgroundColor:
                activeButton === "Recent" ? "var(--theme-color3)" : "inherit",
              height: "26px",
              width: "71px",
              borderRadius: "08px",
              color:
                activeButton === "Recent"
                  ? "var(--theme-color2)"
                  : "var(--theme-color6)",
            }}
          >
            Recent
          </GradientButton>
          <GradientButton
            onClick={() => handleButtonClick("Favourite")}
            style={{
              backgroundColor:
                activeButton === "Favourite"
                  ? "var(--theme-color3)"
                  : "inherit",
              height: "26px",
              width: "71px",
              borderRadius: "08px",
              color:
                activeButton === "Favourite"
                  ? "var(--theme-color2)"
                  : "var(--theme-color6)",
            }}
          >
            Favourite
          </GradientButton>
        </Box>
      </Toolbar>
      {/* </AppBar> */}
      <GridWrapper
        key={`quickAccessGrid`}
        finalMetaData={QuickAccessTableGridMetaData as GridMetaDataType}
        data={apiData ?? []}
        setData={() => null}
        // actions={actions}
        // setAction={setCurrentAction}
        controlsAtBottom={false}
        headerToolbarStyle={{
          backgroundColor: "inherit",
          color: "black",
        }}
        loading={isLoading || isFetching}
        refetchData={() => refetch()}
      />
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
