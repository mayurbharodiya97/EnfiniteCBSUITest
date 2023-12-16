import * as API from "../../../../api";
export const other_details_meta_data = {
    form: {
        name: "other_details_annual_income_details_form",
        label: "", 
        resetFieldOnUnmount: false,
        validationRun: "onBlur", 
        submitAction: "home",  
        render: {
            ordering: "auto",
            renderType: "simple",
            gridConfig: {
            item: {
                xs: 12,
                sm: 6,
            },
            container: {
                direction: "row",
                spacing: 1,
            },
            },
        },
        componentProps: {
            textField: {
                fullWidth: true,
            },
            select: {
                fullWidth: true,
            },
            datePicker: {
                fullWidth: true,
            },
            numberFormat: {
                fullWidth: true,
            },
            inputMask: {
                fullWidth: true,
            },
            datetimePicker: {
                fullWidth: true,
            },
        },
    },
    fields: [
      {
          render: {
              componentType: "Divider",
          },
          dividerText: "AnnualIncome",
          name: "AnnualIncomeDivider_ignoreField",
          label: "AnnualIncomeDivider",
      },
      {
          render: {
              componentType: "autocomplete",
          },
          name: "RANGE",
          label: "Range",
          options: (dependentValue, formState, _, authState) => API.getRangeOptions(authState?.companyID, authState?.user?.branchCode),
          _optionsKey: "rangeOptions",
          required: true,          
          placeholder: "",
          type: "text",
        //   GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
          GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
      },
      {
          render: {
            componentType: "autocomplete",
          },
          // className: "textInputFromRight",
          name: "TURNOVER",
          label: "Turnover",
          options: (dependentValue, formState, _, authState) => API.getRangeOptions(authState?.companyID, authState?.user?.branchCode),
          _optionsKey: "turnoverOptions",
          placeholder: "",
          type: "text",
          GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
          // maxLength: 3,
          // showMaxLength: false,
          // FormatProps: {
          //   allowNegative: false,
          //   allowLeadingZeros: true,
          //   decimalScale: 0,
          //   isAllowed: (values) => {
          //     if (values?.value?.length > 3) {
          //       return false;
          //     }
          //     if (values?.value > 100) {
          //       return false;
          //     }
          //     return true;
          //   },
          // },
        },
        {
            render: {
                componentType: "autocomplete",
            },
            name: "OTHER_INCOME",
            label: "OtherIncome",
            options: (dependentValue, formState, _, authState) => API.getRangeOptions(authState?.companyID, authState?.user?.branchCode),
            _optionsKey: "otherIncomeOptions",
            placeholder: "",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "SOURCE_OF_INCOME",
            label: "SourceOfIncome",
            placeholder: "",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:4},
        },



        {
            render: {
                componentType: "Divider",
            },
            dividerText: "ExposureInfo",
            name: "ExposureInfoDivider_ignoreField",
            label: "ExposureInfoDivider",
        },
        {
            render: {
              componentType: "numberFormat",
            },
            // className: "textInputFromRight",
            name: "FUNDED_AMT",
            label: "Funded",
            placeholder: "",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
          },
        {
            render: {
              componentType: "numberFormat",
            },
            // className: "textInputFromRight",
            name: "NON_FUNDED_AMT",
            label: "NonFunded",
            placeholder: "",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
          },
        {
            render: {
              componentType: "numberFormat",
            },
            // className: "textInputFromRight",
            name: "THRESHOLD_AMT",
            label: "ThresholdLimit",
            placeholder: "",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
          },



        {
            render: {
                componentType: "Divider",
            },
            dividerText: "PersonalInfo",
            name: "PersonalInfoDivider_ignoreField",
            label: "PersonalInfoDivider",
        },
        {
            render: {
                componentType: "numberFormat",
            },
            // className: "textInputFromRight",
            name: "NO_OF_CHILDREN",
            label: "ChildrenCount",
            placeholder: "",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
        },
        {
            render: {
                componentType: "autocomplete",
            },
            name: "HOUSE_TYPE",
            label: "HouseType",
            options: () => API.getPMISCData("House"),
            _optionsKey: "HouseTypes",
            placeholder: "",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
        },
        {
            render: {
                componentType: "numberFormat",
            },
            // className: "textInputFromRight",
            name: "NO_OF_ADULTS",
            label: "AdultsCount",
            placeholder: "",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
        },
        {
            render: {
                componentType: "checkbox",
            },
            defaultValue: false,
            name: "POLITICALLY_CONNECTED",
            label: "PoliticallyConnected",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
        },
        {
            render: {
                componentType: "numberFormat",
            },
            // className: "textInputFromRight",
            name: "EARNING_MEMEBER",
            label: "EarningMembers",
            placeholder: "",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
        },
        {
            render: {
                componentType: "checkbox",
            },
            defaultValue: false,
            name: "BLINDNESS",
            label: "Blind",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "ID_MARK",
            label: "IDMark",
            placeholder: "",
            type: "text",
            maxLength: 100,
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:4},
        },



        {
            render: {
                componentType: "Divider",
            },
            dividerText: "VehicleInfo",
            name: "VehicleInfoDivider_ignoreField",
            label: "VehicleInfoDivider",
        },
        {
            render: {
                componentType: "numberFormat",
            },
            // className: "textInputFromRight",
            name: "NO_OF_2_WHEELERS",
            label: "TwoWheelers",
            maxLength: 2,
            placeholder: "",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
            FormatProps: {
                isAllowed: (values) => {
                  if (values?.value?.length > 2) {
                    return false;
                  }
                //   if (values.floatValue === 0) {
                //     return false;
                //   }
                  return true;
                },
              },
        },
        {
            render: {
                componentType: "numberFormat",
            },
            // className: "textInputFromRight",
            name: "NO_OF_4_WHEELERS",
            label: "FourWheelers",
            maxLength: 2,
            placeholder: "",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
            FormatProps: {
                isAllowed: (values) => {
                  if (values?.value?.length > 2) {
                    return false;
                  }
                //   if (values.floatValue === 0) {
                //     return false;
                //   }
                  return true;
                },
              },
        },
        {
            render: {
                componentType: "textField",
            },
            name: "CIBIL_SCORE",
            label: "CIBILScore",
            placeholder: "",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
        },


        {
            render: {
                componentType: "Divider",
            },
            dividerText: "Employment Info.",
            name: "EmpInfoDivider_ignoreField",
            label: "EmpInfoDivider",
        },
        {
            render: {
                componentType: "autocomplete",
            },
            name: "EMPLOYMENT_STATUS",
            label: "EmpStatus",
            options: () => API.getPMISCData("Emp_Status"),
            _optionsKey: "EmpStatus",
            placeholder: "",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
        },
        {
            render: {
                componentType: "checkbox",
            },
            defaultValue: false,
            name: "REFERRED_BY_STAFF",
            label: "ReferredByStaff",            
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
        },
        {
            render: {
                componentType: "autocomplete",
            },
            name: "EDUCATION_CD",
            label: "EduQualification",
            options: (dependentValue, formState, _, authState) => API.getEduQualiOptions(authState?.companyID, authState?.user?.branchCode),
            _optionsKey: "eduQualiOptions",
            placeholder: "",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "COMPANY_NM",
            label: "CompanyName",
            placeholder: "",
            type: "text",
            maxLength: 100,
            GridProps: {xs:12, sm:8, md: 6, lg: 4.8, xl:6},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "DEPARTNAME",
            label: "Departname",
            placeholder: "",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "COMPANY_ADDRESS",
            label: "CompanyAdd",
            placeholder: "",
            type: "text",
            maxLength: 100,
            GridProps: {xs:12, sm:12, md:12, lg:7.2, xl:6},
        },
        {
            render: {
                componentType: "datePicker",
            },
            // className: "textInputFromRight",
            name: "JOINING_DT",
            label: "JoiningDate",
            placeholder: "",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
        },
        {
            render: {
                componentType: "datePicker",
            },
            // className: "textInputFromRight",
            name: "RETIREMENT_DT",
            label: "RetirementDate",
            placeholder: "",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
        },
        {
            render: {
                componentType: "autocomplete",
            },
            // className: "textInputFromRight",
            name: "EMP_COMPANY_TYPE",
            label: "EmpCompanyType",
            placeholder: "",
            type: "text",
            options: (dependentValue, formState, _, authState) => API.getEmpCompanyTypes(authState?.companyID, authState?.user?.branchCode),
            _optionsKey: "PDPrefix",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
        },
        {
            render: {
                componentType: "numberFormat",
            },
            // className: "textInputFromRight",
            name: "WORK_EXP",
            label: "WorkExperienceYear",
            placeholder: "",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "SPECIALIZATION_REMARKS",
            label: "Specialization",
            placeholder: "",
            type: "text",
            maxLength: 100,
            GridProps: {xs:12, sm:8, md: 6, lg: 4.8, xl:6},
        },
    ]
}