import { Fragment, useRef, useState } from "react";
import { useQuery } from "react-query";
import { ACH_IWGridMetaData } from "./gridMetadata";
// import GridWrapper from "components/dataTableStatic";
// import { GridMetaDataType } from "components/dataTable/types";
import * as API from "./api";
import { AuthContext } from "pages_audit/auth";
import { AccDetailContext } from "pages_audit/auth";
import { useContext } from "react";
import { Alert, GridWrapper, GridMetaDataType } from "@acuteinfo/common-base";
export const ACH_IW = ({ reqData }) => {
  const myGridRef = useRef<any>(null);
  const { authState } = useContext(AuthContext);
  const { tempStore, setTempStore } = useContext(AccDetailContext);
  const [rows, setRows] = useState([]);

  // api define
  // const getACH_IWList = useMutation(API.getACH_IWList, {
  //   onSuccess: (data) => {
  //     console.log(data, " getACH_IWList detailssss");
  //     setRows(data);
  //   },
  //   onError: (error) => {},
  // });

  // useEffect(() => {
  //   tempStore?.accInfo?.ACCT_CD && getACH_IWList.mutate(tempStore.accInfo);
  // }, [tempStore]);

  const { data, isLoading, isFetching, refetch, error, isError } = useQuery<
    any,
    any
  >(["getACH_IWList", { reqData }], () => API.getACH_IWList(reqData));

  return (
    <>
      {" "}
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
        key={`ACH_IWGridMetaData`}
        finalMetaData={ACH_IWGridMetaData as GridMetaDataType}
        data={data ?? []}
        loading={isLoading || isFetching}
        setData={() => null}
        // refetchData={() => {}}
        ref={myGridRef}
      />
    </>
  );
};
