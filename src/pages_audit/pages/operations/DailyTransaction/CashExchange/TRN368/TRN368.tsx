import { gridMetaData368 } from "./gridMetadata";
import { useCallback, useEffect, useRef, useState } from "react";
import { Card } from "@mui/material";
import {
  ActionTypes,
  GridMetaDataType,
  GridWrapper,
} from "@acuteinfo/common-base";

const actions: ActionTypes[] = [
  {
    actionName: "view-detail",
    actionLabel: "",
    multiple: false,
    rowDoubleClick: true,
  },
  {
    actionName: "Delete",
    actionLabel: "Remove",
    multiple: false,
    rowDoubleClick: false,
    // alwaysAvailable: true,
  },
];
const TRN368 = () => {
  const myGridRef = useRef<any>(null);
  const [rows, setRows] = useState<any>([]);

  const setCurrentAction = useCallback((data) => {
    console.log("something");
    let row = data.rows[0]?.data;

    if (data.name === "view-detail") {
    }

    if (data.name === "Delete") {
    }
  }, []);
  return (
    <Card
      sx={{
        boxShadow: "0px 1px 4px -1px #999999",
        borderRadius: "5px",
        padding: "8px",
        margin: "4px",
      }}
    >
      <h3>Cashier Exchange Confirmation (TRN/368)</h3>

      <GridWrapper
        key={`gridMetaData368`}
        finalMetaData={gridMetaData368 as GridMetaDataType}
        data={rows ?? []}
        setData={() => null}
        // loading={getTRN001List.isLoading || getCarousalCards.isLoading}
        // refetchData={() => getTRN001List.mutate(objData)}
        ref={myGridRef}
        actions={actions}
        setAction={setCurrentAction}
        disableMultipleRowSelect={true}
        variant={"outlined"}
      />
    </Card>
  );
};

export default TRN368;

// VALIDATECONFRIMEDDATA: {
//   url: "/transactionServiceAPI/VALIDATECONFRIMEDDATA",
//   packageName: "",
// },
// VALIDATECREDITDEBITAMT: {
//   url: "/transactionServiceAPI/VALIDATECREDITDEBITAMT",
//   packageName: "",
// },

// import TRN368 from "./pages/operations/DailyTransaction/CashExchange/TRN368/TRN368";
// import TRN043 from "./pages/operations/DailyTransaction/CashExchange/TRN043/TRN043";
// import TRN044 from "./pages/operations/DailyTransaction/CashExchange/TRN044/TRN044";
// <Route path="cash/368" element={<TRN368 />} />
// <Route path="cash/043" element={<TRN043 />} />
// <Route path="cash/044" element={<TRN044 />} />
