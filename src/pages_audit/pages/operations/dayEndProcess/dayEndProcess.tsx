import { AppBar, Toolbar, Typography } from "@mui/material";
import { ClearCacheProvider, queryClient } from "cache";
import { Theme } from '@mui/system';
import { makeStyles } from "@mui/styles";
import { GradientButton } from "components/styledComponent/button";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "pages_audit/auth";
import * as API from './api';
import { useQuery } from "react-query";
import GridWrapper, { GridMetaDataType } from "components/dataTableStatic";
import { pendingAcctMetadata } from "../acct-mst/metadata/pendingAcctMetadata";
import { PendinGTrns } from "./pendingTransactions";
import { usePopupContext } from "components/custom/popupContext";


const useTypeStyles: any = makeStyles((theme: Theme) => ({
    root: {
      paddingLeft: theme.spacing(1.5),
      paddingRight: theme.spacing(1.5),
      background: "var(--theme-color5)",
    },
    title: {
      flex: "1 1 100%",
      color: "var(--white)",
      letterSpacing: "1px",
      fontSize: "1.5rem",
    },
  }));

const DayEndProcess = ()=>{
    const headerClasses = useTypeStyles();
    const { authState } = useContext(AuthContext);
    const [openPendingTrns,setOpenPendingTrns]=useState(false);
  const { MessageBox, CloseMessageBox } = usePopupContext();

    const [openDayendProcess,setOpenDayendProcess]=useState(false);
    const [openVerifyChecksums,setOpenVerifyChecksums]=useState(false);


    const { data, isLoading, isFetching, isError, error, refetch: slipdataRefetch } = useQuery<any, any>(
        ["getDayendprocessFlag"],
        () =>
          API.getDayendprocessFlag({
            ENT_COMP_CD: authState?.companyID,
            ENT_BRANCH_CD: authState?.user?.branchCode,
            BASE_COMP_CD: authState?.baseCompanyID,
            BASE_BRANCH_CD: authState?.user?.baseBranchCode,
            GD_DATE: authState?.workingDate
          })
      );

      useEffect(() => {
        return () => {
          queryClient.removeQueries(["getDayendprocessFlag"]);
        };
      }, []);
    



    return(
        <>
          <AppBar position="relative" color="secondary">
          <Toolbar className={headerClasses.root} variant="dense">
            <Typography className={headerClasses.title} color="inherit" variant="h6" component="div">
              {"Day End Process (TRN/399)"}
            </Typography>
            <GradientButton
                onClick={async(event) => {
                    const btnName = await MessageBox({
                        message: "DeleteData",
                        messageTitle: "Do you want to proceed pending transactions?",
                        buttonNames: ["Yes", "No"],
                      });
                      if (btnName === "Yes") {
                       setOpenPendingTrns(true);
                      }
                }}
                color={"primary"}
              >
                Pending Transactions
              </GradientButton>
              <GradientButton
                onClick={(event) => {
                 setOpenVerifyChecksums(true);
                }}
                color={"primary"}
              >
               Day End Process
               {
                data[0]?.Flag==="D"?"Day End Process":"Day Hand Over"
               }
              </GradientButton>
              <GradientButton
                onClick={(event) => {
                 
                }}
                color={"primary"}
              >
               Verify DayEnd Checksums
              </GradientButton>
          </Toolbar>
        </AppBar>
        {
            openPendingTrns? 
            <PendinGTrns
             open={openPendingTrns}
             close={()=>setOpenPendingTrns(false)}
            />
            :""
        }
          
         
        </>
    )
}
export const DayEndProcessMain = () => {
    return (
      <ClearCacheProvider>
         <DayEndProcess/>
      </ClearCacheProvider>
    );
  };