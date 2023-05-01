import { forwardRef } from "react";
import RefreshIcon from "@mui/icons-material/Refresh";
import { ColumnVisibility } from "./columnVisibility";
import { RenderActions } from "./tableActionToolbar";
import { TableFilterComponent } from "./tableFilterComponent";
import { useAutoRefresh } from "../utils/autoRefresh";
import { CircularProgressWithLabel } from "../utils/circularProgressWithLabel";
import { IconButton, Toolbar, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme: any) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    background: "var(--theme-color1)",
  },
  title: {
    flex: "1 1 100%",
    color: "var(--white)",
    letterSpacing: "1px",
    fontSize: "2rem",
  },
  refreshiconhover: {
    // "&:hover": {
    //   backgroundColor: "var(--theme-color2)",
    //   color: "var(--theme-color1)",
    // },
  },
}));

export const TableHeaderToolbar = forwardRef<any, any>(
  (
    {
      dense,
      label,
      visibleColumns,
      defaultHiddenColumns,
      allowColumnHiding,
      setGridAction,
      selectedFlatRows,
      alwaysAvailableAction,
      allowFilter,
      setAllFilters,
      gotoPage,
      setSortBy,
      filterMeta,
      filters,
      autoRefreshInterval,
    },
    ref
  ) => {
    const classes = useStyles();
    const { progress, enabled, intervalElapsed, pause, resume } =
      useAutoRefresh(
        //@ts-ignore
        ref?.current?.fetchData,
        autoRefreshInterval
      );

    return (
      <Toolbar className={classes.root} variant={dense ? "dense" : "regular"}>
        <Typography
          className={classes.title}
          color="inherit"
          variant={"h6"}
          component="div"
        >
          {label}
        </Typography>
        <RenderActions
          key="alwaysRender"
          actions={alwaysAvailableAction ?? []}
          setAction={setGridAction}
          selectedRows={selectedFlatRows}
        />
        {allowFilter ? (
          <TableFilterComponent
            setAllFilters={setAllFilters}
            filters={filters}
            filterMeta={filterMeta}
            gotoPage={gotoPage}
            setSortBy={setSortBy}
            classes={classes}
          />
        ) : null}
        <IconButton
          aria-label="refresh"
          aria-controls="button"
          aria-haspopup="false"
          //@ts-ignore
          onClick={() => ref?.current?.fetchData?.()}
          color="primary"
          className={classes.refreshiconhover}
        >
          <RefreshIcon />
        </IconButton>
        {enabled ? (
          <CircularProgressWithLabel
            variant="determinate"
            value={progress}
            interval={intervalElapsed}
            pause={pause}
            resume={resume}
          />
        ) : null}

        {allowColumnHiding ? (
          <ColumnVisibility
            visibleColumns={visibleColumns}
            defaultHiddenColumns={defaultHiddenColumns}
            classes={classes}
          />
        ) : null}
      </Toolbar>
    );
  }
);
