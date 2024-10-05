import React, { useEffect } from "react";
import CommonForm from "../commonForm/commonForm";
import { ClearCacheProvider } from "@acuteinfo/common-base";
import { useNavigate } from "react-router-dom";

const Confirmation = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("retrieve-cfm-form");
  }, []);
  return (
    <ClearCacheProvider>
      <CommonForm FLAG="C" />
    </ClearCacheProvider>
  );
};
export default Confirmation;
