import { Fragment, useRef, useState } from "react";
import { useQuery } from "react-query";
import { HoldChargeGridMetaData } from "./gridMetadata";
// import GridWrapper from "components/dataTableStatic";
// import { GridMetaDataType } from "components/dataTable/types";
import * as API from "./api";
import { AuthContext } from "pages_audit/auth";
import { AccDetailContext } from "pages_audit/auth";
import { useContext } from "react";
import { Alert, GridWrapper, GridMetaDataType } from "@acuteinfo/common-base";

export const HoldCharge = ({ reqData }) => {
  const myGridRef = useRef<any>(null);
  const { authState } = useContext(AuthContext);
  const { tempStore, setTempStore } = useContext(AccDetailContext);
  const [rows, setRows] = useState([]);

  // api define
  // const getHoldChargeList = useMutation(API.getHoldChargeList, {
  //   onSuccess: (data) => {
  //     console.log(data, " getHoldChargeList detailssss");
  //     setRows(data);
  //   },
  //   onError: (error) => {},
  // });

  // useEffect(() => {
  //   console.log(tempStore, "tempStore");
  //   tempStore?.accInfo?.ACCT_CD && getHoldChargeList.mutate(tempStore.accInfo);
  // }, [tempStore]);

  const { data, isLoading, isFetching, refetch, error, isError } = useQuery<
    any,
    any
  >(["getHoldChargeList", { reqData }], () => API.getHoldChargeList(reqData));

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
        key={`HoldChargeGridMetaData`}
        finalMetaData={HoldChargeGridMetaData as GridMetaDataType}
        data={data ?? []}
        setData={() => null}
        loading={isLoading || isFetching}
        // refetchData={() => {}}
        ref={myGridRef}
      />
    </>
  );
};
