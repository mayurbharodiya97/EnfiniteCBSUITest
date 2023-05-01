import { useRef, useCallback, useState } from "react";
import Button from "@material-ui/core/Button";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { DateRetrievalDialog } from "components/custom/dateRetrievalPara";
import { useStyles } from "pages_audit/style";
import { CustomRetrievalWrapper } from "pages_audit/pages/reports/reportsRetrieval/customRetrieval";
import { DateUserRetrievalDialog } from "pages_audit/pages/reports/reportsRetrieval/dateUserRetrieval";

export const filterReducer = (state: any = [], action: any = {}) => {
  switch (action.type) {
    case "setValue": {
      const { id, ...others } = action.payload;
      let index = state.findIndex((one) => one.id === id);
      if (index >= 0) {
        state[index].value = others;
        return [...state];
      }
      return [...state, { id, value: others }];
    }
    case "removeValue": {
      const { id } = action.payload;
      /* eslint-disable eqeqeq */
      let result = state.filter((one) => one.id != id);
      return result;
    }
    case "resetAll": {
      return [];
    }
    default: {
      return state;
    }
  }
};

export const useFilterState = (reducer) => {
  const filterState = useRef<object>([]);
  /* eslint-disable react-hooks/exhaustive-deps */
  const dispatch = useCallback((action) => {
    let newState = reducer(filterState.current, action);
    filterState.current = newState;
  }, []);

  return {
    dispatch,
    filterState,
  };
};

export const FilterComponent = ({
  setQueryFilters,
  filterMeta,
  filterData,
  retrievalType,
}) => {
  const [open, setOpen] = useState(false);
  // const { filterState, dispatch } = useFilterState(filterReducer);
  const classes = useStyles();

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  // const handleFilterChange = () => {
  //   setQueryFilters(filterState.current);
  //   setOpen(false);
  // };

  // const selectedDates = (fromDate, toDate) => {
  //   setQueryFilters([
  //     {
  //       id: "FROM_DT",
  //       value: {
  //         condition: "equal",
  //         value: format(
  //           new Date(fromDate.toISOString() ?? new Date()),
  //           "dd/MM/yyyy"
  //         ),
  //         columnName: "From Date",
  //       },
  //     },
  //     {
  //       id: "TO_DT",
  //       value: {
  //         condition: "equal",
  //         value: format(
  //           new Date(toDate.toISOString() ?? new Date()),
  //           "dd/MM/yyyy"
  //         ),
  //         columnName: "To Date",
  //       },
  //     },
  //   ]);
  //   setOpen(false);
  // };

  const retrievalParaValues = (retrievalValues) => {
    setQueryFilters(retrievalValues);
    setOpen(false);
  };

  const setRetrievalData = (data) => {
    setQueryFilters([data]);
    setOpen(false);
  };

  const handleClearFilter = () => {
    setQueryFilters([]);
    setOpen(false);
  };

  // let filterColumns: any = [];
  // if (Array.isArray(filterMeta)) {
  //   filterColumns = filterMeta.filter(
  //     (one) => typeof one.Filter === "function"
  //   );
  //   filterColumns = filterColumns.map((one) => {
  //     const { Filter, accessor, ...others } = one;
  //     return (
  //       //@ts-ignore
  //       createElement(Filter, {
  //         key: accessor,
  //         filterValue: filterData.filter((one) => one.id === accessor)?.[0]
  //           ?.value,
  //         id: accessor,
  //         dispatch,
  //         ...others,
  //       })
  //     );
  //   });
  // }
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Button onClick={handleOpen} color="primary">
        Retrive Data
      </Button>
      {/* <Drawer
        anchor="right"
        id={"columnVisibility"}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: { width: "520px" },
        }}
      >
        <AppBar position="relative" color="secondary">
          <Toolbar variant="dense">
            <Typography variant="h6">Filter</Typography>
            <div style={{ flexGrow: 1 }} />
            <Button onClick={handleFilterChange}>Apply</Button>
            <Button onClick={handleClearFilter}>Clear</Button>
            <Button onClick={handleClose}>Close</Button>
          </Toolbar>
        </AppBar>
        <CardContent>
          <Grid container spacing={2}>
            {filterColumns}
          </Grid>
        </CardContent>
      </Drawer> */}
      {open && retrievalType === "DATE" ? (
        <DateRetrievalDialog
          classes={classes}
          open={open}
          handleClose={handleClose}
          loginState={{}}
          retrievalParaValues={retrievalParaValues}
        />
      ) : open && retrievalType === "DATEUSERNM" ? (
        <DateUserRetrievalDialog
          classes={classes}
          open={open}
          handleClose={handleClose}
          loginState={{}}
          retrievalParaValues={retrievalParaValues}
        />
      ) : open && retrievalType === "CUSTOM" ? (
        <CustomRetrievalWrapper
          open={open}
          handleDialogClose={handleClose}
          metaData={filterMeta}
          defaultData={filterData}
          retrievalData={setRetrievalData}
        />
      ) : (
        <></>
      )}
    </MuiPickersUtilsProvider>
  );
};
