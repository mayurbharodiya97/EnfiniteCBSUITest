import { usePopupContext } from "components/custom/popupContext";
import React, { useContext, useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { getLimitFDdetail } from "../api";
import { ActionTypes } from "components/dataTable";
import { GridWrapper } from "components/dataTableStatic/gridWrapper";
import { GridMetaDataType } from "components/dataTableStatic";
import { AppBar, Dialog, LinearProgress } from "@mui/material";
import { AuthContext } from "pages_audit/auth";
import { Alert } from "components/common/alert";
import { queryClient } from "cache";
import { fdDetailGridData } from "./fdDetailsGridMetaData";
import { useTranslation } from "react-i18next";

export const FdDetails = ({ navigate, myMasterRef }) => {
  const fdAction: ActionTypes[] = [
    {
      actionName: "close",
      actionLabel: "Close",
      multiple: false,
      rowDoubleClick: false,
      alwaysAvailable: true,
    },
  ];
  const { authState } = useContext(AuthContext);
  const { MessageBox } = usePopupContext();
  const [openDialog, setOpenDialg] = useState<boolean>(false);
  const { t } = useTranslation();

  const fdDetail: any = useMutation("getLimitFDdetail", getLimitFDdetail, {
    onSuccess: (data) => {
      if (data?.[0]?.MESSAGE) {
        navigate(".");
        MessageBox({
          messageTitle: "AccountDescription",
          message: data?.[0]?.MESSAGE,
        });
      } else {
        setOpenDialg(true);
      }
    },
  });

  useEffect(() => {
    async function apiCall() {
      let buttonName = await MessageBox({
        messageTitle: "confirmation",
        message: `
                Press 'Yes' then - to view Lien FD(s) against this A/c.                               ,                             
                Press 'No' then to view all the FD(s) of
                this Customer.
            `,
        buttonNames: ["Yes", "No"],
      });
      if (buttonName) {
        myMasterRef?.current?.getFieldData().then((res) => {
          if (res?.ACCT_CD && res?.ACCT_TYPE && res?.BRANCH_CD) {
            fdDetail.mutate({
              COMP_CD: authState?.companyID,
              ACCT_CD: res?.ACCT_CD,
              ACCT_TYPE: res?.ACCT_TYPE,
              BRANCH_CD: res?.BRANCH_CD,
              LOGIN_COMP_CD: authState?.companyID,
              FLAG: buttonName === "Yes" ? "L" : "C",
            });
          }
        });
      }
    }
    apiCall();
  }, []);

  useEffect(() => {
    return () => {
      queryClient.removeQueries(["getLimitFDdetail"]);
    };
  }, []);
  return (
    <>
      {fdDetail.isError && (
        <AppBar position="relative" color="primary">
          <Alert
            severity="error"
            errorMsg={fdDetail?.error?.error_msg ?? "Unknow Error"}
            errorDetail={fdDetail?.error?.error_detail ?? ""}
            color="error"
          />
        </AppBar>
      )}
      <Dialog
        open={openDialog}
        fullWidth={true}
        PaperProps={{
          style: {
            maxWidth: "1095px",
            padding: "5px",
          },
        }}
      >
        <>
          <GridWrapper
            key={`fd-Detail-GridData`}
            finalMetaData={fdDetailGridData as GridMetaDataType}
            data={fdDetail.data ?? []}
            setData={() => {}}
            loading={fdDetail.isLoading}
            actions={fdAction}
            setAction={() => {
              navigate(".");
            }}
          />
        </>
      </Dialog>
    </>
  );
};