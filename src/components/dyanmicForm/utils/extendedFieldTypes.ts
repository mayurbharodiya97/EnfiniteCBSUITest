import {
  MetaDataType,
  ExtendedFieldMetaDataTypeOptional,
  FieldMetaDataType,
} from "../types";
export const extendFieldTypes = (
  metaData: MetaDataType,
  extendedTypes: ExtendedFieldMetaDataTypeOptional,
  lanTranslate: any = (edata) => edata,
  authState: any = {},
  customParameters: any = {}
) => {
  // console.log(customParameters, "PARAMETER S");

  const {
    dynamicAccountNumberField,
    dynamicAmountSymbol,
    dynamicAmountGroup,
    dynamicDecimalScale,
  } = customParameters;

  const newMetaDataFields = metaData.fields.map((one) => {
    const extendedType = extendedTypes[one.render.componentType];

    if (one["options"] && Array.isArray(one["options"])) {
      one["options"] = one["options"].map((_item) => {
        if (_item?.label) {
          return { ..._item, label: lanTranslate(_item?.label) };
        }
        return _item;
      });
    }
    //exclude the following types from extending
    if (typeof extendedType === "object") {
      // const {
      //   defaultValue,
      //   render,
      //   validate,
      //   shouldExclude,
      //   isReadOnly,
      //   name,
      //   validationRun,
      //   dependentFields,
      //   postValidationSetCrossFieldValues,
      //   runPostValidationHookAlways,
      //   ...others
      // } = extendedType;
      const { render, FormatProps, ...others } = extendedType;
      console.log("FormatProps", FormatProps);
      //const result = Object.assign({}, one, others) as FieldMetaDataType;
      const result = Object.assign({}, others, one) as FieldMetaDataType;

      // const prefixAvail = Object.keys(FormatProps).includes("prefix");

      // console.log(prefixAvail, "prefixAvail");
      console.log(dynamicAmountSymbol, "dynamicAmountSymbol");
      if (FormatProps) {
        const prefixAvail = Object.keys(FormatProps)?.includes("prefix");
        if (prefixAvail) {
          FormatProps["prefix"] = dynamicAmountSymbol ?? FormatProps?.prefix;
        }
        const thousandsGroupStyleAvail = Object.keys(FormatProps)?.includes(
          "thousandsGroupStyle"
        );
        if (thousandsGroupStyleAvail) {
          FormatProps["thousandsGroupStyle"] =
            dynamicAmountGroup ?? FormatProps?.thousandsGroupStyle;
        }
        const decimalScaleAvail =
          Object.keys(FormatProps)?.includes("decimalScale");
        if (decimalScaleAvail) {
          FormatProps["decimalScale"] =
            dynamicDecimalScale ?? FormatProps?.decimalScale;
        }
      }
      if (FormatProps) {
      }
      // if (FormatProps) {
      //
      // }
      result["FormatProps"] = { ...FormatProps, ...(one?.FormatProps ?? {}) };
      result["label"] = lanTranslate(result["label"]);
      result["placeholder"] = lanTranslate(result["placeholder"]);
      if (result && result.render && result.render.componentType) {
        //@ts-ignore
        result.render.componentType = extendedType.render?.componentType;
      }
      return result;
    }
    one["label"] = lanTranslate(one["label"]);
    one["placeholder"] = lanTranslate(one["placeholder"]);
    return one;
  });

  let newMetaDataFieldsCustom: any = [];
  const paravalue: string = dynamicAccountNumberField;

  const processExtendedType = (key: string) => {
    const field = extendedTypes[key];
    // console.log(extendedTypes["currency"], "field");
    console.log(extendedTypes["currency"], "field");

    // if (currencyField) {
    //   currencyField.FormatProps = {
    //     ...currencyField.FormatProps,
    //     prefix: dynamicAmountSymbol,
    //     thousandsGroupStyle: dynamicAmmountGroupStyle,
    //   };
    // }

    if (typeof field === "object") {
      field["label"] = lanTranslate(field["label"]);
      field["placeholder"] = lanTranslate(field["placeholder"]);
      if (key === "branchCode") {
        // Set the default value for branchCode
        field["defaultValue"] = authState?.user?.branchCode; // Use the branchCodeValue parameter
      } else if (key === "accountType") {
        // Set autofocus on the accountType field
        // console.log("acctTYPE");
        field["autoFocus"] = true;
      }
      newMetaDataFieldsCustom.push(field);
    }
  };

  newMetaDataFields?.forEach((item) => {
    if (item.render.componentType === "_accountNumber") {
      if (item?.para === "1") {
        const fullAccountNumber = extendedTypes["fullAccountNumber"];
        if (typeof fullAccountNumber === "object") {
          newMetaDataFieldsCustom.push(fullAccountNumber);
        }
      } else if (item?.para === "2") {
        ["branchCode", "accountType", "accountCode"].forEach(
          processExtendedType
        );
      } else if (paravalue === "1") {
        const fullAccountNumber = extendedTypes["fullAccountNumber"];
        if (typeof fullAccountNumber === "object") {
          newMetaDataFieldsCustom.push(fullAccountNumber);
        }
      } else if (paravalue === "2") {
        ["branchCode", "accountType", "accountCode"].forEach(
          processExtendedType
        );
      } else {
        ["branchCode", "accountType", "accountCode"].forEach(
          processExtendedType
        );
      }
      // } else if (item.render.componentType === "currency") {
      //   const currency: any = extendedTypes["currency"];
      //   if (typeof currency === "object") {
      //     newMetaDataFieldsCustom.push(currency);
      //   }
      //   if (currency?.FormatProps) {
      //     currency.FormatProps = {
      //       ...currency?.FormatProps,
      //       prefix: item?.customPrefix ? item?.customPrefix : dynamicAmountSymbol,
      //     };
      // }
    } else {
      newMetaDataFieldsCustom = [...newMetaDataFieldsCustom, item];
    }
  });
  // console.log("newMetaDataFields", newMetaDataFields, newMetaDataFieldsCustom);
  return {
    form: metaData.form,
    fields: [...newMetaDataFieldsCustom],
  } as MetaDataType;
};
