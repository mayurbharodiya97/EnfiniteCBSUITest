import {
  ClearCacheProvider,
  extractGridMetaData,
  extractMetaData,
  FormWrapper,
  GradientButton,
  LoadingTextAnimation,
  MetaDataType,
} from "@acuteinfo/common-base";
import { Dialog, Paper } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { ddTransactionFormMetaData } from "./metaData";
import { useLocation } from "react-router-dom";
import { commonDataRetrive, headerDataRetrive } from "../api";
import { useQuery } from "react-query";
import { AuthContext } from "pages_audit/auth";
import * as API from "./api";

const EntryFormView = ({ onClose, gridData }) => {
  const [combinedData, setCombinedData] = useState<any>([]);
  const { state: rows } = useLocation();
  const [formMode, setFormMode] = useState("edit");
  const { authState } = useContext(AuthContext);
  const requestData = {
    COMP_CD: authState?.companyID,
    BRANCH_CD: authState.user.branchCode,
    TRAN_CD: rows?.gridData.TRAN_CD,
    SR_CD: rows?.gridData.SR_CD,
  };
  const { data: acctDtlData, isLoading: isAcctDtlLoading } = useQuery(
    ["headerData", requestData],
    () => headerDataRetrive(requestData),
    {
      enabled: formMode !== "add",
    }
  );
  const { data: draftDtlData, isLoading: isdraftDtlLoading } = useQuery(
    ["draftdata", requestData],
    () => API.getRealizedHeaderData(requestData),
    {
      enabled: formMode !== "add",
    }
  );
  useEffect(() => {
    if (!isAcctDtlLoading && !isdraftDtlLoading) {
      const combined: any = [];

      // Combine acctDtlData
      for (const acctItem of acctDtlData) {
        combined.push({ ...acctItem });
      }

      // Combine draftDtlData
      for (const draftItem of draftDtlData) {
        combined.push({ ...draftItem });
      }

      setCombinedData(combined);
    }
  }, [acctDtlData, draftDtlData]);
  console.log(combinedData);

  return (
    <>
      <Dialog
        open={true}
        PaperProps={{
          style: {
            overflow: "hidden",
            height: "auto",
            width: "100%",
          },
        }}
        maxWidth="xl"
      >
        {!isAcctDtlLoading && !isdraftDtlLoading ? (
          <>
            <FormWrapper
              key={"modeMasterForm" + formMode}
              metaData={
                extractMetaData(
                  ddTransactionFormMetaData,
                  formMode
                ) as MetaDataType
              }
              displayMode={formMode}
              onSubmitHandler={() => {}}
              initialValues={{
                CCTFLAG: draftDtlData && draftDtlData[0]?.C_C_T,
                REALIZE_AMT: draftDtlData && draftDtlData[0]?.AMOUNT,
                ...(acctDtlData && acctDtlData.length > 0
                  ? acctDtlData[0]
                  : {}),
                ...(draftDtlData && draftDtlData.length > 0
                  ? draftDtlData[0]
                  : {}),
              }}
              formStyle={{
                background: "white",
              }}
            >
              {({ isSubmitting, handleSubmit }) => (
                <>
                  <GradientButton onClick={() => onClose()} color={"primary"}>
                    Close
                  </GradientButton>
                </>
              )}
            </FormWrapper>
          </>
        ) : (
          <Paper sx={{ display: "flex", justifyContent: "center" }}>
            <LoadingTextAnimation />
          </Paper>
        )}
      </Dialog>
    </>
  );
};

export const EntryForm = ({ onClose, gridData }) => {
  return (
    <>
      <ClearCacheProvider>
        <EntryFormView onClose={onClose} gridData={gridData} />
      </ClearCacheProvider>
    </>
  );
};
