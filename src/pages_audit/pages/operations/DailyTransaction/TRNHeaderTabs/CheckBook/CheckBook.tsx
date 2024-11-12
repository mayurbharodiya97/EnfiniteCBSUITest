import ChequebookTab from "pages_audit/pages/operations/chequeBookTab";
export const CheckBook = ({ reqData }) => {
  return (
    <>
      <ChequebookTab screenFlag="chequesDtlForTrn" reqData={reqData} />
    </>
  );
};
