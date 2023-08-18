import React, { useContext } from "react";
import { Dialog } from "@mui/material";
import * as API from "./api";
import { DependenciesData } from "./metaData";
import { AuthContext } from "pages_audit/auth";
import Report from "components/report";
const Dependencies = ({ open, onClose, rowsData }) => {
  const { authState } = useContext(AuthContext);

  return (
    <Dialog
      open={open}
      onClose={onClose}
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
        reportName={"reportID-" + "any"}
        dataFetcher={API.getDependenciesData}
        metaData={DependenciesData}
        disableFilters
        maxHeight={window.innerHeight - 146}
        title={DependenciesData.title}
        // options={{
        //   disableGroupBy: data.disableGroupBy,
        // }}
        // hideFooter={data.hideFooter}
        // hideAmountIn={data.hideAmountIn}
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
