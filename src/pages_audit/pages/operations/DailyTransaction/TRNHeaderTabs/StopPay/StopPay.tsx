import StopPaymentEntry from "pages_audit/pages/operations/stopPaymentEntry";
export const StopPay = ({ reqData }) => {
  return (
    <>
      <StopPaymentEntry screenFlag="stopPaymentForTrn" reqData={reqData} />
    </>
  );
};
