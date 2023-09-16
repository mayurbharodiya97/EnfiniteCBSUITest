import React, { useState, useEffect, useCallback, useContext } from "react";
import { Dialog } from "@mui/material";
import * as API from "./api";
import { AuthContext } from "pages_audit/auth";
import { useMutation, useQuery } from "react-query";

export const DeactivateCustomer = ({rowdata}) => {
    // console.log("DeactivateCustomer", rowdata, rowdata?.[0]?.data?.CUSTOMER_ID)
    const { authState } = useContext(AuthContext);
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const {data:inactivateCustData, isError: isinactivateCustError, isLoading: isinactivateCustLoading, refetch: inactivateCustRefetch} = useQuery<any, any>(
      ["DeactivateCustomer", {rowdata }],
      () => API.DeactivateCustomer({
        COMP_CD: authState?.companyID ?? "",
        CUSTOMER_ID: rowdata?.[0]?.data?.CUSTOMER_ID ?? "", // mutation?.data?.[0]?.CUSTOMER_ID ?? 
        // ACCT_TYPE: "143 ",
        // ACCT_CD: "000039",
        // AS_FROM: "C"  
      })
    )

    useEffect(() => {
      if(!isinactivateCustLoading && inactivateCustData) {
        // console.log("DeactivateCustomer data", inactivateCustData)
        setIsDialogOpen(true)
      }
    }, [inactivateCustData, isinactivateCustLoading])


  return (
    <Dialog fullScreen={true} open={isDialogOpen} onClose={() => setIsDialogOpen(false)}
      // sx={{width:"100px", height: "100px"}}
    >
      {/* {inactivateCustData && <p>asdasd</p>} */}
      <p>Deactivate Customer ID</p>
    </Dialog>
  );
};