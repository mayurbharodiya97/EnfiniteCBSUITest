import { forwardRef, useImperativeHandle } from "react";
import RefreshIcon from "@mui/icons-material/Refresh";
import { GlobalFilter } from "./components/filters";
import { RenderActions } from "components/dataTable/tableActionToolbar";
import { useAutoRefresh } from "../utils/autoRefresh";
import { CircularProgressWithLabel } from "../utils/circularProgressWithLabel";
import { TableFilterComponent } from "../dataTable/tableFilterComponent";
import { ColumnVisibility } from "../dataTable/columnVisibility";
import { IconButton, Toolbar, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { GradientButton } from "components/styledComponent/button";

const useStyles = makeStyles((theme: any) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
    background: "var(--theme-color5)",
  },
  title: {
    flex: "1 1 100%",
    color: "var(--theme-color2)",
    letterSpacing: "1px",
    fontSize: "1.5rem",
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
      preGlobalFilteredRows,
      globalFilter,
      setGlobalFilter,
      alwaysAvailableAction,
      setGridAction,
      selectedFlatRows,
      disableGlobalFilter,
      refetchData,
      autoRefreshInterval,
      gotoPage,
      setSortBy,
      allowFilter,
      filters,
      setAllFilters,
      filterMeta,
      visibleColumns,
      defaultHiddenColumns,
      allowColumnHiding,
      headerToolbarStyle,
      searchPlaceholder,
      ReportExportButton,
      setOpenExport
    },
    ref
    ) => {
      const { progress, enabled, intervalElapsed, pause, resume } =
      useAutoRefresh(refetchData, autoRefreshInterval);
      const classes = useStyles();
    useImperativeHandle(ref, () => ({
      pause: pause,
      resume: resume,
    }));
    return (
      <Toolbar
        className={classes.root}
        variant={dense ? "dense" : "regular"}
        style={{ ...headerToolbarStyle }}
      >
        <Typography
          className={classes.title}
          color="inherit"
          variant={"h6"}
          component="div"
          style={{ ...headerToolbarStyle }}
        >
          {label}
        </Typography>
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
        {typeof refetchData === "function" ? (
          <IconButton
            aria-label="more"
            aria-controls="long-menu"
            aria-haspopup="true"
            //@ts-ignore
            onClick={refetchData}
            color="primary"
          >
            <RefreshIcon />
          </IconButton>
        ) : null}
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
        {disableGlobalFilter ? null : (
          <GlobalFilter
            preGlobalFilteredRows={preGlobalFilteredRows}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
            searchPlaceholder={searchPlaceholder}
          />
        )}
        {ReportExportButton && 
        <GradientButton
          onClick={() => setOpenExport(true)} endicon="GetApp"
        >Export</GradientButton>}
        <RenderActions
          key="alwaysRender"
          selectedRows={selectedFlatRows}
          setAction={setGridAction}
          actions={alwaysAvailableAction ?? []}
        />
      </Toolbar>
    );
  }
);
