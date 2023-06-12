import React, { useEffect, useRef } from 'react';
import { Grid, Typography, Divider, Skeleton } from '@mui/material';
import FormWrapper, {MetaDataType} from 'components/dyanmicForm';


const other_details_annual_income_meta_data = {
  form: {
      name: "other_detail_form",
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
            componentType: "textField",
        },
        name: "RANGE",
        label: "Range",
        required: true,          
        placeholder: "",
        type: "text",
        GridProps: {xs: 6, sm:3},
    },
    {
        render: {
          componentType: "numberFormat",
        },
        // className: "textInputFromRight",
        name: "TURNOVER",
        label: "Turnover",
        placeholder: "",
        type: "text",
        GridProps: {xs: 6, sm:3},
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
              componentType: "textField",
          },
          name: "OTHER_INCOME",
          label: "Other Income",
          placeholder: "",
          type: "text",
          GridProps: {xs: 6, sm:3},
      },
      {
          render: {
              componentType: "textField",
          },
          name: "SOURCE_OF_INCOME",
          label: "Source of Income",
          placeholder: "",
          type: "text",
          GridProps: {xs: 6, sm:3},
      },
  ]
}
const other_details_exposure_info_meta_data = {
  form: {
      name: "other_detail_form",
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
        GridProps: {xs: 6, sm:3},
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
        GridProps: {xs: 6, sm:3},
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
        GridProps: {xs: 6, sm:3},
      },
  ]
}
const other_details_personal_info_meta_data = {
    form: {
        name: "other_detail_form",
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
            GridProps: {xs: 6, sm:3},
        },
        {
            render: {
                componentType: "select",
            },
            name: "HOUSE_TYPE",
            label: "House Type",
            placeholder: "",
            type: "text",
            GridProps: {xs: 6, sm:3},
            options: [
                {label: "House Type1", value: "House Type1"},
                {label: "House Type2", value: "House Type2"},
            ],
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
            GridProps: {xs: 6, sm:3},
        },
        {
            render: {
                componentType: "checkbox",
            },
            name: "POLITICALLY_CONNECTED",
            label: "Politically Connected",
            GridProps: {xs:6, sm:3},
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
            GridProps: {xs: 6, sm:3},
        },
        {
            render: {
                componentType: "checkbox",
            },
            name: "IS_BLIND",
            label: "Blind",
            GridProps: {xs:6, sm:3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "ID_MARK",
            label: "ID Mark",
            placeholder: "",
            type: "text",
            GridProps: {xs: 6, sm:3},
        },
    ]
}
const other_details_vehicle_info_meta_data = {
    form: {
        name: "other_detail_form",
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
            GridProps: {xs: 6, sm:3},
        },
        {
            render: {
                componentType: "numberFormat",
            },
            // className: "textInputFromRight",
            name: "NO_OF_TWO_WHEELERS",
            label: "No. of 4 Wheelers",
            placeholder: "",
            type: "text",
            GridProps: {xs: 6, sm:3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "CIBIL_SCORE",
            label: "CIBIL Score",
            placeholder: "",
            type: "text",
            GridProps: {xs: 6, sm:3},
        },
    ]
}
const other_details_employment_info_meta_data = {
    form: {
        name: "other_detail_form",
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
                componentType: "textField",
            },
            name: "EMPLOYEMENT_STATUS",
            label: "Employement Status",
            placeholder: "",
            type: "text",
            GridProps: {xs: 6, sm:3},
        },
        {
            render: {
                componentType: "checkbox",
            },
            name: "REFERRED_BY_STAFF",
            label: "Referred By Staff",            
            GridProps: {xs: 6, sm:3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "EDUCATION_QUALIFICATION",
            label: "Education Qualification",
            placeholder: "",
            type: "text",
            GridProps: {xs: 6, sm:3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "COMPANY_NAME",
            label: "Company Name",
            placeholder: "",
            type: "text",
            GridProps: {xs: 6, sm:3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "DEPARTNAME",
            label: "Departname",
            placeholder: "",
            type: "text",
            GridProps: {xs: 6, sm:3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "COMPANY_ADDRESS",
            label: "Company_Address",
            placeholder: "",
            type: "text",
            GridProps: {xs: 6, sm:3},
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
            GridProps: {xs: 6, sm:3},
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
            GridProps: {xs: 6, sm:3},
        },
        {
            render: {
                componentType: "select",
            },
            // className: "textInputFromRight",
            name: "RETIREMENT_DATE",
            label: "Retirement Date",
            placeholder: "",
            type: "text",
            GridProps: {xs: 6, sm:3},
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
            options: [
                {label: "Company Type1", value: "Company Type1"},
                {label: "Company Type2", value: "Company Type2"}
            ],
            GridProps: {xs: 6, sm:3},
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
            GridProps: {xs: 6, sm:3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "SPECIALIZATION",
            label: "Specialization",
            placeholder: "",
            type: "text",
            GridProps: {xs: 6, sm:3},
        },
    ]
}

const OtherDetails = ({isCustomerData, setIsCustomerData, isLoading, setIsLoading}) => {
  //  const [customerDataCurrentStatus, setCustomerDataCurrentStatus] = useState("none")
  //  const [isLoading, setIsLoading] = useState(false)
const myGridRef = useRef<any>(null);

    return (
        <Grid container rowGap={3}>
            {/* <Typography variant={"h6"}>Personal Details</Typography> */}
            {isCustomerData ? <Grid 
                sx={{
                    backgroundColor:"var(--theme-color2)", 
                    padding:(theme) => theme.spacing(2), 
                    border: "1px solid rgba(0,0,0,0.12)", 
                    borderRadius: "20px"
                }} container item xs={12} direction={'column'}>
                <Grid item>
                    <Typography sx={{color:"var(--theme-color3)"}} gutterBottom={true} variant={"h6"}>Other Details</Typography>
                </Grid>

                <Divider sx={{mt: 3, color: "var(--theme-color3)"}} textAlign={"left"}>Annual Income</Divider>
                <Grid item>
                    <FormWrapper 
                        key={"new-form-in-kyc"}
                        metaData={other_details_annual_income_meta_data as MetaDataType}
                        formStyle={{}}
                        hideHeader={true}
                    />
                </Grid>

                <Divider sx={{mt: 3, color: "var(--theme-color3)"}} textAlign={"left"}>Exposure Info./Risk Profile</Divider>
                <Grid item>
                    <FormWrapper 
                        key={"new-form-in-kyc"}
                        metaData={other_details_exposure_info_meta_data as MetaDataType}
                        formStyle={{}}
                        hideHeader={true}
                    />
                </Grid>

                <Divider sx={{mt: 3, color: "var(--theme-color3)"}} textAlign={"left"}>Personal Info.</Divider>
                <Grid item>
                    <FormWrapper 
                        key={"new-form-in-kyc"}
                        metaData={other_details_personal_info_meta_data as MetaDataType}
                        formStyle={{}}
                        hideHeader={true}
                    />
                </Grid>

                <Divider sx={{mt: 3, color: "var(--theme-color3)"}} textAlign={"left"}>Vehicle Info.</Divider>
                <Grid item>
                    <FormWrapper 
                        key={"new-form-in-kyc"}
                        metaData={other_details_vehicle_info_meta_data as MetaDataType}
                        formStyle={{}}
                        hideHeader={true}
                    />
                </Grid>

                <Divider sx={{mt: 3, color: "var(--theme-color3)"}} textAlign={"left"}>Employment Info.</Divider>
                <Grid item>
                    <FormWrapper 
                        key={"new-form-in-kyc"}
                        metaData={other_details_employment_info_meta_data as MetaDataType}
                        formStyle={{}}
                        hideHeader={true}
                    >
                    </FormWrapper>
                </Grid>
            </Grid> : isLoading ? <Skeleton variant='rounded' animation="wave" height="220px" width="100%"></Skeleton> : null}
        </Grid>        
    )
}

export default OtherDetails