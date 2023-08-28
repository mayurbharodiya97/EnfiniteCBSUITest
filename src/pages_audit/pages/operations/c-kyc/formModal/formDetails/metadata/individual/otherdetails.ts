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
          name: "AnnualIncomeDivider",
          label: "AnnualIncomeDivider",
      },
      {
          render: {
              componentType: "select",
          },
          name: "RANGE",
          label: "Range",
          options: (dependentValue, formState, _, authState) => API.getRangeOptions(authState?.companyID, authState?.user?.branchCode),
          _optionsKey: "rangeOptions",
          required: true,          
          placeholder: "",
          type: "text",
          GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
      },
      {
          render: {
            componentType: "select",
          },
          // className: "textInputFromRight",
          name: "TURNOVER",
          label: "Turnover",
          options: (dependentValue, formState, _, authState) => API.getRangeOptions(authState?.companyID, authState?.user?.branchCode),
          _optionsKey: "turnoverOptions",
          placeholder: "",
          type: "text",
          GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
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
                componentType: "select",
            },
            name: "OTHER_INCOME",
            label: "OtherIncome",
            options: (dependentValue, formState, _, authState) => API.getRangeOptions(authState?.companyID, authState?.user?.branchCode),
            _optionsKey: "otherIncomeOptions",
            placeholder: "",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "SOURCE_OF_INCOME",
            label: "SourceOfIncome",
            placeholder: "",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
        },



        {
            render: {
                componentType: "Divider",
            },
            dividerText: "ExposureInfo",
            name: "ExposureInfoDivider",
            label: "ExposureInfoDivider",
        },
        {
            render: {
              componentType: "numberFormat",
            },
            // className: "textInputFromRight",
            name: "FUNDED",
            label: "Funded",
            placeholder: "",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
          },
        {
            render: {
              componentType: "numberFormat",
            },
            // className: "textInputFromRight",
            name: "NON_FUNDED",
            label: "NonFunded",
            placeholder: "",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
          },
        {
            render: {
              componentType: "numberFormat",
            },
            // className: "textInputFromRight",
            name: "THRESHOLD_LIMIT",
            label: "ThresholdLimit",
            placeholder: "",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
          },



        {
            render: {
                componentType: "Divider",
            },
            dividerText: "PersonalInfo",
            name: "PersonalInfoDivider",
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
            GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
        },
        {
            render: {
                componentType: "select",
            },
            name: "HOUSE_TYPE",
            label: "HouseType",
            options: () => API.getPMISCData("House"),
            _optionsKey: "HouseTypes",
            placeholder: "",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
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
            GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
        },
        {
            render: {
                componentType: "checkbox",
            },
            name: "POLITICALLY_CONNECTED",
            label: "PoliticallyConnected",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
        },
        {
            render: {
                componentType: "numberFormat",
            },
            // className: "textInputFromRight",
            name: "EARNING_MEMBER_COUNT",
            label: "EarningMembers",
            placeholder: "",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
        },
        {
            render: {
                componentType: "checkbox",
            },
            name: "IS_BLIND",
            label: "Blind",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "ID_MARK",
            label: "IDMark",
            placeholder: "",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
        },



        {
            render: {
                componentType: "Divider",
            },
            dividerText: "VehicleInfo",
            name: "VehicleInfoDivider",
            label: "VehicleInfoDivider",
        },
        {
            render: {
                componentType: "numberFormat",
            },
            // className: "textInputFromRight",
            name: "NO_OF_TWO_WHEELERS",
            label: "TwoWheelers",
            placeholder: "",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
        },
        {
            render: {
                componentType: "numberFormat",
            },
            // className: "textInputFromRight",
            name: "NO_OF_FOUR_WHEELERS",
            label: "FourWheelers",
            placeholder: "",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "CIBIL_SCORE",
            label: "CIBILScore",
            placeholder: "",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
        },


        {
            render: {
                componentType: "Divider",
            },
            dividerText: "Employment Info.",
            name: "EmpInfoDivider",
            label: "EmpInfoDivider",
        },
        {
            render: {
                componentType: "select",
            },
            name: "EMPLOYEMENT_STATUS",
            label: "EmpStatus",
            options: () => API.getPMISCData("Emp_Status"),
            _optionsKey: "EmpStatus",
            placeholder: "",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
        },
        {
            render: {
                componentType: "checkbox",
            },
            name: "REFERRED_BY_STAFF",
            label: "ReferredByStaff",            
            GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
        },
        {
            render: {
                componentType: "select",
            },
            name: "EDUCATION_QUALIFICATION",
            label: "EduQualification",
            options: (dependentValue, formState, _, authState) => API.getEduQualiOptions(authState?.companyID, authState?.user?.branchCode),
            _optionsKey: "eduQualiOptions",
            placeholder: "",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "COMPANY_NAME",
            label: "CompanyName",
            placeholder: "",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "DEPARTNAME",
            label: "Departname",
            placeholder: "",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "COMPANY_ADDRESS",
            label: "CompanyAdd",
            placeholder: "",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
        },
        {
            render: {
                componentType: "datePicker",
            },
            // className: "textInputFromRight",
            name: "JOINING_DATE",
            label: "JoiningDate",
            placeholder: "",
            type: "text",
            format: "dd/MM/yyyy",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
        },
        {
            render: {
                componentType: "datePicker",
            },
            // className: "textInputFromRight",
            name: "RETIREMENT_DATE",
            label: "RetirementDate",
            placeholder: "",
            type: "text",
            format: "dd/MM/yyyy",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
        },
        {
            render: {
                componentType: "select",
            },
            // className: "textInputFromRight",
            name: "EMP.COMPANY_TYPE",
            label: "EmpCompanyType",
            placeholder: "",
            type: "text",
            options: (dependentValue, formState, _, authState) => API.getEmpCompanyTypes(authState?.companyID, authState?.user?.branchCode),
            _optionsKey: "PDPrefix",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
        },
        {
            render: {
                componentType: "numberFormat",
            },
            // className: "textInputFromRight",
            name: "WORK_EXPERIENCE_IN_YEAR",
            label: "WorkExperienceYear",
            placeholder: "",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "SPECIALIZATION",
            label: "Specialization",
            placeholder: "",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
        },
    ]
  }
  export const other_details_exposure_info_meta_data = {
    form: {
        name: "other_details_exposure_details_form",
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
                spacing: 3,
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
            componentType: "numberFormat",
          },
          // className: "textInputFromRight",
          name: "FUNDED",
          label: "Funded",
          placeholder: "",
          type: "text",
          GridProps: {xs: 4, sm:3},
        },
      {
          render: {
            componentType: "numberFormat",
          },
          // className: "textInputFromRight",
          name: "NON_FUNDED",
          label: "Non Funded",
          placeholder: "",
          type: "text",
          GridProps: {xs: 4, sm:3},
        },
      {
          render: {
            componentType: "numberFormat",
          },
          // className: "textInputFromRight",
          name: "THRESHOLD_LIMIT",
          label: "Threshold Limit",
          placeholder: "",
          type: "text",
          GridProps: {xs: 4, sm:3},
        },
    ]
  }
  export const other_details_personal_info_meta_data = {
      form: {
          name: "other_details_personal_details_form",
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
                  spacing: 3,
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
              checkbox: {
                  fullWidth: true,
              },
          },
      },
      fields: [   
          {
              render: {
                  componentType: "numberFormat",
              },
              // className: "textInputFromRight",
              name: "NO_OF_CHILDREN",
              label: "No. of Children",
              placeholder: "",
              type: "text",
              GridProps: {xs: 4, sm:3},
          },
          {
              render: {
                  componentType: "select",
              },
              name: "HOUSE_TYPE",
              label: "House Type",
              options: () => API.getPMISCData("House"),
              _optionsKey: "HouseTypes",
              placeholder: "",
              type: "text",
              GridProps: {xs: 4, sm:3},
          },
          {
              render: {
                  componentType: "numberFormat",
              },
              // className: "textInputFromRight",
              name: "NO_OF_ADULTS",
              label: "No. of Adults",
              placeholder: "",
              type: "text",
              GridProps: {xs: 4, sm:3},
          },
          {
              render: {
                  componentType: "checkbox",
              },
              name: "POLITICALLY_CONNECTED",
              label: "Politically Connected",
              GridProps: {xs:4, sm:3},
          },
          {
              render: {
                  componentType: "numberFormat",
              },
              // className: "textInputFromRight",
              name: "EARNING_MEMBER_COUNT",
              label: "Earning Members in Family",
              placeholder: "",
              type: "text",
              GridProps: {xs: 4, sm:3},
          },
          {
              render: {
                  componentType: "checkbox",
              },
              name: "IS_BLIND",
              label: "Blind",
              GridProps: {xs:4, sm:3},
          },
          {
              render: {
                  componentType: "textField",
              },
              name: "ID_MARK",
              label: "ID Mark",
              placeholder: "",
              type: "text",
              GridProps: {xs: 4, sm:3},
          },
      ]
  }
  export const other_details_vehicle_info_meta_data = {
      form: {
          name: "other_details_vehicle_details_form",
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
                  spacing: 3,
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
              checkbox: {
                  fullWidth: true,
              },
          },
      },
      fields: [   
          {
              render: {
                  componentType: "numberFormat",
              },
              // className: "textInputFromRight",
              name: "NO_OF_TWO_WHEELERS",
              label: "No. of 2 Wheelers",
              placeholder: "",
              type: "text",
              GridProps: {xs: 4, sm:3},
          },
          {
              render: {
                  componentType: "numberFormat",
              },
              // className: "textInputFromRight",
              name: "NO_OF_FOUR_WHEELERS",
              label: "No. of 4 Wheelers",
              placeholder: "",
              type: "text",
              GridProps: {xs: 4, sm:3},
          },
          {
              render: {
                  componentType: "textField",
              },
              name: "CIBIL_SCORE",
              label: "CIBIL Score",
              placeholder: "",
              type: "text",
              GridProps: {xs: 4, sm:3},
          },
      ]
  }
  export const other_details_employment_info_meta_data = {
      form: {
          name: "other_details_employment_details_form",
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
                  spacing: 3,
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
              checkbox: {
                  fullWidth: true,
              },
          },
      },
      fields: [   
          {
              render: {
                  componentType: "select",
              },
              name: "EMPLOYEMENT_STATUS",
              label: "Employement Status",
              options: () => API.getPMISCData("Emp_Status"),
              _optionsKey: "EmpStatus",
              placeholder: "",
              type: "text",
              GridProps: {xs: 4, sm:3},
          },
          {
              render: {
                  componentType: "checkbox",
              },
              name: "REFERRED_BY_STAFF",
              label: "Referred By Staff",            
              GridProps: {xs: 4, sm:3},
          },
          {
              render: {
                  componentType: "select",
              },
              name: "EDUCATION_QUALIFICATION",
              label: "Education Qualification",
              options: (dependentValue, formState, _, authState) => API.getEduQualiOptions(authState?.companyID, authState?.user?.branchCode),
              _optionsKey: "eduQualiOptions",
              placeholder: "",
              type: "text",
              GridProps: {xs: 4, sm:3},
          },
          {
              render: {
                  componentType: "textField",
              },
              name: "COMPANY_NAME",
              label: "Company Name",
              placeholder: "",
              type: "text",
              GridProps: {xs: 4, sm:3},
          },
          {
              render: {
                  componentType: "textField",
              },
              name: "DEPARTNAME",
              label: "Departname",
              placeholder: "",
              type: "text",
              GridProps: {xs: 4, sm:3},
          },
          {
              render: {
                  componentType: "textField",
              },
              name: "COMPANY_ADDRESS",
              label: "Company_Address",
              placeholder: "",
              type: "text",
              GridProps: {xs: 4, sm:3},
          },
          {
              render: {
                  componentType: "datePicker",
              },
              // className: "textInputFromRight",
              name: "JOINING_DATE",
              label: "Joining Date",
              placeholder: "",
              type: "text",
              format: "dd/MM/yyyy",
              GridProps: {xs: 4, sm:3},
          },
          {
              render: {
                  componentType: "datePicker",
              },
              // className: "textInputFromRight",
              name: "RETIREMENT_DATE",
              label: "Retirement Date",
              placeholder: "",
              type: "text",
              format: "dd/MM/yyyy",
              GridProps: {xs: 4, sm:3},
          },
          {
              render: {
                  componentType: "select",
              },
              // className: "textInputFromRight",
              name: "EMP.COMPANY_TYPE",
              label: "Emp.Company Type",
              placeholder: "",
              type: "text",
              options: (dependentValue, formState, _, authState) => API.getEmpCompanyTypes(authState?.companyID, authState?.user?.branchCode),
              _optionsKey: "PDPrefix",
              GridProps: {xs: 4, sm:3},
          },
          {
              render: {
                  componentType: "numberFormat",
              },
              // className: "textInputFromRight",
              name: "WORK_EXPERIENCE_IN_YEAR",
              label: "Work Experience in Year",
              placeholder: "",
              type: "text",
              GridProps: {xs: 4, sm:3},
          },
          {
              render: {
                  componentType: "textField",
              },
              name: "SPECIALIZATION",
              label: "Specialization",
              placeholder: "",
              type: "text",
              GridProps: {xs: 4, sm:3},
          },
      ]
  }  