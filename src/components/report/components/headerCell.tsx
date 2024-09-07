import { TableSortLabel } from "@mui/material";
import { Fragment } from "react";

export const HeaderColumnCell = (props) => {
  //Column change order using drag and drop
  const { column } = props;

  return (
    <Fragment>
      <TableSortLabel
        active={column.isSorted}
        direction={column.isSortedDesc ? "desc" : "asc"}
        hideSortIcon={true}
        {...column.getSortByToggleProps([
          {
            style: {
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              display: "flex",
              color: "#0063a3",
              fontSize: "1 rem",
              fontWeight: "600",
              paddingRight:
                //@ts-ignore
                (column?.TableCellProps?.align ?? "left") === "right" &&
                column.canFilter
                  ? "15px"
                  : "10px",
            },
          },
        ])}
      >
        <span
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            paddingRight: "10px",
            color: "var(--theme-color3)",
          }}
        >
          {column.columnName}
        </span>
      </TableSortLabel>
      {column.canGroupBy ? (
        <span {...column.getGroupByToggleProps()}>
          {column.isGrouped ? "🔴" : "➕"}
        </span>
      ) : null}
      <div
        {...column.getResizerProps([
          {
            style: {
              //minHeight: "34px",
              opacity: 1,
              color: "rgba(224, 224, 224, 1)",
              right: "0px",
              display: "flex",
              zIndex: 100,
              position: "absolute",
              flexDirection: "column",
              justifyContent: "center",
            },
          },
        ])}
      >
        <svg
          focusable="false"
          viewBox="0 0 24 24"
          aria-hidden="true"
          data-testid="SeparatorIcon"
          style={{
            color: "inherit",
            userSelect: "none",
            width: "1em",
            height: "1em",
            display: "inline-block",
            fill: "currentColor",
            flexShrink: 0,
            transition: "fill 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
            fontSize: "20px",
          }}
        >
          <path d="M11 19V5h2v14z"></path>
        </svg>
      </div>
    </Fragment>
  );
};
