import { Fragment, useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { SubsidyGridMetaData } from "./gridMetadata";
import GridWrapper from "components/dataTableStatic";
import { GridMetaDataType } from "components/dataTable/types";
import * as API from "./api";
import { AuthContext } from "pages_audit/auth";
import { AccDetailContext } from "pages_audit/auth";
import { useContext } from "react";
import { Alert } from "components/common/alert";

export const Subsidyy = ({ reqData }) => {
  const myGridRef = useRef<any>(null);
  const { authState } = useContext(AuthContext);
  const { tempStore, setTempStore } = useContext(AccDetailContext);
  const [rows, setRows] = useState([]);

  // // api define
  // const getSubsidyList = useMutation(API.getSubsidyList, {
  //   onSuccess: (data) => {
  //     console.log(data, " getSubsidyList detailssss");
  //     setRows(data);
  //   },
  //   onError: (error) => {},
  // });

  // useEffect(() => {
  //   tempStore?.accInfo?.ACCT_CD && getSubsidyList.mutate(tempStore.accInfo);
  // }, [tempStore]);

  const { data, isLoading, isFetching, refetch, error, isError } = useQuery<
    any,
    any
  >(["getSubsidyList"], () => API.getSubsidyList(reqData));
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
        key={`SubsidyGridMetaData`}
        finalMetaData={SubsidyGridMetaData as GridMetaDataType}
        data={data ?? []}
        setData={() => null}
        loading={isLoading || isFetching}
        refetchData={() => {}}
        ref={myGridRef}
      />
    </>
  );
};
