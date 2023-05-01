import { ClearCacheContext, queryClient } from "cache";
import { useQuery } from "react-query";
import { useEffect, useContext, useRef, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { GridMetaDataType } from "components/dataTable/types";
import { ActionTypes } from "components/dataTable";
import * as API from "../api";
import { AmountLabelsGridMetaData } from "./gridMetadata";
import { useDialogStyles } from "pages_audit/common/dialogStyles";
import { AppBar, Button, Dialog, Toolbar, Typography } from "@material-ui/core";
import { Transition } from "pages_audit/common/transition";
import { GradientButton } from "components/styledComponent/button";
import { AmountLabelDetailsUpdate } from "./amountLabels";
//import { ReleaseUsersAPIWrapper } from "../releaseUsers";
const actions: ActionTypes[] = [
  {
    actionName: "view-details",
    actionLabel: "Edit Detail",
    multiple: false,
    rowDoubleClick: false,
  },
];

const transformData = (data: any) => {
  if (Array.isArray(data)) {
    return data.map((one, index) => ({
      ...one,
      id: index,
      _hidden: false,
      _isNewRow: false,
    }));
  } else {
    return data;
  }
};
export const ServiceAmountLabels = ({ closeDialog, rowData }) => {
  const isDataChangedRef = useRef(false);
  const myGridRef = useRef<any>(null);
  const { getEntries } = useContext(ClearCacheContext);
  const navigate = useNavigate();

  const { data, isLoading, isFetching, isError, error, refetch } = useQuery<
    any,
    any
  >(["getAmountLabelsGridData"], () =>
    API.getAmountLabelsGridData(rowData?.[0]?.data?.TRAN_CD)
  );
  useEffect(() => {
    return () => {
      let entries = getEntries() as any[];
      entries.forEach((one) => {
        queryClient.removeQueries(one);
      });
      queryClient.removeQueries(["getAmountLabelsGridData"]);
    };
  }, [getEntries]);
  const ClosedEventCall = useCallback(() => {
    navigate(".");
    if (isDataChangedRef.current === true) {
      myGridRef.current?.refetch?.();
      isDataChangedRef.current = false;
    }
  }, [navigate]);
  const GidData = useMemo(() => transformData(data), [data]);
  return (
    <>
      <div style={{ padding: "9px" }}>
        {isLoading || isFetching ? (
          <AmountLabelDetailsUpdate
            key={"Loading-CustomerLimitDetailsUpdate"}
            metadata={AmountLabelsGridMetaData as GridMetaDataType}
            ClosedEventCall={ClosedEventCall}
            data={[]}
            isEditableForm={true}
            isLoading={isLoading}
          >
            {({ handelCloseEvent, handleSubmit, classes }) => (
              <>
                <AppBar
                  position="relative"
                  color="secondary"
                  style={{ marginBottom: "10px" }}
                >
                  <Toolbar variant="dense">
                    <Typography
                      className={classes.title}
                      color="inherit"
                      variant={"h6"}
                      component="div"
                    >
                      Amount Label Mapping
                    </Typography>
                    <Button onClick={handelCloseEvent} color="primary">
                      Close
                    </Button>
                  </Toolbar>
                </AppBar>
              </>
            )}
          </AmountLabelDetailsUpdate>
        ) : isError ? (
          <AmountLabelDetailsUpdate
            key={"Error-CustomerLimitDetailsUpdate"}
            metadata={AmountLabelsGridMetaData as GridMetaDataType}
            ClosedEventCall={ClosedEventCall}
            data={[]}
            isEditableForm={true}
            isError={isError}
            ErrorMessage={error?.error_msg ?? "Error"}
          >
            {({ handelCloseEvent, handleSubmit, classes }) => (
              <AppBar
                position="relative"
                color="secondary"
                style={{ marginBottom: "10px" }}
              >
                <Toolbar variant="dense">
                  <Typography
                    className={classes.title}
                    color="inherit"
                    variant={"h6"}
                    component="div"
                  >
                    Amount Label Mapping
                  </Typography>
                  {/* <GradientButton onClick={refetch()} color="primary">
                    Retry
                  </GradientButton> */}
                  <Button onClick={handelCloseEvent} color="primary">
                    Close
                  </Button>
                </Toolbar>
              </AppBar>
            )}
          </AmountLabelDetailsUpdate>
        ) : (
          <AmountLabelDetailsUpdate
            key={"edit"}
            metadata={AmountLabelsGridMetaData as GridMetaDataType}
            ClosedEventCall={ClosedEventCall}
            data={GidData}
            // actions={actions}
            isEditableForm={true}
            mode={"edit"}
          >
            {({
              handelCloseEvent,
              handleSubmit,
              classes,
              handelActionEvent,
            }) => (
              <AppBar
                position="relative"
                color="secondary"
                style={{ marginBottom: "10px" }}
              >
                <Toolbar variant="dense">
                  <Typography
                    className={classes.title}
                    color="inherit"
                    variant={"h6"}
                    component="div"
                  >
                    Amount Label Mapping
                  </Typography>
                  <GradientButton
                    onClick={() => {
                      handelActionEvent({ name: "Add" });
                    }}
                    color="primary"
                  >
                    Add
                  </GradientButton>
                  <GradientButton onClick={handleSubmit} color="primary">
                    Save
                  </GradientButton>
                  <GradientButton onClick={closeDialog} color="primary">
                    Close
                  </GradientButton>
                </Toolbar>
              </AppBar>
            )}
          </AmountLabelDetailsUpdate>
        )}
      </div>
    </>
  );
};

export const AmountLabelsGridWrapper = ({ open, closeDialog, rowData }) => {
  const classes = useDialogStyles();
  return (
    <>
      <Dialog
        open={open}
        //@ts-ignore
        TransitionComponent={Transition}
        // PaperProps={{
        //   style: {
        //     width: "80%",
        //     minHeight: "60vh",
        //     height: "70vh",
        //   },
        // }}
        // maxWidth=""
        classes={{
          scrollPaper: classes.topScrollPaper,
          paperScrollBody: classes.topPaperScrollBody,
        }}
      >
        <ServiceAmountLabels closeDialog={closeDialog} rowData={rowData} />
      </Dialog>
    </>
  );
};
