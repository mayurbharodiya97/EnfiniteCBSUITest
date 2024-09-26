import { ClearCacheProvider } from "cache";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CommonForm from "../commonForm/commonForm";

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
