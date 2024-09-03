import { Fragment, useRef, useState } from "react";
import { useQuery } from "react-query";
import { ASBAGridMetaData } from "./gridMetadata";
// import GridWrapper from "components/dataTableStatic";
import { GridWrapper } from "components/dataTableStatic/gridWrapper";
import { Alert } from "components/common/alert";
// import { GridMetaDataType } from "components/dataTable/types";
import { GridMetaDataType } from "components/dataTableStatic/types";
import * as API from "./api";
import { AuthContext } from "pages_audit/auth";
import { AccDetailContext } from "pages_audit/auth";
import { useContext } from "react";

export const ASBA = ({ reqData }) => {
  const myGridRef = useRef<any>(null);
  const { authState } = useContext(AuthContext);
  const { tempStore, setTempStore } = useContext(AccDetailContext);
  const [rows, setRows] = useState([]);

  // api define
  // const getASBAList = useMutation(API.getASBAList, {
  //   onSuccess: (data) => {
  //     console.log(data, " getASBAList detailssss");
  //     setRows(data);
  //   },
  //   onError: (error) => {},
  // });

  // useEffect(() => {
  //   tempStore?.accInfo?.ACCT_CD && getASBAList.mutate(tempStore.accInfo);
  // }, [tempStore]);
  const { data, isLoading, isFetching, refetch, error, isError } = useQuery<
    any,
    any
  >(["getASBAList", { reqData }], () => API.getASBAList(reqData));

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
        key={`ASBAGridMetaData`}
        finalMetaData={ASBAGridMetaData as GridMetaDataType}
        data={data ?? []}
        loading={isLoading || isFetching}
        setData={() => null}
        // refetchData={() => {}}
        ref={myGridRef}
      />
    </>
  );
};
