import * as API from "../../../../api";


export const kyc_proof_of_identity_meta_data = {
    form: {
        name: "kyc_poi_details_form",
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
                componentType: "select",
            },
            name: "FORM_60",
            label: "Form6061",
            placeholder: "",
            defaultValue: "N",
            type: "text",
            GridProps: {xs: 4, sm:3},
            options: [
                {label: "Form 61", value: "F"},
                {label: "No", value: "N"},
            ],
            // dependentFields: ["DAILY_AMT"],
            // runValidationOnDependentFieldsChange: true,
            // validate: (currentField, dependentFields) => {
            //     if(Number(dependentFields?.DAILY_AMT?.value) >
            //     Number(currentField?.value)) {
            //         return "Weekly Limit should greater than or equal to Daily Limit";
            //     } else {
            //         return "";
            //     }
            // }
        },
        {
            render: {
                componentType: "textField",
            },
            name: "PAN_NO",
            label: "PanNo",
            placeholder: "",
            type: "text",
            GridProps: {xs: 4, sm:3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "UNIQUE_ID",
            label: "UIDAadhaar",
            placeholder: "",
            type: "text",
            GridProps: {xs: 4, sm:3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "ELECTION_CARD_NO",
            label: "VoterId",
            placeholder: "",
            type: "text",
            GridProps: {xs: 4, sm:3},
        },
        {
          render: {
              componentType: "select",
          },
          name: "EXPLICIT_TDS",
          label: "ExplicitTDS",
          defaultValue: "N",
          placeholder: "",
          type: "text",
          GridProps: {xs: 4, sm:3},
          options: [
              {label: "Yes", value: "T"},
              {label: "No", value: "N"},
          ],
        },
        {
          render: {
              componentType: "textField",
          },
          name: "NREGA_JOB_CARD",
          label: "NREGA",
          placeholder: "",
          type: "text",
          GridProps: {xs: 4, sm:3},
        },
        {
          render: {
              componentType: "textField",
          },
          name: "OTHER_DOC",
          label: "OtherPoI",
          placeholder: "",
          type: "text",
          GridProps: {xs: 4, sm:3},
        },
        {
          render: {
              componentType: "textField",
          },
          name: "OTHER_DOC_NO",
          label: "PoINo",
          placeholder: "",
          type: "text",
          GridProps: {xs: 4, sm:3},
        },



        {
            render:  {
                componentType: "Divider",
                sequence: 1,
            },
            dividerText: "PassportDetails",
            name: "passportDivider",
            label: "passportDivider"
        },
        {
            render: {
                componentType: "textField",
            },
            name: "PASSPORT_NO",
            label: "No",
            placeholder: "",
            type: "text",
            GridProps: {xs: 4, sm:3},
        },
        {
            render: {
                componentType: "select",
            },
            name: "PASSPORT_AUTHORITY_CD",
            label: "Autho",
            placeholder: "",
            options: () => API.getPMISCData("Authority"),
            _optionsKey: "passportAuthority",
            type: "text",
            GridProps: {xs: 4, sm:3},
        },
        {
          render: {
              componentType: "datePicker",
          },
          name: "PASSPORT_ISSUE_DT",
          label: "IssueDate",
          required: true,
          format: "dd/MM/yyyy",
          // placeholder: "",
          // type: "datePicker",
          GridProps: {xs: 4, sm:3},
        },
        {
          render: {
              componentType: "datePicker",
          },
          name: "PASSPORT_EXPIRY_DT",
          label: "ExpiryDate",
          required: true,
          format: "dd/MM/yyyy",
          // placeholder: "",
          // type: "datePicker",
          GridProps: {xs: 4, sm:3},
        },



        {
            render:  {
                componentType: "Divider",
                sequence: 1,
            },
            dividerText: "DrivingLicenseDetails",
            name: "drivingLicenseDivider",
            label: "drivingLicenseDivider"
        },
        {
            render: {
                componentType: "textField",
            },
            name: "DRIVING_LICENSE_NO",
            label: "No",
            placeholder: "",
            type: "text",
            GridProps: {xs: 4, sm:3},
        },
        {
            render: {
                componentType: "select",
            },
            name: "DRIVING_LICENSE_AUTHORITY_CD",
            label: "Autho",
            options: () => API.getPMISCData("Authority"),
            _optionsKey: "drivingLicenseAuthority",
            placeholder: "",
            type: "text",
            GridProps: {xs: 4, sm:3},
        },
        {
          render: {
              componentType: "datePicker",
          },
          name: "DRIVING_LICENSE_ISSUE_DT",
          label: "IssueDate",
          required: true,
          format: "dd/MM/yyyy",
          // placeholder: "",
          // type: "datePicker",
          GridProps: {xs: 4, sm:3},
        },
        {
          render: {
              componentType: "datePicker",
          },
          name: "DRIVING_LICENSE_EXPIRY_DT",
          label: "ExpiryDate",
          required: true,
          format: "dd/MM/yyyy",
          // placeholder: "",
          // type: "datePicker",
          GridProps: {xs: 4, sm:3},
        },
    ]
}
export const kyc_proof_of_identity_passport_details_meta_data = {
    form: {
        name: "kyc_poi_passport_details_form",
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
                componentType: "textField",
            },
            name: "PASSPORT_NO",
            label: "No.",
            placeholder: "",
            type: "text",
            GridProps: {xs: 4, sm:3},
        },
        {
            render: {
                componentType: "select",
            },
            name: "PASSPORT_AUTHORITY_CD",
            label: "Autho.",
            placeholder: "",
            options: () => API.getPMISCData("Authority"),
            _optionsKey: "passportAuthority",
            type: "text",
            GridProps: {xs: 4, sm:3},
        },
        {
          render: {
              componentType: "datePicker",
          },
          name: "PASSPORT_ISSUE_DT",
          label: "Issue Date",
          required: true,
          format: "dd/MM/yyyy",
          // placeholder: "",
          // type: "datePicker",
          GridProps: {xs: 4, sm:3},
        },
        {
          render: {
              componentType: "datePicker",
          },
          name: "PASSPORT_EXPIRY_DT",
          label: "Expiry Date",
          required: true,
          format: "dd/MM/yyyy",
          // placeholder: "",
          // type: "datePicker",
          GridProps: {xs: 4, sm:3},
      },
    ]
}
export const kyc_proof_of_identity_driving_license_details_meta_data = {
    form: {
        name: "kyc_poi_driving_license_details_form",
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
                componentType: "textField",
            },
            name: "DRIVING_LICENSE_NO",
            label: "No.",
            placeholder: "",
            type: "text",
            GridProps: {xs: 4, sm:3},
        },
        {
            render: {
                componentType: "select",
            },
            name: "DRIVING_LICENSE_AUTHORITY_CD",
            label: "Autho.",
            options: () => API.getPMISCData("Authority"),
            _optionsKey: "drivingLicenseAuthority",
            placeholder: "",
            type: "text",
            GridProps: {xs: 4, sm:3},
        },
        {
          render: {
              componentType: "datePicker",
          },
          name: "DRIVING_LICENSE_ISSUE_DT",
          label: "Issue Date",
          required: true,
          format: "dd/MM/yyyy",
          // placeholder: "",
          // type: "datePicker",
          GridProps: {xs: 4, sm:3},
        },
        {
          render: {
              componentType: "datePicker",
          },
          name: "DRIVING_LICENSE_EXPIRY_DT",
          label: "Expiry Date",
          required: true,
          format: "dd/MM/yyyy",
          // placeholder: "",
          // type: "datePicker",
          GridProps: {xs: 4, sm:3},
      },
    ]
}

