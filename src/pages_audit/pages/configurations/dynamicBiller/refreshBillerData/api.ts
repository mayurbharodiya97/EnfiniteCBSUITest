import { DynamicBillerGridMetaData } from "./gridMetadata";
import { AuthSDK } from "registry/fns/auth";
import { DefaultErrorObject } from "components/utils";

export const getBillerInfoRefreshData = async () => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("BILLERINFO", {});
  if (status === "0") {
    let responseData = data;

    if (!Array.isArray(responseData)) {
      responseData = [responseData];
    }
    let billerData: any = [];

    responseData.forEach((category, categoryIndex) => {
      category?.subCategories.forEach((subCategory, subCategoryIndex) => {
        subCategory?.billerInformationList.forEach((biller, billerIndex) => {
          let billerFields: any = [];
          let billerInfoPara: any = [];
          let billerPayPara: any = [];

          biller?.fieldMetaList.forEach((fields, fieldIndex) => {
            let fieldLabelBn = "";
            let fieldLabelEn = "";
            fields?.fieldLabels.forEach((labels) => {
              if (labels?.language === "bn") {
                fieldLabelBn = labels?.label;
              } else {
                fieldLabelEn = labels?.label;
              }
            });

            let fieldOptions: any = [];
            fields?.options.forEach((option) => {
              fieldOptions.push({
                LINE_ID: fieldOptions.length + 1,
                OPTIONS_NAME: option?.name,
                OPTIONS_VALUE: option?.value,
              });
            });
            billerFields.push({
              SR_CD: fieldIndex + 1,
              FIELD_NAME: fields?.name,
              FIELD_TYPE: fields?.fieldType,
              FIELD_REQUIRED: fields?.isMandatory,
              FIELD_DATATYPE: fields?.dataType,
              FIELD_MIN_VALUE: fields?.minLength,
              FIELD_MAX_VALUE: fields?.maxLength,
              DEFAULT_VALUE: fields?.defaultValue,
              TEXT_ALIGN: fields?.textAlign,
              PLACEHOLDER: fields?.placeholder,
              VALIDATION_REGEX: fields?.validation_regex,
              IS_BENEFICIARY_FIELD: fields?.isBeneficiaryField,
              REQUIRE_FOR_BILL_INFO: fields?.requireForBillInfo,
              DISPLAY_ORDER: fields?.sequence,
              IS_PAYABLE_AMT: fields?.isPayableAmount,
              FIELD_LABEL_EN: fieldLabelEn,
              FIELD_LABEL_BN: fieldLabelBn,
              FIELD_OPTIONS: fieldOptions,
            });
          });
          for (let infoPara of Object.keys(biller?.billInfo?.requestParams)) {
            billerInfoPara.push({
              SR_NO: billerInfoPara.length + 1,
              PARAMETER_KEYS: infoPara,
            });
          }
          for (let payPara of Object.keys(biller?.billPayment?.requestParams)) {
            billerPayPara.push({
              SR_NO: billerPayPara.length + 1,
              PARAMETER_KEYS: payPara,
            });
          }

          billerData.push({
            SR_NO: billerData.length + 1,
            CATEGORY_ID: category?.code,
            CATEGORY_NAME: category?.name,
            DESCRIPTION: category?.description,
            SUB_CATEGORY_ID: subCategory?.code,
            SUB_CATEGORY_NAME: subCategory?.name,
            SUB_CATEGORY_DESC: subCategory?.description,
            BILLER_ID: biller?.billerId,
            BILLER_NAME: biller?.name,
            BILLER_DESC: biller?.description,
            BILLER_INFO_URL: biller?.billInfo?.actionUrl,
            BILLER_PAYMENT_URL: biller?.billPayment?.actionUrl,
            FIELDS: billerFields,
            INFO_PARA: billerInfoPara,
            PAYMENT_PARA: billerPayPara,
          });
        });
      });
    });

    return { billerData: billerData, mainData: data };
  } else {
    throw DefaultErrorObject(message, "error", messageDetails);
  }
};

export const refreshBillerData = async (billerData) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("REFRESHBILLERMETADATA", billerData);
  if (status === "0") {
    return message;
  } else {
    throw DefaultErrorObject(message, "error", messageDetails);
  }
};
