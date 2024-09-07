import { filterAction } from "components/dataTable/utils";
import { CellWrapper } from "./cellWrapper";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";

export const ActionCellRenderer = (props) => {
  let {
    column: { actions },
    row,
    setGridAction,
    singleActions,
  } = props;
  const setAction = (actionName) => {
    setGridAction({
      name: actionName,
      rows: [
        {
          data: row?.original,
          id: row?.id,
        },
      ],
    });
  };
  if (!Array.isArray(actions)) {
    actions = [actions];
  }
  singleActions = singleActions.filter((one) => {
    return actions.indexOf(one?.actionName) >= 0;
  });
  if (singleActions.length > 0) {
    singleActions = filterAction(singleActions, [row], {}, false);
  }
  return (
    <CellWrapper {...props}>
      <ButtonGroup size="small" aria-label="actions">
        {singleActions.map((one) => (
          <Button onClick={() => setAction(one.actionName)}>
            {one.actionLabel}
          </Button>
        ))}
      </ButtonGroup>
    </CellWrapper>
  );
};
