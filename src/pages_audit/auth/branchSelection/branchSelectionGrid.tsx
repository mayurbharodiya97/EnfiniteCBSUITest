import GridWrapper from "components/dataTableStatic";
import { Fragment, useCallback, useContext, useEffect, useState } from "react";
import { BranchSelectionGridMetaData } from "./gridMetaData";
import { ActionTypes, GridMetaDataType } from "components/dataTable/types";
import { ClearCacheProvider } from "cache";
import branchSelectionSideImage from "assets/images/sideImage.png";
import "./css/branchSelectionGrid.css";
import { Alert } from "components/common/alert";
import { Box, Button, Grid } from "@mui/material";
import { useMutation, useQuery } from "react-query";
import * as API from "./api";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useNavigate } from "react-router-dom";
import React, { useRef } from "react";
import { useSnackbar } from "notistack";
import { AuthContext } from "pages_audit/auth";
import { queryClient } from "cache";
import { LoaderPaperComponent } from "components/common/loaderPaper";
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
    rowDoubleClick: true,
    actionTextColor: "var(--theme-color2)",
    actionBackground: "var(--theme-color3)",
    onEnterSubmit: true,
  },
];

const BranchSelectionGrid = ({ selectionMode }) => {
  const { authState, isBranchSelected, branchSelect, isLoggedIn, logout } =
    useContext(AuthContext);
  const navigate = useNavigate();
  const rowsData = useRef<any>({});

  const { enqueueSnackbar } = useSnackbar();
  const { data, isLoading, isFetching, refetch, error, isError } = useQuery<
    any,
    any
  >(["BranchSelectionGridData"], () => API.BranchSelectionGridData());

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/cbsenfinity/login");
    } else if (isBranchSelected() && selectionMode !== "C") {
      navigate("/cbsenfinity/dashboard");
    }
  }, [isBranchSelected, isLoggedIn]);

  type MutationErrorType = {
    severity: string;
    error_msg: string;
    error_detail: string;
  };

  const mutation = useMutation(API.GetMenuData, {
    onSuccess: (data) => {
      console.log(">>success rowsData", rowsData);
      branchSelect({
        menulistdata: data,
        branchCode: rowsData?.current?.BRANCH_CD,
        branch: rowsData?.current?.BRANCH_NM,
        baseBranchCode: rowsData?.current?.BASE_BRANCH_CD,
      });
    },
  });
  const getError: any = mutation.error as MutationErrorType;
  const setCurrentAction = useCallback(
    (data) => {
      if (data.name === "proceed") {
        if (data.rows?.length === 0) {
          enqueueSnackbar("Please Select Branch", {
            variant: "error",
          });
        } else if (data.rows?.[0]?.data?.STATUS === "Closed") {
          enqueueSnackbar("Please Select Open Branch.", {
            variant: "error",
          });
        } else {
          rowsData.current = data.rows?.[0]?.data;
          mutation.mutate({
            BASE_COMP_CD: data.rows?.[0]?.data?.BASE_COMP_CD ?? "",
            BASE_BRANCH_CD: data.rows?.[0]?.data?.BASE_BRANCH_CD ?? "",
            COMP_CD: data.rows?.[0]?.data?.COMP_CD ?? "",
            BRANCH_CD: data.rows?.[0]?.data?.BRANCH_CD ?? "",
            GROUP_NAME: authState?.roleName ?? "",
            APP_TRAN_CD: "51",
            COMP_NM: data.rows?.[0]?.data?.COMP_NM ?? "",
            BRANCH_NM: data.rows?.[0]?.data?.BRANCH_NM ?? "",
            DAYEND_STATUS: data.rows?.[0]?.data?.DAYEND_STATUS ?? "",
            EOD_RUNNING_STATUS: data.rows?.[0]?.data?.EOD_RUNNING_STATUS ?? "",
            IS_UPD_DEF_BRANCH: authState?.user?.isUpdDefBranch ?? "",
            COMP_BASE_BRANCH_CD:
              data.rows?.[0]?.data?.COMP_BASE_BRANCH_CD ?? "",
            selectionMode,
            fulldata: authState,
          });
        }
      } else {
        logout();
      }
    },
    [navigate, data, mutation]
  );

  useEffect(() => {
    if (data?.length === 1) {
      if (data?.[0]?.STATUS === "Closed") {
        enqueueSnackbar("Please Select Open Branch.", {
          variant: "error",
        });
      } else {
        setCurrentAction({ name: "proceed", rows: [{ data: { ...data[0] } }] });
      }
    }
  }, [JSON.stringify(data)]);

  return (
    <>
      <Grid
        container
        style={{
          margin: "0",
          padding: "0",
          height: "100vh",
          // overflowY: "hidden",
        }}
      >
        <Grid item lg={1} md={1} xl={1} xs={1} sm={1}>
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
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Grid
            container
            style={{
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
                margin: "0",
                padding: "0",
                // height: "12vh",
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
                xs={12}
                sm={6}
                style={{
                  justifyContent: "center",
                }}
              >
                <h1
                  className="name-heading"
                  style={{ fontSize: "24px", margin: "4px 0px" }}
                >
                  Welcome <span>{`${authState?.user?.name ?? ""},`}</span>
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
                xs={12}
                sm={6}
                style={{
                  margin: "4px 0px 0 0",
                  padding: "0",
                  justifyContent: "right",
                  display: "grid",
                  height: "fit-content",
                }}
              >
                <div className="bank-name-container">
                  <p className="bank-name">
                    {`Bank Name: ${authState?.companyName ?? ""}`}
                  </p>
                </div>

                <p className="emp-id">
                  {`Emp. Id: ${authState?.user?.employeeID ?? ""}`}
                </p>
              </Grid>
            </Grid>

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
            ) : mutation.isError && mutation.error ? (
              <Fragment>
                <div style={{ width: "100%", paddingTop: "10px" }}>
                  <Alert
                    severity={getError.severity ?? "error"}
                    errorMsg={getError.error_msg ?? "Error"}
                    errorDetail={getError.error_detail ?? ""}
                  />
                </div>
              </Fragment>
            ) : null}
            <GridWrapper
              key={`branchSelection`}
              finalMetaData={BranchSelectionGridMetaData as GridMetaDataType}
              data={data ?? []}
              setData={() => null}
              actions={actions}
              setAction={setCurrentAction}
              controlsAtBottom={true}
              headerToolbarStyle={{
                background: "var(--theme-color2)",
              }}
              onlySingleSelectionAllow={true}
              isNewRowStyle={true}
              loading={isLoading || isFetching || mutation.isLoading}
              defaultSelectedRowId={authState?.user?.branchCode ?? null}
            />
            {isError || data?.length === 0 ? (
              <Button
                sx={{
                  backgroundColor: "var(--theme-color3)",
                  position: "absolute",
                  right: "113px",
                  bottom: "20px",
                  width: "7rem",
                  "&:hover": {
                    backgroundColor: "var(--theme-color3)",
                  },
                }}
                onClick={() => logout()}
              >
                Back
              </Button>
            ) : null}
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

export const BranchSelectionGridWrapper = ({ selectionMode }) => {
  return (
    <ClearCacheProvider>
      <BranchSelectionGrid selectionMode={selectionMode} />
    </ClearCacheProvider>
  );
};
