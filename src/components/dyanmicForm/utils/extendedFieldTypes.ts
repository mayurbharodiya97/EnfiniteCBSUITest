import getCurrencySymbol from "components/custom/getCurrencySymbol";
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
  const {
    dynamicAccountNumberField,
    dynamicAmountSymbol,
    dynamicAmountGroupStyle,
    decimalCount,
    commonDateFormat,
    commonDateTimeFormat,
  } = customParameters;

  const newMetaDataFields = metaData?.fields?.map((one) => {
    const extendedType = extendedTypes[one.render.componentType];
    if (
      one?.render?.componentType === "datePicker" ||
      one?.render?.componentType === "datetimePicker"
    ) {
      if (!one?.format) {
        const format =
          one.render.componentType === "datePicker"
            ? commonDateFormat
            : commonDateTimeFormat;
        one = { ...one, format };
      }
    }

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
      const {
        render,
        FormatProps,
        StartAdornment,
        isCurrencyField,
        ...others
      } = extendedType;
      //const result = Object.assign({}, one, others) as FieldMetaDataType;
      const result = Object.assign({}, others, one) as FieldMetaDataType;

      result["FormatProps"] = {
        ...FormatProps,
        ...(one?.FormatProps ?? {}),
      };

      if (Boolean(isCurrencyField) || Boolean(one?.isCurrencyField)) {
        let currencySymbol;
        let isCurrencyCode = one?.isCurrencyCode;
        if (Boolean(StartAdornment)) {
          currencySymbol = StartAdornment;
        }
        if (Boolean(dynamicAmountSymbol)) {
          currencySymbol = dynamicAmountSymbol;
        }
        if (Boolean(one?.StartAdornment)) {
          currencySymbol = one?.StartAdornment;
        }
        result["StartAdornment"] = isCurrencyCode
          ? currencySymbol
          : getCurrencySymbol(currencySymbol);

        let groupStyle;
        if (Boolean(FormatProps?.thousandsGroupStyle)) {
          groupStyle = FormatProps?.thousandsGroupStyle;
        }
        if (Boolean(dynamicAmountGroupStyle)) {
          groupStyle = dynamicAmountGroupStyle;
        }
        if (Boolean(one?.FormatProps?.thousandsGroupStyle)) {
          groupStyle = one?.FormatProps?.thousandsGroupStyle;
        }

        if (result["FormatProps"]) {
          result["FormatProps"]["thousandsGroupStyle"] =
            groupStyle ?? "thousand";
        } else {
          result["FormatProps"] = {
            thousandsGroupStyle: groupStyle ?? "lakh",
          };
        }

        let DecimalScale;
        if (Boolean(FormatProps?.decimalScale)) {
          DecimalScale = FormatProps?.decimalScale;
        }
        if (Boolean(decimalCount)) {
          DecimalScale = decimalCount;
        }
        if (Boolean(one?.FormatProps?.decimalScale)) {
          DecimalScale = one?.FormatProps?.decimalScale;
        }
        // if (result["FormatProps"]) {
        result["FormatProps"]["decimalScale"] = DecimalScale ?? 2;
        // }
      }

      // result["FormatProps"] = { ...FormatProps, ...(one?.FormatProps ?? {}) };
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

    if (typeof field === "object") {
      field["label"] = lanTranslate(field["label"]);
      field["placeholder"] = lanTranslate(field["placeholder"]);
      if (key === "branchCode") {
        // Set the default value for branchCode
        field["defaultValue"] = authState?.user?.branchCode;
      } else if (key === "accountType") {
        // Set autofocus on the accountType field
        field["autoFocus"] = true;
        field["defaultValue"] = "333 ";
      }
      newMetaDataFieldsCustom.push(field);
    }
  };

  newMetaDataFields?.forEach((item) => {
    if (item.render.componentType === "reportAccType") {
      const reportAcctTypes: any = extendedTypes["reportAccountType"];

      if (item["options"]) {
        extendedTypes["reportAccountType"]["options"] = item["options"];
      }
      if (item["_optionsKey"]) {
        extendedTypes["reportAccountType"]["_optionsKey"] = item["_optionsKey"];
      }

      // Check if the '_optionsKey' property is present in the 'item' object
      // if (item._optionsKey) {
      //   reportAccType._optionsKey = item._optionsKey;
      // }

      if (typeof reportAcctTypes === "object") {
        newMetaDataFieldsCustom.push(reportAcctTypes);
      }
    } else if (item.render.componentType === "_accountNumber") {
      if (item["postValidationSetCrossFieldValues"]) {
        extendedTypes["accountCode"]["postValidationSetCrossFieldValues"] =
          item["postValidationSetCrossFieldValues"];
        extendedTypes["fullAccountNumber"][
          "postValidationSetCrossFieldValues"
        ] = item["postValidationSetCrossFieldValues"];
      }

      if (item?.acctFieldPara === "1") {
        const fullAccountNumber = extendedTypes["fullAccountNumber"];
        if (typeof fullAccountNumber === "object") {
          newMetaDataFieldsCustom.push(fullAccountNumber);
        }
      } else if (item?.acctFieldPara === "2") {
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
  return {
    form: metaData.form,
    fields: [...newMetaDataFieldsCustom],
  } as MetaDataType;
};
