import React, {Fragment, useCallback, useState, useContext} from "react"
import GridWrapper, { GridMetaDataType } from "components/dataTableStatic";
import { useMutation, useQuery } from "react-query";
import { AuthContext } from "pages_audit/auth";
import * as API from "./api";
import { Dialog } from "@mui/material";
import { ActionTypes } from "components/dataTable";
import { controlling_person_dtl_grid_meta_data } from "./metadata";

const ControllingPersonComp = ({rowsData, open, onClose}) => {
    const { authState } = useContext(AuthContext);
    console.log("{rowdataaa", {rowsData})
    const {data: contrPersonData, isError: isContrPersonDataError, isFetching: isContrPersonDataFetching, isLoading: isContrPersonDataLoading, refetch: contrPersonDataRefetch} = useQuery<any, any>(
        ["getControllingPersonDTLGridData", {rowsData}],
        () => API.getControllingPersonDTLGridData({
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
                    minWidth: "1000px",
                    maxWidth: "1100px",
                    height: "90%",
                }
            }}
        >
            <GridWrapper
                key={`ControllingPersonGrid`}
                finalMetaData={controlling_person_dtl_grid_meta_data as GridMetaDataType}
                data={contrPersonData ?? []}
                setData={() => null}          
                loading={isContrPersonDataLoading || isContrPersonDataFetching}
                actions={actions}
                setAction={setCurrentAction}
                refetchData={() => contrPersonDataRefetch()}
                // ref={myGridRef}
            />
        </Dialog>
    )
}

export default ControllingPersonComp