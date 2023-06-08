import { Dialog } from "@mui/material";
import { scrollMetaData } from "./metaData";
import Report from "components/report";
import * as API from "./api";
import { useQuery } from "react-query";
import { format } from "date-fns";

const Scroll = ({ open, handleCloseDialog, data }) => {
  const tranDate = format(
    new Date(data?.[0]?.data?.TRAN_DT),
    "dd/MMM/yyyy EEEE"
  );

  const updatedMetaData = {
    ...scrollMetaData,
    title: `Transaction Detail of Scroll : 1925 - Date : ${tranDate}`,
  };

  return (
    <Dialog open={open} maxWidth={"xl"}>
      <Report
        reportID={"scrollDetail"}
        reportName={"scrollDetail"}
        dataFetcher={API.ScrollDetailData}
        metaData={updatedMetaData}
        disableFilters
        maxHeight={window.innerHeight - 250}
        title={updatedMetaData?.title}
        options={{
          disableGroupBy: updatedMetaData?.disableGroupBy,
        }}
        hideFooter={updatedMetaData?.hideFooter}
        hideAmountIn={updatedMetaData?.hideAmountIn}
        retrievalType={updatedMetaData?.retrievalType}
        initialState={{
          groupBy: updatedMetaData?.groupBy ?? [],
        }}
        onClose={handleCloseDialog}
        otherAPIRequestPara={{
          COMP_CD: data?.[0]?.data?.COMP_CD,
          BRANCH_CD: data?.[0]?.data?.BRANCH_CD,
          TRAN_DATE: "08/Feb/2021",
          AS_FLAG: Number(data?.[0]?.data?.TYPE_CD),
        }}
      />
    </Dialog>
  );
};

export default Scroll;
