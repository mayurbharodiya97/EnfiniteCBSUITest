import Typograhpy from "components/common/typograhpy";
import { useState } from "react";

const AcctMST = () => {
  const [open, setOpen] = useState(true);
  const onClose = () => {
    setOpen(false);
  };
  return (
    <>
      <h3>Account Opening</h3>
      {/* <AccountinquiryCommonComp /> */}
    </>
  );
};

export default AcctMST;
