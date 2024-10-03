import InsuranceEntryForm from "pages_audit/pages/operations/insuranceEntry";
export const Insurance = ({ reqData }) => {
  return (
    <>
      <InsuranceEntryForm screenFlag="insuranceForTrn" reqData={reqData} />
    </>
  );
};
