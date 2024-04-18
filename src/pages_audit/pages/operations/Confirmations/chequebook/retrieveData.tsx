import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import React, { useContext } from "react";
import { chequebookRetrievalMetadata } from "./retrieveMetadata";
import { AppBar, Button, Dialog } from "@mui/material";
import { useStyles } from "pages_audit/auth/style";
import { SubmitFnType } from "packages/form";
import { format } from "date-fns";
import { AuthContext } from "pages_audit/auth";
import * as API from "./api";
import { useQuery } from "react-query";
import { Alert } from "components/common/alert";
import { LoaderPaperComponent } from "components/common/loaderPaper";
import { GradientButton } from "components/styledComponent/button";

const RetrieveDataCustom = ({ closeDialog, chequeBkConfirmDetail }) => {
  const actionClasses = useStyles();
  const { authState } = useContext(AuthContext);

  const {
    data: chequeBookFlag,
    isError,
    error,
    isLoading,
  } = useQuery<any, any, any>(["GETRETRIVECHQBKFLAG"], () =>
    API.getChequeBookFlag()
  );

  const onSubmitHandler = (data, displayData, endSubmit) => {
    chequeBkConfirmDetail.mutate({
      COMP_CD: authState?.companyID,
      BRANCH_CD: authState?.user?.branchCode,
      FROM_DATE: format(new Date(data?.FROM_DATE), "dd-MMM-yyyy"),
      TO_DATE: format(new Date(data?.TO_DATE), "dd-MMM-yyyy"),
      FLAG: data?.FLAG ?? "",
    });

    //@ts-ignore
    endSubmit(true);
  };

  return (
    <>
      {isLoading ? (
        <LoaderPaperComponent />
      ) : (
        <>
          {isError ? (
            <AppBar position="relative" color="primary">
              <Alert
                severity="error"
                errorMsg={error?.error_msg ?? "Unknow Error"}
                errorDetail={error?.error_detail ?? ""}
                color="error"
              />
            </AppBar>
          ) : (
            <FormWrapper
              key={"Retrieve-data"}
              metaData={chequebookRetrievalMetadata}
              initialValues={{
                FLAG: chequeBookFlag?.[0]?.CHQ_PRINT_BUTTON_FLAG === "N" && "B",
              }}
              onSubmitHandler={onSubmitHandler}
              //@ts-ignore
              formStyle={{
                background: "white",
              }}
              controlsAtBottom={true}
              containerstyle={{ padding: "10px" }}
            >
              {({ isSubmitting, handleSubmit }) => (
                <>
                  <GradientButton
                    onClick={(event) => {
                      handleSubmit(event, "Save");
                      closeDialog();
                    }}
                    disabled={isSubmitting}
                    // className={actionClasses.button}
                    color={"primary"}
                  >
                    ok
                  </GradientButton>
                  <GradientButton
                    onClick={closeDialog}
                    // className={actionClasses.button}
                    color={"primary"}
                    disabled={isSubmitting}
                  >
                    Close
                  </GradientButton>
                </>
              )}
            </FormWrapper>
          )}
        </>
      )}
    </>
  );
};

export const RetrieveData = ({
  isRetrieve,
  closeDialog,
  chequeBkConfirmDetail,
}) => {
  return (
    <>
      <Dialog
        open={isRetrieve}
        //@ts-ignore
        PaperProps={{
          style: {
            width: "100%",
          },
        }}
        maxWidth="sm"
      >
        <RetrieveDataCustom
          closeDialog={closeDialog}
          chequeBkConfirmDetail={chequeBkConfirmDetail}
        />
      </Dialog>
    </>
  );
};
