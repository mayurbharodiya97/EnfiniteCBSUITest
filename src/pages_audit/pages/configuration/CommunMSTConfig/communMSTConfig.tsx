import { useCallback, useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "react-query";

import * as API from "./api";
import { queryClient } from "cache";
import {
  AppBar,
  Dialog,
  DialogActions,
  Grid,
  Toolbar,
  Typography,
} from "@mui/material";
import { LoaderPaperComponent } from "components/common/loaderPaper";
import { Box } from "@mui/system";
import { List } from "reactstrap";
import { ListItemData } from "components/dashboard/messageBox/messageBox";
import { GradientButton } from "components/styledComponent/button";
import { ActionTypes, GridMetaDataType } from "components/dataTable/types";
import GridWrapper from "components/dataTableStatic";
import { MiscMasteConfigGridMetaData } from "./metaData";
import { useNavigate } from "react-router-dom";

const actions: ActionTypes[] = [
  {
    actionName: "retreive",
    actionLabel: `Retreive`,
    multiple: false,
    rowDoubleClick: false,
    actionTextColor: "var(--theme-color2)",
    actionBackground: "var(--theme-color5)",
    alwaysAvailable: true,
  },
  // {
  //   actionName: "Add",
  //   actionLabel: `Add`,
  //   multiple: false,
  //   rowDoubleClick: false,
  //   actionTextColor: "var(--theme-color2)",
  //   actionBackground: "var(--theme-color5)",
  //   alwaysAvailable: true,
  // },
];
export const CommunMSTConfig = () => {
  //  const actionClasses = useStyles();
  const [open, setOpen] = useState(true);
  const [selectedRows, setSelectedRows] = useState<any>([]);
  const navigate = useNavigate();

  const { data, isLoading, isFetching } = useQuery(["getMiscListData"], () =>
    API.getMiscListData()
  );
  const miscGridData: any = useMutation(API.getProMiscData, {
    onSuccess: (data) => {},
    onError: (error: any) => {},
  });
  const handleRowClick = (event: any, name: string) => {
    if (event.ctrlKey) {
      setSelectedRows([...selectedRows, name]);
    } else {
      setSelectedRows([name]);
    }
  };

  useEffect(() => {
    return () => {
      queryClient.removeQueries(["getMiscListData"]);
      queryClient.removeQueries(["getProMiscData"]);
    };
  }, []);
  const setCurrentAction = useCallback(
    (data) => {
      if (data.name === "retreive") {
        setOpen(true);
      } else {
        navigate(data?.name, {
          state: data?.rows,
        });
      }
    },
    [navigate]
  );
  return (
    <>
      <Dialog
        open={open}
        //@ts-ignore
        // TransitionComponent={Transition}
        PaperProps={{
          style: {
            width: "100%",
            // minHeight: "36vh",
            // height: "36vh",
          },
        }}
        maxWidth="sm"
        classes={
          {
            // scrollPaper: classes.topScrollPaper,
            // paperScrollBody: classes.topPaperScrollBody,
          }
        }
      >
        <AppBar
          position="relative"
          color="secondary"
          style={{ marginBottom: "5px" }}
        >
          <Toolbar variant={"dense"}>
            <Typography
              // className={headerClasses.title}
              color="inherit"
              variant={"h6"}
              component="div"
            >
              Misc Master Configuration
            </Typography>
          </Toolbar>
        </AppBar>
        <>
          {isLoading || isFetching ? (
            <LoaderPaperComponent />
          ) : (
            <Grid item xs={12} sm={12} md={12} style={{ padding: "10px" }}>
              <Box
                sx={{
                  width: "100%",
                  // maxWidth: 400,
                  bgcolor: "background.paper",
                  height: "35vh",
                  overflow: "scroll",
                  border: "ridge",
                  borderRadius: "3",
                }}
              >
                <nav aria-label="main mailbox folders">
                  <List style={{ paddingTop: "0px", paddingBottom: "0px" }}>
                    {data?.map((item) => (
                      <ListItemData
                        key={item?.value}
                        name={item?.label}
                        disabled={false}
                        selected={selectedRows.includes(item?.value)}
                        onClick={(event) => handleRowClick(event, item?.value)}
                      />
                    ))}
                  </List>
                </nav>
              </Box>
            </Grid>
          )}
        </>
        <DialogActions
          // className={actionClasses.verifybutton}
          style={{ marginTop: "2px", marginBottom: "2px" }}
        >
          <>
            <GradientButton
              onClick={(e) => {
                miscGridData.mutate({
                  categoryCD: selectedRows?.[0],
                });
                setOpen(false);
              }}
            >
              Ok
            </GradientButton>

            <GradientButton
              // disabled={result.isLoading || isLocalLoding}
              onClick={() => {
                setOpen(false);
                navigate("/cbsenfinity/configuration/");
              }}
            >
              Cancel
            </GradientButton>
          </>
        </DialogActions>
      </Dialog>

      {miscGridData.isLoading || miscGridData.isFetching ? (
        <LoaderPaperComponent />
      ) : (
        <GridWrapper
          key={`miscMasterConfig`}
          finalMetaData={MiscMasteConfigGridMetaData as GridMetaDataType}
          data={miscGridData?.data}
          setData={() => null}
          // loading={mutation.isLoading}
          actions={actions}
          setAction={setCurrentAction}
          headerToolbarStyle={{
            fontSize: "1.20rem",
          }}
          // refetchData={() => {}}
          // ref={myGridRef}
        />
      )}
    </>
  );
};
