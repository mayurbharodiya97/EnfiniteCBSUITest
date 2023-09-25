import React, {Fragment, useCallback, useState, useContext} from "react"
import GridWrapper, { GridMetaDataType } from "components/dataTableStatic";
import { useMutation, useQuery } from "react-query";
import { AuthContext } from "pages_audit/auth";
import * as API from "./api";
import { ActionTypes } from "components/dataTable";
import { bank_dtl_grid_meta_data, financial_dtl_grid_meta_data } from "./metadata";
import { Dialog } from "@mui/material";
import { useLocation } from "react-router-dom";

const FinancialDTLComp = ({open, onClose}) => {
    const { authState } = useContext(AuthContext);
    const { state: data }: any = useLocation();
    // console.log("{rowdataaa", data)
    const {data:financialdtlData, isError: isFinancialDTLError, isFetching: isFinancialDTLFetching, isLoading: isFinancialDTLLoading, refetch: financialDTLRefetch} = useQuery<any, any>(
        ["getFinancialDTLGridData", {data}],
        () => API.getFinancialDTLGridData({
            COMP_CD: authState?.companyID ?? "",
            CUSTOMER_ID: data?.[0]?.id ?? "",
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
                key={`FinancialDetailsGrid`}
                finalMetaData={financial_dtl_grid_meta_data as GridMetaDataType}
                data={financialdtlData ?? []}
                setData={() => null}          
                loading={isFinancialDTLLoading || isFinancialDTLFetching}
                actions={actions}
                setAction={setCurrentAction}
                refetchData={() => financialDTLRefetch()}
                // ref={myGridRef}
            />
        </Dialog>
    )
}

export default FinancialDTLComp