export const kyc_proof_of_address_meta_data = {
  form: {
      name: "kyc_poa_details_form",
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
            render:  {
                componentType: "Divider",
                sequence: 1,
            },
            dividerText: "CurrentAddress",
            name: "currentAddDivider",
            label: "currentAddDivider"
        },
      {
          render: {
              componentType: "select",
          },
          name: "ADDRESS_TYPE",
          label: "AddressType",
          placeholder: "",
          type: "text",
          GridProps: {xs: 4, sm:3},
          options: () => API.getPMISCData("ADDRESS_TYPE"),
          _optionsKey: "currentAddType",
      },
      {
          render: {
              componentType: "textField",
          },
          name: "ADD1",
          label: "Line1",
          required: true,          
          placeholder: "",
          type: "text",
          GridProps: {xs: 4, sm:3},
      },
      {
          render: {
              componentType: "textField",
          },
          name: "ADD2",
          label: "Line2",
          placeholder: "",
          type: "text",
          GridProps: {xs: 4, sm:3},
      },
      {
          render: {
              componentType: "textField",
          },
          name: "ADD3",
          label: "Line3",
          placeholder: "",
          type: "text",
          GridProps: {xs: 4, sm:3},
      },
      {
          render: {
              componentType: "select",
          },
          options: (dependentValue, formState, _, authState) => API.getParentAreaOptions(authState?.companyID, authState?.user?.branchCode),          
          _optionsKey: "parentAreaList",
          name: "PAR_AREA_CD",
          label: "ParentArea",
          placeholder: "",
          type: "text",
          GridProps: {xs: 4, sm:3},
      },
      {
          render: {
              componentType: "select",
          },
          options: (dependentValue, formState, _, authState) => API.getSubAreaOptions(authState?.companyID, authState?.user?.branchCode),
          _optionsKey: "subAreaList",
          name: "AREA_CD",
          label: "SubArea",
          placeholder: "",
          type: "text",
          GridProps: {xs: 4, sm:3},
      },
      {
          render: {
              componentType: "textField",
          },
          name: "PIN_CODE",
          label: "PIN",
          required: true,
          placeholder: "",
          type: "text",
          GridProps: {xs: 4, sm:3},
      },
      {
          render: {
              componentType: "textField",
          },
          name: "CITY_CD",
          label: "City",
          required: true,
          placeholder: "",
          type: "text",
          GridProps: {xs: 4, sm:3},
      },
      {
          render: {
              componentType: "textField",
          },
          name: "DISTRICT",
          label: "District",
          placeholder: "",
          type: "text",
          GridProps: {xs: 4, sm:3},
      },
      {
          render: {
              componentType: "textField",
          },
          name: "STATE",
          label: "State",
          placeholder: "",
          type: "text",
          GridProps: {xs: 4, sm:3},
      },
      {
          render: {
              componentType: "textField",
          },
          name: "COUNTRY",
          label: "Country",
          placeholder: "",
          type: "text",
          GridProps: {xs: 4, sm:3},
      },
      {
          render: {
              componentType: "textField",
          },
          name: "STATE_CD",
          label: "UnionTerritoriesCode",
          placeholder: "",
          type: "text",
          GridProps: {xs: 4, sm:3},
      },
      {
          render: {
              componentType: "textField",
          },
          name: "COUNTRY_CD",
          label: "CountryCode",
          placeholder: "",
          type: "text",
          GridProps: {xs: 4, sm:3},
      },
      {
          render: {
              componentType: "select",
          },
          name: "PROOF_OF_ADD",
          label: "ProofofAdd",
          required: true,
          placeholder: "",
          type: "text",
          GridProps: {xs: 4, sm:3},
          options: () => API.getPMISCData("CKYC_ADD_PROOF"),
          _optionsKey: "currentPoA",
      },
      {
          render: {
              componentType: "textField",
          },
          name: "OTHER_POA",
          label: "OthersPoA",
          placeholder: "",
          type: "text",
          GridProps: {xs: 4, sm:3},
      },



    {
        render:  {
            componentType: "Divider",
            sequence: 1,
        },
        dividerText: "CorrespondenceAddress",
        name: "localAddDivider",
        label: "localAddDivider"
    },
    {
        render: { componentType: "checkbox", group: 0 },
        name: "SAME_AS_PER",
        sequence: 9,
        type: "text",
        label: "SameAsPermanentAddress",
        // isReadOnly: true,
        // placeholder: "Allowed Release",
        GridProps: {xs: 4, sm:3},
      },
      {
          render: {
              componentType: "select",
          },
          name: "LOC_ADD_TYPE",
          label: "LocalAddressType",
          placeholder: "",
          type: "text",
          GridProps: {xs: 4, sm:3},
          options: () => API.getPMISCData("ADDRESS_TYPE"),
          _optionsKey: "currentAddType",
      },
      {
          render: {
              componentType: "textField",
          },
          name: "LOC_ADD1",
          label: "Line1",
          required: true,          
          placeholder: "",
          type: "text",
          GridProps: {xs: 4, sm:3},
      },
      {
          render: {
              componentType: "textField",
          },
          name: "LOC_ADD2",
          label: "Line2",
          placeholder: "",
          type: "text",
          GridProps: {xs: 4, sm:3},
      },
      {
          render: {
              componentType: "textField",
          },
          name: "LOC_ADD3",
          label: "Line3",
          placeholder: "",
          type: "text",
          GridProps: {xs: 4, sm:3},
      },
      {
          render: {
              componentType: "select",
          },
          name: "LOC_AREA_CD",
          options: (dependentValue, formState, _, authState) => API.getParentAreaOptions(authState?.companyID, authState?.user?.branchCode),          
          _optionsKey: "localParentAreaList",
          label: "Area",
          placeholder: "",
          type: "text",
          GridProps: {xs: 4, sm:3},
      },
      {
          render: {
              componentType: "select",
          },
          name: "LOC_AREA_CD2",
          options: (dependentValue, formState, _, authState) => API.getParentAreaOptions(authState?.companyID, authState?.user?.branchCode),          
          _optionsKey: "localSubAreaList",
          label: "Area",
          placeholder: "",
          type: "text",
          GridProps: {xs: 4, sm:3},
      },
      {
          render: {
              componentType: "textField",
          },
          name: "LOC_PIN_CODE",
          label: "PIN",
          required: true,
          placeholder: "",
          type: "text",
          GridProps: {xs: 4, sm:3},
      },
      {
          render: {
              componentType: "textField",
          },
          name: "LOC_CITY_CD",
          label: "City",
          required: true,
          placeholder: "",
          type: "text",
          GridProps: {xs: 4, sm:3},
      },
      {
          render: {
              componentType: "textField",
          },
          name: "LOC_DISTRICT_CD",
          label: "District",
          placeholder: "",
          type: "text",
          GridProps: {xs: 4, sm:3},
      },
      {
          render: {
              componentType: "textField",
          },
          name: "LOC_STATE",
          label: "State",
          placeholder: "",
          type: "text",
          GridProps: {xs: 4, sm:3},
      },
      {
          render: {
              componentType: "textField",
          },
          name: "LOC_COUNTRY",
          label: "Country",
          placeholder: "",
          type: "text",
          GridProps: {xs: 4, sm:3},
      },
      {
          render: {
              componentType: "textField",
          },
          name: "STATE_UT_CODE",
          label: "UnionTerritoriesCode",
          placeholder: "",
          type: "text",
          GridProps: {xs: 4, sm:3},
      },
      {
          render: {
              componentType: "textField",
          },
          name: "LOC_COUNTRY_CD",
          label: "CountryCode",
          placeholder: "",
          type: "text",
          GridProps: {xs: 4, sm:3},
      },
      {
          render: {
              componentType: "select",
          },
          name: "LOC_PROOF_OF_ADD",
          label: "ProofofAdd",
          required: true,
          placeholder: "",
          options: () => API.getPMISCData("CKYC_LOC_POA"),
          _optionsKey: "localPoA",
          type: "text",
          GridProps: {xs: 4, sm:3},
      },



    {
        render:  {
            componentType: "Divider",
            sequence: 1,
        },
        dividerText: "Contact",
        name: "contactDivider",
        label: "contactDivider"
    },
      {
        render: {
            componentType: "textField",
        },
        name: "PHONE_o",
        label: "PhoneO",
        placeholder: "",
        type: "text",
        GridProps: {xs: 4, sm:3},
    },
    {
        render: {
            componentType: "textField",
        },
        name: "PHONE_R",
        label: "PhoneR",
        placeholder: "",
        type: "text",
        GridProps: {xs: 4, sm:3},
    },
    {
        render: {
            componentType: "textField",
        },
        name: "MOBILE_NO",
        label: "MobileNo",
        placeholder: "",
        type: "text",
        GridProps: {xs: 4, sm:3},
    },
    {
        render: {
            componentType: "textField",
        },
        name: "FAX",
        label: "Fax",
        placeholder: "",
        type: "text",
        GridProps: {xs: 4, sm:3},
    },
    {
        render: {
            componentType: "textField",
        },
        name: "E_MAIL_ID",
        label: "EmailId",
        placeholder: "",
        type: "text",
        GridProps: {xs: 4, sm:3},
    },
  ]
}
export const kyc_proof_of_local_address_meta_data = {
  form: {
      name: "kyc_local_poa_details_form",
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
        render: { componentType: "checkbox", group: 0 },
        name: "SAME_AS_PER",
        sequence: 9,
        type: "text",
        label: "Same As Permanent Address",
        // isReadOnly: true,
        // placeholder: "Allowed Release",
        GridProps: {xs: 4, sm:3},
      },
      {
          render: {
              componentType: "select",
          },
          name: "LOC_ADD_TYPE",
          label: "Local Address Type",
          placeholder: "",
          type: "text",
          GridProps: {xs: 4, sm:3},
          options: () => API.getPMISCData("ADDRESS_TYPE"),
          _optionsKey: "currentAddType",
      },
      {
          render: {
              componentType: "textField",
          },
          name: "LOC_ADD1",
          label: "Line1",
          required: true,          
          placeholder: "",
          type: "text",
          GridProps: {xs: 4, sm:3},
      },
      {
          render: {
              componentType: "textField",
          },
          name: "LOC_ADD2",
          label: "Line2",
          placeholder: "",
          type: "text",
          GridProps: {xs: 4, sm:3},
      },
      {
          render: {
              componentType: "textField",
          },
          name: "LOC_ADD3",
          label: "Line3",
          placeholder: "",
          type: "text",
          GridProps: {xs: 4, sm:3},
      },
      {
          render: {
              componentType: "select",
          },
          name: "LOC_AREA_CD",
          options: (dependentValue, formState, _, authState) => API.getParentAreaOptions(authState?.companyID, authState?.user?.branchCode),          
          _optionsKey: "localParentAreaList",
          label: "Area",
          placeholder: "",
          type: "text",
          GridProps: {xs: 4, sm:3},
      },
      {
          render: {
              componentType: "select",
          },
          name: "LOC_AREA_CD2",
          options: (dependentValue, formState, _, authState) => API.getParentAreaOptions(authState?.companyID, authState?.user?.branchCode),          
          _optionsKey: "localSubAreaList",
          label: "Area",
          placeholder: "",
          type: "text",
          GridProps: {xs: 4, sm:3},
      },
      {
          render: {
              componentType: "textField",
          },
          name: "LOC_PIN_CODE",
          label: "PIN",
          required: true,
          placeholder: "",
          type: "text",
          GridProps: {xs: 4, sm:3},
      },
      {
          render: {
              componentType: "textField",
          },
          name: "LOC_CITY_CD",
          label: "City",
          required: true,
          placeholder: "",
          type: "text",
          GridProps: {xs: 4, sm:3},
      },
      {
          render: {
              componentType: "textField",
          },
          name: "DISTRICT",
          label: "District",
          placeholder: "",
          type: "text",
          GridProps: {xs: 4, sm:3},
      },
      {
          render: {
              componentType: "textField",
          },
          name: "STATE",
          label: "State",
          placeholder: "",
          type: "text",
          GridProps: {xs: 4, sm:3},
      },
      {
          render: {
              componentType: "textField",
          },
          name: "COUNTRY",
          label: "Country",
          placeholder: "",
          type: "text",
          GridProps: {xs: 4, sm:3},
      },
      {
          render: {
              componentType: "textField",
          },
          name: "STATE_UT_CODE",
          label: "State/U.T(Union Territories) Code",
          placeholder: "",
          type: "text",
          GridProps: {xs: 4, sm:3},
      },
      {
          render: {
              componentType: "textField",
          },
          name: "ISO_COUNTRY_CODE",
          label: "ISO-3166 Country Code of Residence",
          placeholder: "",
          type: "text",
          GridProps: {xs: 4, sm:3},
      },
      {
          render: {
              componentType: "select",
          },
          name: "LOC_PROOF_OF_ADD",
          label: "Proof of Add.",
          required: true,
          placeholder: "",
          options: () => API.getPMISCData("CKYC_LOC_POA"),
          _optionsKey: "localPoA",
          type: "text",
          GridProps: {xs: 4, sm:3},
      },
  ]
}
export const kyc_proof_of_address_contact_meta_data = {
  form: {
      name: "kyc_poa_contact_details_form",
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
              componentType: "textField",
          },
          name: "PHONE_o",
          label: "Phone(O)",
          placeholder: "",
          type: "text",
          GridProps: {xs: 4, sm:3},
      },
      {
          render: {
              componentType: "textField",
          },
          name: "PHONE_R",
          label: "Phone(R)",
          placeholder: "",
          type: "text",
          GridProps: {xs: 4, sm:3},
      },
      {
          render: {
              componentType: "textField",
          },
          name: "MOBILE_NO",
          label: "Mobile No.",
          placeholder: "",
          type: "text",
          GridProps: {xs: 4, sm:3},
      },
      {
          render: {
              componentType: "textField",
          },
          name: "FAX",
          label: "Fax",
          placeholder: "",
          type: "text",
          GridProps: {xs: 4, sm:3},
      },
      {
          render: {
              componentType: "textField",
          },
          name: "E_MAIL_ID",
          label: "Email ID",
          placeholder: "",
          type: "text",
          GridProps: {xs: 4, sm:3},
      },
  ]
}