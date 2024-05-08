import { Fragment, useCallback, useRef, useState } from "react";
import { useQuery } from "react-query";
import { StockGridMetaData } from "./gridMetadata";
import GridWrapper from "components/dataTableStatic";
import { Alert } from "components/common/alert";
import { ActionTypes, GridMetaDataType } from "components/dataTable/types";
import * as API from "./api";
import { AuthContext } from "pages_audit/auth";
import { AccDetailContext } from "pages_audit/auth";
import { useContext } from "react";

const actions: ActionTypes[] = [
  {
    actionName: "view-detail",
    actionLabel: "Force Expire",
    multiple: false,
    rowDoubleClick: true,
  },
  {
    actionName: "Delete",
    actionLabel: "Remove",
    multiple: false,
    rowDoubleClick: false,
  },
  {
    actionName: "view",
    actionLabel: "Upload Doc",
    actionIcon: "detail",
    multiple: false,
  },
];

export const Stock = ({ reqData }) => {
  const myGridRef = useRef<any>(null);
  const { authState } = useContext(AuthContext);
  const { tempStore, setTempStore } = useContext(AccDetailContext);
  const [rows, setRows] = useState([]);
  const [dataRow, setDataRow] = useState<any>({});

  // const getStockList = useMutation(API.getStockList, {
  //   onSuccess: (data) => {
  //     console.log(data, " getStockList");
  //     setRows(data);
  //   },
  //   onError: (error) => {},
  // });

  // useEffect(() => {
  //   tempStore?.accInfo?.ACCT_CD && getStockList.mutate(tempStore.accInfo);
  // }, [tempStore]);
  const { data, isLoading, isFetching, refetch, error, isError } = useQuery<
    any,
    any
  >(["getStockList", { reqData }], () => API.getStockList(reqData));

  const setCurrentAction = useCallback((data) => {
    let row = data.rows[0]?.data;
    console.log(row, "rowwww");
    setDataRow(row);

    if (data.name === "view-detail") {
      console.log("heloooo");
    }
  }, []);

  return (
    <>
      {isError ? (
        <Fragment>
          <div style={{ width: "100%", paddingTop: "10px" }}>
            <Alert
              severity={error?.severity ?? "error"}
              errorMsg={error?.error_msg ?? "Error"}
              errorDetail={error?.error_detail ?? ""}
            />
          </div>
        </Fragment>
      ) : null}
      <GridWrapper
        key={`StockGridMetaData`}
        finalMetaData={StockGridMetaData as GridMetaDataType}
        data={data ?? []}
        setData={() => null}
        loading={isLoading || isFetching}
        // refetchData={() => {}}
        ref={myGridRef}
        actions={actions}
        setAction={setCurrentAction}
        onlySingleSelectionAllow={true}
        isNewRowStyle={true}
      />
    </>
  );
};
