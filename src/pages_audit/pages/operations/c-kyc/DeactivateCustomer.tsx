import React, { useState, useEffect, useCallback, useContext } from "react";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import * as API from "./api";
import { AuthContext } from "pages_audit/auth";
import { useMutation, useQuery } from "react-query";
import { GradientButton } from "components/styledComponent/button";
import { useLocation, useNavigate } from "react-router-dom";
import Dependencies from "pages_audit/acct_Inquiry/dependencies";

export const DeactivateCustomer = ({rowdata, onClose}) => {
    const { authState } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isDialogOpen, setIsDialogOpen] = useState(true)
    const [dependecyDialogOpen, setDependecyDialogOpen] = useState(false)
    const {state:data} = useLocation();
    // console.log("::stateeee", data)
    const {data:inactivateCustData, isError: isinactivateCustError, isLoading: isinactivateCustLoading, refetch: inactivateCustRefetch} = useQuery<any, any>(
      ["DeactivateCustomer", {data }],
      () => API.DeactivateCustomer({
        COMP_CD: authState?.companyID ?? "",
        CUSTOMER_ID: data?.[0]?.data?.CUSTOMER_ID ?? "", // mutation?.data?.[0]?.CUSTOMER_ID ?? 
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
    <React.Fragment>
      {
      dependecyDialogOpen &&
      <Dependencies 
        rowsData={data}
        open={dependecyDialogOpen}
        onClose={() => {
          setDependecyDialogOpen(false)
          onClose()
        }} 
      />
      }
      <Dialog open={true} onClose={() => setIsDialogOpen(false)}
        // PaperProps={{
        //   style: {
        //       minWidth: "1000px",
        //       width: "auto",
        //       maxWidth: "1100px",
        //       height: "90%",
        //   }
        // }}
        // sx={{width:"100px", height: "100px"}}
      >
        {/* {inactivateCustData && <p>asdasd</p>} */}
        <DialogTitle
          sx={{
            background: "var(--theme-color3)",
            color: "var(--theme-color2)",
            letterSpacing: "1.3px",
            margin: "10px",
            boxShadow:
              "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;",
            fontWeight: 500,
            borderRadius: "inherit",
            minWidth: "450px",
            py: 1,
          }}
          id="responsive-dialog-title"
        >
          {`Deactivate Customer ID ${data?.[0]?.data?.CUSTOMER_ID ? `: ${data?.[0]?.data?.CUSTOMER_ID}` : null}`}
          {/* rowdata?.[0]?.data?.CUSTOMER_ID */}
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            sx={{ fontSize: "19px", display: "flex" }}
          >
            {inactivateCustData && <p>Customer mapped with accounts: {inactivateCustData?.[0]?.TOTAL_ACCT}</p>}
            {/* Are you sure want to logout...{" "} */}
            {/* <HelpIcon color="secondary" fontSize="large" /> */}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {/* <GradientButton
            // sx={{
            //   color: "var(--theme-color2)",
            // }}
            autoFocus
            // onClick={() => setLogoutOpen(false)}
          >
            No
          </GradientButton> */}
          <GradientButton
            // sx={{
            //   color: "var(--theme-color2)",
            // }}
            // onClick={() => authController?.logout()}
            onClick={() => {
              // if(inactivateCustData?.[0]?.TOTAL_ACCT && inactivateCustData?.[0]?.TOTAL_ACCT !== 0) {
              //   navigate("dependencies")
              //   // <Dependencies 
              //   //   rowsData={rowdata}
              //   //   open={isDialogOpen}
              //   //   onClose={() => setIsDialogOpen(false)} 
              //   // />
              // } else {
                if(Number(inactivateCustData?.[0]?.TOTAL_ACCT) !== 0) {
                  setDependecyDialogOpen(true)
                }
                // onClose(inactivateCustData?.[0]?.TOTAL_ACCT)
              // }
            }}
            autoFocus
          >
            OK
          </GradientButton>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};