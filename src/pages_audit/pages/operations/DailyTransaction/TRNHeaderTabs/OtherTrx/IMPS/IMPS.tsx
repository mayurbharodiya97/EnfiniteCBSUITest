import { Fragment, useRef, useState } from "react";
import { useQuery } from "react-query";
import { IMPSGridMetaData } from "./gridMetadata";
// import GridWrapper from "components/dataTableStatic";
// import { GridMetaDataType } from "components/dataTable/types";
import * as API from "./api";
import { AuthContext } from "pages_audit/auth";
import { AccDetailContext } from "pages_audit/auth";
import { useContext } from "react";
import { Alert, GridWrapper, GridMetaDataType } from "@acuteinfo/common-base";
export const IMPS = ({ reqData }) => {
  const myGridRef = useRef<any>(null);
  const { authState } = useContext(AuthContext);
  const { tempStore, setTempStore } = useContext(AccDetailContext);
  const [rows, setRows] = useState([]);
  console.log("imps calleddddd");
  // api define
  // const getIMPSList = useMutation(API.getIMPSList, {
  //   onSuccess: (data) => {
  //     console.log(data, " getIMPSList detailssss");
  //     setRows(data);
  //   },
  //   onError: (error) => {},
  // });

  // useEffect(() => {
  //   tempStore?.accInfo?.ACCT_CD && getIMPSList.mutate(tempStore.accInfo);
  // }, [tempStore]);
  const { data, isLoading, isFetching, refetch, error, isError } = useQuery<
    any,
    any
  >(["getIMPSList", { reqData }], () => API.getIMPSList(reqData));

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
        key={`IMPSGridMetaData`}
        finalMetaData={IMPSGridMetaData as GridMetaDataType}
        loading={isLoading || isFetching}
        data={data ?? []}
        setData={() => null}
        // refetchData={() => {}}
        ref={myGridRef}
      />
    </>
  );
};
