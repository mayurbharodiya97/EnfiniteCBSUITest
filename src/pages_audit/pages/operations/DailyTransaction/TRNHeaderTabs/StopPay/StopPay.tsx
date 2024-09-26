import { Fragment, useCallback, useRef, useState } from "react";
import { useQuery } from "react-query";
import { stopPayGridMetaData } from "./gridMetadata";
// import GridWrapper from "components/dataTableStatic";
import * as API from "./api";
import { AuthContext } from "pages_audit/auth";
import { AccDetailContext } from "pages_audit/auth";
import { useContext } from "react";
import {
  usePopupContext,
  Alert,
  GridWrapper,
  GridMetaDataType,
  ActionTypes,
  queryClient,
} from "@acuteinfo/common-base";

const actions: ActionTypes[] = [
  {
    actionName: "view-detail",
    actionLabel: "Release",
    multiple: false,
    rowDoubleClick: true,
    alwaysAvailable: true,
  },
];
export const StopPay = ({ reqData }) => {
  const myGridRef = useRef<any>(null);
  const { authState } = useContext(AuthContext);
  const { tempStore, setTempStore } = useContext(AccDetailContext);
  const [rows, setRows] = useState([]);
  const [dataRow, setDataRow] = useState<any>({});

  // // api define
  // const getStopPayList = useMutation(API.getStopPayList, {
  //   onSuccess: (data) => {
  //     console.log(data, " getStopPayList detailssss");
  //     setRows(data);
  //   },
  //   onError: (error) => {},
  // });

  // useEffect(() => {
  //   tempStore?.accInfo?.ACCT_CD && getStopPayList.mutate(tempStore.accInfo);
  // }, [tempStore]);
  console.log(reqData, "reqDatareqDatareqData]]]]]]");
  const { data, isLoading, isFetching, refetch, error, isError } = useQuery<
    any,
    any
  >(["getStopPayList", { reqData }], () => API.getStopPayList(reqData));

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
        key={`stopPayGridMetaData`}
        finalMetaData={stopPayGridMetaData as GridMetaDataType}
        data={data ?? []}
        setData={() => null}
        loading={isLoading || isFetching}
        // refetchData={() => {}}
        ref={myGridRef}
        actions={actions}
        setAction={setCurrentAction}
        disableMultipleRowSelect={true}
        variant={"standard"}
      />
    </>
  );
};
