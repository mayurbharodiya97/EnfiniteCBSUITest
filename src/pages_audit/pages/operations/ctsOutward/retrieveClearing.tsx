import { FC, useRef, useCallback, useContext, Fragment } from "react";
import { useMutation } from "react-query";
import * as API from "./api";
import { ClearCacheProvider } from "cache";
import { RetrieveFormConfigMetaData, RetrieveGridMetaData } from "./metaData";
import { Dialog } from "@mui/material";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { SubmitFnType } from "packages/form";
import { AuthContext } from "pages_audit/auth";
import GridWrapper from "components/dataTableStatic";
import { GradientButton } from "components/styledComponent/button";
import { format } from "date-fns";
import { Alert } from "components/common/alert";
import { ActionTypes } from "components/dataTable";
import { useLocation, useNavigate } from "react-router";

const actions: ActionTypes[] = [
  {
    actionName: "view-details",
    actionLabel: "Edit Detail",
    multiple: false,
    rowDoubleClick: true,
  },
];
export const RetrieveClearing: FC<{
  onClose?: any;
  zoneTranType?: any;
  tranDate?: any;
}> = ({ onClose, zoneTranType, tranDate }) => {
  const { authState } = useContext(AuthContext);
  const formRef = useRef<any>(null);

  const setCurrentAction = useCallback((data) => {
    onClose("action", data?.rows);
  }, []);

  const mutation: any = useMutation(
    "getRetrievalClearingData",
    API.getRetrievalClearingData,
    {
      onSuccess: (data) => {},
      onError: (error: any) => {},
    }
  );

  const onSubmitHandler: SubmitFnType = async (
    data: any,
    displayData,
    endSubmit,
    setFieldError,
    actionFlag
  ) => {
    delete data["RETRIEVE"];
    if (actionFlag === "RETRIEVE") {
      data["COMP_CD"] = authState.companyID;
      data["BRANCH_CD"] = authState.user.branchCode;
      if (Boolean(data["FROM_TRAN_DT"])) {
        data["FROM_TRAN_DT"] = format(
          new Date(data["FROM_TRAN_DT"]),
          "dd/MMM/yyyy"
        );
      }
      if (Boolean(data["TO_TRAN_DT"])) {
        data["TO_TRAN_DT"] = format(
          new Date(data["TO_TRAN_DT"]),
          "dd/MMM/yyyy"
        );
      }
      data["BANK_CD"] = data["BANK_CD"].padEnd(10, " ");
      data = {
        ...data,
        TRAN_TYPE: zoneTranType,
        CONFIRMED: "0",
      };
      mutation.mutate(data);
      endSubmit(true);
    }
  };

  return (
    <>
      <>
        <Dialog
          open={true}
          PaperProps={{
            style: {
              overflow: "hidden",
            },
          }}
          maxWidth="xl"
        >
          <FormWrapper
            key={`retrieveForm`}
            metaData={RetrieveFormConfigMetaData as unknown as MetaDataType}
            initialValues={{
              FROM_TRAN_DT: tranDate,
              TO_TRAN_DT: tranDate,
              ZONE_TRAN_TYPE: zoneTranType,
            }}
            onSubmitHandler={onSubmitHandler}
            formStyle={{
              background: "white",
            }}
            onFormButtonClickHandel={() => {
              let event: any = { preventDefault: () => {} };
              // if (mutation?.isLoading) {
              formRef?.current?.handleSubmit(event, "RETRIEVE");
              // }
            }}
            formState={{ ZONE_TRAN_TYPE: zoneTranType }}
            ref={formRef}
          >
            {({ isSubmitting, handleSubmit }) => (
              <>
                <GradientButton
                  onClick={() => {
                    onClose();
                  }}
                >
                  Close
                </GradientButton>
              </>
            )}
          </FormWrapper>
          <Fragment>
            {mutation.isError && (
              <Alert
                severity="error"
                errorMsg={
                  mutation.error?.error_msg ?? "Something went to wrong.."
                }
                errorDetail={mutation.error?.error_detail}
                color="error"
              />
            )}
            {/* {mutation?.data ? ( */}
            <GridWrapper
              key={"RetrieveGridMetaData"}
              finalMetaData={RetrieveGridMetaData}
              data={mutation?.data ?? []}
              setData={() => null}
              loading={mutation.isLoading || mutation.isFetching}
              actions={actions}
              setAction={setCurrentAction}
            />
            {/* ) : null} */}
          </Fragment>
        </Dialog>
      </>
    </>
  );
};

export const RetrieveClearingForm = ({ zoneTranType, onClose, tranDate }) => {
  return (
    <ClearCacheProvider>
      <RetrieveClearing
        zoneTranType={zoneTranType}
        onClose={onClose}
        tranDate={tranDate}
      />
    </ClearCacheProvider>
  );
};
