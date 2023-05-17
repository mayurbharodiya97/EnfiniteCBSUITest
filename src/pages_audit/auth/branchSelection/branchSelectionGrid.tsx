import GridWrapper from "components/dataTableStatic";
import { useCallback, useEffect, useState } from "react";
import { BranchSelectionGridMetaData } from "./gridMetaData";
import { ActionTypes, GridMetaDataType } from "components/dataTable/types";
import { ClearCacheProvider } from "cache";
import branchSelectionSideImage from "assets/images/sideImage.png";
import "./css/branchSelectionGrid.css";
import { Box, Grid } from "@mui/material";
import { useQuery } from "react-query";
import * as API from "./api";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useNavigate } from "react-router-dom";
import React, { useRef } from "react";
import { useSnackbar } from "notistack";

const actions: ActionTypes[] = [
  {
    actionName: "back",
    actionLabel: "Back",
    multiple: false,
    rowDoubleClick: false,
    actionTextColor: "var(--theme-color3)",
    actionBackground: "var(--theme-color2)",
  },
  {
    actionName: "proceed",
    actionLabel: "Proceed",
    multiple: false,
    rowDoubleClick: false,
    alwaysAvailable: false,
    actionTextColor: "var(--theme-color2)",
    actionBackground: "var(--theme-color3)",
  },
];

const BranchSelectionGrid = () => {
  const navigate = useNavigate();
  const [apiData, setApiData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<any>(false);
  const { enqueueSnackbar } = useSnackbar();

  const { data, isLoading, isFetching, refetch } = useQuery<any, any>(
    ["BranchSelectionGridData"],
    () => API.BranchSelectionGridData()
  );

  const setCurrentAction = useCallback(
    (data) => {
      console.log(">>data", data);
      if (data.name === "proceed") {
        if (data.rows?.length === 0) {
          enqueueSnackbar("Please Select Branch", {
            variant: "error",
          });
        } else if (data.rows?.[0]?.values?.STATUS === "Closed") {
          enqueueSnackbar("Please Select Open Branch.", {
            variant: "error",
          });
        } else {
          navigate("/netbanking/dashboard");
        }
      } else {
        navigate("/netbanking/login");
      }
    },
    [navigate]
  );

  useEffect(() => {
    if (data) {
      setApiData(data);
      setFilteredData(data);
    }
  }, [data]);

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
                minHeight: "86px",
                maxHeight: "86px",
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
                <h1
                  className="name-heading"
                  style={{ fontSize: "24px", margin: "4px 0px" }}
                >
                  Welcome <span>Leo Williams,</span>
                </h1>
                <h1 className="access-heading" style={{ fontSize: "22px" }}>
                  Access Branch List
                </h1>
              </Grid>
              <Grid
                item
                lg={6}
                md={6}
                xl={6}
                xs={6}
                style={{
                  margin: "4px 0px 0 0",
                  padding: "0",
                  justifyContent: "right",
                  display: "grid",
                  height: "fit-content",
                }}
              >
                <p className="bank-name">Bank Name : Easybank Ltd.</p>

                <p className="emp-id">Emp. Id : 001156</p>
              </Grid>
            </Grid>

            {/* <Grid
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
            > */}
            <GridWrapper
              key={`branchSelection`}
              finalMetaData={BranchSelectionGridMetaData as GridMetaDataType}
              data={apiData}
              setData={(row) => setSelectedBranch(row)}
              actions={actions}
              setAction={setCurrentAction}
              ref={gridRef}
              controlsAtBottom={true}
              headerToolbarStyle={{
                background: "white",
                float: "right",
                marginBottom: "13px",
              }}
            />
            {/* </Grid> */}
          </Grid>
          {/* <Box
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
          </Box> */}
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
