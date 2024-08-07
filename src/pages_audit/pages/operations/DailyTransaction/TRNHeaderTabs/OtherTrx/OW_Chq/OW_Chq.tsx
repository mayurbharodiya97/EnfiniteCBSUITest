import { Fragment, useRef, useState } from "react";
import { useQuery } from "react-query";
import { OwChqGridMetaData } from "./gridMetadata";
import * as API from "./api";
import { AuthContext } from "pages_audit/auth";
import { AccDetailContext } from "pages_audit/auth";
import { useContext } from "react";
import { Alert, GridWrapper, GridMetaDataType } from "@acuteinfo/common-base";
export const OW_Chq = ({ reqData }) => {
  const myGridRef = useRef<any>(null);
  const { authState } = useContext(AuthContext);
  const { tempStore, setTempStore } = useContext(AccDetailContext);
  const [rows, setRows] = useState([]);

  // api define
  // const getOWChqList = useMutation(API.getOWChqList, {
  //   onSuccess: (data) => {
  //     console.log(data, " getOWChqList detailssss");
  //     setRows(data);
  //   },
  //   onError: (error) => {},
  // });
  // console.log(tempStore, "tempStore");
  // useEffect(() => {
  //   tempStore?.accInfo?.ACCT_CD && getOWChqList.mutate(tempStore.accInfo);
  // }, [tempStore]);
  const { data, isLoading, isFetching, refetch, error, isError } = useQuery<
    any,
    any
  >(["getOWChqList", { reqData }], () => API.getOWChqList(reqData));

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
        key={`OwChqGridMetaData`}
        finalMetaData={OwChqGridMetaData as GridMetaDataType}
        loading={isLoading || isFetching}
        data={data ?? []}
        setData={() => null}
        // refetchData={() => {}}
        ref={myGridRef}
      />
    </>
  );
};
