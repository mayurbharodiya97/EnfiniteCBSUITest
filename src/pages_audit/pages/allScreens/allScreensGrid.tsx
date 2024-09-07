import { ClearCacheProvider, ClearCacheContext, queryClient } from "cache";
import { useContext, useRef, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Alert } from "components/common/alert";
import GridWrapper from "components/dataTableStatic";
import { GridMetaDataType } from "components/dataTable/types";
import { ActionTypes } from "components/dataTable";
import * as API from "./api";
import { AllScreensGridMetaData } from "./gridMetadata";
import { AuthContext } from "pages_audit/auth";
import { utilFunction } from "components/utils/utilFunctions";
import {
  AppBar,
  Box,
  Button,
  Dialog,
  Theme,
  Toolbar,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { GradientButton } from "components/styledComponent/button";

const useTypeStyles = makeStyles((theme: Theme) => ({
  root: {
    paddingLeft: theme.spacing(1.5),
    paddingRight: theme.spacing(1.5),
    background: "var(--theme-color5)",
  },
  title: {
    flex: "1 1 100%",
    color: "var(--theme-color2)",
    letterSpacing: "1px",
    fontSize: "1.5rem",
  },
  refreshiconhover: {},
}));
const actions: ActionTypes[] = [
  {
    actionName: "allScreens",
    actionLabel: "Release",
    multiple: true,
    rowDoubleClick: true,
  },
];

export const ReleaseUsers = ({ open = false, handleDialogClose }) => {
  const myGridRef = useRef<any>(null);
  const { getEntries } = useContext(ClearCacheContext);
  const { authState } = useContext(AuthContext);
  const headerClasses = useTypeStyles();
  const navigate = useNavigate();

  const result: any = {};
  const allScreenData = useMemo(() => {
    let responseData = utilFunction.GetAllChieldMenuData(
      authState.menulistdata,
      true
    );
    return responseData;
  }, [authState.menulistdata]);
  // console.log(allScreenData);
  const setCurrentAction = useCallback(
    (data) => {
      if ((data?.name ?? "") === "allScreens") {
        let path = data?.rows?.[0]?.data?.href;
        if (Boolean(path)) {
          navigate("../" + path);
        }
      } else {
        navigate(data?.name, {
          state: data?.rows,
        });
      }
    },
    [navigate]
  );
  // const result = useQuery<any, any>(["getAllScreensGridData"], () =>
  //   API.getAllScreensGridData()
  // );
  // const handleDialogClose = () => {
  //   navigate(".");
  //   if (isDataChangedRef.current === true) {
  //     myGridRef.current?.refetch?.();
  //     isDataChangedRef.current = false;
  //   }
  // };
  // useEffect(() => {
  //   return () => {
  //     let entries = getEntries() as any[];
  //     entries.forEach((one) => {
  //       queryClient.removeQueries(one);
  //     });
  //     queryClient.removeQueries(["getPartnerGridData"]);
  //   };
  // }, [getEntries]);
  //result.isError = true;
  //result.error.error_msg = "Something went to wrong..";
  return (
    <>
      <Dialog
        // fullWidth={true}
        open={open}
        PaperProps={{
          style: {
            width: "75%",
            // minHeight: "36vh",
            // height: "36vh",
          },
        }}
        maxWidth="lg"
      >
        <AppBar
          position="relative"
          color="secondary"
          style={{ marginBottom: "5px" }}
        >
          <Toolbar className={headerClasses.root} variant={"dense"}>
            <Typography
              className={headerClasses.title}
              color="inherit"
              variant={"h6"}
              component="div"
            >
              All Screens
            </Typography>
            {/* <Box
            // sx={{
            //   display: "flex",
            //   backgroundColor: "var(--theme-color4)",
            //   height: "39px",
            //   alignItems: "center",
            //   width: "100%",
            //   borderRadius: "12px",
            //   justifyContent: "center",
            // }}
            > */}
            <GradientButton
              onClick={handleDialogClose}
              style={{
                backgroundColor: "var(--theme-color2)",
                height: "26px",
                width: "71px",
                borderRadius: "08px",
                color: "var(--theme-color3)",
              }}
            >
              Close
            </GradientButton>
            {/* </Box> */}
          </Toolbar>
        </AppBar>
        <GridWrapper
          key={`allScreensGrid`}
          finalMetaData={AllScreensGridMetaData as GridMetaDataType}
          data={allScreenData}
          setData={() => null}
          loading={false}
          actions={actions}
          setAction={setCurrentAction}
          ref={myGridRef}
        />
      </Dialog>
    </>
  );
};

export const AllScreensGridWrapper = ({ open, handleDialogClose }) => {
  return (
    <ClearCacheProvider>
      <ReleaseUsers open={open} handleDialogClose={handleDialogClose} />
    </ClearCacheProvider>
  );
};
