import React, {Fragment, useCallback, useState, useContext} from "react"
import GridWrapper, { GridMetaDataType } from "components/dataTableStatic";
import { useMutation, useQuery } from "react-query";
import { AuthContext } from "pages_audit/auth";
import * as API from "./api";
import { ActionTypes } from "components/dataTable";
import { bank_dtl_grid_meta_data } from "./metadata";
import { Dialog } from "@mui/material";

const BankDTLComp = ({rowsData, open, onClose}) => {
    const { authState } = useContext(AuthContext);
    console.log("{rowdataaa", rowsData)
    const {data:bankdtlData, isError: isBankDTLError, isFetching: isBankDTLFetching, isLoading: isBankDTLLoading, refetch: bankDTLRefetch} = useQuery<any, any>(
        ["getBankDTLGridData", {rowsData}],
        () => API.getBankDTLGridData({
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
                key={`BankDetailsGrid`}
                finalMetaData={bank_dtl_grid_meta_data as GridMetaDataType}
                data={bankdtlData ?? []}
                setData={() => null}          
                loading={isBankDTLLoading || isBankDTLFetching}
                actions={actions}
                setAction={setCurrentAction}
                refetchData={() => bankDTLRefetch()}
                // ref={myGridRef}
            />
        </Dialog>
    )
}

export default BankDTLComp