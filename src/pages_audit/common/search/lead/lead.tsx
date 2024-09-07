import { useState, Fragment, useEffect } from "react";
import {
  ServerGrid,
  ServerGridContextProvider,
} from "pages_audit/common/serverGrid";
import { serverGridContextGenerator } from "./context";
import { ActionTypes } from "components/dataTable";

const actions: ActionTypes[] = [
  {
    actionName: "select",
    actionLabel: "Select",
    multiple: false,
    rowDoubleClick: true,
  },
];

export const LeadSearch = ({ gridCode, actions, onAccept, value }) => {
  const [currentAction, setCurrentAction] = useState<null | any>(null);
  let filter = Boolean(value)
    ? [
        {
          id: "lead_no",
          value: {
            value: value,
            condition: "equal",
            columnName: "Lead CD",
          },
        },
      ]
    : [];
  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (currentAction?.name === "select") {
      onAccept({
        refID: currentAction?.rows[0].id,
        value: currentAction?.rows[0]?.data?.lead_no,
      });
    }
  }, [currentAction]);
  return (
    <Fragment>
      <ServerGridContextProvider {...serverGridContextGenerator(gridCode)}>
        <ServerGrid
          gridCode={gridCode}
          actions={actions}
          setAction={setCurrentAction}
          defaultSortOrder={[{ id: "tran_cd", desc: true }]}
          defaultFilter={filter}
        />
      </ServerGridContextProvider>
    </Fragment>
  );
};

export const LeadSearchWrapper = ({ onAccept, value }) => {
  return (
    <LeadSearch
      gridCode="TRN/003"
      actions={actions}
      onAccept={onAccept}
      value={value}
    />
  );
};
