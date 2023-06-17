import React, { useEffect, useRef, useState } from 'react';
import { Box, Grid, Typography, Paper, TextField, Button, Divider, Skeleton } from '@mui/material';
import {styled} from "@mui/material/styles";
import FormWrapper, {MetaDataType} from 'components/dyanmicForm';
import {GridMetaDataType} from "../../../../components/dataTableStatic/types"
import { GridWrapper } from 'components/dataTableStatic/gridWrapper'

const ChequebookentryGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "Cheque Book Issued",
    rowIdColumn: "id",
    defaultColumnConfig: {
      width: 100,
      maxWidth: 200,
      // minWidth: 100,
    },
    allowColumnReordering: true,
    disableSorting: false,
    disableGroupBy: true,
    enablePagination: false,
    hideFooter: true,
    pageSizes: [10, 20, 30],
    defaultPageSize: 10,
    // containerHeight: {
    //   min: "42vh",
    //   max: "45vh",
    // },
    allowFilter: false,
    allowColumnHiding: false,
    allowRowSelection: false,
  },
  filters: [],
  columns: [
    {
      accessor: "sr_no",
      columnName: "Sr.No.",
      sequence: 1,
      alignment: "right",
      componentType: "default",
      width: 70,
      minWidth: 70,
      maxWidth: 200,
      isAutoSequence: true,
    },
    {
      accessor: "accountCardType",
      columnName: "Type",
      sequence: 2,
      alignment: "left",
      componentType: "default",
      width: 100,
      minWidth: 100,
      maxWidth: 200,
      isVisible: true,
    },
    {
      accessor: "maskAcctCardNo",
      columnName: "Account/Card Number",
      sequence: 3,
      alignment: "left",
      componentType: "default",
      width: 170,
      minWidth: 150,
      maxWidth: 200,
    },
    {
      accessor: "customerId",
      columnName: "Customer ID",
      sequence: 4,
      alignment: "left",
      componentType: "default",
      width: 120,
      minWidth: 100,
      maxWidth: 400,
    },
    {
      accessor: "accountNameOrNameOnCard",
      columnName: "Name",
      sequence: 5,
      alignment: "left",
      componentType: "default",
      width: 220,
      minWidth: 180,
      maxWidth: 250,
    },
    {
      accessor: "constitution",
      columnName: "Constitution",
      sequence: 6,
      alignment: "left",
      componentType: "default",
      width: 120,
      minWidth: 100,
      maxWidth: 200,
    },
    {
      accessor: "productCode",
      columnName: "Product Code",
      sequence: 7,
      alignment: "left",
      componentType: "default",
      width: 150,
      minWidth: 100,
      maxWidth: 200,
    },
    {
      accessor: "productName",
      columnName: "Account Type Name",
      sequence: 8,
      alignment: "left",
      componentType: "default",
      width: 120,
      minWidth: 100,
      maxWidth: 200,
      // color: (value) => {
      //   if ((value || "unlock").toLowerCase() === "unlock") {
      //     return "green";
      //   }
      //   return "red";
      // },
    },
    {
      accessor: "cardProductBin",
      columnName: "Card Product Bin",
      sequence: 9,
      alignment: "left",
      componentType: "default",
      width: 120,
      minWidth: 100,
      maxWidth: 200,
    },
    {
      accessor: "dob",
      columnName: "Birth Date",
      sequence: 10,
      alignment: "left",
      componentType: "date",
      dateFormat: "dd/MM/yyyy",
      width: 120,
      minWidth: 100,
      maxWidth: 200,
    },
    {
      accessor: "_NEW_gender",
      columnName: "Gender",
      sequence: 11,
      alignment: "left",
      componentType: "default",
      width: 150,
      minWidth: 100,
      maxWidth: 400,
    },
    {
      accessor: "fathersName",
      columnName: "Father Name",
      sequence: 12,
      alignment: "left",
      componentType: "default",
      width: 150,
      minWidth: 100,
      maxWidth: 400,
    },
    {
      accessor: "mothersName",
      columnName: "Mother Name",
      sequence: 13,
      alignment: "left",
      componentType: "default",
      width: 150,
      minWidth: 100,
      maxWidth: 400,
    },
    {
      accessor: "linkedAccount",
      columnName: "Linked Account",
      sequence: 14,
      alignment: "left",
      componentType: "default",
      width: 150,
      minWidth: 100,
      maxWidth: 400,
    },
    {
      accessor: "fullName",
      columnName: "Full Name",
      sequence: 15,
      alignment: "left",
      componentType: "default",
      width: 150,
      minWidth: 100,
      maxWidth: 400,
    },
    {
      accessor: "tinNumber",
      columnName: "TIN Number",
      sequence: 16,
      alignment: "left",
      componentType: "default",
      width: 150,
      minWidth: 100,
      maxWidth: 400,
    },
    {
      accessor: "nationalId13Digit",
      columnName: "National ID 13 Digit",
      sequence: 0,
      alignment: "left",
      componentType: "default",
      width: 150,
      minWidth: 100,
      maxWidth: 400,
      isVisible: false,
    },
    {
      accessor: "modeOfOperation",
      columnName: "Mode Of Operation",
      sequence: 0,
      alignment: "left",
      componentType: "default",
      width: 150,
      minWidth: 100,
      maxWidth: 400,
      isVisible: false,
    },
    {
      accessor: "nationality",
      columnName: "Nationality",
      sequence: 17,
      alignment: "left",
      componentType: "default",
      width: 150,
      minWidth: 100,
      maxWidth: 400,
    },
    {
      accessor: "nationalId",
      columnName: "National ID",
      sequence: 18,
      alignment: "left",
      componentType: "default",
      width: 150,
      minWidth: 100,
      maxWidth: 400,
    },
    {
      accessor: "identificationNo",
      columnName: "Identification Number",
      sequence: 19,
      alignment: "left",
      componentType: "default",
      width: 150,
      minWidth: 100,
      maxWidth: 400,
    },
    {
      accessor: "phone",
      columnName: "Mobile Number",
      sequence: 20,
      alignment: "left",
      componentType: "default",
      width: 150,
      minWidth: 100,
      maxWidth: 400,
    },
    {
      accessor: "email",
      columnName: "E-Mail ID",
      sequence: 21,
      alignment: "left",
      componentType: "default",
      width: 150,
      minWidth: 100,
      maxWidth: 400,
    },
  ],
}


