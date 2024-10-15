import LimitEntry from "pages_audit/pages/operations/limit-entry";
export const Limit = ({ reqData }) => {
  return (
    <>
      <LimitEntry screenFlag="limitForTrn" reqData={reqData} />
    </>
  );
};
