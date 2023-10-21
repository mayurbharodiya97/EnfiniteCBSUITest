import React, {Fragment, useCallback, useState, useContext} from "react"
import GridWrapper, { GridMetaDataType } from "components/dataTableStatic";
import { useMutation, useQuery } from "react-query";
import { AuthContext } from "pages_audit/auth";
import * as API from "./api";
import { ActionTypes } from "components/dataTable";
import { Dialog } from "@mui/material";
import { credit_card_dtl_grid_meta_data } from "./metadata";
import { useLocation } from "react-router-dom";

const CreditCardDTLComp = ({open, onClose}) => {
    const { authState } = useContext(AuthContext);
    const {state: data} = useLocation();
    // console.log("{rowdataaa", data)
    const {data:creditCardData, isError: isCreditCardDataError, isFetching: isCreditCardDataFetching, isLoading: isCreditCardDataLoading, refetch: reditCardDataRefetch} = useQuery<any, any>(
        ["getCreditCardDTLGridData", {data}],
        () => API.getCreditCardDTLGridData({
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
                    width: "auto",
                    // maxWidth: "1100px",
                    height: "90%",
                }
            }}
        >
            <GridWrapper
                key={`CreditCardGrid`}
                finalMetaData={credit_card_dtl_grid_meta_data as GridMetaDataType}
                data={creditCardData ?? []}
                setData={() => null}          
                loading={isCreditCardDataLoading || isCreditCardDataFetching}
                actions={actions}
                setAction={setCurrentAction}
                refetchData={() => reditCardDataRefetch()}
                // ref={myGridRef}
            />
        </Dialog>
    )
}

export default CreditCardDTLComp