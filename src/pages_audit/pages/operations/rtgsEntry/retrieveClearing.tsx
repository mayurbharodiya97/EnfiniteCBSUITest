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
}> = ({ onClose }) => {
  const { authState } = useContext(AuthContext);
  const formRef = useRef<any>(null);

  const setCurrentAction = useCallback((data) => {
    onClose("action", data?.rows);
  }, []);

  const mutation: any = useMutation(
    "getRtgsRetrieveData",
    API.getRtgsRetrieveData,
    {
      onSuccess: (data) => { },
      onError: (error: any) => { },
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
    delete data["VIEW_ALL"];
    if (Boolean(data["FROM_DT"])) {
      data["FROM_DT"] = format(
        new Date(data["FROM_DT"]),
        "dd/MMM/yyyy"
      );
    }
    if (Boolean(data["TO_DT"])) {
      data["TO_DT"] = format(
        new Date(data["TO_DT"]),
        "dd/MMM/yyyy"
      );
    }
    data = {
      ...data,
      COMP_CD: authState.companyID,
      BRANCH_CD: authState.user.branchCode,
      FLAG: actionFlag === "RETRIEVE" ? "P" : "A",
      FLAG_RTGSC: ""
    };
    mutation.mutate(data);
    endSubmit(true);


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
              FROM_DT:
                authState?.workingDate ?? "",
              TO_DT:
                authState?.workingDate ?? "",

            }}
            onSubmitHandler={onSubmitHandler}
            formStyle={{
              background: "white",
            }}
            onFormButtonClickHandel={(id) => {
              let event: any = { preventDefault: () => { } };
              if (id === "RETRIEVE") {
                formRef?.current?.handleSubmit(event, "RETRIEVE");
              } else if (id === "VIEW_ALL") {
                formRef?.current?.handleSubmit(event, "VIEW_ALL");
              }

            }}
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
            <GridWrapper
              key={"RetrieveGridMetaData"}
              finalMetaData={RetrieveGridMetaData}
              data={mutation?.data ?? []}
              setData={() => null}
              loading={mutation.isLoading || mutation.isFetching}
              actions={actions}
              setAction={setCurrentAction}
            />
          </Fragment>
        </Dialog>
      </>
    </>
  );
};

export const RetrieveClearingForm = ({ onClose }) => {
  return (
    <ClearCacheProvider>
      <RetrieveClearing
        onClose={onClose}
      />
    </ClearCacheProvider>
  );
};
