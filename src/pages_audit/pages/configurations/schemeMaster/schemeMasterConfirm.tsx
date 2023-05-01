import { useRef, Fragment, useEffect, useContext, useCallback } from "react";
import { useNavigate, Routes, Route } from "react-router-dom";
import { queryClient, ClearCacheContext } from "cache";
import { useQuery } from "react-query";
import { Alert } from "components/common/alert";
import { ActionTypes } from "components/dataTable";
import GridWrapper from "components/dataTableStatic";
import { ViewEditSchemeMasterWrapper } from "./schemeMasterCrud";
import * as API from "./api";
import { useSnackbar } from "notistack";
import { SchemeMasterConfirmationGridMetaData } from "./gridMetaData";

const actions: ActionTypes[] = [
  {
    actionName: "view-details",
    actionLabel: "View Details",
    multiple: false,
    rowDoubleClick: true,
  },
];

export const SchemeMasterConfirm = () => {
  const navigate = useNavigate();
  const { getEntries } = useContext(ClearCacheContext);
  const isDataChangedRef = useRef(false);
  const myGridRef = useRef<any>(null);
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    return () => {
      let entries = getEntries() as any[];
      if (Array.isArray(entries) && entries.length > 0) {
        entries.forEach((one) => {
          queryClient.removeQueries(one);
        });
      }
      queryClient.removeQueries(["getMastersGridData"]);
    };
  }, [getEntries]);

  const { refetch, data, isLoading, isFetching, isError, error } = useQuery(
    ["getMastersGridData"],
    API.getMastersGridData
  );
  //console.log(data, isLoading, isFetching, isError, error);
  const setCurrentAction = useCallback(
    (data) => {
      let confirmed = data?.rows[0]?.data.CONFIRMED;
      if (confirmed === "Y") {
        enqueueSnackbar("Request has been already accepted.", {
          variant: "warning",
        });
      } else if (confirmed === "R") {
        enqueueSnackbar("Request has been already rejected.", {
          variant: "warning",
        });
      } else {
        navigate(data?.name, {
          state: data?.rows,
        });
      }
    },
    [navigate]
  );

  const handleDialogClose = () => {
    if (isDataChangedRef.current === true) {
      refetch();
      isDataChangedRef.current = false;
    }
    navigate(".");
  };
  let reqerror =
    typeof error === "object"
      ? { ...error }
      : { severity: undefined, error_msg: "", error_detail: "" };
  return (
    <Fragment>
      {isError === true ? (
        <Alert
          severity={reqerror?.severity ?? "error"}
          errorMsg={reqerror?.error_msg ?? "Error"}
          errorDetail={reqerror?.error_detail ?? ""}
        />
      ) : null}
      <GridWrapper
        key={`chargeTemplateConfirmation`}
        //@ts-ignore
        finalMetaData={SchemeMasterConfirmationGridMetaData}
        data={data ?? []}
        setData={() => null}
        actions={actions}
        setAction={setCurrentAction}
        loading={isLoading || isFetching}
        refetchData={refetch}
        ref={myGridRef}
        defaultSortOrder={[{ id: "TRAN_CD", desc: false }]}
        defaultFilter={[
          {
            id: "CONFIRM_STATUS",
            value: {
              columnName: "Status",
              condition: "equal",
              value: "Confirmation Pending",
            },
          },
        ]}
      />
      <Routes>
        <Route
          path="view-details/*"
          element={
            <ViewEditSchemeMasterWrapper
              isDataChangedRef={isDataChangedRef}
              closeDialog={handleDialogClose}
              defaultView={"confirm"}
            />
          }
        />
      </Routes>
    </Fragment>
  );
};
