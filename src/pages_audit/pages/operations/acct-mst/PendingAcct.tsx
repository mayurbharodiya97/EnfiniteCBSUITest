import React, { useCallback, useContext, useMemo, useState } from "react";
import { Grid } from "@mui/material";
import { Alert } from "components/common/alert";
import { GridMetaDataType } from "components/dataTableStatic";
import { GridWrapper } from "components/dataTableStatic/gridWrapper";
import { useQuery } from "react-query";
import { Route, Routes, useNavigate } from "react-router-dom";
import * as API from "./api";
import { ActionTypes } from "components/dataTable";
import { AuthContext } from "pages_audit/auth";
import { pendingAcctMetadata } from "./metadata/pendingAcctMetadata";
import { format } from "date-fns";
import AcctModal from "./AcctModal";

const pendingActions: ActionTypes[] = [
    {
      actionName: "view-detail",
      actionLabel: "View Detail",
      multiple: false,
      rowDoubleClick: true,
    },
    {
      actionName: "view-all",
      actionLabel: "View All",
      multiple: false,
      rowDoubleClick: false,
      alwaysAvailable: true,
      isNodataThenShow: true,
    },
];
const PendingAcct = () => {
    const {authState} = useContext(AuthContext);
    const navigate = useNavigate();
    const [formMode, setFormMode] = useState("new");

    const {
        data: PendingAcct,
        isError: isPendingError,
        isLoading: isPendingAcctLoading,
        isFetching: isPendingAcctFetching,
        refetch: PendingRefetch,
        error: PendingError,
    } = useQuery<any, any>(["getConfirmPendingData", {}], () =>
      API.getPendingAcct({
        COMP_CD: authState?.companyID ?? "",
        BRANCH_CD: authState?.user?.branchCode ?? "",
        REQ_FLAG: "P",
      //   ENTERED_DATE: format(new Date(), "dd-MM-yyyy"),
      })
    )

    const transformData = (data: any) => {
        if (Array.isArray(data)) {
          return data.map((one, index) => ({
            ...one,
            LAST_MODIFIED: Boolean(one?.LAST_MODIFIED)
              ? format(new Date(one?.LAST_MODIFIED), "dd/MM/yyyy")
              : "",
            VERIFIED_DATE: Boolean(one?.VERIFIED_DATE)
              ? format(new Date(one?.VERIFIED_DATE), "dd/MM/yyyy")
              : "",
          }));
        } else {
          return data;
        }
    };
    const GridData = useMemo(() => transformData(PendingAcct), [PendingAcct]);

    const setCurrentAction = useCallback(
        (data) => {
          const confirmed = data?.rows?.[0]?.data?.CONFIRMED ?? "";
          const maker = data?.rows?.[0]?.data?.MAKER ?? "";
          const loggedinUser = authState?.user?.id;
          if(Boolean(confirmed)) {
            if(confirmed.includes("P")) {
              if(maker === loggedinUser) {
                setFormMode("edit")
              } else {
                setFormMode("view")
              }
            } else if(confirmed.includes("M")) {
              setFormMode("edit")
            } else {
              setFormMode("view")
            }
          }
          if(data.rows?.[0]?.data?.UPD_TAB_NAME === "EXISTING_PHOTO_MODIFY") {
            navigate("photo-signature", {
              state: data?.rows,
            })  
          } else {
            // setRowsData(data?.rows);
            navigate(data?.name, {
              state: data?.rows,
            });
          }
        },
        [navigate]
    );

    return (
      <Grid>
        {isPendingError && (
            <Alert
            severity={PendingError?.severity ?? "error"}
            errorMsg={PendingError?.error_msg ?? "Something went to wrong.."}
            errorDetail={PendingError?.error_detail}
            color="error"
            />
        )}
        <Grid item>
          <GridWrapper
              key={`PendingAcctEntrties` + GridData}
              finalMetaData={pendingAcctMetadata as GridMetaDataType}
              data={GridData ?? []}
              setData={() => null}
              loading={isPendingAcctLoading || isPendingAcctFetching}
              actions={pendingActions}
              setAction={setCurrentAction}
              refetchData={() => PendingRefetch()}
              // ref={myGridRef}
          />
        </Grid>
        <Routes>
          <Route
            path="view-detail/*"
            element={
                <AcctModal
                onClose={() => navigate(".")}
                formmode={formMode ?? "edit"}
                from={"pending-entry"}
                />
            }
          />
          {/* <Route
          path="photo-signature/*"
          element={
              <PhotoSignatureCpyDialog
              open={true}
              onClose={() => {
                  navigate(".");
              }}
              viewMode={formMode ?? "edit"}
              />
          }
          /> */}
        </Routes>
      </Grid>
    )
}

export default PendingAcct;