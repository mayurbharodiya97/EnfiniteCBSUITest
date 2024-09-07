import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { withStyles } from "@mui/styles";
import { CellWrapper } from "./cellWrapper";
import { Theme, Tooltip } from "@mui/material";

const HtmlTooltip = withStyles((theme: Theme) => ({
  tooltip: {
    backgroundColor: "#f5f5f9",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid #dadde9",
  },
}))(Tooltip);

export const MultipleValuesCellRenderer = (props) => {
  const {
    row: { original },
    column: { _accessor },
  } = props;

  let values = original[_accessor];
  let isArray = Array.isArray(values);

  let result = values.map((one, index) => {
    return <li key={index}>{one}</li>;
  });

  return (
    <CellWrapper positionRelative={true} {...props}>
      {isArray ? values[0] : "-"}
      {isArray && values.length > 1 ? (
        <HtmlTooltip
          title={
            <ul style={{ padding: 0, listStyle: "none", margin: "0px 0px" }}>
              {result}
            </ul>
          }
        >
          <MoreHorizIcon
            style={{
              position: "absolute",
              right: "5px",
              top: "5px",
              color: "#8d868685",
            }}
          />
        </HtmlTooltip>
      ) : null}
    </CellWrapper>
  );
};
