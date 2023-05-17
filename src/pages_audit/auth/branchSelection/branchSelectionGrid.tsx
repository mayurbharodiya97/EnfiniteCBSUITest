import GridWrapper from "components/dataTableStatic";
import { Fragment, useEffect, useState } from "react";
import { BranchSelectionGridMetaData } from "./gridMetaData";
import { GridMetaDataType } from "components/dataTable/types";
import { ClearCacheProvider, ClearCacheContext, queryClient } from "cache";
import branchSelectionSideImage from "assets/images/sideImage.png";
import "./css/branchSelectionGrid.css";
import { Box, Button, Container, Grid, Toolbar } from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import { useQuery } from "react-query";
import * as API from "./api";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useNavigate, useParams } from "react-router-dom";
import React, { useRef } from "react";
import { theme } from "app/audit/theme";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

const BranchSelectionGrid = () => {
  const navigate = useNavigate();
  const [apiData, setApiData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<any>(false); // Change 1: Added selectedBranch state
  const [error, setError] = useState(false); // Change 2: Added error state
  const { data, isLoading, isFetching, refetch } = useQuery<any, any>(
    ["BranchSelectionGridData"],
    () => API.BranchSelectionGridData()
  );

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
        ({ BRANCH_CD, BRANCH_NM, STATUS, END_DATETIME, BEGIN_DATETIME }) =>
          [BRANCH_CD, BRANCH_NM, STATUS, END_DATETIME, BEGIN_DATETIME].some(
            (info) => info.toLowerCase().includes(e.target.value.toLowerCase())
          )
      );
      setApiData(filtredValue);
    }
  };
  // const modifiedData = apiData.map((item) => ({
  //   ...item,
  //   disabled: item.STATUS === "Closed",
  //   clickable: item.STATUS == "Closed",
  // }));
  // console.log("modifiedData", modifiedData);

  const buttonStyles = {
    margin: "10px",
    minWidth: "8rem",
    height: "2.6rem",
    cursor: "pointer",
  };

  const handleNavigate = () => {
    if (selectedBranch) {
      // Change 3: Check if a branch is selected
      //navigate("/cbsenfinity/dashboard"); // Replace '/dashboard' with the actual URL of your dashboard page
      navigate("/cbsenfinity/dashboard");
    } else {
      setError(true); // Change 4: Set error state if no branch is selected
    }
    console.log("APIAPIDATADATA", apiData);
  };

  const gridRef = useRef();
  console.log("gridRef.current", gridRef.current);
  return (
    <>
      {/* <Container
        style={{ maxWidth: "100%", height: "100vh", padding: "0px !important" }}
      > */}
      <Grid
        container
        style={{
          margin: "0",
          padding: "0",
          height: "100vh",
          overflowY: "hidden",
          // Adjusted height to fill the entire viewport
        }}
      >
        <Grid item lg={1} md={1} xl={1} xs={1}>
          <img
            className="sideImage"
            src={branchSelectionSideImage}
            alt="side-Image"
          />
        </Grid>
        <Grid
          item
          lg={11}
          md={11}
          xl={11}
          xs={11}
          style={{
            // backgroundColor: "white",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Grid
            container
            // spacing={2}
            style={{
              // backgroundColor: "blue",
              minHeight: "100vh",
              padding: "10px 0px 0px 0px",
            }}
            lg={10}
            md={10}
            xl={10}
            xs={10}
          >
            <Grid
              container
              style={{
                // backgroundColor: "aqua",

                margin: "0",
                padding: "0",
                minHeight: "128px",
                maxHeight: "128px",
                // maxHeight: "79px",
              }}
              lg={12}
              md={12}
              xl={12}
              xs={12}
            >
              <Grid
                item
                lg={6}
                md={6}
                xl={6}
                xs={6}
                style={{
                  justifyContent: "center",
                }}
              >
                <Grid
                  item
                  style={{
                    margin: "0",
                    padding: "0",
                  }}
                  lg={12}
                  md={12}
                  xl={12}
                  xs={12}
                >
                  <h1
                    className="name-heading"
                    style={{ fontSize: "24px", margin: "14px 0px" }}
                  >
                    Welcome <span>Leo Williams,</span>
                  </h1>
                  <h1 className="access-heading" style={{ fontSize: "22px" }}>
                    Access Branch List <span>{apiData.length}</span>
                  </h1>
                </Grid>
              </Grid>
              <Grid
                item
                lg={6}
                md={6}
                xl={6}
                xs={6}
                style={{
                  // backgroundColor: "lightgreen",
                  justifyContent: "center",
                }}
              >
                <Grid
                  container
                  style={{
                    margin: "16px 0px 0 0",
                    padding: "0",
                    justifyContent: "right",
                    display: "grid",
                  }}
                  lg={12}
                  md={12}
                  xl={12}
                  xs={12}
                >
                  <p className="bank-name">Bank Name : Easybank Ltd.</p>

                  <p className="emp-id">Emp. Id : 001156</p>
                </Grid>
                <Grid
                  item
                  style={{
                    margin: "0",
                    padding: "0",
                  }}
                  lg={12}
                  md={12}
                  xl={12}
                  xs={12}
                >
                  <Search
                    style={{
                      backgroundColor: " var(--light-gray)",
                      borderRadius: "6px",
                      width: "auto",
                      margin: "0px",
                      float: "right",
                    }}
                  >
                    <SearchIconWrapper>
                      <SearchIcon />
                    </SearchIconWrapper>
                    <StyledInputBase
                      placeholder="Search Branch..."
                      inputProps={{ "aria-label": "search" }}
                      style={{
                        backgroundColor: "#EBEDEE73",
                        borderRadius: "10px",
                      }}
                      onChange={handleSearch}
                    />
                  </Search>
                </Grid>
              </Grid>
            </Grid>

            <Grid
              container
              style={{
                // backgroundColor: "orange",
                margin: "0",
                padding: "0",
                minHeight: "407px",
              }}
              lg={12}
              md={12}
              xl={12}
              xs={12}
            >
              {error && (
                <p style={{ color: "red" }}>Please select a branch</p> // Change 5: Display error message
              )}
              <GridWrapper
                key={`branchSelection`}
                finalMetaData={BranchSelectionGridMetaData as GridMetaDataType}
                data={apiData}
                setData={(row) => setSelectedBranch(row)}
                ref={gridRef}
              />

              <Grid
                container
                style={{
                  // backgroundColor: "orange",
                  margin: "0",
                  padding: "0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "right",
                }}
                lg={12}
                md={12}
                xl={12}
                xs={12}
              >
                {" "}
                <Button
                  style={{
                    ...buttonStyles,
                    border: "1px solid var(--theme-color3)",
                    color: "var(--theme-color3)",
                  }}
                >
                  Exit
                </Button>
                <Button
                  style={{
                    ...buttonStyles,
                    backgroundColor: "var(--theme-color3)",
                  }}
                  onClick={handleNavigate}
                >
                  Procceed
                </Button>
              </Grid>
            </Grid>
          </Grid>
          <Box
            style={{
              background: "var(--theme-color4)",
              height: "fit-content",
              position: "absolute",
              right: "55px",
              bottom: "7rem",
              padding: "7px",
              display: "flex",
              borderRadius: "10px",
              boxShadow: "0px 5px 10px 0px #080F2333",
              cursor: "pointer",
            }}
          >
            <ExpandMoreIcon style={{ color: "var(--theme-color3)" }} />
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export const BranchSelectionGridWrapper = () => {
  return (
    <ClearCacheProvider>
      <BranchSelectionGrid />
    </ClearCacheProvider>
  );
};
