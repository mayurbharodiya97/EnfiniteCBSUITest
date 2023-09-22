import React, {Fragment, useCallback, useState, useContext} from "react"
import GridWrapper, { GridMetaDataType } from "components/dataTableStatic";
import { useMutation, useQuery } from "react-query";
import { AuthContext } from "pages_audit/auth";
import * as API from "./api";
import { offences_dtl_grid_meta_data } from "./metadata";
import { Dialog } from "@mui/material";
import { ActionTypes } from "components/dataTable";

const OffencesDTLComp = ({rowsData, open, onClose}) => {
    const { authState } = useContext(AuthContext);
    console.log("{rowdataaa", rowsData)
    const {data:offencesGridData, isError: isOffencesGridError, isFetching: isOffencesGridFetching, isLoading: isOffencesGridLoading, refetch: offencesGridRefetch} = useQuery<any, any>(
        ["getOffencesDTLGridData", {rowsData}],
        () => API.getOffencesDTLGridData({
            COMP_CD: authState?.companyID ?? "",
            CUSTOMER_ID: rowsData?.[0]?.id ?? "",
        })
    )

    const actions: ActionTypes[] = [
        {
          actionName: "view-detail",
          actionLabel: "View Detail",
          multiple: false,
          rowDoubleClick: true,
        },
    ];

    const setCurrentAction = useCallback((data) => {

    }, [])

    return (
        <Dialog open={open} onClose={onClose} 
            PaperProps={{
                style: {
                    minWidth: "500px",
                    width: "auto",
                    // maxWidth: "700px",
                    height: "90%",
                }
            }}
        >
            {/* <p>asdasdasdasd</p> */}
            <GridWrapper
                key={`OffencesDetailsGrid`}
                finalMetaData={offences_dtl_grid_meta_data as GridMetaDataType}
                data={offencesGridData ?? []}
                setData={() => null}          
                loading={isOffencesGridLoading || isOffencesGridFetching}
                actions={actions}
                setAction={setCurrentAction}
                refetchData={() => offencesGridRefetch()}
                // ref={myGridRef}
            />
        </Dialog>
    )
}

export default OffencesDTLComp