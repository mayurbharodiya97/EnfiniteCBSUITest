import React, { useContext } from "react";
import { Dialog } from "@mui/material";
import * as API from "./api";
import { DependenciesData } from "./metaData";
import { AuthContext } from "pages_audit/auth";
import Report from "components/report";
const Dependencies = ({ open, onClose, rowsData }) => {
  const { authState } = useContext(AuthContext);
  console.log("<<<API.getDependenciesData", API.getDependenciesData);
  return (
    <Dialog
      open={open}
      // onClose={onClose}
      fullWidth={true}
      PaperProps={{
        style: {
          maxWidth: "1150px",
          height: "90%",
        },
      }}
    >
      <Report
        reportID={"CUSTOMERDEPENDENCYDTL"}
        reportName={"reportID-" + "getDependenciesData"}
        dataFetcher={API.getDependenciesData}
        metaData={DependenciesData}
        disableFilters
        maxHeight={window.innerHeight - 151}
        title={`Dependencies of Customer-id = ${rowsData?.[0]?.data?.CUSTOMER_ID}`}
        onClose={onClose}
        hideFooter={DependenciesData.hideFooter}
        hideAmountIn={DependenciesData.hideAmountIn}
        // retrievalType={data.retrievalType}
        // autoFetch={data?.filters?.fields?.length > 0 ? false : true}
        otherAPIRequestPara={{
          CUSTOMER_ID: rowsData?.[0]?.data?.CUSTOMER_ID,
          COMP_CD: authState.companyID,
        }}
      />
    </Dialog>
  );
};
export default Dependencies;