export const personal_detail_prefix_data = {
    form: {
        name: "personal_detail_prefix_form",
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
            divider: {
                fullWidth: true,
            }
        },
    },
    fields: [
        {
            render: {
                componentType: "textField",
            },
            name: "PREFIX",
            label: "Prefix",
            placeholder: "Prefix",
            type: "text",
            GridProps: {xs:6, sm:3},
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
            name: "FIRST_NAME",
            label: "First Name",
            placeholder: "First Name",
            type: "text",
            GridProps: {xs:6, sm:3},
            // dependentFields: ["DAILY_AMT"],
        },
        {
            render: {
                componentType: "textField",
            },
            name: "MIDDLE_NAME",
            label: "Middle Name",
            placeholder: "Middle Name",
            type: "text",
            GridProps: {xs:6, sm:3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "LAST_NAME",
            label: "Last Name",
            placeholder: "Last Name",
            type: "text",
            GridProps: {xs:6, sm:3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "FULL_NAME",
            label: "Full Name",
            placeholder: "",
            type: "text",
            GridProps: {xs: 12, sm: 8, md: 8, lg:8},
        }
    ]
}
export const personal_detail_maiden_data = {
    form: {
        name: "personal_detail_maiden_form",
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
            divider: {
                fullWidth: true,
            }
        },
    },
    fields: [
        {
            render: {
                componentType: "textField",
            },
            name: "PREFIX",
            label: "Prefix",
            placeholder: "Prefix",
            type: "text",
            GridProps: {xs: 6, sm:3},
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
            name: "FIRST_NAME",
            label: "First Name",
            placeholder: "First Name",
            type: "text",
            GridProps: {xs: 6, sm:3},
            // dependentFields: ["DAILY_AMT"],
        },
        {
            render: {
                componentType: "textField",
            },
            name: "MIDDLE_NAME",
            label: "Middle Name",
            placeholder: "Middle Name",
            type: "text",
            GridProps: {xs: 6, sm:3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "LAST_NAME",
            label: "Last Name",
            placeholder: "Last Name",
            type: "text",
            GridProps: {xs: 6, sm:3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "FATHER_SPOUSe_NAME",
            label: "Father/Spouse Name",
            placeholder: "",
            type: "text",
            GridProps: {xs: 12, sm:true},
        }
    ]
}
export const personal_detail_father_data = {
    form: {
        name: "personal_detail_father_form",
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
            divider: {
                fullWidth: true,
            }
        },
    },
    fields: [
        {
            render: {
                componentType: "textField",
            },
            name: "PREFIX",
            label: "Prefix",
            placeholder: "Prefix",
            type: "text",
            GridProps: {xs: 6, sm:3},
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
            name: "FIRST_NAME",
            label: "First Name",
            placeholder: "First Name",
            type: "text",
            GridProps: {xs: 6, sm:3},
            // dependentFields: ["DAILY_AMT"],
        },
        {
            render: {
                componentType: "textField",
            },
            name: "MIDDLE_NAME",
            label: "Middle Name",
            placeholder: "Middle Name",
            type: "text",
            GridProps: {xs: 6, sm:3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "LAST_NAME",
            label: "Last Name",
            placeholder: "Last Name",
            type: "text",
            GridProps: {xs: 6, sm:3},
        }
    ]
}
export const personal_detail_mother_data = {
    form: {
        name: "personal_detail_mother_form",
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
            divider: {
                fullWidth: true,
            }
        },
    },
    fields: [
        {
            render: {
                componentType: "textField",
            },
            name: "PREFIX",
            label: "Prefix",
            placeholder: "Prefix",
            type: "text",
            GridProps: {xs: 6, sm:3},
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
            name: "FIRST_NAME",
            label: "First Name",
            placeholder: "First Name",
            type: "text",
            GridProps: {xs: 6, sm:3},
            // dependentFields: ["DAILY_AMT"],
        },
        {
            render: {
                componentType: "textField",
            },
            name: "MIDDLE_NAME",
            label: "Middle Name",
            placeholder: "Middle Name",
            type: "text",
            GridProps: {xs: 6, sm:3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "LAST_NAME",
            label: "Last Name",
            placeholder: "Last Name",
            type: "text",
            GridProps: {xs: 6, sm:3},
        }
    ]
}
export const personal_other_detail_meta_data = {
    form: {
        name: "personal_other_detail_form",
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
                componentType: "datePicker",
            },
            name: "DOB",
            label: "Date Of Birth",
            required: true,
            // placeholder: "",
            // type: "datePicker",
            GridProps: {xs: 6, sm:3},
        },
        {
            render: {
                componentType: "select",
            },
            options: [
                {label: "Minor", value: "minor"},
                {label: "Major", value: "major"}
            ],
            name: "MINOR_MAJOR",
            label: "Minor/Major",
            required: true,
            placeholder: "",
            type: "text",
            GridProps: {xs: 6, sm:3},
        },
        {
            render: {
                componentType: "select",
            },
            options: [
                {label: "Male", value: "male"},
                {label: "Female", value: "female"},
                {label: "Other", value: "other"}
            ],
            name: "GENDER",
            label: "Gender",
            required: true,
            placeholder: "",
            type: "text",
            GridProps: {xs: 6, sm:3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "BLOOD_GROUP",
            label: "Blood Group",
            placeholder: "",
            type: "text",
            GridProps: {xs: 6, sm:3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "MARITAL_STATUS",
            label: "Marital Status",
            required: true,
            placeholder: "",
            type: "text",
            GridProps: {xs: 6, sm:3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "NATIONALITY",
            label: "Nationality",
            required: true,
            placeholder: "",
            type: "text",
            GridProps: {xs: 6, sm:3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "RESI_STATUS",
            label: "Resi. Status",
            required: true,
            placeholder: "",
            type: "text",
            GridProps: {xs: 6, sm:3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "OCCUPATION",
            label: "Occupation",
            required: true,
            placeholder: "",
            type: "text",
            GridProps: {xs: 6, sm:3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "GROUP",
            label: "Group",
            placeholder: "",
            type: "text",
            GridProps: {xs: 6, sm:3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "RELIGION",
            label: "Religion",
            required: true,
            placeholder: "",
            type: "text",
            GridProps: {xs: 6, sm:3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "CASTE",
            label: "Caste",
            placeholder: "",
            type: "text",
            GridProps: {xs: 6, sm:3},
        },
        {
            render: {
                componentType: "datePicker",
            },
            name: "KYC_REVISED_DT",
            label: "KYC Revised Dt.",
            required: true,
            // placeholder: "",
            // type: "datePicker",
            GridProps: {xs: 6, sm:3},
        },
    ]
}

const PersonalDetails = ({isCustomerData, setIsCustomerData, isLoading, setIsLoading}) => {
  //  const [customerDataCurrentStatus, setCustomerDataCurrentStatus] = useState("none")
  //  const [isLoading, setIsLoading] = useState(false)
const myGridRef = useRef<any>(null);

    // useEffect(() => {
    //     console.log("... personal details", isCustomerData)
    //     passDataFromPersonalDetails(isCustomerData)
    // }, [isCustomerData])

    return (
        <Grid container rowGap={3}
          // sx={{backgroundColor: "#eee"}}
        >
            {/* <Typography variant={"h6"}>Personal Details</Typography> */}
            {isCustomerData ? <Grid 
                sx={{
                    backgroundColor:"var(--theme-color2)", 
                    padding:(theme) => theme.spacing(2), 
                    border: "1px solid rgba(0,0,0,0.12)", 
                    borderRadius: "20px"
                }} container item xs={12} direction={'column'}>
                <Grid item>
                    <Typography sx={{color:"var(--theme-color3)"}} gutterBottom={true} variant={"h6"}>Personal Details</Typography>
                </Grid>
                <Grid container item>
                    <Grid item xs={12}>
                        <FormWrapper 
                            key={"new-form-in-kyc"}
                            metaData={personal_detail_prefix_data as MetaDataType}
                            formStyle={{}}
                            hideHeader={true}
                        />
                    </Grid>                    
                </Grid>

                <Divider sx={{mt: 3, color: "var(--theme-color3)"}} textAlign={"left"}>Maiden Name</Divider>
                <Grid item>
                    <FormWrapper 
                        key={"new-form-in-kyc"}
                        metaData={personal_detail_maiden_data as MetaDataType}
                        formStyle={{}}
                        hideHeader={true}
                    />
                </Grid>

                <Divider sx={{mt: 3, color: "var(--theme-color3)"}} textAlign={"left"}>Father Name*</Divider>
                <Grid item>
                    <FormWrapper 
                        key={"new-form-in-kyc"}
                        metaData={personal_detail_father_data as MetaDataType}
                        formStyle={{}}
                        hideHeader={true}
                    />
                </Grid>

                <Divider sx={{mt: 3, color: "var(--theme-color3)"}} textAlign={"left"}>Mother Name*</Divider>
                <Grid item>
                    <FormWrapper 
                        key={"new-form-in-kyc"}
                        metaData={personal_detail_mother_data as MetaDataType}
                        formStyle={{}}
                        hideHeader={true}
                    />
                </Grid>                
            </Grid> : isLoading ? <Skeleton variant='rounded' animation="wave" height="220px" width="100%"></Skeleton> : null}

            {isCustomerData ? <Grid 
                sx={{
                    backgroundColor:"var(--theme-color2)", 
                    padding:(theme) => theme.spacing(2), 
                    border: "1px solid rgba(0,0,0,0.12)", 
                    borderRadius: "20px"
                }} container item xs={12} direction={'column'}>
                <Grid item>
                    <Typography sx={{color:"var(--theme-color3)"}} gutterBottom={true} variant={"h6"}>Other Personal Details</Typography>
                </Grid>
                <Grid container item>
                    <Grid item xs={12}>
                        <FormWrapper 
                            key={"new-form-in-kyc"}
                            metaData={personal_other_detail_meta_data as MetaDataType}
                            formStyle={{}}
                            hideHeader={true}
                        />
                    </Grid>                    
                </Grid>
            </Grid> : isLoading ? <Skeleton variant='rounded' animation="wave" height="300px" width="100%"></Skeleton> : null}

            {isCustomerData ? 
            <Grid 
                sx={{
                    backgroundColor:"var(--theme-color2)", 
                    padding:(theme) => theme.spacing(2), 
                    border: "1px solid rgba(0,0,0,0.12)", 
                    borderRadius: "20px"
                }} container item xs={12} direction={'column'}>
                <Grid item>
                    <Typography sx={{color:"var(--theme-color3)"}} gutterBottom={true} variant={"h6"}>Other Personal Details</Typography>
                </Grid>
                <Grid container item>
                    <Grid item xs={12} sx={{backgroundColor:"#eee", padding: "100px", overflow: "hidden", boxSizing: "border-box"}}>
                        {/* <FormWrapper 
                            key={"new-form-in-kyc"}
                            metaData={personal_other_detail_meta_data as MetaDataType}
                            formStyle={{}}
                            hideHeader={true}
                        /> */}
                      {/* <GridWrapper
                        key={`ChequeBookEntryGrid`}
                        finalMetaData={ChequebookentryGridMetaData as GridMetaDataType}
                        // data={data?.[0]?.ALL_ACCOUNT_DETAIL ?? []}
                        data={[]}
                        setData={() => null}
                        // loading={getData.isLoading}
                        // setAction={setCurrentAction}
                        refetchData={() => {}}
                        ref={myGridRef}
                      /> */}
                    </Grid>                    
                </Grid>
            </Grid> : isLoading ? <Skeleton variant='rounded' animation="wave" height="300px" width="100%"></Skeleton> : null}
        </Grid>        
    )
}

export default PersonalDetails