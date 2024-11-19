import StockEntry from "pages_audit/pages/operations/stockEntry";
export const Stock = ({ reqData }) => {
  return (
    <>
      <StockEntry screenFlag="stockForTrn" reqData={reqData} />
    </>
  );
};
