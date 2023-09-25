import React, {Fragment, useCallback, useState, useContext, useEffect} from "react"
import GridWrapper, { GridMetaDataType } from "components/dataTableStatic";
import { useMutation, useQuery } from "react-query";
import { AuthContext } from "pages_audit/auth";
import * as API from "./api";
import { Dialog } from "@mui/material";
import { insurance_grid_meta_data } from "./metadata";
import { ActionTypes } from "components/dataTable";
import { useLocation } from "react-router-dom";

const InsuranceComp = ({open, onClose}) => {
    const { authState } = useContext(AuthContext);
    const { state: data }: any = useLocation();
    const [isCompOpen, setIsCompOpen] = useState(true);
    // console.log("{rowdataaa", data)
    const {data:insuranceData, isError: isInsuranceError, isFetching: isInsuranceFetching, isLoading: isInsuranceLoading, refetch: insuranceRefetch} = useQuery<any, any>(
        ["getInsuranceGridData", {data}],
        () => API.getInsuranceGridData({
            COMP_CD: authState?.companyID ?? "",
            CUSTOMER_ID: data?.[0]?.id ?? "",
        })
    )
    // useEffect(() => {
    //     insuranceRefetch()
    // }, [])
    // useEffect(() => {
    //     if(!isInsuranceLoading && insuranceData) {
    //       // console.log("DeactivateCustomer data", inactivateCustData)
    //       setIsCompOpen(true)
    //     }
    // }, [insuranceData, isInsuranceLoading])

    // useEffect(() => {
    //     return () => {
    //         console.log("insurance comp unmount")
    //     }
    // }, [])

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
                    maxWidth: "1100px",
                    height: "90%",
                }
            }}
        >
            {/* <p>asdasdasdasd</p> */}
            <GridWrapper
                key={`InsuranceGrid`}
                finalMetaData={insurance_grid_meta_data as GridMetaDataType}
                data={insuranceData ?? []}
                setData={() => null}          
                loading={isInsuranceLoading || isInsuranceFetching}
                actions={actions}
                setAction={setCurrentAction}
                refetchData={() => insuranceRefetch()}
                // ref={myGridRef}
            />
        </Dialog>)
    // <Fragment>
    // </Fragment>
}

export default InsuranceComp