import { FC } from "react";
import {
  Button,
  lighten,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import clsx from "clsx";
import { TableActionType, RenderActionType } from "./types";
import { filterAction } from "./utils";
import { makeStyles } from "@mui/styles";
import { GradientButton } from "components/styledComponent/button";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles((theme: any) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  highlight:
    theme.palette.type === "light"
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: "var(--theme-color2)",
          background: "var(--theme-color5)",
          borderTop: "1.5px solid var(--theme-color2)",
        },
  title: {
    flex: "1 1 100%",
  },
}));

export const TableActionToolbar: FC<TableActionType> = ({
  dense,
  selectedFlatRows,
  multipleActions,
  singleActions,
  setGridAction,
  submitButtonRef,
}) => {
  const classes = useStyles();
  const selectedCount = selectedFlatRows.length;
  const selectedRows = selectedFlatRows.map((one) => {
    return {
      data: one.original,
      id: one.id,
    };
  });
  if (selectedCount <= 0) {
    return null;
  }
  if (typeof setGridAction !== "function") {
    setGridAction = () => {};
  }
  return (
    <Toolbar
      className={clsx(classes.root, classes.highlight)}
      variant={dense ? "dense" : "regular"}
    >
      <Typography
        className={classes.title}
        color="inherit"
        variant={selectedCount > 0 ? "subtitle1" : "h6"}
        component="div"
      >
        Selected {selectedCount}
      </Typography>
      {selectedCount === 1 ? (
        <RenderActions
          key="singleFilters"
          actions={singleActions}
          setAction={setGridAction}
          selectedRows={selectedRows}
          buttonTextColor={"var(--theme-color2)"}
          submitButtonRef={submitButtonRef}
        />
      ) : null}
      {selectedCount > 0 ? (
        <RenderActions
          key="multipleFilters"
          actions={multipleActions ?? []}
          setAction={setGridAction}
          selectedRows={selectedRows}
          buttonTextColor={"var(--theme-color2)"}
          submitButtonRef={submitButtonRef}
        />
      ) : null}
    </Toolbar>
  );
};

//@ts-ignore
export const RenderActions: FC<RenderActionType> = ({
  actions,
  setAction,
  selectedRows,
  buttonTextColor = "var( --theme-color2)",
  buttonBackground = "inherit",
  style = {},
  submitButtonRef,
}) => {
  const { t } = useTranslation();
  if (Array.isArray(actions) && actions.length > 0) {
    return actions.map((one) => (
      <Tooltip title={one.tooltip ?? one.actionLabel} key={one.actionName}>
        <GradientButton
          rotateIcon={one.rotateIcon}
          starticon={one.startsIcon}
          endicon={one.endsIcon}
          onClick={() => {
            setAction({
              name: one.actionName,
              rows: selectedRows,
            });
          }}
          //color="secondary"
          // style={{
          //   //background: "var(--theme-color1)",
          //   color: "var(--theme-color3)", //"var(--theme-color2)",
          //   marginRight: "10px",
          // }}
          color={one.actionTextColor ?? buttonTextColor}
          style={{
            background: one.actionBackground ?? buttonBackground,
            color: one.actionTextColor ?? buttonTextColor,
            ...style,
            //marginRight: "10px",
          }}
          ref={one.onEnterSubmit ? submitButtonRef : null}
        >
          {t(one.actionLabel)}
        </GradientButton>
      </Tooltip>
    ));
  } else {
    return null;
  }
};

export const ActionContextMenu: FC<TableActionType> = ({
  singleActions,
  multipleActions,
  setGridAction,
  contextMenuRow,
  selectedFlatRows,
  mouseX,
  mouseY,
  handleClose,
  authState,
}) => {
  const { t } = useTranslation();
  const selectedRows = selectedFlatRows.map((one) => {
    return {
      data: one.original,
      id: one.id,
    };
  });
  let menuItems: null | JSX.Element[] = null;
  if (typeof setGridAction !== "function") {
    setGridAction = () => {};
  }
  let allActions = [...singleActions, ...(multipleActions ?? [])];
  if (
    Array.isArray(allActions) &&
    allActions.length > 0 &&
    selectedFlatRows.length <= 1 &&
    contextMenuRow !== null
  ) {
    allActions = filterAction(allActions, [contextMenuRow], authState, false);
    menuItems = allActions.map((one) => (
      <MenuItem
        key={one.actionName}
        onClick={() => {
          setGridAction({
            name: one.actionName,
            rows: [
              {
                data: contextMenuRow?.original,
                id: contextMenuRow?.id,
              },
            ],
          });
          handleClose();
        }}
      >
        {t(one.actionLabel)}
      </MenuItem>
    ));
  } else if (
    Array.isArray(multipleActions) &&
    multipleActions.length > 0 &&
    selectedFlatRows.length > 1 &&
    selectedFlatRows !== null
  ) {
    menuItems = multipleActions?.map((one) => (
      <MenuItem
        key={one.actionName}
        onClick={() => {
          setGridAction({
            name: one.actionName,
            rows: selectedRows,
          });
          handleClose();
        }}
      >
        {t(one.actionLabel)}
      </MenuItem>
    ));
  }
  return (
    <>
      {/* {console.log(menuItems)} */}
      {menuItems !== null &&
      Array.isArray(menuItems) &&
      menuItems.length > 0 ? (
        <Menu
          onContextMenu={(e) => {
            e.preventDefault();
            handleClose();
          }}
          open={mouseY !== null && singleActions.length > 0}
          onClose={handleClose}
          anchorReference="anchorPosition"
          anchorPosition={
            mouseY !== null && mouseX !== null
              ? {
                  top: mouseY,
                  left: mouseX,
                }
              : undefined
          }
        >
          {menuItems}
        </Menu>
      ) : null}
    </>
  );
};
