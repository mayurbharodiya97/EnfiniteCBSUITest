import { createContext, useState, useContext } from "react";
import { SelectRenderOnly as Select } from "components/common/select";

const AmountContext = createContext<any>(null);

export const AmountProvider = ({ children }) => {
  const [divider, setDivider] = useState(1);

  return (
    <AmountContext.Provider value={{ divider, setDivider }}>
      {children}
    </AmountContext.Provider>
  );
};

export const useAmountDivider = () => {
  const { divider } = useContext(AmountContext);
  return divider;
};

const options = [
  { label: "Default", value: 1 },
  { label: "Lakhs", value: 100000 },
  { label: "Crore", value: 10000000 },
];

export const AmountSelect = () => {
  const { setDivider, divider } = useContext(AmountContext);
  return (
    <Select
      label="Amount In"
      size="small"
      touched={true}
      error={""}
      value={divider}
      handleChange={(e) => setDivider(e.target.value)}
      handleBlur={() => true}
      options={options}
      _optionsKey={"amountIn"}
      selectVariant="default"
      style={{ width: "120px", margin: "0px 16px", color: "white" }}
      InputLabelProps={{ style: { color: "white" } }}
    />
  );
};
