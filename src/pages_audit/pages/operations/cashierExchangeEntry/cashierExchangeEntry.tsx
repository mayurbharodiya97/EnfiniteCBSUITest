import FormWrapper, { MetaDataType } from "components/dyanmicForm"
import { Fragment, useContext, useRef } from "react"
import { cashierEntryMetaData, cashierEntryMetaData2 } from "./cashierEntryMetadata"
import { usePopupContext } from "components/custom/popupContext";
import { GradientButton } from "components/styledComponent/button";
import { SubmitFnType } from "packages/form";
import { useMutation, useQuery } from "react-query";
import { AuthContext } from "pages_audit/auth";
import * as API from "./api"
import { LinearProgress } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { format, parse } from "date-fns";
const CashierExchangeEntry = () =>{
  const { MessageBox } = usePopupContext();
  const {authState} = useContext(AuthContext)
    const getData: any = useMutation(API.getCashDeno, {
      onSuccess: (data) => {
      },
      onError: (error: any, variables?: any) => {
        enqueueSnackbar(error?.error_msg, {
          variant: "error",
        });
      },
    });
    const onSubmitHandler: SubmitFnType = (data: any, displayData, endSubmit) => {
      // @ts-ignore
      endSubmit(true);
      
    }
    return (
        <Fragment>
        <FormWrapper
          key={"CashierExchangeEntryForm"}
          metaData={cashierEntryMetaData2 as MetaDataType}
          onSubmitHandler={onSubmitHandler}
          formStyle={{
            height:"auto"
          }}
          formState={{
            MessageBox: MessageBox,
          }}
          setDataOnFieldChange={async (action, payload) => {
            console.log("Action",action,"Payload",payload);
            if(action === "FROM_USER" && payload?.value?.length > 0){
              const formattedDate = format(
                parse(authState?.workingDate, "dd/MMM/yyyy", new Date()),
                "dd/MMM/yyyy"
              ).toUpperCase();
              getData.mutate({
                BRANCH_CD: authState?.user?.branchCode,
                COMP_CD: authState?.companyID,
                TRAN_DT: formattedDate,
                USER_NAME: payload?.value
              })
            }
          }
        }
          initialValues={{}}
        >
         {({ isSubmitting, handleSubmit }) => (
          <>
            <GradientButton onClick={(event) => {
                handleSubmit(event, "Save");
              }}
              color={"primary"}>
              Save
            </GradientButton>
          </>
        )}
        </FormWrapper>
        {getData?.isLoading && <LinearProgress color="secondary" />}
        <FormWrapper
          key={"CashierExchangeEntry" + getData?.data}
          metaData={cashierEntryMetaData as MetaDataType}
          onSubmitHandler={onSubmitHandler}
          hideHeader={true}
          formState={{
            MessageBox: MessageBox,
          }}
          initialValues={{
            CASHIERENTRY: getData?.data
          }}
        />
      </Fragment>
    )
}
export default CashierExchangeEntry